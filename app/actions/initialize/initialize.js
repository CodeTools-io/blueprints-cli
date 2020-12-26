const path = require('path')
const fs = require('fs-extra')

module.exports = async function initialize(projectPath, command) {
  const projectBlueprintsPath = projectPath
    ? path.resolve(projectPath, './.blueprints')
    : path.resolve('./.blueprints')

  await fs.ensureDir(projectBlueprintsPath)

  console.log(
    `Project initialized. Blueprints can now be added to ${projectBlueprintsPath}`
  )
}
