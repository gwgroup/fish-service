var express = require('express');
var router = express.Router();

router.post('/get_ip', function (req, res, next) {
  let ip = req.socket.remoteAddress;
  res.send(JSON.stringify({ code: 1000, data: ip }));
});

module.exports = router;
