var express = require('express');
var router = express.Router();

var service = require('../../services/device');

/* 启动水泵 */
router.post('/open_pump', function (req, res, next) {
  service.openPump("0000000055ed");
  res.send(JSON.stringify({}));
});

/* 关闭水泵 */
router.post('/close_pump', function (req, res, next) {
  service.closePump("0000000055ed");
  res.send(JSON.stringify({}));
});

module.exports = router;
