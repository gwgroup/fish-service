var util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper,
  BusinessError = util.BusinessError,
  config = require('../config/index'),
  tokenService = require('./token'),
  valiCodeService = require('./vali-code'),
  async = require('async');


/**
* 获取用户/创建用户
* @param {String} mobile 
* @param {Function} cb 
*/
var __getUserAnCreate = function (mobile, cb) {
  MysqlHelper.pool.getConnection((err, connection) => {
    if (err) {
      return cb(err);
    }
    async.waterfall([
      (cb) => {
        //查找用户
        connection.query('SELECT * FROM `fish`.`pt_user` WHERE mobile=?;', [mobile], (err, results) => {
          cb(err, results[0]);
        });
      }, (user, cb) => {
        //检查是否有用户,没有就创建
        if (user) {
          return cb(undefined, user);
        }
        let obj = { id: util.generateUUID(), mobile }
        connection.query('INSERT INTO `fish`.`pt_user` SET ?;', obj, (err, result) => {
          if (err) {
            return cb(err);
          }
          cb(undefined, obj);
        });
      }
    ], (err, result) => {
      connection.release();
      cb(err, result);
    });
  });
};


/**
 * 登录
 * @param {Object} params mobile,vali_code
 * @param {Function} cb 回调函数 返回token
 */
var login = function ({ mobile, vali_code }, cb) {
  if (!mobile || !vali_code) {
    return cb(BusinessError.create(config.codes.paramsError));
  }
  valiCodeService.checkValiCode(mobile,
    vali_code,
    (err) => {
      if (err) {
        return cb(err);
      }
      __getUserAnCreate(mobile, (err, user) => {
        if (err) {
          return cb(err);
        }
        tokenService.insertToken(user.id, cb);
      });
    });
};


/**
 * 加载用户数据
 * @param {String} user_id 
 * @param {Function} cb 
 */
function load(user_id, cb) {
  MysqlHelper.query(`
    SELECT
      a.*
    FROM
    \`fish\`.\`pt_user\` a
    WHERE a.\`id\`=?
    LIMIT 0, 1;
    SELECT
      \`device_mac\`,
      \`scene_name\`,
      \`create_time\`,
      \`update_time\`
    FROM
      \`fish\`.\`f_scene\`
    WHERE \`user_id\`=?;
    `,
    [user_id, user_id],
    (err, results) => {
      if (err) {
        return cb(err);
      }
      return cb(undefined, results);
    });
}
module.exports = { login, load };