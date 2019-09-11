var mqtt = require('../mqtt');
var serviceReport = require('./report');
let ACTION_CODES = Object.freeze({ EXEC: 3004, OPEN: 4001, CLOSE: 4002, GET_IO_SETTING: 4011, GET_PLAN_SETTING: 4012, GET_TRIGGER_SETTING: 4013 });
var deviceStatus = new Map();
mqtt.on('online', function (topic) {
  __filterInsertStatus(topic.clientId);
  deviceStatus[topic.clientId].online = 1;
});
mqtt.on('offline', function (topic) {
  __filterInsertStatus(topic.clientId, true);
  if (deviceStatus[topic.clientId]) {
    deviceStatus[topic.clientId].online = 0;
  }
});
mqtt.on('status', function (topic, status) {
  __filterInsertStatus(topic.clientId);
  Object.assign(deviceStatus[topic.clientId].status, status);
});
mqtt.on('report', function (topic, report) {
  __filterInsertStatus(topic.clientId);
  serviceReport.fill(topic.clientId, report);
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
 * 更新重启
 * @param {*} clientId 
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