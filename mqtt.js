
var mqtt = require('mqtt'),
  util = require('./utils/index'),
  client = undefined;
//配置
const CONFIG = require('./config/index').mqtt,
  //客户端发送消息主题
  SUB_TOPIC = 'device/set/fish/#',
  //遗嘱主题
  LWT_TOPIC = 'device/lwt/fish/#',
  //在线
  MESSAGE_TYPE_ONLINE = 1001,
  //离线
  MESSAGE_TYPE_OFFLINE = 1002;

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
  });
  client.on("message", messageHandler);
};

/**
* 停止
*/
var stop = function () {
  console.log("断开MQTT连接");
  if (client) {
    client.end();
    client = undefined;
  }
};

/**
* 消息处理
* @param {String} topic 
* @param {String} message 
*/
var messageHandler = function (topic, message) {
  try {
    console.log(topic, message.toString('utf8'));
    // let topicObj = util.parseTopic(topic),
    //   body = JSON.parse(message.toString('utf8'));
    // switch (body.type) {
    //   case MESSAGE_TYPE_ONLINE:
    //     serviceDevice.online(topicObj.clientId);
    //     break;
    //   case MESSAGE_TYPE_OFFLINE:
    //     serviceDevice.offline(topicObj.clientId);
    //     break;
    //   default:
    //     console.warn('未找到要处理的类型');
    //     break;
    // }
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
  if (client) {
    let topic = `device/get/fish/${clientId}`;
    client.publish(topic, JSON.stringify(body));
  }
};

module.exports = { run, stop, sendWithClient };

