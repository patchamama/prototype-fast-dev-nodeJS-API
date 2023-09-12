// Desc: Main entry point for the application
// Usage: node index.js

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// start the server
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
