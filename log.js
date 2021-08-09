const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  transports: [
    new winston.transports.Console(),
  ]
});

module.exports = logger