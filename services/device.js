var BusinessError = require('../utils/business-error'),
  adapter = require('../adapter');
const RESULT_CODES = require('../config').codes;
let ACTION_CODES = Object.freeze({ EXEC: 3004, OPEN: 4001, CLOSE: 4002 });

// /**
//  * 更新重启
//  * @param {String} clientId 
//  */
// function updateReset(clientId) {
//   adapter.safeRpc(clientId, { sub_type: ACTION_CODES.EXEC, "cmd": "/home/work/script/fish-client.autofast.update.sh" }, (err, result) => {
//     if (err) {
//       return console.error(err);
//     }
//     console.log(result);
//   });
// }

/**
 * 打开IO
 * @param {String} ioCode io标识
 * @param {Number} duration 持续时间
 * @param {Function} cb 回调
 */
function open(clientId, ioCode, duration, cb) {
  let cdi = adapter.getDeviceStatus(clientId);
  if (cdi[ioCode] && cdi[ioCode].opened) {
    return cb(BusinessError.create(RESULT_CODES.repeatOpen));
  }
  adapter.safeRpc(clientId, { io_code: ioCode, duration, sub_type: ACTION_CODES.OPEN }, cb);
}

/**
 * 关闭IO
 * @param {String} ioCode 
 * @param {Function} cb 
 */
function close(clientId, ioCode, cb) {
  let cdi = adapter.getDeviceStatus(clientId);
  if (cdi[ioCode] && !cdi[ioCode].opened) {
    return cb(BusinessError.create(RESULT_CODES.repeatClose));
  }
  adapter.safeRpc(clientId, { io_code: ioCode, sub_type: ACTION_CODES.CLOSE }, cb);
}

module.exports = { open, close };