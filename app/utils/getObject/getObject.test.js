const getObject = require('./getObject')

describe('getObject', () => {
  test('can parse standard keys', () => {
    const result = getObject([['title', 'working']])

    expect(result).toEqual({ title: 'working' })
  })

  test('can parse property keys', () => {
    const result = getObject([['info.name', 'Cliff']])

    expect(result).toEqual({ info: { name: 'Cliff' } })
  })

  test('can parse array indexes', () => {
    const result = getObject([
      ['colors[0]', 'blue'],
      ['colors[1]', 'red'],
    ])

    expect(result).toEqual({ colors: ['blue', 'red'] })
  })
})
