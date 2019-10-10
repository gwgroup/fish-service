
var mqtt = require('mqtt'),
  util = require('./utils/index'),
  config = require('./config/index'),
  CODES = config.codes,
  EventEmitter = require('events').EventEmitter,
  __ev = new EventEmitter(),
  client = undefined;

//配置
const CONFIG = config.mqtt,
  //客户端发送消息主题
  SUB_TOPIC = 'device/set/fish/#',
  //遗嘱主题
  LWT_TOPIC = 'device/lwt/fish/#',
  //下方公共消息
  PUBLIC_TOPIC = "device/public/fish",
  //在线
  MESSAGE_TYPE_ONLINE = 1001,
  //离线
  MESSAGE_TYPE_OFFLINE = 1002,
  //设备状态反馈
  MESSAGE_TYPE_STATUS = 3003,
  //RPC 结果
  MESSAGE_TYPE_RPC = 5001,
  //报告收集
  MESSAGE_TYPE_REPORT = 3005;

/**
* 运行
*/
var run = function () {
  if (client) {
    return;
  }
  console.log("2.启动设备消息收发服务");
  client = mqtt.connect(CONFIG.url, CONFIG.options);
  client.on("connect", function () {
    client.subscribe(SUB_TOPIC, { qos: 2, retain: false });
    client.subscribe(LWT_TOPIC, { qos: 2, retain: false });
    sendAllClient({ sub_type: MESSAGE_TYPE_STATUS });
    //通知所有客户端上报设备状态
  });
  client.on("message", messageHandler);
};

// /**
// * 停止
// */
// var stop = function () {
//   console.log("断开MQTT连接");
//   if (client) {
//     client.end();
//     client = undefined;
//   }
// };

/**
* 消息处理
* @param {String} topic 
* @param {String} message 
*/
var messageHandler = function (topic, message) {
  try {
    //console.log(topic, message.toString('utf8'));
    let topicObj = util.parseTopic(topic),
      body = JSON.parse(message.toString('utf8'));
    switch (body.type) {
      case MESSAGE_TYPE_RPC:
        let id = body.id;
        __ev.emit(`rpc_${id}`, body, topicObj);
        break;
      case MESSAGE_TYPE_ONLINE:
        __ev.emit('online', topicObj);
        break;
      case MESSAGE_TYPE_OFFLINE:
        __ev.emit('offline', topicObj);
        break;
      case MESSAGE_TYPE_STATUS:
        __ev.emit('status', topicObj, body.status);
        break;
      case MESSAGE_TYPE_REPORT:
        __ev.emit('report', topicObj, body.report);
        break;
      default:
        console.warn('未找到要处理的类型');
        break;
    }
  } catch (ex) {
    console.error(ex);
  }
};

/**
* 发送数据（clientId）
* @param {String} clientId 
* @param {Object} body 
*/
var sendWithClient = function (clientId, body) {
  if (client && client.connected) {
    let topic = `device/get/fish/${clientId}`;
    client.publish(topic, JSON.stringify(body));
  }
};

/**
* 发送数据到所有客户端（clientId）
* @param {Object} body 
*/
var sendAllClient = function (body) {
  if (client && client.connected) {
    client.publish(PUBLIC_TOPIC, JSON.stringify(body));
  }
};

/**
 * 远程调用
 * @param {String} clientId 
 * @param {Object} body 
 * @param {Function} cb 
 * @param {Number} timeout
 */
var rpc = function (clientId, body, cb, timeout = 5000) {
  if (client && client.connected) {
    let id = util.generateID(),
      evName = `rpc_${id}`,
      topic = `device/get/fish/${clientId}`;
    client.publish(topic, JSON.stringify(Object.assign({ id, type: MESSAGE_TYPE_RPC }, body)));
    let qTimeout = null,
      tHandler = function (result) {
        clearTimeout(qTimeout);
        return cb(undefined, result);
      };
    __ev.once(evName, tHandler);
    qTimeout = setTimeout(() => {
      __ev.removeListener(evName, tHandler);
      return cb(util.BusinessError.create(CODES.rpcTimeout));
    }, timeout);
  } else {
    return cb(util.BusinessError.create(CODES.serverError));
  }
}

run();
module.exports = Object.assign(__ev, { sendWithClient, rpc, sendAllClient });

