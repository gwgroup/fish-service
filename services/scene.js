var util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper,
  BusinessError = util.BusinessError,
  config = require('../config/index');

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
        throw err;
      }
      maps.delete(device_mac);
      results.forEach(element => {
        __fillItem(element);
      });
    });
}
__init();
module.exports = { getUserids };