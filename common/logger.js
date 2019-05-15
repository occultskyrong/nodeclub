const log4js = require('log4js');
const pathLib = require('path');

const config = require('../config');

const env = process.env.NODE_ENV || 'development';

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: pathLib.join(config.log_dir, 'app.log'), category: 'app' },
  ],
});

const logger = log4js.getLogger('app');
logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'INFO');

module.exports = logger;
