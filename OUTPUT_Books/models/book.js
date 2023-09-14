// Description: Book model
// Usage: const Book = require('../models/book')

const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  name: String,
})

// Define the schema for the book model
const schema = new mongoose.Schema({
  title: {
    // title of the book
    type: String,
    required: true,
    // minlength: 3,
    // unique: true,
  },
  pages: Number,
  genre: String,
  cover: String,
  synopsis: String,
  year: Number,
  ISBN: String,
  author: String,
  otherBooks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  // Add new fields here
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
})

// Use the unique validator plugin?
// schema.plugin(uniqueValidator)

// Dont return the version field when converting from JSON
schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Author = mongoose.model('Author', authorSchema)
const Book = mongoose.model('Book', schema)

module.exports = { Author, Book }
