const path = require('path')
const fs = require('fs-extra')

const {
  CURRENT_DIRNAME,
  CURRENT_PATH,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = async function initialize(projectPath, command) {
  const projectBlueprintsPath = projectPath
    ? path.resolve(projectPath, './.blueprints')
    : path.resolve('./.blueprints')

  await fs.ensureDir(projectBlueprintsPath)

  console.log(
    `Project initialized. Blueprints can now be added to ${projectBlueprintsPath}`
  )
}
