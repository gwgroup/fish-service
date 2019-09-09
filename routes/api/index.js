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
  service.open(client_id, io_code, duration, (err, result) => {
    if (err) {
      res.send(JSON.stringify({ code: 1001, message: err.message }));
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
      res.send(JSON.stringify({ code: 1001, message: err.message }));
    } else {
      res.send(JSON.stringify({ code: 1000, message: '已关闭' }));
    }
  });
});

module.exports = router;
