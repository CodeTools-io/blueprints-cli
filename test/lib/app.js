const os = require('os')
const path = require('path')

const { expect } = require('chai')

const App = require('../../lib/App')

const GLOBAL_BLUEPRINTS_DIR = path.resolve(
  __dirname,
  '../fixtures/global-blueprints'
)
const PROJECT_BLUEPRINTS_DIR = path.resolve(
  __dirname,
  '../fixtures/project-blueprints'
)

describe('App', function() {
  it('can retrieve blueprints', function() {
    const app = new App({
      globalPath: GLOBAL_BLUEPRINTS_DIR,
      projectPath: PROJECT_BLUEPRINTS_DIR
    })

    return app.getAllBlueprints().then(blueprints => {
      expect(blueprints.global.length).to.eql(2)
      expect(blueprints.project.length).to.eql(1)
    })
  })
})
