const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { tokenExtractor } = require('../utils/middleware')

describe('when there is initially one user in db', () => {
  let token // Token of authenticated user
  let userId // ID of authenticated user

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    token = response.body.token
    userId = response.body.id
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mulukka',
      name: 'Muluken',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('should create a new user with valid username and password', async () => {
    const newUser = {
      username: 'newuser',
      password: 'password123',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)
    // console.log(response.body)
    expect(response.status).toBe(201)
    expect(response.body.username).toEqual(newUser.username)
    expect(response.body.name).toEqual(newUser.name)
    // expect(response.body.passwordHash).not.toEqual(newUser.password)

    const savedUser = await User.findOne({ username: newUser.username })
    // console.log(savedUser)
    expect(savedUser.username).toEqual(newUser.username)
    expect(savedUser.passwordHash).not.toEqual(newUser.password)
  })

  test('should return an error if username is not provided', async () => {
    const newUser = {
      password: 'password123',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain(
      'User validation failed: username: Path `username` is required.'
    )
  })

  test('should return an error if password is not provided', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain(
      '`password` is shorter than the minimum allowed length (3)'
    )
  })

  test('should return an error if username is not unique', async () => {
    const existingUser = new User({
      username: 'existinguser',
      passwordHash: await bcrypt.hash('password123', 10),
      name: 'Existing User',
    })
    await existingUser.save()

    const newUser = {
      username: 'existinguser',
      password: 'password123',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain('User validation failed')
  })

  test('should return an error if username or password is too short', async () => {
    const newUser = {
      username: 'u',
      password: 'p',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain(
      '`password` is shorter than the minimum allowed length (3)'
    )
  })

  test('should update user data', async () => {
    // Make a PUT request to update a user's data
    const response = await api
      .put(`/api/users/${userId}`)
      .set('Authorization', `bearer ${token}`) // Set the Authorization header
      .send({
        username: 'root',
        name: 'newname',
        password: 'sekret',
        email: 'new@email.com',
      })

    console.log(`User: /api/users/${userId}`)
    console.log(`Token: ${token}`)
    // Verify that the response is successful and has the new username
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('newname')
  })

  // Other user-related tests can go here

  afterAll(() => {
    // Perform any necessary cleanup after the tests, such as closing database connections if needed
  })
})
