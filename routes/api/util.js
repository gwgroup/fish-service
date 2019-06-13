var express = require('express');
var router = express.Router();
var util = require('../../utils/index');

router.get('/get_info', function (req, res, next) {
  res.send(JSON.stringify({ code: 1000, data: { local_ip: util.getClientIp(req), server_timestamp: Date.now() } }));
});

module.exports = router;
