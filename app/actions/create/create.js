const App = require('../../app')

const { PROJECT_ROOT_PATH, GLOBAL_BLUEPRINTS_PATH } = require('../../config')

module.exports = function create(blueprintName, options) {
  const app = new App({
    globalPath: GLOBAL_BLUEPRINTS_PATH,
    projectPath: PROJECT_ROOT_PATH,
  })
  app.createBlueprint(blueprintName, options)
}
