var express = require('express');
var router = express.Router();
var planSettingService = require('../../services/setting-plan');
var util = require('../../utils/index');
const RESULT_CODE = require('../../config/index').codes;
/**
 * 获取所有定时计划
 */
router.post('/get_all_plan', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  planSettingService.getAllPlan(req.body.device_mac, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * 添加计划
 */
router.post('/add_plan', function (req, res, next) {
  if (!req.body.device_mac || !req.body.plan ||
    !util.checkRequiredParams([
      'per',
      'day_of_month',
      'day_of_week',
      'hour',
      'minute',
      'second',
      'io_code',
      'duration',
      'weight',
      'enabled'],
      req.body.plan)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  planSettingService.addPlan(req.body.device_mac, req.body.plan, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 修改计划
 */
router.post('/edit_plan', function (req, res, next) {
  if (!req.body.device_mac || !req.body.plan ||
    !util.checkRequiredParams([
      'id',
      'per',
      'day_of_month',
      'day_of_week',
      'hour',
      'minute',
      'second',
      'io_code',
      'duration',
      'weight',
      'enabled'],
      req.body.plan)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  planSettingService.editPlan(req.body.device_mac, req.body.plan, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 删除计划
 */
router.post('/remove_plan', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'id'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  planSettingService.removePlan(req.body.device_mac, req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 启用计划
 */
router.post('/enable_plan', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'id'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  planSettingService.enablePlan(req.body.device_mac, req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});
/**
 * 禁用计划
 */
router.post('/disable_plan', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac', 'id'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  planSettingService.disablePlan(req.body.device_mac, req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

module.exports = router;
