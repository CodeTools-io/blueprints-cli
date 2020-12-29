jest.mock('../../config')
const list = require('./list')

describe('list', () => {
  test('can show global blueprints', async () => {
    const result = await list()

    expect(result).toContain('--- Global Blueprints ---\nexample -')
    expect(result).toContain('example-2 -')
    expect(result).toContain('--- Project Blueprints ---\nexample - ')
  })
})
