const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Prototype = require('../models/prototype')
const User = require('../models/user')

beforeEach(async () => {
  await Prototype.deleteMany({})

  const prototypeObjects = helper.initialPrototypes.map(
    (prototype) => new Prototype(prototype)
  )
  const promiseArray = prototypeObjects.map((prototype) => prototype.save())
  await Promise.all(promiseArray)

  // for (let prototype of helper.initialPrototypes) {
  //   let prototypeObject = new Prototype(prototype)
  //   await prototypeObject.save()
  // }
})

describe('when there is initially some prototypes saved', () => {
  test('prototype are returned as json', async () => {
    await api
      .get('/api/prototypes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all prototype are returned', async () => {
    const response = await api.get('/api/prototypes')
    //   console.log(response.body)
    expect(response.body).toHaveLength(helper.initialPrototypes.length)
  })

  test('a specific prototype is within the returned prototypes', async () => {
    const response = await api.get('/api/prototypes')
    //   console.log(response.body[0])

    const contents = response.body.map((r) => r.title)
    //   console.log(contents)
    expect(contents).toContain('El tortuoso camino de la justicia transicional')
  })
})

describe('viewing a specific prototype', () => {
  let token // Token of authenticated user
  // let userId // ID of authenticated user

  beforeEach(async () => {
    await Prototype.deleteMany({})

    const prototypeObjects = helper.initialPrototypes.map(
      (prototype) => new Prototype(prototype)
    )
    const promiseArray = prototypeObjects.map((prototype) => prototype.save())
    await Promise.all(promiseArray)

    // for (let prototype of helper.initialPrototypes) {
    //   let prototypeObject = new Prototype(prototype)
    //   await prototypeObject.save()
    // }

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    token = response.body.token
    // userId = response.body.id
  })

  test('a valid prototype can be added', async () => {
    const newPrototype = {
      title: 'Fugas o la ansiedad de sentirse vivo',
    }

    await api
      .post('/api/prototypes')
      .set('Authorization', `bearer ${token}`)
      .send(newPrototype)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/prototypes')
    // const contents = response.body.map((r) => r.title)

    const prototypesAtEnd = await helper.prototypesInDb()
    expect(response.body).toHaveLength(helper.initialPrototypes.length + 1)

    const contents = prototypesAtEnd.map((n) => n.title)
    expect(contents).toContain('Fugas o la ansiedad de sentirse vivo')
  })

  test('fails with statuscode 404 if prototype does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/prototypes/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 404 if is not found', async () => {
    const invalidId = '6501d908459ef53f046fe9e5'

    await api.get(`/api/prototypes/${invalidId}`).expect(404)
  })

  test('fails with statuscode 400, bad format of id', async () => {
    const invalidId = '6501d908459ef53f04e5'

    await api.get(`/api/prototypes/${invalidId}`).expect(400)
  })

  test('unique identifier property of the prototype posts is named id,', async () => {
    const response = await api.get('/api/prototypes')
    const contents = response.body[0]
    //   console.log(contents)
    expect(contents.id).toBeDefined()
  })

  test('if the title is missing from the request data, the backend responds 400 Bad Request', async () => {
    // title is missing
    const response = await api
      .post('/api/prototypes')
      .set('Authorization', `bearer ${token}`)
      .send({})
    expect(response.status).toBe(400)

    const prototypesAtEnd = await helper.prototypesInDb()
    expect(prototypesAtEnd).toHaveLength(helper.initialPrototypes.length)
    //   expect(response.body).toHaveLength(initialPrototypes.length)
  })

  test('succeeds with status code 200 if title is updated', async () => {
    const prototypesAtStart = await helper.prototypesInDb()
    let prototypeToUpdate = prototypesAtStart[0]
    prototypeToUpdate.title = 'test title'
    // add new fields to be checked here

    await api
      .put(`/api/prototypes/${prototypeToUpdate.id}`)
      .send(prototypeToUpdate)
      .expect(200)

    const prototypesAtEnd = await helper.prototypesInDb()

    expect(prototypesAtEnd).toHaveLength(helper.initialPrototypes.length)

    // use map to get the titles of the prototypes
    const contents = prototypesAtEnd.map((r) => r.title)
    expect(contents).toContain(prototypeToUpdate.title)
  })

  test('should return an error if the user is not authenticated when add a prototype', async () => {
    const newPrototype = {
      title: 'Test Prototype Post',
    }

    const response = await api.post('/api/prototypes').send(newPrototype)

    expect(response.status).toBe(401)
    expect(response.body.error).toContain('operation not permitted')
  })

  test('should create a new prototype post for an authenticated user', async () => {
    const newPrototype = {
      title: 'Test Prototype Post',
    }

    const response = await api
      .post('/api/prototypes')
      .set('Authorization', `bearer ${token}`)
      .send(newPrototype)

    expect(response.status).toBe(201)
    expect(response.body.title).toEqual('Test Prototype Post')
    const prototypes = await Prototype.find({})
    expect(prototypes).toHaveLength(3)
    // expect(prototypes[2].title).toEqual('Test Prototype Post')
  })
})

describe('deletion of a prototype', () => {
  let token // Token of authenticated user
  let userId // ID of authenticated user

  beforeEach(async () => {
    await Prototype.deleteMany({})

    const prototypeObjects = helper.initialPrototypes.map(
      (prototype) => new Prototype(prototype)
    )
    const promiseArray = prototypeObjects.map((prototype) => prototype.save())
    await Promise.all(promiseArray)

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

  test('delete a prototype with not auth user: status code 400', async () => {
    const prototypesAtStart = await helper.prototypesInDb()
    const prototypeToDelete = prototypesAtStart[0]

    await api.delete(`/api/prototypes/${prototypeToDelete.id}`).expect(401)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const prototype = {
      title: 'Test Prototype Post',
      user: userId,
    }
    // let prototypeObject = new Prototype(prototype)
    // await prototypeObject.save()

    const resp = await api
      .post('/api/prototypes')
      .set('Authorization', `bearer ${token}`)
      .send(prototype)
    expect(resp.status).toBe(201)

    await api
      .delete(`/api/prototypes/${resp.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const prototypesAtEnd = await helper.prototypesInDb()

    expect(prototypesAtEnd).toHaveLength(helper.initialPrototypes.length)

    const contents = prototypesAtEnd.map((r) => r.title)

    expect(contents).not.toContain(prototype.title)
  })

  test('should return an error if the user is not authenticated', async () => {
    const prototype = new Prototype({
      title: 'Test Prototype Post',
      user: userId,
    })
    await prototype.save()

    const response = await api.delete(`/api/prototypes/${prototype.id}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toContain('operation not permitted')
  })
})

test('unknown endpoint in api url', async () => {
  const response = await api.get('/api/prototypes-url-dont-exist')
  //   console.log(response.body)

  expect(response.body.error).toBe('unknown endpoint')
})

afterAll(async () => {
  await mongoose.connection.close()
})
