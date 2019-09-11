var express = require('express');
var router = express.Router();
var service = require('../../services/device');
var ioSettingService = require('../../services/setting-io');

//const CLIENT_ID = "b827eb540371";//0000000055ed

/* 启动 */
router.post('/open', function (req, res, next) {
  let io_code = req.body.io_code,
    client_id = req.body.client_id,
    duration = req.body.duration;
  service.open(client_id, io_code, duration, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, message: '已启动' }));
    }
  });
});

/* 关闭 */
router.post('/close', function (req, res, next) {
  let io_code = req.body.io_code,
    client_id = req.body.client_id;
  service.close(client_id, io_code, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, message: '已关闭' }));
    }
  });
});
/**
 * 获取io信息
 */
router.post('/get_io_info', function (req, res, next) {
  ioSettingService.getIoInfo(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 重命名IO
 */
router.post('/io_rename', function (req, res, next) {
  ioSettingService.renameIo(req.body.device_mac, req.body.code, req.body.name, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 启用IO
 */
router.post('/io_enable', function (req, res, next) {
  ioSettingService.enableIo(req.body.device_mac, req.body.code, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 禁用IO
 */
router.post('/io_disable', function (req, res, next) {
  ioSettingService.disableIo(req.body.device_mac, req.body.code, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 校准投喂机IO
 */
router.post('/calibration_feeder', function (req, res, next) {
  ioSettingService.calibrationFeeder(req.body.device_mac, req.body.code, req.body.weight_per_second, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

module.exports = router;
