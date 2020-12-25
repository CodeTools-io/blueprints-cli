const getTemplateArgs = require('./getTemplateArgs')

describe('getTemplateArgs', () => {
  test('can get template args', () => {
    const result = getTemplateArgs([
      '--global',
      '--check="working"',
      'title="working"',
      'toggleSomething',
      'description=yep',
    ])

    expect(result).toEqual([
      'title="working"',
      'toggleSomething',
      'description=yep',
    ])
  })
})
