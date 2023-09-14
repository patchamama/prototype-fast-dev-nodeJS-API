// Desc: Controller for books
// Usage: const booksRouter = require('./controllers/bookController')

const router = require('express').Router()
const { Book } = require('../models/book')
const { userExtractor } = require('../utils/middleware')

// get all books
router.get('/', async (request, response) => {
  // populate the user field with the username and name of the user?
  // const books = await Book.find({})
  //   .populate('user', {
  //     // username: 1,
  //   })
  //   .populate('author', {
  //     // title: 1,
  //   })
  // const booksWithOtherBooks = books

  const books = await Book.find({}).populate('author')
  const booksWithOtherBooks = books.map((book) => {
    // console.log(book)
    const bookId = book.id
    const authorName = book.author
    const otherBooks = books
      .filter(
        (otherBook) =>
          otherBook.author === authorName && otherBook.id !== bookId
      )
      .map((otherBook) => `${otherBook.title} (${otherBook.id})`)
    return {
      ...book.toObject(),
      otherBooks,
    }
  })

  // let booksWithOtherBooks2 = { library: [] }
  // booksWithOtherBooks2.library = booksWithOtherBooks
  const convertedData = {
    library: booksWithOtherBooks.map((book) => ({ book })),
  }
  response.json(convertedData)
})

// get a single prototype
router.get('/:id', async (request, response) => {
  const book = await Book.findById(request.params.id)
  if (book) {
    response.json(book)
  } else {
    response.status(404).end()
  }
})

// post a new book to the database and add it to the user's list of books
// Only logged in users can post books
router.post('/', userExtractor, async (request, response) => {
  const { title, pages, genre, cover, synopsis, year, ISBN, author } =
    request.body

  const book = new Book({
    title,
    pages,
    genre,
    cover,
    synopsis,
    year,
    ISBN,
    author,
    // Add new fields to be updated here
  })

  const user = request.user
  // only logged in users can post books
  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  // add the book to the user's list of books
  book.user = user._id
  const createdBook = await book.save()
  user.books = user.books.concat(createdBook._id)
  await user.save()

  response.status(201).json(createdBook)
})

// update a book
router.put('/:id', async (request, response) => {
  const body = request.body

  const book = await Book.findById(request.params.id)
  if (book) {
    for (const key in body) {
      book[key] = body[key]
    }
    // console.log(blog)
    const updatedBook = await Book.findByIdAndUpdate(request.params.id, book, {
      new: true,
    })
    response.status(200).json(updatedBook)
  }
})

// delete a book
router.delete('/:id', userExtractor, async (request, response) => {
  const book = await Book.findById(request.params.id)

  const user = request.user

  // only the user who created the book can delete it
  if (!user || book.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  // remove the book from the user's list of books
  user.books = user.books.filter((b) => b.toString() !== book.id.toString())

  await user.save()
  // await book.remove()
  await Book.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = router
