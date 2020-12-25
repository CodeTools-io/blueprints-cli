const pipe = require('./pipe')

describe('pipe', () => {
  test('can pipe data through functions', () => {
    const data = ['red', 'white', 'blue']
    const capitalize = (args) => args.map((arg) => arg.toUpperCase())
    const appendUnderscore = (args) => args.map((arg) => `${arg}_`)
    const prependUnderscore = (args) => args.map((arg) => `_${arg}`)
    const result = pipe(data, capitalize, appendUnderscore, prependUnderscore)

    expect(result).toEqual(['_RED_', '_WHITE_', '_BLUE_'])
  })
})
