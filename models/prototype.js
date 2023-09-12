const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // Add new fields here
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Prototype', schema)
