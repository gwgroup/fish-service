/*
TOPIC 
MQTT 发送内容格式
重新扫描摄像头
{"id":"231211","sub_type":9001}
获取配置
{"id":"231211","sub_type":9002}
通知推流
{"id":"231211","sub_type":9003,"cam_key":"192168247"}
切换清晰度
{"id":"231211","sub_type":9005,"cam_key":"192168247","profile_token":"profile_1"}
通知停止推流
{"id":"231211","sub_type":9004,"cam_key":"192168247"}
*/
let ACTION_CODES = Object.freeze({ SCAN: 9001, GET_CAMS_CONFIG: 9002, START_PUSH: 9003, STOP_PUSH: 9004, SWITCH_PROFILE: 9005, MOVE: 9006, AUTH: 9007 });
var adapter = require('../adapter');
var util = require('../utils/index');

/**
 * 播放通知
 * @param {Object} params 
 * @param {Function} cb 
 */
function play(params, cb) {
  let { device_mac, cam_key } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.START_PUSH, cam_key }, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.error) {
      return cb(new util.BusinessError(result.error.code, result.error.message));
    }
    cb();
  }, 15000);
}

/**
 * 获取摄像头配置
 * @param {Object} params 
  * @param {Function} cb
 */
function getConfig(params, cb) {
  let { device_mac } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.GET_CAMS_CONFIG }, (err, result) => {
    if (err) {
      return cb(err);
    }
    cb(undefined, result.data);
  });
}

/**
 * 扫描摄像头
 * @param {Object} params 
  * @param {Function} cb
 */
function scan(params, cb) {
  let { device_mac } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.SCAN }, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.error) {
      return cb(new util.BusinessError(result.error.code, result.error.message));
    }
    cb(undefined, result.data);
  }, 30000);
}

/**
 * 切换清晰度
 * @param {Object} params 
  * @param {Function} cb
 */
function switchProfile(params, cb) {
  let { device_mac, cam_key, profile_token } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.SWITCH_PROFILE, cam_key, profile_token }, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.error) {
      return cb(new util.BusinessError(result.error.code, result.error.message));
    }
    cb(undefined, result);
  }, 8000);
}

/**
 * 停止推流
 * @param {Object} params
  * @param {Function} cb
 */
function stop(params, cb) {
  let { device_mac, cam_key } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.STOP_PUSH, cam_key }, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.error) {
      return cb(new util.BusinessError(result.error.code, result.error.message));
    }
    cb();
  }, 8000);
}

/**
 * 移动
 * @param {Object} params
  * @param {Function} cb
 */
function move(params, cb) {
  let { device_mac, cam_key, pan } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.MOVE, cam_key, pan }, (err) => {
    if (err) {
      return cb(err);
    }
    cb();
  });
}


/**
 * 验证摄像头口令
 * @param {Object} params 
  * @param {Function} cb
 */
function auth(params, cb) {
  let { device_mac, cam_key, password } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.AUTH, cam_key, password }, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.error) {
      return cb(new util.BusinessError(result.error.code, result.error.message));
    }
    cb(undefined, result.data);
  }, 15000);
}


module.exports = { play, stop, scan, getConfig, switchProfile, move, auth };