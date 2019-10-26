var express = require('express');
var router = express.Router();
var camService = require('../../services/cams');
var util = require('../../utils/index');
const RESULT_CODE = require('../../config/index').codes;
/**
 * 获取摄像头配置信息
 * 返回配置信息
 */
router.post('/get_config', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  camService.getConfig(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 重新扫描摄像头
 * 返回配置信息
 */
router.post('/scan', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  //扫描（超时20秒种）
  camService.scan(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 播放
 */
router.post('/play', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'cam_key'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  camService.play(req.body, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 停止
 */
router.post('/stop', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'cam_key'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  camService.stop(req.body, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 切换清晰度
 */
router.post('/switch_profile', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'cam_key', 'profile_token'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  camService.switchProfile(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});


/**
 * 移动
 */
router.post('/move', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'cam_key', 'pan'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  camService.move(req.body, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 验证摄像头口令
 *  
 */
router.post('/auth', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'cam_key', 'password'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  camService.auth(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

module.exports = router;