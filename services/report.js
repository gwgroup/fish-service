var util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper;
/*


{ start_time: 1569917055526,
data:    bin/www:6182 -   end_time: 1569917056527,
data:    bin/www:6182 -   plan_duration: 1000,
data:    bin/www:6182 -   io_code: 'feeder1',
data:    bin/www:6182 -   io_name: '投喂机1',
data:    bin/www:6182 -   io_type: 'feeder',
data:    bin/www:6182 -   weight_per_second: 23.1 }

{ start_time: 1569917008813,
data:    bin/www:6182 -   end_time: 1569917018814,
data:    bin/www:6182 -   plan_duration: 10000,
data:    bin/www:6182 -   io_code: 'lamp1',
data:    bin/www:6182 -   io_name: '灯',
data:    bin/www:6182 -   io_type: 'lamp' }


*/

/**
 * 采集报表
 * @param {String} clientId 
 * @param {Object} report 
 */
function fill(clientId, report) {
  let o1 = { plan_duration, io_code, io_name, io_type, weight_per_second } = report;
  let obj = Object.assign({ device_mac: clientId, start_time: new Date(report.start_time), end_time: new Date(report.end_time) }, o1);
  MysqlHelper.query('INSERT INTO `fish`.`f_report` SET ?;', obj, (err) => {
    if (err) {
      console.error(err, clientId, report);
    }
  });
}
module.exports = { fill };