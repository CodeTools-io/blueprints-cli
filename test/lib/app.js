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
      globalBlueprintsPath: GLOBAL_BLUEPRINTS_DIR,
      projectBlueprintsPath: PROJECT_BLUEPRINTS_DIR
    })

    return app.getBlueprints().then(blueprints => {
      expect(blueprints.globals).to.have.deep.members([
        {
          name: 'blueprint',
          path: path.resolve(GLOBAL_BLUEPRINTS_DIR, 'blueprint')
        },
        {
          name: 'global-blueprint',
          path: path.resolve(GLOBAL_BLUEPRINTS_DIR, 'global-blueprint')
        }
      ])
      expect(blueprints.projects).to.have.deep.members([
        {
          name: 'blueprint',
          path: path.resolve(PROJECT_BLUEPRINTS_DIR, 'blueprint')
        },
        {
          name: 'project-blueprint',
          path: path.resolve(PROJECT_BLUEPRINTS_DIR, 'project-blueprint')
        }
      ])
    })
  })
})
