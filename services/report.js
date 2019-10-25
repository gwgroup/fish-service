var util = require('../utils/index'),
  MysqlHelper = util.MysqlHelper,
  adapter = require('../adapter');

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
adapter.mqtt.on('report', function (topic, report) {
  fill(topic.clientId, report);
});

/**
 * 采集报表
 * @param {String} clientId 
 * @param {Object} report 
 */
function fill(clientId, report) {
  let { plan_duration, io_code, io_name, io_type, weight_per_second, power_w } = report,
    actual_duration = report.end_time - report.start_time,
    actual_weight = weight_per_second ? parseFloat((weight_per_second * actual_duration / 1000).toFixed(2)) : null,
    kwh = power_w ? parseFloat((power_w * actual_duration / 3600000).toFixed(5)) : null;
  obj = {
    device_mac: clientId,
    start_time: util.dateFormat(new Date(report.start_time), 'yyyy-MM-dd hh:mm:ss.S'),
    end_time: util.dateFormat(new Date(report.end_time), 'yyyy-MM-dd hh:mm:ss.S'),
    plan_duration,
    actual_duration,
    actual_weight,
    io_code,
    io_name,
    io_type,
    weight_per_second,
    power_w,
    kwh
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
  let ds = adapter.getAllDeviceStatus();
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