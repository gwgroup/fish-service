var mqtt = require('../mqtt');
let ACTION_CODES = Object.freeze({ EXEC: 3004, OPEN: 4001, CLOSE: 4002, GET_IO_SETTING: 4011, GET_PLAN_SETTING: 4012, GET_TRIGGER_SETTING: 4013 });
var deviceStatus = {};
mqtt.run();
mqtt.on('online', function (topic, body) {
  __filterInsertStatus(topic.clientId);
  deviceStatus[topic.clientId].online = 1;
  console.log('1', topic.clientId, body);
});
mqtt.on('offline', function (topic, body) {
  __filterInsertStatus(topic.clientId);
  if (deviceStatus[topic.clientId]) {
    deviceStatus[topic.clientId].online = 0;
  }
  console.log('2', topic.clientId, body);
});
mqtt.on('status', function (topic, body) {
  __filterInsertStatus(topic.clientId);
  Object.assign(deviceStatus[topic.clientId].status, body.status);
  console.log('3', topic.clientId, body);
});

function __filterInsertStatus(clientId) {
  if (!deviceStatus[clientId]) {
    deviceStatus[clientId] = { online: 1, status: {} };
  }
}

/**
 * 更新重启
 * @param {*} clientId 
 */
function updateReset(clientId) {
  mqtt.rpc(clientId, { "sub_type": ACTION_CODES.EXEC, "cmd": "/home/work/script/fish-client.auto.update.sh" }, (err, result) => {
    if (err) {
      return console.error(err);
    }
    console.log( result);
  });
}

/**
 * 获取设备信息
 * @param {String} clientId 
 */
function deviceInfo(clientId) {
  return deviceStatus[clientId];
}

/**
 * 打开IO
 * @param {String} ioCode io标识
 * @param {Number} duration 持续时间
 * @param {Function} cb 回调
 */
function open(clientId,ioCode, duration, cb) {
  mqtt.rpc(clientId, { io_code: ioCode, duration, sub_type: ACTION_CODES.OPEN }, cb);
}

/**
 * 关闭IO
 * @param {String} ioCode 
 * @param {Function} cb 
 */
function close(clientId,ioCode, cb) {
  mqtt.rpc(clientId, { io_code: ioCode, sub_type: ACTION_CODES.CLOSE }, cb);
}

module.exports = { open, close, deviceInfo, updateReset };