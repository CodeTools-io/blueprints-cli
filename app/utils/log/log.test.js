const log = require('./log')

describe('log', () => {
  test('can log standard output', () => {
    log.clear()
    log('first')
    log('second')
    log('third')
    const result = log.output()

    expect(result).toMatchSnapshot()
  })

  test('can log warning output', () => {
    log.clear()
    log.warning('first warning')
    log.warning('second warning')
    log.warning('third warning')
    const result = log.output()

    expect(result).toMatchSnapshot()
  })

  test('can log error output', () => {
    expect(() => {
      log.error('first error')
    }).toThrow('first error')
  })
})
