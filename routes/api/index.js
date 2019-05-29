var express = require('express');
var router = express.Router();
var configPin = require('../../config/index').pin;
var service = require('../../services/device');

/* 启动水泵 */
router.post('/open_pump', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo("0000000055ed");
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.pump===1) {
      //水泵已经在抽水
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.openPump("0000000055ed");
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭水泵 */
router.post('/close_pump', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo("0000000055ed");
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.pump===0) {
      //水泵本来就没有启动
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.closePump("0000000055ed");
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/**
 * 设备信息
 */
router.post('/device_info', function (req, res, next) {
  res.send(JSON.stringify({ code: 1000, data: service.deviceInfo("0000000055ed") }));
});

module.exports = router;
