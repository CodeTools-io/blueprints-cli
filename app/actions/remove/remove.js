const path = require('path')
const App = require('../../app')

const {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')
module.exports = function remove(blueprint, options) {
  const app = new App({
    globalPath: GLOBAL_BLUEPRINTS_PATH,
    projectPath: PROJECT_BLUEPRINTS_PATH,
  })
  const blueprintName = blueprint
  const isGlobal = options.global || false
  const globalLocation = path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
  const projectLocation = path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)
  const location = isGlobal ? globalLocation : projectLocation

  app
    .removeBlueprint(blueprintName, { location })
    .then((blueprint) => {
      console.log(`${blueprint.name} was removed from: ${blueprint.location}`)
    })
    .catch((err) => {
      throw err
    })
}
