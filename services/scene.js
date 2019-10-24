var
  async = require('async'),
  util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper;
var adapter = require('../adapter');
let maps = new Map();

/*
结构如：
{
  "a":[uid,uid,uid],
  "b":[uid,uid,uid]
}
*/

function __fillItem(el) {
  let { user_id, device_mac } = el;
  if (!maps.has(device_mac)) {
    maps.set(device_mac, []);
  }
  maps.get(device_mac).push(user_id);
}

function __init() {
  console.log('init scene map cache!');
  MysqlHelper.query(`
    SELECT
      \`user_id\`,
      \`device_mac\`
    FROM
      \`fish\`.\`f_scene\`;
    `, [],
    (err, results) => {
      if (err) {
        throw err;
      }
      results.forEach(element => {
        __fillItem(element);
      });
    });
}

/**
 * 获取所有相关设备的用户ID
 * @param {String} device_mac 
 */
function __getUseridsWithDeviceMac(device_mac) {
  return maps.has(device_mac) ? maps.get(device_mac) : [];
}
/**
 * 刷新相关设备的用户ID集合
 * @param {String} device_mac 
 * @param {Function} cb
 */
function __freshUserids(device_mac, cb) {
  MysqlHelper.query(`
    SELECT
      \`user_id\`,
      \`device_mac\`
    FROM
      \`fish\`.\`f_scene\`
    WHERE
      \`device_mac\`=?;
    `, [device_mac],
    (err, results) => {
      if (err) {
        return cb(err);
      }
      maps.delete(device_mac);
      results.forEach(element => {
        __fillItem(element);
      });
      cb();
    });
}

/**
 * 获取所有设备标识（根据用户ID）
 * @param {String} userId 
 */
function getDeviceMacs(userId) {
  let result = [];
  maps.forEach((item, key) => {
    if (item.indexOf(userId) != -1) {
      result.push(key);
    }
  });
  return result;
}

/**
 * 添加场景
 * @param {String} userId 
 * @param {String} device_mac 
 * @param {String} scene_name
 */
function addScene(userId, { device_mac, scene_name }, cb) {
  async.waterfall([
    (cb) => {
      MysqlHelper.query('INSERT INTO `fish`.`f_scene` (`user_id`,`device_mac`,`scene_name`) VALUES (?,?,?);', [userId, device_mac, scene_name], cb);
    }, (result, fields, cb) => {
      __freshUserids(device_mac, cb);
      _noticeNewDeviceStatus(userId, device_mac);
    }
  ], (err) => {
    cb(err);
  });
}

/**
 * 重命名场景
 * @param {String} userId 
 * @param {String} device_mac 
 * @param {String} scene_name
 */
function renameScene(userId, { device_mac, scene_name }, cb) {
  MysqlHelper.query('UPDATE `fish`.`f_scene` SET `scene_name` = ? WHERE `user_id` = ? AND `device_mac` = ?;', [scene_name, userId, device_mac], cb);
}

/**
 * 移除场景
 * @param {String} userId 
 * @param {String} device_mac 
 * @param {String} scene_name
 */
function removeScene(userId, device_mac, cb) {
  async.waterfall([
    (cb) => {
      MysqlHelper.query('DELETE FROM `fish`.`f_scene` WHERE `user_id` = ? AND `device_mac` = ?;', [userId, device_mac], cb);
    }, (result, fields, cb) => {
      __freshUserids(device_mac, cb);
    }
  ], (err) => {
    cb(err);
  });
}
/**
 * 获取所有场景
 * @param {String} userId 
 * @param {Function} cb 
 */
function getAllScene(userId, cb) {
  MysqlHelper.query('SELECT `device_mac`,`scene_name` FROM `fish`.`f_scene` WHERE `user_id`=?;', [userId], cb);
}


/**
 * 通知新添加设备状态到APP用户
 * @param {*} userId 
 * @param {*} device_mac 
 */
function _noticeNewDeviceStatus(userId, device_mac) {
  //用户添加场景,触发发送设备状态到ws
  let data = { type: 1, device_mac, data: adapter.getDeviceStatus(device_mac) };
  adapter.ws.sendDataWithUsers([userId], data);
}

/**
 * 设备状态变更触发发送给app用户设备状态数据
 */
adapter.on('device_status_change', function (device_mac, data) {
  let uids = __getUseridsWithDeviceMac(device_mac);
  adapter.ws.sendDataWithUsers(uids, { type: 1, device_mac, data });
});

module.exports = { getDeviceMacs, addScene, removeScene, getAllScene, renameScene };
__init();