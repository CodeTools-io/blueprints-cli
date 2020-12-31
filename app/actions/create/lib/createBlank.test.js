jest.mock('../../../config')
const createBlank = require('./createBlank')
const fs = require('fs-extra')
const path = require('path')

describe('createBlank', () => {
  beforeEach(async () => {
    const blueprintPath = path.resolve(
      __dirname,
      '../../../../test/fixtures/project-example/.blueprints/MyBlankBlueprint'
    )
    await fs.remove(blueprintPath)
  })
  afterEach(async () => {
    const blueprintPath = path.resolve(
      __dirname,
      '../../../../test/fixtures/project-example/.blueprints/MyBlankBlueprint'
    )
    await fs.remove(blueprintPath)
  })
  test('can create blank blueprints', async () => {
    const result = await createBlank('MyBlankBlueprint')

    expect(result.name).toEqual('MyBlankBlueprint')
    expect(result.location).toContain(
      'test/fixtures/project-example/.blueprints/MyBlankBlueprint'
    )
  })
})
