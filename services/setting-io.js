let ACTION_CODES = Object.freeze({ ADD_IO: 8001, REMOVE_IO: 8002, ENABLE_IO: 8003, DISABLE_IO: 8004, GET_ALL_IO: 8005, RENAME_IO: 8006, CALIBRATION_FEEDER: 8007 });
let mqtt = require('../mqtt');
/**
 * 获取IO信息
 * @param {Object} param0 
 * @param {Function} cb 
 */
function getIoInfo({ device_mac }, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.GET_ALL_IO }, (err, result) => {
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
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.ADD_IO, io }, cb);
}

/**
 * 移除IO（慎用）
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {Function} cb 
 */
function removeIo(device_mac, io_code, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.REMOVE_IO, io: { code: io_code } }, cb);
}
/**
 * 重命名IO
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {String} io_name 
 * @param {Function} cb 
 */
function renameIo(device_mac, io_code, io_name, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.RENAME_IO, io: { code: io_code, name: io_name } }, cb);
}

/**
 * 启用IO
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {Function} cb 
 */
function enableIo(device_mac, io_code, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.ENABLE_IO, io: { code: io_code } }, cb);
}

/**
 *禁用IO
 * @param {String} device_mac
 * @param {String} io_code
 * @param {Function} cb
 */
function disableIo(device_mac, io_code, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.DISABLE_IO, io: { code: io_code } }, cb);
}

/**
 * 校准投喂机
 * @param {String} device_mac 
 * @param {String} io_code 
 * @param {Number} weight_per_second 
 * @param {Function} cb 
 */
function calibrationFeeder(device_mac, io_code, weight_per_second, cb) {
  mqtt.rpc(device_mac, { sub_type: ACTION_CODES.CALIBRATION_FEEDER, io: { code: io_code, weight_per_second } }, cb);
}

module.exports = { getIoInfo, addIo, removeIo, renameIo, enableIo, disableIo, calibrationFeeder };