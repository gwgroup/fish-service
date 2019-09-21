var express = require('express');
var router = express.Router();
var serviceScene = require('../../services/scene');
/**
 * 获取所有场景
 */
router.post('/get_all_scene', function (req, res, next) {
  serviceScene.getAllScene(req.token.user_id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});

/**
 * device_mac,scene_name
 * 添加场景
 */
router.post('/add_scene', function (req, res, next) {
  serviceScene.addScene(req.token.user_id, req.body, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

/**
 * 删除场景
 */
router.post('/remove_scene', function (req, res, next) {
  serviceScene.removeScene(req.token.user_id, req.body.device_mac, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000 }));
    }
  });
});

module.exports = router;