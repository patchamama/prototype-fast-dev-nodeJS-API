// Desc: Main application file for the backend
// Usage: node app.js

const config = require('./utils/config')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
// express-async-errors allows for async/await syntax in express error handling
require('express-async-errors')

// controllers
const booksRouter = require('./controllers/bookController')
const usersRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')

// mongoose set strictQuery to false to allow for querying by id
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// middleware
const middleware = require('./utils/middleware')

// cors allows requests from other origins
app.use(cors())

// morgan logs requests to the console
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// express.static serves the build folder
// (as static files, like images or react code)
// app.use(express.static('build'))

// express.json parses json data from requests
app.use(express.json())

// routes
app.use('/api/books', booksRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// unknown endpoint handler
app.use(middleware.unknownEndpoint)
// error handler
app.use(middleware.errorHandler)

module.exports = app
