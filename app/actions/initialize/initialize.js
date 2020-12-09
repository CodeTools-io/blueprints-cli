const path = require('path')
const App = require('../../app')

const {
  CURRENT_DIRNAME,
  CURRENT_PATH,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = function initialize(blueprint, options) {
  const app = new App({
    globalPath: GLOBAL_BLUEPRINTS_PATH,
    projectPath: PROJECT_BLUEPRINTS_PATH,
  })
  const blueprintName = blueprint || CURRENT_DIRNAME
  const isGlobal = options.global || false
  const source = CURRENT_PATH
  const globalLocation = path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
  const projectLocation = path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)
  const location = isGlobal ? globalLocation : projectLocation

  app
    .initializeBlueprint(blueprintName, { source, location })
    .then((blueprint) => {
      console.log(`${blueprint.name} was created at: ${blueprint.location}`)
    })
    .catch((err) => {
      throw err
    })
}
