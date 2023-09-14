const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Book = require('../models/book')
const User = require('../models/user')

beforeEach(async () => {
  await Book.deleteMany({})

  const bookObjects = helper.initialBooks.map(
    (book) => new Book(book)
  )
  const promiseArray = bookObjects.map((book) => book.save())
  await Promise.all(promiseArray)

  // for (let book of helper.initialBooks) {
  //   let bookObject = new Book(book)
  //   await bookObject.save()
  // }
})

describe('when there is initially some books saved', () => {
  test('book are returned as json', async () => {
    await api
      .get('/api/books')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all book are returned', async () => {
    const response = await api.get('/api/books')
    //   console.log(response.body)
    expect(response.body).toHaveLength(helper.initialBooks.length)
  })

  test('a specific book is within the returned books', async () => {
    const response = await api.get('/api/books')
    //   console.log(response.body[0])

    const contents = response.body.map((r) => r.title)
    //   console.log(contents)
    expect(contents).toContain('El tortuoso camino de la justicia transicional')
  })
})

describe('viewing a specific book', () => {
  let token // Token of authenticated user
  // let userId // ID of authenticated user

  beforeEach(async () => {
    await Book.deleteMany({})

    const bookObjects = helper.initialBooks.map(
      (book) => new Book(book)
    )
    const promiseArray = bookObjects.map((book) => book.save())
    await Promise.all(promiseArray)

    // for (let book of helper.initialBooks) {
    //   let bookObject = new Book(book)
    //   await bookObject.save()
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

  test('a valid book can be added', async () => {
    const newBook = {
      title: 'Fugas o la ansiedad de sentirse vivo',
    }

    await api
      .post('/api/books')
      .set('Authorization', `bearer ${token}`)
      .send(newBook)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/books')
    // const contents = response.body.map((r) => r.title)

    const booksAtEnd = await helper.booksInDb()
    expect(response.body).toHaveLength(helper.initialBooks.length + 1)

    const contents = booksAtEnd.map((n) => n.title)
    expect(contents).toContain('Fugas o la ansiedad de sentirse vivo')
  })

  test('fails with statuscode 404 if book does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/books/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 404 if is not found', async () => {
    const invalidId = '5a3d5da59220081a82a3445'

    await api.get(`/api/books/${invalidId}`).expect(404)
  })

  test('unique identifier property of the book posts is named id,', async () => {
    const response = await api.get('/api/books')
    const contents = response.body[0]
    //   console.log(contents)
    expect(contents.id).toBeDefined()
  })

  test('if the title is missing from the request data, the backend responds 400 Bad Request', async () => {
    // title is missing
    const response = await api
      .post('/api/books')
      .set('Authorization', `bearer ${token}`)
      .send({})
    expect(response.status).toBe(400)

    const booksAtEnd = await helper.booksInDb()
    expect(booksAtEnd).toHaveLength(helper.initialBooks.length)
    //   expect(response.body).toHaveLength(initialBooks.length)
  })

  test('succeeds with status code 200 if title is updated', async () => {
    const booksAtStart = await helper.booksInDb()
    let bookToUpdate = booksAtStart[0]
    bookToUpdate.title = 'test title'
    // add new fields to be checked here

    await api
      .put(`/api/books/${bookToUpdate.id}`)
      .send(bookToUpdate)
      .expect(200)

    const booksAtEnd = await helper.booksInDb()

    expect(booksAtEnd).toHaveLength(helper.initialBooks.length)

    // use map to get the titles of the books
    const contents = booksAtEnd.map((r) => r.title)
    expect(contents).toContain(bookToUpdate.title)
  })

  test('should return an error if the user is not authenticated when add a book', async () => {
    const newBook = {
      title: 'Test Book Post',
    }

    const response = await api.post('/api/books').send(newBook)

    expect(response.status).toBe(401)
    expect(response.body.error).toContain('operation not permitted')
  })

  test('should create a new book post for an authenticated user', async () => {
    const newBook = {
      title: 'Test Book Post',
    }

    const response = await api
      .post('/api/books')
      .set('Authorization', `bearer ${token}`)
      .send(newBook)

    expect(response.status).toBe(201)
    expect(response.body.title).toEqual('Test Book Post')
    const books = await Book.find({})
    expect(books).toHaveLength(3)
    // expect(books[2].title).toEqual('Test Book Post')
  })
})

describe('deletion of a book', () => {
  let token // Token of authenticated user
  let userId // ID of authenticated user

  beforeEach(async () => {
    await Book.deleteMany({})

    const bookObjects = helper.initialBooks.map(
      (book) => new Book(book)
    )
    const promiseArray = bookObjects.map((book) => book.save())
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

  test('delete a book with not auth user: status code 400', async () => {
    const booksAtStart = await helper.booksInDb()
    const bookToDelete = booksAtStart[0]

    await api.delete(`/api/books/${bookToDelete.id}`).expect(401)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const book = {
      title: 'Test Book Post',
      user: userId,
    }
    // let bookObject = new Book(book)
    // await bookObject.save()

    const resp = await api
      .post('/api/books')
      .set('Authorization', `bearer ${token}`)
      .send(book)
    expect(resp.status).toBe(201)

    await api
      .delete(`/api/books/${resp.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const booksAtEnd = await helper.booksInDb()

    expect(booksAtEnd).toHaveLength(helper.initialBooks.length)

    const contents = booksAtEnd.map((r) => r.title)

    expect(contents).not.toContain(book.title)
  })

  test('should return an error if the user is not authenticated', async () => {
    const book = new Book({
      title: 'Test Book Post',
      user: userId,
    })
    await book.save()

    const response = await api.delete(`/api/books/${book.id}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toContain('operation not permitted')
  })
})

test('unknown endpoint in api url', async () => {
  const response = await api.get('/api/books-url-dont-exist')
  //   console.log(response.body)

  expect(response.body.error).toBe('unknown endpoint')
})

afterAll(async () => {
  await mongoose.connection.close()
})
