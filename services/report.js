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
    kwh = power_w ? parseFloat((power_w * actual_duration / 3600000 / 1000).toFixed(5)) : null;
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

/**
 * 获取预览报表数据
 * @param {String} device_mac 
 * @param {Function} cb 
 */
function getPreview(device_mac, cb) {
  let initObject = {
    today_water_temperature: { water_temperature_max: null, water_temperature_min: null, water_temperature_avg: null },
    today_ph: { ph_max: null, ph_min: null, ph_avg: null },
    today_o2: { o2_max: null, o2_min: null, o2_avg: null },
    today_kwh: { kwh_sum: null },
    today_feeder_weight: { actual_weight_sum: null },
    today_aeration_duration: { actual_duration_sum: null },
    past7day_water_temperature: { water_temperature_max: null, water_temperature_min: null, water_temperature_avg: null },
    past7day_ph: { ph_max: null, ph_min: null, ph_avg: null },
    past7day_o2: { o2_max: null, o2_min: null, o2_avg: null },
    past7day_kwh: { kwh_sum: null },
    past7day_feeder_weight: { actual_weight_sum: null },
    past7day_aeration_duration: { actual_duration_sum: null }
  };
  MysqlHelper.query(`
# 传感器指标
#今天
SELECT 
  MAX(water_temperature) water_temperature_max,
  MIN(water_temperature) water_temperature_min,
  TRUNCATE(AVG(water_temperature),1) water_temperature_avg,
  MAX(ph) ph_max,
  MIN(ph) ph_min,
  TRUNCATE(AVG(ph),1) ph_avg,
  MAX(o2) o2_max,
  MIN(o2) o2_min,
  TRUNCATE(AVG(o2),1) o2_avg
FROM \`fish\`.\`f_sensor_data\` 
WHERE device_mac=? AND TO_DAYS(NOW()) = TO_DAYS(\`create_time\`);
#过去7天
SELECT 
  MAX(water_temperature) water_temperature_max,
  MIN(water_temperature) water_temperature_min,
  TRUNCATE(AVG(water_temperature),1) water_temperature_avg,
  MAX(ph) ph_max,
  MIN(ph) ph_min,
  TRUNCATE(AVG(ph),1) ph_avg,
  MAX(o2) o2_max,
  MIN(o2) o2_min,
  TRUNCATE(AVG(o2),1) o2_avg
FROM \`fish\`.\`f_sensor_data\` 
WHERE device_mac=? AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) <=DATE(\`create_time\`) AND DATE(\`create_time\`)<=DATE(CURDATE()-1);
#今日用电量
SELECT
  SUM(\`kwh\`) kwh_sum
FROM \`fish\`.\`f_report\`
WHERE device_mac=? AND TO_DAYS(NOW()) = TO_DAYS(\`end_time\`);
#过去7天用电量
SELECT
  SUM(\`kwh\`) kwh_sum
FROM \`fish\`.\`f_report\`
WHERE device_mac=?  AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) <=DATE(\`end_time\`) AND DATE(\`end_time\`)<=DATE(CURDATE()-1);
#今日投喂量
SELECT
  FLOOR(SUM(\`actual_weight\`)) actual_weight_sum
FROM \`fish\`.\`f_report\`
WHERE device_mac=? AND \`io_type\`='feeder' AND TO_DAYS(NOW()) = TO_DAYS(\`end_time\`);
#过去7天投喂量
SELECT
  FLOOR(SUM(\`actual_weight\`)) actual_weight_sum
FROM \`fish\`.\`f_report\`
WHERE device_mac=? AND \`io_type\`='feeder' AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) <=DATE(\`end_time\`) AND DATE(\`end_time\`)<=DATE(CURDATE()-1);
#今日增氧时长
SELECT
  FLOOR(SUM(\`actual_duration\`)/1000) actual_duration_sum
FROM \`fish\`.\`f_report\`
WHERE device_mac=? AND \`io_type\`='aerator' AND TO_DAYS(NOW()) = TO_DAYS(\`end_time\`);
#过去7天增氧时长
SELECT
  FLOOR(SUM(\`actual_duration\`)/1000) actual_duration_sum
FROM \`fish\`.\`f_report\`
WHERE device_mac=? AND \`io_type\`='aerator' AND DATE_SUB(CURDATE(), INTERVAL 7 DAY) <=DATE(\`end_time\`) AND DATE(\`end_time\`)<=DATE(CURDATE()-1);
`, [device_mac, device_mac, device_mac, device_mac, device_mac, device_mac, device_mac, device_mac], function (err, results) {
    if (err) {
      return cb(err);
    }
    __fillPreviewData(initObject.today_water_temperature, results[0][0]);
    __fillPreviewData(initObject.today_ph, results[0][0]);
    __fillPreviewData(initObject.today_o2, results[0][0]);
    __fillPreviewData(initObject.today_kwh, results[2][0]);
    __fillPreviewData(initObject.today_feeder_weight, results[4][0]);
    __fillPreviewData(initObject.today_aeration_duration, results[6][0]);
    __fillPreviewData(initObject.past7day_water_temperature, results[1][0]);
    __fillPreviewData(initObject.past7day_ph, results[1][0]);
    __fillPreviewData(initObject.past7day_o2, results[1][0]);
    __fillPreviewData(initObject.past7day_kwh, results[3][0]);
    __fillPreviewData(initObject.past7day_feeder_weight, results[5][0]);
    __fillPreviewData(initObject.past7day_aeration_duration, results[7][0]);
    let obj = adapter.getDeviceStatus(device_mac);
    initObject.today_water_temperature.current = obj.status.water_temperature;
    initObject.today_ph.current = obj.status.ph;
    initObject.today_o2.current = obj.status.o2;
    return cb(undefined, initObject);
  });
}
/**
 * 填充到基础对象数据
 * @param {Object} baseObj 
 * @param {Object} data 
 */
