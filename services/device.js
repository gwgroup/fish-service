var mqtt = require('../mqtt');
var serviceReport = require('./report');
var serviceUserDevice = require('./scene');
var ws = require('../ws');
let ACTION_CODES = Object.freeze({ EXEC: 3004, OPEN: 4001, CLOSE: 4002, GET_IO_SETTING: 4011, GET_PLAN_SETTING: 4012, GET_TRIGGER_SETTING: 4013 });
var deviceStatus = new Map();
mqtt.on('online', function (topic) {
  __filterInsertStatus(topic.clientId);
  deviceStatus[topic.clientId].online = true;
  __noticeDeviceStatusToApp(topic.clientId);
});
mqtt.on('offline', function (topic) {
  __filterInsertStatus(topic.clientId, true);
  deviceStatus[topic.clientId].online = false;
  __noticeDeviceStatusToApp(topic.clientId);
});
mqtt.on('status', function (topic, status) {
  __filterInsertStatus(topic.clientId);
  Object.assign(deviceStatus[topic.clientId].status, status);
  __noticeDeviceStatusToApp(topic.clientId);
});
mqtt.on('report', function (topic, report) {
  //__filterInsertStatus(topic.clientId);
  serviceReport.fill(topic.clientId, report);
});

ws.on('connect', (con) => {
  let userid = con.userId;
  let macs = serviceUserDevice.getDeviceMacs(userid);
  macs.forEach((mac) => {
    let data = { type: 1, device_mac: mac, data: getDeviceStatus(mac) };
    ws.sendData(con, data);
  });
});

/**
 * 
 * @param {String} clientId 
 * @param {Boolean} offline 是否下线
 */
function __filterInsertStatus(clientId, offline) {
  if (!deviceStatus[clientId]) {
    deviceStatus[clientId] = { online: offline ? 0 : 1, status: {} };
  }
}

/**
 * 通知设备状态到APP用户
 * @param {String} clientId 
 */
function __noticeDeviceStatusToApp(clientId) {
  let obj = deviceStatus[clientId];
  let uids = serviceUserDevice.getUserids(clientId);
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
  __filterInsertStatus(clientId);
  return deviceStatus[clientId];
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
    return cb(new Error("设备已经启动，不需要重复操作"));
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
    return cb(new Error("设备已经关闭，不需要重复操作"));
  }
  mqtt.rpc(clientId, { io_code: ioCode, sub_type: ACTION_CODES.CLOSE }, cb);
}



module.exports = { open, close, getDeviceStatus, updateReset };