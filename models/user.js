// Desc: User model for the database
// Usage: const User = require('../models/user')

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Define the schema for the user model
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  name: String,
  email: String,
  passwordHash: String,
  // Add new fields here
  prototypes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prototype', // This is the name of the model to reference
    },
  ],
})

// Use the unique validator plugin
userSchema.plugin(uniqueValidator)

// Dont return the version field when converting from JSON
// and change the _id field to id
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
