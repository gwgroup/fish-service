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
  Object.assign(deviceStatus[topic.clientId].status, body.status);
  console.log('3', topic.clientId, body);
});

function __filterInsertStatus(clientId) {
  if (!deviceStatus[clientId]) {
    deviceStatus[clientId] = { online: 1, status: {} };
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
 * 开增氧机1
 * @param {*} clientId 
 */
function openAerator1(clientId) {
  mqtt.sendWithClient(clientId, { type: 3031 });
}


/**
 * 关增氧机1
 * @param {*} clientId 
 */
function closeAerator1(clientId) {
  mqtt.sendWithClient(clientId, { type: 3041 });
}

/**
 * 开增氧机2
 * @param {*} clientId 
 */
function openAerator2(clientId) {
  mqtt.sendWithClient(clientId, { type: 3032 });
}

/**
 * 关增氧机2
 * @param {*} clientId 
 */
function closeAerator2(clientId) {
  mqtt.sendWithClient(clientId, { type: 3042 });
}

/**
 * 开LED1
 * @param {*} clientId 
 */
function openLamp1(clientId) {
  mqtt.sendWithClient(clientId, { type: 3011 });
}

/**
 * 关LED1
 * @param {*} clientId 
 */
function closeLamp1(clientId) {
  mqtt.sendWithClient(clientId, { type: 3021 });
}


/**
 * 开LED2
 * @param {*} clientId 
 */
function openLamp2(clientId) {
  mqtt.sendWithClient(clientId, { type: 3012 });
}

/**
 * 关LED2
 * @param {*} clientId 
 */
function closeLamp2(clientId) {
  mqtt.sendWithClient(clientId, { type: 3022 });
}

/**
 * 更新重启
 * @param {*} clientId 
 */
function updateReset(clientId) {
  mqtt.sendWithClient(clientId, { "type": 3004, "index": 10004, "cmd": "/home/work/script/fish-client.auto.update.sh" });
}

/**
 * 获取设备信息
 * @param {String} clientId 
 */
function deviceInfo(clientId) {
  return deviceStatus[clientId];
}

module.exports = { openPump, closePump, openAerator1, openAerator2, openLamp1, openLamp2, closeAerator1, closeAerator2, closeLamp1, closeLamp1, closeLamp2, deviceInfo };