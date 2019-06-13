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

module.exports = {
  parseTopic, BusinessError, getClientIp
};
