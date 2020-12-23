const path = require('path')
const fs = require('fs-extra')

const Blueprint = require('../../lib/Blueprint')

const {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = async function _import(
  globalBlueprintName,
  localBlueprintName,
  options
) {
  try {
    const blueprintName = localBlueprintName || globalBlueprintName
    const source = path.resolve(GLOBAL_BLUEPRINTS_PATH, globalBlueprintName)
    const location = path.resolve(PROJECT_BLUEPRINTS_PATH, `${blueprintName}`)

    if (!fs.pathExistsSync(source)) {
      console.error(`Global blueprint "${globalBlueprintName}" does not exist`)
      return
    }

    const blueprint = new Blueprint({
      name: blueprintName,
      source,
      location,
    })

    await blueprint.save()

    console.log(`${globalBlueprintName} was imported to ${location}`)
  } catch (err) {
    console.error(err)
  }
}
