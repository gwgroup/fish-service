var sms = require('../utils/sms'),
    util = require('../utils/index'),
    BusinessError = util.BusinessError,
    config = require('../config'),
    CODES = config.codes,
    dbhelper = require('../utils/mysql-helper');

/**
 * 发送验证码
 * @param {String} mobile 
 * @param {String} ip 
 * @param {Function} cb 
 */
var sendValiCode = function ({ mobile, ip }, cb) {
    //1.检查电话号码是否多次发送短信
    let time = new Date(Date.now() - (1000 * 120));
    let sql = 'SELECT `id`,`code`,`mobile`,`ip`,`create_time` FROM `fish`.`pt_verify_code` WHERE mobile=? AND create_time>?;';
    dbhelper.query(sql, [mobile, time], (err, result) => {
        if (err) {
            return cb(err);
        }
        if (result.length > 0) {
            return cb(BusinessError.create(CODES.smsTooMany));
        }
        let obj = { code: util.generateValiCode(), ip, mobile };
        dbhelper.query("INSERT INTO `fish`.`pt_verify_code` SET ?;", obj, (err, result) => {
            if (err) {
                return cb(err);
            }
            sms.sendSMS(mobile, sms.TEMPLATES.VALI_CODE, { code: obj.code }, function (err, res) {
                if (err) {
                    return cb(err);
                }
                cb(undefined);
            });
        });
    });
};

/**
 * 检查验证码是否合法
 * @param {String} mobile 
 * @param {String} valiCode 
 * @param {Function} cb 
 */
var checkValiCode = function (mobile, valiCode, cb) {
    let time = new Date(Date.now() - config.expires.smsValiCode);
    let sql = 'SELECT `id`,`code`,`mobile`,`ip`,`create_time` FROM `fish`.`pt_verify_code` WHERE mobile=? AND `code`=?;';
    dbhelper.query(sql, [mobile, valiCode.toLowerCase()], (err, result) => {
        if (err) { return cb(err); }
        let vobj = result[0];
        if (!vobj) {
            return cb(BusinessError.create(CODES.valiCodeNotExist));
        } else if (vobj.create_time < time) {
            return cb(BusinessError.create(CODES.valiCodeExpire));
        }
        cb();
    });
};
module.exports = { sendValiCode, checkValiCode }
