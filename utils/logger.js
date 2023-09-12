// Desc: logger for the backend
// Usage: const logger = require('./utils/logger')
// logger.info('message')
// logger.error('message')
//  - message is a string
//  - info is used for logging general information
//  - error is used for logging errors

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}
module.exports = {
  info,
  error,
}
