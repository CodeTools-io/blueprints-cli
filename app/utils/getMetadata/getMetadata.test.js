const getMetadata = require('./getMetadata')

describe('getMetadata', () => {
  test('can get variances of blueprint instance name', () => {
    const result = getMetadata({
      blueprint: 'Component',
      blueprintInstance: 'Button',
    })

    expect(result).toMatchSnapshot()
  })
})
