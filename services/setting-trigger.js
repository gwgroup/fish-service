let ACTION_CODES = Object.freeze({ ADD_TRIGGER: 7001, REMOVE_TRIGGER: 7002, ENABLE_TRIGGER: 7003, DISABLE_TRIGGER: 7004, GET_ALL_TRIGGER: 7005, EDIT_TRIGGER: 7009 });
let mqtt = require('../mqtt');
let util = require('../utils/index');
/**
 * 获取所有触发任务
 * @param {String} device_mac
 * @param {Function} cb 
 */
function getAllTrigger(device_mac, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.GET_ALL_TRIGGER }, (err, result) => {
    cb(err, result ? result.data : undefined);
  });
}
/**
 * 新增触发任务
 * @param {String} device_mac 
 * @param {Object} params 
 * @param {Function} cb 
 */
function addTrigger(device_mac, params, cb) {
  let trigger = {
    monitor, condition, condition_val, io_code, operaction, duration, enabled
  } = params;
  trigger.id = util.generateUUID();
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.ADD_TRIGGER, trigger }, cb);
}

/**
 * 移除触发任务
 * @param {String} device_mac 
 * @param {String} trigger_id 
 * @param {Function} cb 
 */
function removeTrigger(device_mac, trigger_id, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.REMOVE_TRIGGER, trigger: { id: trigger_id } }, cb);
}

/**
 * 启用触发任务
 * @param {String} device_mac 
 * @param {String} trigger_id 
 * @param {Function} cb 
 */
function enableTrigger(device_mac, trigger_id, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.ENABLE_TRIGGER, trigger: { id: trigger_id } }, cb);
}

/**
 * 禁用触发任务
 * @param {String} device_mac
 * @param {String} trigger_id
 * @param {Function} cb
 */
function disableTrigger(device_mac, trigger_id, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.DISABLE_TRIGGER, trigger: { id: trigger_id } }, cb);
}


/**
 * 编辑触发任务
 * @param {String} device_mac 
 * @param {Object} params 
 * @param {Function} cb 
 */
function editTrigger(device_mac, params, cb) {
  let trigger = {
    id,
    per,
    day_of_month,
    day_of_week,
    hour,
    minute,
    second,
    io_code,
    duration,
    enabled
  } = params;
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.EDIT_TRIGGER, trigger }, cb);
}

module.exports = { getAllTrigger, addTrigger, removeTrigger, enableTrigger, disableTrigger, editTrigger };