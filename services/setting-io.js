let ACTION_CODES = Object.freeze({ ADD_IO: 8001, REMOVE_IO: 8002, ENABLE_IO: 8003, DISABLE_IO: 8004, GET_ALL_IO: 8005, RENAME_IO: 8006, CALIBRATION_FEEDER: 8007, POWER: 8008 });
var adapter = require('../adapter');
/**
 * 获取IO信息
 * @param {Object} param0 
 * @param {Function} cb 
 */
function getIoInfo({ device_mac }, cb) {
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.GET_ALL_IO }, (err, result) => {
    cb(err, result ? result.data : undefined);
  });
}
/**
 * 新增IO(慎用)
 * @param {String} device_mac 
 * @param {Object} params 
 * @param {Function} cb 
 */
function addIo(device_mac, params, cb) {
  let io = { code, type, name="空", pin, weight_per_second, enabled=true } = params;
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.ADD_IO, io }, cb);
}

/**
 * 移除IO（慎用）
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {Function} cb 
 */
function removeIo(device_mac, io_code, cb) {
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.REMOVE_IO, io: { code: io_code } }, cb);
}
/**
 * 重命名IO
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {String} io_name 
 * @param {Function} cb 
 */
function renameIo(device_mac, io_code, io_name, cb) {
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.RENAME_IO, io: { code: io_code, name: io_name } }, cb);
}

/**
 * 启用IO
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {Function} cb 
 */
function enableIo(device_mac, io_code, cb) {
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.ENABLE_IO, io: { code: io_code } }, cb);
}

/**
 *禁用IO
 * @param {String} device_mac
 * @param {String} io_code
 * @param {Function} cb
 */
function disableIo(device_mac, io_code, cb) {
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.DISABLE_IO, io: { code: io_code } }, cb);
}

/**
 * 校准投喂机
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {Number} weight_per_second 
 * @param {Function} cb 
 */
function calibrationFeeder(device_mac, io_code, weight_per_second, cb) {
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.CALIBRATION_FEEDER, io: { code: io_code, weight_per_second } }, cb);
}

/**
 * 设置功耗 
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {Number} power_kw 功耗，千瓦 
 * @param {Function} cb 
 */
function power(device_mac, io_code, power_kw, cb) {
  adapter.safeRpc(device_mac, { sub_type: ACTION_CODES.POWER, io: { code: io_code, power_kw: power_kw ? power_kw : null } }, cb);
}

module.exports = { getIoInfo, addIo, removeIo, renameIo, enableIo, disableIo, calibrationFeeder, power };