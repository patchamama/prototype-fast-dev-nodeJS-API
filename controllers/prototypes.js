const router = require('express').Router()
const Prototype = require('../models/prototype')

const { userExtractor } = require('../utils/middleware')

router.get('/', async (request, response) => {
  const prototypes = await Prototype.find({}).populate('user', {
    username: 1,
    name: 1,
  })

  response.json(prototypes)
})

router.post('/', userExtractor, async (request, response) => {
  const { title } = request.body
  const prototype = new Prototype({
    title,
  })

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  prototype.user = user._id

  const createdPrototype = await prototype.save()

  user.prototypes = user.prototypes.concat(createdPrototype._id)
  await user.save()

  response.status(201).json(createdPrototype)
})

router.put('/:id', async (request, response) => {
  const { title } = request.body

  const updatedPrototype = await Prototype.findByIdAndUpdate(
    request.params.id,
    { title },
    { new: true }
  )

  response.json(updatedPrototype)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const prototype = await Prototype.findById(request.params.id)

  const user = request.user

  if (!user || prototype.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  user.prototypes = user.prototypes.filter(
    (b) => b.toString() !== prototype.id.toString()
  )

  await user.save()
  await prototype.remove()

  response.status(204).end()
})

module.exports = router
