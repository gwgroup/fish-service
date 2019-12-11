var Request = require('request');
var weatherConfig = require('../config/index').weatherApi;
function getWeatherWithIp(ip, cb) {
  Request.get(`https://www.tianqiapi.com/api/?appid=${weatherConfig.appid}&appsecret=${weatherConfig.appsecret}&version=v1&ip=${ip}`,
    { json: true },
    (err, response, body) => {
      if (err) { return cb(err); }
      if (body && body.data) {
        cb(undefined, body);
      } else {
        cb(undefined, null);
      }
    });
}
module.exports = { getWeatherWithIp };