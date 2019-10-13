var schedule = require('node-schedule');
var reportService = require('./services/report');
/**
 * 每30分钟执行一次传感数据采集
 */
schedule.scheduleJob('gather_sensor_data', '0 0,30 * * * *', reportService.gatherSensorData);

console.log('3.调度任务加载完成');
module.exports = schedule;