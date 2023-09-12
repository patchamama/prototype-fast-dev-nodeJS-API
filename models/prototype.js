// Description: Prototype model
// Usage: const Prototype = require('../models/prototype')

const mongoose = require('mongoose')

// Define the schema for the prototype model
const schema = new mongoose.Schema({
  title: {
    // title of the prototype
    type: String,
    required: true,
    // minlength: 3,
    // unique: true,
  },
  // Add new fields here
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.model('Prototype', schema)
