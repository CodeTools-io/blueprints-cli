const path = require('path')

const fs = require('fs-extra')

const { PROJECT_ROOT_PATH, GLOBAL_BLUEPRINTS_PATH } = require('../../../config')

module.exports = function createBlank(blueprintName, options) {
  if (!blueprintName) {
    throw new Error('requires a name')
  }

  const blueprintPath = options.global
    ? path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
    : path.resolve(PROJECT_ROOT_PATH, `./.blueprints/${blueprintName}`)

  if (fs.pathExistsSync(blueprintPath)) {
    throw new Error(`A blueprint called ${blueprintName} already exists`)
  }

  return Promise.all([
    fs.ensureDir(path.resolve(blueprintPath, './files/__blueprintInstance__')),
    fs.outputJson(
      path.resolve(blueprintPath, './blueprint.json'),
      {},
      { space: 2 }
    ),
  ])
    .then(() => {
      console.log(`${blueprintName} was created at ${blueprintPath}`)
    })
    .catch((err) => {
      console.error(err)
      fs.remove(path.resolve(blueprintPath)).catch((rmError) => {
        console.error(rmError)
      })
    })
}