function __fillPreviewData(baseObj, data) {
  if (!data) {
    return;
  }
  for (let key in baseObj) {
    baseObj[key] = data[key];
  }
}
/**
 * 获取传感器数据
 * @param {Object} params 
 * @param {Function} cb 
 */
function getSensorData(params, cb) {
  let { device_mac, start_date, end_date } = params;
  MysqlHelper.query(`
  SELECT
    \`water_temperature\`,
    \`ph\`,
    \`o2\`,
    \`create_time\`
  FROM
    \`fish\`.\`f_sensor_data\`
  WHERE \`device_mac\`=? AND DATE(\`create_time\`)>=? AND DATE(\`create_time\`)<=?;
  `, [device_mac, start_date, end_date], cb);
}
/**
 * 获取用电量数据
 * @param {Object} params 
 * @param {Function} cb 
 */
function getKwhData(params, cb) {
  let { device_mac, start_date, end_date } = params;
  MysqlHelper.query(`
  SELECT
    \`io_name\`,
    \`io_code\`,
    \`io_type\`,
    \`start_time\`,
    \`end_time\`,
    \`plan_duration\`,
    \`actual_duration\`,
    \`power_w\`,
    \`kwh\`
  FROM
    \`fish\`.\`f_report\`
  WHERE \`device_mac\`=?  AND power_w IS NOT NULL AND DATE(\`create_time\`)>=? AND DATE(\`create_time\`)<=?;
  `, [device_mac, start_date, end_date], cb);
}
/**
 * 获取投喂数据
 * @param {Object} params 
 * @param {Function} cb 
 */
function getFeedData(params, cb) {
  let { device_mac, start_date, end_date } = params;
  MysqlHelper.query(`
  SELECT
    \`io_name\`,
    \`io_code\`,
    \`io_type\`,
    \`start_time\`,
    \`end_time\`,
    \`plan_duration\`,
    \`actual_duration\`,
    \`weight_per_second\`,  
    \`actual_weight\`
  FROM
    \`fish\`.\`f_report\`
  WHERE \`device_mac\`=? AND actual_weight IS NOT NULL AND DATE(\`create_time\`)>=? AND DATE(\`create_time\`)<=?;
  `, [device_mac, start_date, end_date], cb);
}

/**
 * 获取增氧记录数据
 * @param {Object} params 
 * @param {Function} cb 
 */
function getAerationData(params, cb) {
  let { device_mac, start_date, end_date } = params;
  MysqlHelper.query(`
  SELECT
    \`io_name\`,
    \`io_code\`,
    \`io_type\`,
    \`start_time\`,
    \`end_time\`,
    \`plan_duration\`,
    \`actual_duration\`
  FROM
    \`fish\`.\`f_report\`
  WHERE \`device_mac\`=? AND io_type='aerator' AND DATE(\`create_time\`)>=? AND DATE(\`create_time\`)<=?;
  `, [device_mac, start_date, end_date], cb);
}
module.exports = { fill, gatherSensorData, getPreview, getSensorData, getKwhData, getFeedData, getAerationData };