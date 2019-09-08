/**
 * 解析主题
 * @param {String} topic 
 */
var parseTopic = function (topic) {
  var r = topic.split('/');
  return { product: r[2], clientId: r[3], type: r[1] };
};

class BusinessError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
/**
 * 获取客户端IP
 * @param {Object} req 
 */
var getClientIp = function (req) {
  var ip = req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
};

/**
* 生成UUID
*/
function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

/**
* 生成ID
*/
function generateID() {
  return generateUUID().replace(/\-/g, '');
}

module.exports = {
  parseTopic, BusinessError, getClientIp, generateUUID, generateID
};
