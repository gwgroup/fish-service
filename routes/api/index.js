var express = require('express');
var router = express.Router();
var configPin = require('../../config/index').pin;
var service = require('../../services/device');
//const CLIENT_ID = "b827eb540371";//0000000055ed

/* 启动 */
router.post('/open', function (req, res, next) {
  let io_code = req.body.io_code,
    client_id = req.body.client_id,
    duration = req.body.duration;
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(client_id);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.lamp2.opened === 1) {
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.open(client_id, io_code, duration, function (err, topicObj, data) {
        res.send(JSON.stringify({ code: 1000 }));
      });
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭 */
router.post('/close', function (req, res, next) {
  let io_code = req.body.io_code,
    client_id = req.body.client_id;
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(client_id);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.lamp2.opened === 0) {

      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.close(client_id, io_code, function (err, topicObj, data) {
        res.send(JSON.stringify({ code: 1000 }));
      });
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});


/**
 * 设备信息
 */
router.post('/device_info', function (req, res, next) {
  res.send(JSON.stringify({ code: 1000, data: service.deviceInfo(req.body.client_id) }));
});

module.exports = router;
