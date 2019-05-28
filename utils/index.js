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

module.exports = {
  parseTopic, BusinessError
};
