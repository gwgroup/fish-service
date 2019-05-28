var mqtt = require('../mqtt');
mqtt.run();

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
module.exports = { openPump, closePump };