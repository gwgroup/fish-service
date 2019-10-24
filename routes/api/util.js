var express = require('express');
var router = express.Router();
var util = require('../../utils/index');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var fishScreenshot = multer({ dest: path.join(__dirname, '../../../fish-screenshot/') });
var adapter = require('../../adapter');
var easyDarwinService = require('../../services/easy-darwin');
const SCREENSHOT_URL = require('../../config/index').openUrls.screenshotUrl;
//上报设备信息
router.get('/get_info', function (req, res, next) {
  let client_id = req.param("client_id");
  let ip = util.getClientIp(req);
  adapter.getDeviceStatus(client_id).ip = ip;
  res.send(JSON.stringify({ code: 1000, data: { local_ip: ip, server_timestamp: Date.now() } }));
});

//获取rtsp的推流是否可以释放
router.get('/ed_stream_can_be_release', function (req, res, next) {
  let q = req.query.q;
  easyDarwinService.canBeRelease(q, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify({ code: 1000, data: result }));
  });
});
//文件上传
router.post('/file_upload', fishScreenshot.single('screenshot'), function (req, res, next) {
  fs.renameSync(req.file.path, path.join(req.file.destination, req.file.originalname));
  res.send(JSON.stringify({ code: 1000, data: `${SCREENSHOT_URL}/${req.file.originalname}` }));
});
module.exports = router;
