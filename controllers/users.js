// Desc: Controller for the user model
// Usage: const usersRouter = require('./controllers/users')

const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

// Post a new user to the database
router.post('/', async (request, response) => {
  const { username, name, password, email } = request.body

  // Check that the password is at least 3 characters long
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: '`password` is shorter than the minimum allowed length (3)',
    })
  }

  // saltRounds is the number of times the password is hashed
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    email,
    passwordHash,
    // add new fields here
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

// Get all users
router.get('/', async (request, response) => {
  // Populate the prototypes field with the title of the prototype
  const users = await User.find({}).populate('prototypes')
  response.json(users)
})

router.delete('/:id', async (request, response) => {
  // ToDo: Remove the entries from the user's prototype list
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = router
