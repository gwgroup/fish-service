var util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper,
  mqtt = require('../mqtt'),
  deviceService = require('./device');



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
mqtt.on('report', function (topic, report) {
  fill(topic.clientId, report);
});

/**
 * 采集报表
 * @param {String} clientId 
 * @param {Object} report 
 */
function fill(clientId, report) {
  let { plan_duration, io_code, io_name, io_type, weight_per_second } = report,
    obj = {
      device_mac: clientId,
      start_time: util.dateFormat(new Date(report.start_time), 'yyyy-MM-dd hh:mm:ss.S'),
      end_time: util.dateFormat(new Date(report.end_time), 'yyyy-MM-dd hh:mm:ss.S'),
      plan_duration,
      io_code,
      io_name,
      io_type,
      weight_per_second
    };
  MysqlHelper.query('INSERT INTO `fish`.`f_report` SET ?;', obj, (err) => {
    if (err) {
      console.error(err, obj);
    }
  });
}

/**
 * 采集传感器数据
 * @param {String} fireTime
 */
function gatherSensorData(fireTime) {
  let ds = deviceService.getAllDeviceStatus();
  let result = [];
  ds.forEach((val, device_mac) => {
    if (val.online) {
      let { water_temperature, ph, o2 } = val.status;
      if (water_temperature != null || ph != null || o2 != null) {
        result.push(`('${device_mac}',${water_temperature},${ph},${o2})`);
      }
    }
  });
  if (result.length === 0) {
    return;
  }
  let dataStr = result.join(',');
  MysqlHelper.query(
    `INSERT INTO \`fish\`.\`f_sensor_data\` 
    (\`device_mac\`,
    \`water_temperature\`,
    \`ph\`,
    \`o2\`)
    VALUES ${dataStr};`,
    [],
    (err) => {
      if (err) {
        return console.error('gather_sensor_data', fireTime, err);
      }
      console.log('gather_sensor_data', fireTime, 'count', result.length);
    });
}

module.exports = { fill, gatherSensorData };


