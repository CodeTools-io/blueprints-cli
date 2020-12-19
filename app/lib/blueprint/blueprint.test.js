const path = require('path')
const Blueprint = require('./blueprint')

describe('blueprint', () => {
  test('can create new instances', () => {
    const params = {
      name: 'example2',
      source: path.resolve(__dirname, './__mocks__/example/source'),
      location: path.resolve(__dirname, './__mocks__/example'),
    }
    const result = new Blueprint(params)

    expect(result.name).toEqual(params.name)
    expect(result.source).toEqual(params.source)
    expect(result.location).toEqual(params.location)
    expect(result.filesPath).toEqual(path.resolve(params.location, 'files'))
    expect(result.configPath).toEqual(
      path.resolve(params.location, 'blueprint.json')
    )
    expect(result).toHaveProperty('config')
  })

  test('can merge config into new instances', () => {
    const params = {
      name: 'example2',
      source: path.resolve(__dirname, './__mocks__/example_with_config/source'),
      location: path.resolve(__dirname, './__mocks__/example_with_config'),
    }
    const result = new Blueprint(params)

    expect(result.config).toEqual({
      data: { working: true },
      description: 'Example of a blueprint with config for testing',
      name: 'example_with_config',
      postGenerate: [],
      preGenerate: [],
    })
  })
})
