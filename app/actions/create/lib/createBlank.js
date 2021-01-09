const path = require('path')
const fs = require('fs-extra')
const { PROJECT_ROOT_PATH, GLOBAL_BLUEPRINTS_PATH } = require('../../../config')

module.exports = async function createBlank(blueprintName, options = {}) {
  let blueprintPath

  try {
    if (!blueprintName) {
      throw new Error('requires a name')
    }

    blueprintPath = options.global
      ? path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
      : path.resolve(PROJECT_ROOT_PATH, `./.blueprints/${blueprintName}`)

    if (fs.pathExistsSync(blueprintPath)) {
      throw new Error(`A blueprint named ${blueprintName} already exists`)
    }

    await fs.ensureDir(
      path.resolve(blueprintPath, './files/__blueprintInstance__')
    )
    await fs.outputJson(
      path.resolve(blueprintPath, './blueprint.json'),
      {},
      { space: 2 }
    )

    return {
      success: true,
      message: `${blueprintName} was created at ${blueprintPath}`,
    }
  } catch (error) {
    return error
  }
}
