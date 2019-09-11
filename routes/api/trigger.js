var express = require('express');
var router = express.Router();
var triggerSettingService = require('../../services/setting-trigger');

/**
 * 获取所有定时计划
 */
router.post('/get_all_trigger', function (req, res, next) {
  triggerSettingService.getAllTrigger(req.body.device_mac, (err, result) => {
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
router.post('/add_trigger', function (req, res, next) {
  triggerSettingService.addTrigger(req.body.device_mac, req.body.trigger, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 修改触发任务
 */
router.post('/edit_trigger', function (req, res, next) {
  triggerSettingService.editTrigger(req.body.device_mac, req.body.trigger, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 删除触发任务
 */
router.post('/remove_trigger', function (req, res, next) {
  triggerSettingService.removeTrigger(req.body.device_mac, req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 启用触发任务
 */
router.post('/enable_trigger', function (req, res, next) {
  triggerSettingService.enableTrigger(req.body.device_mac, req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});
/**
 * 禁用触发任务
 */
router.post('/disable_trigger', function (req, res, next) {
  triggerSettingService.disableTrigger(req.body.device_mac, req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

module.exports = router;
