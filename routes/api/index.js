var express = require('express');
var router = express.Router();
var configPin = require('../../config/index').pin;
var service = require('../../services/device');
const CLIENT_ID = "b827eb170977";//0000000055ed
/* 启动水泵 */
router.post('/open_pump', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.pump === 1) {
      //水泵已经在抽水
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.openPump(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭水泵 */
router.post('/close_pump', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.pump === 0) {
      //水泵本来就没有启动
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.closePump(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});


/* 启动增氧机1 */
router.post('/open_aerator1', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.aerator1 === 1) {
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.openAerator1(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭增氧机1 */
router.post('/close_aerator1', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.aerator1 === 0) {
     
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.closeAerator1(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});


/* 启动增氧机2 */
router.post('/open_aerator2', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.aerator2 === 1) {
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.openAerator2(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭增氧机2 */
router.post('/close_aerator2', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.aerator2 === 0) {
     
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.closeAerator2(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});


/* 启动LED灯1 */
router.post('/open_lamp1', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.lamp1 === 1) {
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.openLamp1(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭LED灯1 */
router.post('/close_lamp1', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.lamp1 === 0) {
     
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.closeLamp1(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});


/* 启动LED灯2 */
router.post('/open_lamp2', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.lamp2 === 1) {
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.openLamp2(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});

/* 关闭LED灯2 */
router.post('/close_lamp2', function (req, res, next) {
  if (req.body.pin === configPin) {
    let obj = service.deviceInfo(CLIENT_ID);
    if (!obj || obj.online === 0) {
      //设备不在线
      res.send(JSON.stringify({ code: 1002 }));
    } else if (obj.status.lamp2 === 0) {
     
      res.send(JSON.stringify({ code: 1003 }));
    } else {
      service.closeLamp2(CLIENT_ID);
      res.send(JSON.stringify({ code: 1000 }));
    }
  } else {
    res.send(JSON.stringify({ code: 1001 }));
  }
});


/**
 * 设备信息
 */
router.post('/device_info', function (req, res, next) {
  res.send(JSON.stringify({ code: 1000, data: service.deviceInfo(CLIENT_ID) }));
});

module.exports = router;
