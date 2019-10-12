var express = require('express');
var router = express.Router();
var camService = require('../../services/cams');

/**
 * 获取摄像头配置信息
 * 返回配置信息
 */
router.post('/get_config', function (req, res, next) {
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
  camService.auth(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

module.exports = router;