var express = require('express');
var router = express.Router();
var planSettingService = require('../../services/setting-plan');

/**
 * 获取所有定时计划
 */
router.post('/get_all_plan', function (req, res, next) {
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
  planSettingService.disablePlan(req.body.device_mac, req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

module.exports = router;
