// .env file:
// NODE_ENV=development or NODE_ENV=test
// PORT=3003
// MONGODB_URI='mongodb://localhost/bloglist'
// TEST_MONGODB_URI='mongodb://localhost/bloglist-test'
// SECRET='secret'

require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
}
