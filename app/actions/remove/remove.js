const path = require('path')
const Blueprint = require('../../lib/Blueprint')

const {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = async function remove(blueprintName, options) {
  try {
    const isGlobal = options.global || false
    const globalLocation = path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
    const projectLocation = path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)
    const location = isGlobal ? globalLocation : projectLocation

    const blueprint = new Blueprint({
      name: blueprintName,
      location: location,
    })

    await blueprint.remove()

    console.log(`${blueprintName} was removed from: ${location}`)
  } catch (err) {
    console.error(err)
  }
}
