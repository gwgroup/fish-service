var Request = require('request');
var ed = require('../config/index').ed;
const ED_BASE_URL = ed.hostName,
  ED_USERNAME = ed.auth.username,
  ED_PASSWORD = ed.auth.password;

function canBeRelease(q, cb) {
  Request.get(`${ED_BASE_URL}/api/v1/pushers?q=${q}`,
    { auth: { username: ED_USERNAME, password: ED_PASSWORD }, json: true },
    (err, response, body) => {
      if (err) { return cb(err); }
      if (body.total > 0 && body.rows[0].onlines > 0) {
        //不能释放
        cb(undefined, false);
      } else {
        cb(undefined, true);
      }
    });
}
module.exports = { canBeRelease };
// canBeRelease('rtsp://ed.ypcxpt.com/b827ebe99675/192168247/profile_2', (err, result) => {
//   console.log(err, result);
// });