let ACTION_CODES = Object.freeze({ ADD_PLAN: 6001, REMOVE_PLAN: 6002, ENABLE_PLAN: 6003, DISABLE_PLAN: 6004, GET_ALL_PLAN: 6005, EDIT_PLAN: 6009 });
let mqtt = require('../mqtt');
let util = require('../utils/index');
/**
 * 获取所有计划信息
 * @param {String} device_mac
 * @param {Function} cb 
 */
function getAllPlan(device_mac, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.GET_ALL_PLAN }, (err, result) => {
    cb(err, result ? result.data : undefined);
  });
}
/**
 * 新增计划
 * @param {String} device_mac 
 * @param {Object} params 
 * @param {Function} cb 
 */
function addPlan(device_mac, params, cb) {
  let plan = {
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
  plan.id = util.generateUUID();
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.ADD_PLAN, plan }, cb);
}

/**
 * 移除计划
 * @param {String} device_mac 
 * @param {String} plan_id 
 * @param {Function} cb 
 */
function removePlan(device_mac, plan_id, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.REMOVE_PLAN, plan: { id: plan_id } }, cb);
}

/**
 * 启用计划
 * @param {String} device_mac 
 * @param {String} plan_id 
 * @param {Function} cb 
 */
function enablePlan(device_mac, plan_id, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.ENABLE_PLAN, plan: { id: plan_id } }, cb);
}

/**
 *禁用计划
 * @param {String} device_mac
 * @param {String} plan_id
 * @param {Function} cb
 */
function disablePlan(device_mac, plan_id, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.DISABLE_PLAN, plan: { id: plan_id } }, cb);
}


/**
 * 编辑计划
 * @param {String} device_mac 
 * @param {Object} params 
 * @param {Function} cb 
 */
function editPlan(device_mac, params, cb) {
  let plan = {
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
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.EDIT_PLAN, plan }, cb);
}

module.exports = { getAllPlan, addPlan, removePlan, enablePlan, disablePlan, editPlan };