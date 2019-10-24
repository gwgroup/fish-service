var mqtt = require('./mqtt'),
  ws = require('./ws'),
  EventEmitter = require('events').EventEmitter,
  __ev = new EventEmitter(),
  BusinessError = require('./utils/business-error'),
  RESULT_CODES = require('./config/index').codes,
  deviceStatus = new Map();
/**
 * 设备上线
 */
mqtt.on('online', function (topic) {
  __changeStatus(topic.clientId, undefined, 1);
});
/**
 * 设备离线
 */
mqtt.on('offline', function (topic) {
  __changeStatus(topic.clientId, undefined, 0);
});
/**
 * 设备状态更新
 */
mqtt.on('status', function (topic, status) {
  __changeStatus(topic.clientId, status);
});

/**
 * 过滤状态
 * 逻辑： 检查是否有，没有创建离线的初始对象；检查是否需要更新IO状态数据，如果有更新状态数据并使设备处于上线；如果没有状态数据更改，检查是否需要更改上线状态，如果需要，更改；返回状态对象
 * @param {String} clientId 
 * @param {Object} status 
 * @param {Number} online
 * @returns {Object} 状态对象
 */
function __changeStatus(clientId, status, online) {
  if (!deviceStatus.has(clientId)) {
    deviceStatus.set(clientId, { online: 0, status: { water_temperature: null, o2: null, ph: null } });
  }
  let obj = deviceStatus.get(clientId);
  if (status) {
    obj.online = 1;
    Object.assign(obj.status, status);
    __noticeDeviceStatusToApp(clientId, obj);
  } else if (online != undefined) {
    obj.online = online;
    __noticeDeviceStatusToApp(clientId, obj);
  }
  return obj;
}

/**
 * 获取设备状态
 * @param {String} clientId 
 */
function getDeviceStatus(clientId) {
  return __changeStatus(clientId);
}

/**
 * 获取所有设备状态数据
 */
function getAllDeviceStatus() {
  return deviceStatus;
}

/**
 * 通知设备状态到所有绑定了设备的APP用户
 * @param {String} clientId 设备客户端id
 * @param {Object} ds 设备状态对象
 */
function __noticeDeviceStatusToApp(clientId, ds) {
  __ev.emit('device_status_change', clientId, ds);
}

/**
 * 安全调用rpc，会检测设备在线状态调用
 * @param {String} clientId 
 * @param {Object} body 
 * @param {Function} cb 
 * @param {Number} timeout 
 */
var safeRpc = function (clientId, body, cb, timeout = 5000) {
  let ds = getDeviceStatus(clientId);
  if (!ds.online) {
    return cb(BusinessError.create(RESULT_CODES.deviceNotline));
  }
  mqtt.rpc(clientId, body, cb, timeout);
}

module.exports = Object.assign(__ev, { ws, mqtt, getAllDeviceStatus, getDeviceStatus, safeRpc });
