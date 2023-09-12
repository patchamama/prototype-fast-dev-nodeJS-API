// Desc: Login controller for the backend using JWT
// Usage: const loginRouter = require('./controllers/login')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Post a new user to the database
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  // create a token for the user and send it back
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
