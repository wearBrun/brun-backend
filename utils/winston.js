import winston from 'winston';
import env from '../env.js'
// Configure Winston to log errors to a file
export const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    env.NODE_ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});