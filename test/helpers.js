const path = require('path')

const DEST_DIR = path.resolve(__dirname, './fixtures/tmp')
const GLOBAL_BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-global')
const PROJECT_BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-local')

module.exports = {
  DEST_DIR,
  GLOBAL_BLUEPRINT_DEST,
  PROJECT_BLUEPRINT_DEST,
  setConfig: function(app) {
    app.loadConfig({
      globalBlueprintsPath: path.resolve(
        __dirname,
        './fixtures/global-blueprints'
      ),
      projectBlueprintsPath: path.resolve(
        __dirname,
        './fixtures/project-blueprints'
      )
    })
  }
}
