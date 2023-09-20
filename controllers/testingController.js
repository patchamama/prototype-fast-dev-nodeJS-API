const testingRouter = require('express').Router()
const Prototype = require('../models/prototype')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Prototype.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
