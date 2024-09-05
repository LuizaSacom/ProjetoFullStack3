const winston = require('winston');

const { createLogger, format, transports } = winston;
const { combine, timestamp, json, prettyPrint } = format;

const logger = createLogger({
  level: 'info', 
  format: combine(
    timestamp(),
    json(), 
    prettyPrint() 
  ),
  transports: [
    new transports.Console(), 
    new transports.File({ filename: 'combined.log' }) 
  ],
});

module.exports = logger;