const Prototype = require('../models/prototype')
const User = require('../models/user')

const initialPrototypes = [
  {
    title: 'Cinco ecuaciones que cambiaron el mundo',
  },
  {
    title: 'El tortuoso camino de la justicia transicional',
  },
]

const nonExistingId = async () => {
  const prototype = new Prototype({
    title: 'test title1',
  })
  await prototype.save()
  await prototype.deleteOne()

  return prototype._id.toString()
}

const prototypesInDb = async () => {
  const prototypes = await Prototype.find({})
  return prototypes.map((prototype) => prototype.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialPrototypes,
  nonExistingId,
  prototypesInDb,
  usersInDb,
}
