var fs = require('fs');
var path = require('path');
let firmwareDir = path.join(__dirname, '../../fish-firmware');
let downloadBaseUrl = require('../config/index').openUrls.firmwareUrl;
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
module.exports = { check };
// check('77', '0.0.1', (err, result) => {
//   console.log(err, result);
// });

// check('95', '1.0.1', (err, result) => {
//   console.log(err, result);
// });

// check('22', '1.0.0', (err, result) => {
//   console.log(err, result);
// });