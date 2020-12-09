const App = require('../../app')
const getMetadata = require('../../utils/get-metadata')
const getTemplateData = require('../../utils/get-template-data')

const {
  CURRENT_PATH,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = function generate(blueprint, blueprintInstance, options) {
  const app = new App({
    globalPath: GLOBAL_BLUEPRINTS_PATH,
    projectPath: PROJECT_BLUEPRINTS_PATH,
  })
  const destination = options.dest || CURRENT_PATH
  const data = getTemplateData(process.argv.slice(4))
  const metadata = getMetadata({ blueprint, blueprintInstance })
  app.generateBlueprintInstance(blueprint, destination, {
    ...data,
    ...metadata,
  })
}
