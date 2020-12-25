const getParsedKeyValues = require('./getParsedKeyValues')

describe('getParsedKeyValues', () => {
  test('can parse key values', () => {
    const result = getParsedKeyValues(['something=working'])

    expect(result).toEqual([['something', 'working']])
  })
})
