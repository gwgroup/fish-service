var express = require('express');
var router = express.Router();
var util = require('../../utils/index');

router.get('/get_ip', function (req, res, next) {
  res.send(JSON.stringify({ code: 1000, data: util.getClientIp(req) }));
});

module.exports = router;
