var express = require('express');
var router = express.Router();
var reportService = require('../../services/report');
var util = require('../../utils/index');
const RESULT_CODE = require('../../config/index').codes;
/**
 *获取报表总览数据
 */
router.post('/get_preview', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  reportService.getPreview(req.body.device_mac, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 查询传感器数据（根据时间）
 */
router.post('/get_sensor_data', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'start_date', 'end_date'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  reportService.getSensorData(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 用电量记录查询（根据时间）
 */
router.post('/get_power_data', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'start_date', 'end_date'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  reportService.getKwhData(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 饲料消耗记录查询（根据时间）
 */
router.post('/get_feed_data', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'start_date', 'end_date'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  reportService.getFeedData(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 增氧记录查询（根据时间）
 */
router.post('/get_aeration_data', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'start_date', 'end_date'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  reportService.getAerationData(req.body, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});
module.exports = router;