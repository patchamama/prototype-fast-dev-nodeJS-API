const request = require('supertest')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

// Helper function to generate a test token
const generateTestToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  return jwt.sign(userForToken, process.env.SECRET)
}

describe('Login Controller Tests', () => {
  // Before each test, clear the user database
  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('should log in a user with valid credentials', async () => {
    // Create a test user with a password hash
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'testuser',
      passwordHash,
    })
    await user.save()

    // Make a login request with the credentials
    const response = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' })

    // Verify that the request is successful
    expect(response.statusCode).toBe(200)

    // Verify that the response body contains a token
    expect(response.body).toHaveProperty('token')

    // Verify that the token is valid
    const decodedToken = jwt.verify(response.body.token, process.env.SECRET)
    expect(decodedToken.username).toBe('testuser')
  })

  it('should return an error for invalid credentials', async () => {
    // Make a login request with incorrect credentials
    const response = await api
      .post('/api/login')
      .send({ username: 'nonexistentuser', password: 'invalidpassword' })

    // Verify that the request returns a 401 (Unauthorized) status code
    expect(response.statusCode).toBe(401)

    // Verify that the response body contains an error message
    expect(response.body).toHaveProperty(
      'error',
      'invalid username or password'
    )
  })
})
