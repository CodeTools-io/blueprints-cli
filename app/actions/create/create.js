const App = require('../../app')

const {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = function create(blueprint, options) {
  const app = new App({
    globalPath: GLOBAL_BLUEPRINTS_PATH,
    projectPath: PROJECT_BLUEPRINTS_PATH,
  })
  app.createBlueprint(blueprint, options)
}
