var fs = require('fs'),
  path = require('path'),
  firmwareDir = path.join(__dirname, '../../fish-firmware'),
  downloadBaseUrl = require('../config/index').openUrls.firmwareUrl,
  adapter = require('../adapter'),
  util = require('../utils/index'),
  ACTION_CODES = Object.freeze({ GET_VERSION_INFO: 9101, UPGRADE: 9102 });
/**
 * 查询新的固件
 * @param {String} mac 
 * @param {String} version 
 * @param {Function} cb 返回md5，下载url，version
 */
function check(mac, version, cb) {
  //1.查询目录是否有比当前更新的版本
  //2.如果没有返回
  //3.如果有读取json内容，拼接url返回
  fs.readdir(firmwareDir, (err, files) => {
    if (err) { return cb(err); }
    if (files.length === 0) {
      return cb(undefined, null);
    }
    files.sort();
    let lastVersion = files[files.length - 1];
    if (version >= lastVersion) {
      return cb(undefined, null);
    }
    let url = `${downloadBaseUrl}${lastVersion}/fish-client.tar`;
    let info = JSON.parse(fs.readFileSync(path.join(firmwareDir, lastVersion, 'info.json')));
    cb(undefined, { version: lastVersion, url, md5: info.md5, describe: info.describe });
    console.log('firmware check', mac, version, lastVersion);
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