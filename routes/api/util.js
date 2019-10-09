var express = require('express');
var router = express.Router();
var util = require('../../utils/index');
var deviceService = require('../../services/device');
var easyDarwinService = require('../../services/easy-darwin');
//上报设备信息
router.get('/get_info', function (req, res, next) {
  let client_id = req.param("client_id");
  let ip = util.getClientIp(req);
  deviceService.getDeviceStatus(client_id).ip = ip;
  res.send(JSON.stringify({ code: 1000, data: { local_ip: ip, server_timestamp: Date.now() } }));
});

//获取rtsp的推流是否可以释放
router.get('/ed_stream_can_be_release', function (req, res, next) {
  let q = req.params.q;
  easyDarwinService.canBeRelease(q, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify({ code: 1000, data: result }));
  });
});
module.exports = router;
