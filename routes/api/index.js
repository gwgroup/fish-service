var config = require('../../config'),
  HTTP_RESULT_CODES = config.codes,
  express = require('express'),
  router = express.Router(),
  BusinessError = require('../../utils/index').BusinessError,
  openUrls = ['/user/login', '/user/send_vali_sms', '/util/get_info', '/util/ed_stream_can_be_release', '/util/file_upload'];

var tokenService = require('../../services/token'),
  userRouter = require('./user'),
  utilRouter = require('./util'),
  deviceRouter = require('./device'),
  planRouter = require('./plan'),
  triggerRouter = require('./trigger'),
  sceneRouter = require('./scene'),
  camsRouter = require('./cams');

router.use(function (req, res, next) {
  if (openUrls.indexOf(req.path) != -1) {
    return next();
  }
  //1.用户是否持有token，没有提示无权限访问，请登录 return
  //2.判断用户持有的token是否过期，如果过期，请登录 return
  //3.给req赋值user数据
  //4.执行延迟token有效期
  //5.next
  let token = req.headers.authorization;
  if (!token) {
    return next(BusinessError.create(HTTP_RESULT_CODES.invalidToken));
  } else {
    tokenService.checkToken(token, function (err, tokenObject) {
      if (err) {
        console.error(err);
        return next(BusinessError.create(HTTP_RESULT_CODES.serverError));
      }
      if (!tokenObject) {
        return next(BusinessError.create(HTTP_RESULT_CODES.invalidToken));
      } else {
        req.token = tokenObject;
        next();
        //延时token
        tokenService.delay(token);
      }
    });
  }
});

router.use('/user', userRouter);
router.use('/util', utilRouter);
router.use('/device', deviceRouter);
router.use('/plan', planRouter);
router.use('/trigger', triggerRouter);
router.use('/scene', sceneRouter);
router.use('/cams', camsRouter);

router.use(function (req, res, next) {
  res.status(404).send(JSON.stringify({ message: HTTP_RESULT_CODES.apiNotFound[1], code: HTTP_RESULT_CODES.apiNotFound[0] }));
});
router.use(function (err, req, res, next) {
  if (err instanceof BusinessError) {
    return res.send(err.toJsonString());
  }
  console.error(err);
  res.status(500).send(JSON.stringify({ message: HTTP_RESULT_CODES.serverError[1], code: err.code | HTTP_RESULT_CODES.serverError[0] }));
});

module.exports = router;
