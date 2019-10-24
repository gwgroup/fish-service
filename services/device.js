var BusinessError = require('../utils/business-error');
var config = require('../config');
var mqtt = require('../mqtt');
var serviceScene = require('./scene');
var ws = require('../ws');
let ACTION_CODES = Object.freeze({ EXEC: 3004, OPEN: 4001, CLOSE: 4002, GET_IO_SETTING: 4011, GET_PLAN_SETTING: 4012, GET_TRIGGER_SETTING: 4013 });
var deviceStatus = new Map();
mqtt.on('online', function (topic) {
  __filterInsertStatus(topic.clientId);
  deviceStatus.get(topic.clientId).online = 1;
  __noticeDeviceStatusToApp(topic.clientId);
});
mqtt.on('offline', function (topic) {
  __filterInsertStatus(topic.clientId, true);
  deviceStatus.get(topic.clientId).online = 0;
  __noticeDeviceStatusToApp(topic.clientId);
});
mqtt.on('status', function (topic, status) {
  __filterInsertStatus(topic.clientId);
  Object.assign(deviceStatus.get(topic.clientId).status, status);
  __noticeDeviceStatusToApp(topic.clientId);
});

ws.on('connect', (con) => {
  let userid = con.userId;
  let macs = serviceScene.getDeviceMacs(userid);
  macs.forEach((mac) => {
    let data = { type: 1, device_mac: mac, data: getDeviceStatus(mac) };
    ws.sendData(con, data);
  });
});

serviceScene.on('addscene', function (userId, device_mac) {
  //用户添加场景,触发发送设备状态到ws
  let data = { type: 1, device_mac, data: getDeviceStatus(device_mac) };
  ws.sendDataWithUsers(userId, data);
});

/**
 * 
 * @param {String} clientId 
 * @param {Boolean} offline 是否下线
 */
function __filterInsertStatus(clientId, offline) {
  if (!deviceStatus.has(clientId)) {
    deviceStatus.set(clientId, { online: offline ? 0 : 1, status: { water_temperature: null, o2: null, ph: null } });
  }
}

/**
 * 通知设备状态到APP用户
 * @param {String} clientId 
 */
function __noticeDeviceStatusToApp(clientId) {
  let obj = deviceStatus.get(clientId);
  let uids = serviceScene.getUserids(clientId);
  ws.sendDataWithUsers(uids, { type: 1, device_mac: clientId, data: obj });
}

/**
 * 更新重启
 * @param {String} clientId 
 */
function updateReset(clientId) {
  mqtt.rpc(clientId, { sub_type: ACTION_CODES.EXEC, "cmd": "/home/work/script/fish-client.autofast.update.sh" }, (err, result) => {
    if (err) {
      return console.error(err);
    }
    console.log(result);
  });
}

/**
 * 获取设备信息
 * @param {String} clientId 
 */
function getDeviceStatus(clientId) {
  __filterInsertStatus(clientId, true);
  return deviceStatus.get(clientId);
}

/**
 * 打开IO
 * @param {String} ioCode io标识
 * @param {Number} duration 持续时间
 * @param {Function} cb 回调
 */
function open(clientId, ioCode, duration, cb) {
  let cdi = getDeviceStatus(clientId);
  if (cdi[ioCode] && cdi[ioCode].opened) {
    return cb(BusinessError.create(config.codes.repeatOpen));
  }
  mqtt.rpc(clientId, { io_code: ioCode, duration, sub_type: ACTION_CODES.OPEN }, cb);
}

/**
 * 关闭IO
 * @param {String} ioCode 
 * @param {Function} cb 
 */
function close(clientId, ioCode, cb) {
  let cdi = getDeviceStatus(clientId);
  if (cdi[ioCode] && !cdi[ioCode].opened) {
    return cb(BusinessError.create(config.codes.repeatClose));
  }
  mqtt.rpc(clientId, { io_code: ioCode, sub_type: ACTION_CODES.CLOSE }, cb);
}

/**
 * 获取所有设备状态数据
 */
function getAllDeviceStatus() {
  return deviceStatus;
}

module.exports = { open, close, getDeviceStatus, updateReset, getAllDeviceStatus };