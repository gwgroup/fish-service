var schedule = require('node-schedule');
var reportService = require('./services/report');
/**
 * 每30分钟执行一次传感数据采集
 */
schedule.scheduleJob('gather_sensor_data', '0 0,30 * * * *', reportService.gatherSensorData);

module.exports = schedule;