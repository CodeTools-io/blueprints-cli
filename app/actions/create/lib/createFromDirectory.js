const path = require('path')
const fs = require('fs-extra')

const {
  CURRENT_PATH,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../../config')

module.exports = async function createFromDirectory(blueprintName, command) {
  const isGlobal = command.global || false
  const source = command.source.length
    ? path.resolve(command.source)
    : CURRENT_PATH
  const globalLocation = path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
  const projectLocation = path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)
  const location = isGlobal ? globalLocation : projectLocation
  try {
    if (fs.pathExistsSync(location)) {
      throw new Error(`A blueprint called ${blueprintName} already exists`)
    }
    await fs.outputJson(
      path.resolve(location, './blueprint.json'),
      {},
      { space: 2 }
    )
    await fs.copy(
      source,
      path.resolve(location, './files/__blueprintInstance__')
    )
    return {
      success: true,
      message: `${blueprintName} was created at: ${location}`,
    }
  } catch (error) {
    return error
  }
}
