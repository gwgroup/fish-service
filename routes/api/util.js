var express = require('express');
var router = express.Router();
var util = require('../../utils/index');
var deviceService = require('../../services/device');

router.get('/get_info', function (req, res, next) {
  let client_id = req.param("client_id");
  let ip = util.getClientIp(req);
  deviceService.getDeviceStatus(client_id).ip = ip;
  res.send(JSON.stringify({ code: 1000, data: { local_ip: ip, server_timestamp: Date.now() } }));
});

module.exports = router;
