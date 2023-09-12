const listHelper = require('../utils/list_helper')

const bigprototypelist = [
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    __v: 0,
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    __v: 0,
  },
]

test('dummy returns one', () => {
  const prototypes = []

  const result = listHelper.dummy(prototypes)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const prototypes = []
    const result = listHelper.totalLikes(prototypes)
    expect(result).toBe(0)
  })

  test('when list has only one prototype equals the likes of that', () => {
    const prototypes = [
      {
        _id: '23234323242dssfsf',
        title: 'Test 2nd prototype title',
      },
    ]
    const result = listHelper.totalLikes(prototypes)
    expect(result).toBe(6)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(bigprototypelist)
    expect(result).toBe(36)
  })
})

describe('favorites', () => {
  test('Most favorite with empty list', () => {
    const prototypes = [{}]
    const result = listHelper.favoritePrototype(prototypes)
    expect(result).toEqual({})
  })

  test('--- with one value', () => {
    const prototypes = [
      {
        _id: '23234323242dssfsf',
        title: 'Test 2nd prototype title',
      },
    ]
    const result = listHelper.favoritePrototype(prototypes)
    expect(result.likes).toBe(6)
    expect(result).toEqual(prototypes[0])
  })

  test('--- with a big list', () => {
    const result = listHelper.favoritePrototype(bigprototypelist)
    expect(result).toEqual(bigprototypelist[0])
    expect(result.likes).toEqual(12)
  })
})
