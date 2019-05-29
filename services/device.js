var mqtt = require('../mqtt');
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

  deviceStatus[topic.clientId].status = body.status;
  console.log('3', topic.clientId, body);
});

function __filterInsertStatus(clientId) {
  if (!deviceStatus[clientId]) {
    deviceStatus[clientId] = { online: 1, status: { pump: 0 } };
  }
}

/**
 * 开水泵
 * @param {String} clientId 
 */
function openPump(clientId) {
  mqtt.sendWithClient(clientId, { type: 3001 });
}

/**
 * 关水泵
 * @param {String} clientId 
 */
function closePump(clientId) {
  mqtt.sendWithClient(clientId, { type: 3002 });
}

/**
 * 获取设备信息
 * @param {String} clientId 
 */
function deviceInfo(clientId) {
  return deviceStatus[clientId];
}

module.exports = { openPump, closePump, deviceInfo };