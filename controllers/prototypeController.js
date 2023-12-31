// Desc: Controller for prototypes
// Usage: const prototypesRouter = require('./controllers/prototypeController')

const router = require('express').Router()
const Prototype = require('../models/prototype')
const { userExtractor } = require('../utils/middleware')

// get all prototypes
router.get('/', async (request, response) => {
  // populate the user field with the username and name of the user?
  const prototypes = await Prototype.find({}).populate('user', {
    // username: 1,
    // name: 1,
  })

  response.json(prototypes)
})

// get a single prototype
router.get('/:id', async (request, response) => {
  const prototype = await Prototype.findById(request.params.id).populate(
    'user',
    {
      // username: 1,
      // name: 1,
    }
  )
  if (prototype) {
    response.json(prototype)
  } else {
    response.status(404).end()
  }
})

// post a new prototype to the database and add it to the user's list of prototypes
// Only logged in users can post prototypes
router.post('/', userExtractor, async (request, response) => {
  // Option more secure way to get the title (or other field) from the request body
  // const { title } = request.body
  // const prototype = new Prototype({
  //   title,
  //   // Add new fields to be updated here
  // })

  // Generalize the above code to handle all fields in the request body
  const prototype = new Prototype(request.body)

  const user = request.user
  // only logged in users can post prototypes
  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  // add the prototype to the user's list of prototypes
  prototype.user = user._id
  const createdPrototype = await prototype.save()
  user.prototypes = user.prototypes.concat(createdPrototype._id)
  await user.save()

  response.status(201).json(createdPrototype)
})

router.put('/:id', async (request, response) => {
  const body = request.body

  const prototype = await Prototype.findById(request.params.id)
  if (prototype) {
    for (const key in body) {
      prototype[key] = body[key]
    }

    const updatedPrototype = await Prototype.findByIdAndUpdate(
      request.params.id,
      prototype,
      {
        new: true,
      }
    )
    response.status(200).json(updatedPrototype)
  }
})

// delete a prototype
router.delete('/:id', userExtractor, async (request, response) => {
  const prototype = await Prototype.findById(request.params.id)

  const user = request.user

  // only the user who created the prototype can delete it
  if (!user || prototype.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  // remove the prototype from the user's list of prototypes
  user.prototypes = user.prototypes.filter(
    (b) => b.toString() !== prototype.id.toString()
  )

  await user.save()
  // await prototype.remove()
  await Prototype.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = router
