var express = require('express');
var router = express.Router();

var service = require('../../services/device');

/* 启动水泵 */
router.post('/open_pump', function (req, res, next) {
  if (req.body.pin === '0923') {
    service.openPump("0000000055ed");
    res.send(JSON.stringify({ code: 1000 }));
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭水泵 */
router.post('/close_pump', function (req, res, next) {
  if (req.body.pin === '0923') {
    service.closePump("0000000055ed");
    res.send(JSON.stringify({ code: 1000 }));
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

module.exports = router;
