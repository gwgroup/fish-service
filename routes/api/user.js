var express = require('express');
var router = express.Router();
var userService = require('../../services/user');
var valiCodeService = require('../../services/vali-code');
var util = require('../../utils/index');
const RESULT_CODE = require('../../config/index').codes;
/**
 * 登录
 */
router.post('/login', function (req, res, next) {
  if (!util.checkRequiredParams(['mobile', 'vali_code'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  userService.login(req.body, (err, token) => {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify({ code: 1000, data: token }));
  });
});

/**
 * 加载用户信息
 */
router.post('/load', function (req, res, next) {
  userService.load(req.token.user_id, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify({ code: 1000, data: { user: results[0][0], scenes: results[1] } }));
  });
});

/**
 * 发送短信验证码
 */
router.post('/send_vali_sms', function (req, res, next) {
  if (!util.checkRequiredParams(['mobile'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  let ip = util.getClientIp(req);
  valiCodeService.sendValiCode({ mobile: req.body.mobile, ip }, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify({ code: 1000 }));
  });
});

module.exports = router;