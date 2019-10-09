var express = require('express');
var router = express.Router();
var util = require('../../utils/index');
var multer = require('multer');
var path = require('path');
var fishScreenshot = multer({ dest: path.join(__dirname, '../fish-screenshot/') });
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
  let q = req.query.q;
  easyDarwinService.canBeRelease(q, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify({ code: 1000, data: result }));
  });
});
//文件上传
router.post('/file_upload', upload.single('screenshot'), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  console.log(req.file);
  res.send(JSON.stringify({ code: 1000, data: 'xxx' }));
});
module.exports = router;
