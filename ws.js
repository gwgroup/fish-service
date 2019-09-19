var async = require('async');
var WebSocketServer = require('websocket').server;
var tokenService = require('./services/token');
let ws = null;
let connections = new Set();

function __handlerMessage(message) {
  console.log(message);
}

function __handlerClose(reasonCode, description) {
  console.log(new Date().toLocaleDateString(), 'Disconnected', reasonCode, description);
  connections.delete(this);
}

/**
 * 监听
 * @param {Object} httpServer 
 */
function listen(httpServer) {
  if (ws) {
    return;
  }
  ws = new WebSocketServer({ httpServer: httpServer, autoAcceptConnections: false });
  ws.on("request", req => {
    async.waterfall(
      [
        (cb) => {
          //1.检查token
          tokenService.checkToken(req.resourceURL.query.token, cb);
        }
      ], (err, result) => {
        if (err) {
          //拒绝连接
          console.error(err);
          req.reject();
          return;
        } else if (!result) {
          //拒绝连接
          req.reject();
          return;
        }
        //同意连接
        let con = req.accept();
        con.userId = result.user_id;
        req.on("message", __handlerMessage);
        con.on('close', __handlerClose);
        connections.add(con);
      }
    );
  });
}

/**
 * 发送数据到用户组
 * @param {Array} userids 
 * @param {Object} obj 
 */
function sendDataWithUsers(userids, obj) {
  let data = JSON.stringify(obj);
  __getConnectionsWithUserids(userids).forEach(con => {
    if (con.connected) {
      con.sendUTF(data);
    }
  });
}

/**
 * 根据用户ID数组获取所有用户连接
 * @param {Array} userids 
 */
function __getConnectionsWithUserids(userids) {
  let ary = [];
  connections.forEach((el) => {
    if (userids.indexOf(el.userId) != -1) {
      ary.push(el);
    }
  });
  return ary;
}

module.exports = { listen, sendDataWithUsers };