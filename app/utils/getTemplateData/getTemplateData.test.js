const getTemplateData = require('./getTemplateData')

describe('getTemplateData', () => {
  test('can get data', () => {
    const result = getTemplateData(['title=working'])

    expect(result).toEqual({ title: 'working' })
  })
})
