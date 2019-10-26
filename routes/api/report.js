var express = require('express');
var router = express.Router();
var reportService = require('../../services/report');
/**
 *获取报表总览数据
 */
router.post('/get_preview', function (req, res, next) {
  if (!util.checkRequiredParams(['device_mac'], req.body)) {
    return next(util.BusinessError.create(RESULT_CODE.paramsError));
  }
  reportService.getPreview(req.body.device_mac, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(JSON.stringify({ code: 1000, data: result }));
    }
  });
});
module.exports = router;