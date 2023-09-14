const Book = require('../models/book')
const User = require('../models/user')

const initialBooks = [
  {
    title: 'Cinco ecuaciones que cambiaron el mundo',
  },
  {
    title: 'El tortuoso camino de la justicia transicional',
  },
]

const nonExistingId = async () => {
  const book = new Book({
    title: 'test title1',
  })
  await book.save()
  await book.deleteOne()

  return book._id.toString()
}

const booksInDb = async () => {
  const books = await Book.find({})
  return books.map((book) => book.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBooks,
  nonExistingId,
  booksInDb,
  usersInDb,
}
