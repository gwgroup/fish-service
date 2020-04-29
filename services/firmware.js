var fs = require('fs'),
  path = require('path'),
  firmwareDir = path.join(__dirname, '../../fish-firmware'),
  downloadBaseUrl = require('../config/index').openUrls.firmwareUrl,
  adapter = require('../adapter'),
  util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper,
  ACTION_CODES = Object.freeze({ GET_VERSION_INFO: 9101, UPGRADE: 9102 });
/**
 * 查询新的固件
 * @param {String} mac 
 * @param {String} version 
 * @param {Function} cb 返回md5，下载url，version
 */
function check(mac, version, cb) {
  //0.查询设备型号
  //1.查询目录是否有比当前更新的版本
  //2.如果没有返回
  //3.如果有读取json内容，拼接url返回
  searchDeviceModel(mac, (err, model) => {
    if (err || model === null) {
      return cb(undefined, null);
    }
    let checkPath = path.join(firmwareDir, model);
    fs.readdir(checkPath, (err, files) => {
      if (err) { return cb(err); }
      if (files.length === 0) {
        return cb(undefined, null);
      }
      files.sort();
      let lastVersion = files[files.length - 1];
      if (version >= lastVersion) {
        return cb(undefined, null);
      }
      let url = `${downloadBaseUrl}${model}/${lastVersion}/fish-client.tar`;
      let info = JSON.parse(fs.readFileSync(path.join(checkPath, lastVersion, 'info.json')));
      cb(undefined, { version: lastVersion, url, md5: info.md5, describe: info.describe });
      console.log('firmware check', mac, version, lastVersion);
    });
  });
}

/**
 * 根据设备标识查询设备型号
 * @param {String} mac 
 * @param {Function} cb 
 */
function searchDeviceModel(mac, cb) {
  MysqlHelper.query(
    `SELECT \`model\`  FROM  \`fish\`.\`f_device\` WHERE device_mac=?;`,
    [mac],
    (err, result) => {
      if (err) {
        return cb(err);
      }
      cb(undefined, result.length === 0 ? null : result[0].model);
    });
}

/**
 * 获取设备版本信息
 * @param {String} mac 
 * @param {Function} cb 
 */
function getDeviceVersionInfo(mac, cb) {
  adapter.safeRpc(mac, { sub_type: ACTION_CODES.GET_VERSION_INFO }, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.error) {
      return cb(new util.BusinessError(result.error.code, result.error.message));
    }
    cb(undefined, result.data);
  });
}

/**
 * 固件更新
 * @param {String} mac 
 * @param {Function} cb 
 */
function upgrade(mac, cb) {
  adapter.safeRpc(mac, { sub_type: ACTION_CODES.UPGRADE }, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.error) {
      return cb(new util.BusinessError(result.error.code, result.error.message));
    }
    cb();
  }, 50000);
}

module.exports = { check, getDeviceVersionInfo, upgrade };
// check('77', '0.0.1', (err, result) => {
//   console.log(err, result);
// });

// check('95', '1.0.1', (err, result) => {
//   console.log(err, result);
// });

// check('22', '1.0.0', (err, result) => {
//   console.log(err, result);
// });