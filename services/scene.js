var
  async = require('async'),
  util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper,
  EventEmitter = require('events').EventEmitter,
  __ev = new EventEmitter();
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
function getUserids(device_mac) {
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
      __ev.emit('addscene', userId, device_mac);
    }
  ], (err) => {
    cb(err);
  });
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
module.exports = Object.assign(__ev, { getUserids, getDeviceMacs, addScene, removeScene, getAllScene });
__init();