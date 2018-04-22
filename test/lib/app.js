const os = require('os')
const path = require('path')

const { expect } = require('chai')
const fs = require('fs-extra')
const App = require('../../lib/app')

const {
  setConfig,
  DEST_DIR,
  GLOBAL_BLUEPRINT_DEST,
  PROJECT_BLUEPRINT_DEST
} = require('../helpers')

let app = null

beforeEach(function() {
  app = new App()
  setConfig(app)
  return fs.ensureDir(DEST_DIR)
})
afterEach(function() {
  app = null
  return fs.remove(DEST_DIR)
})

describe('App', function() {
  it('can load config', function() {
    const app = new App()
    const HOME_BLUEPRINT_CONFIG = path.resolve(os.homedir(), './.blueprints')
    expect(app.settings).to.be.an('object')
    expect(app.settings).to.have.property('globalBlueprintsPath')
    expect(app.settings.globalBlueprintsPath).to.eql(HOME_BLUEPRINT_CONFIG)
    expect(app.settings).to.have.property('projectBlueprintsPath')
  })

  it('can generate global blueprints', function() {
    app
      .generateFromBlueprint('global-blueprint', GLOBAL_BLUEPRINT_DEST)
      .then(results => {
        return fs.pathExists(GLOBAL_BLUEPRINT_DEST)
      })
      .then(exists => expect(exists).to.eql(true))
      .catch(err => console.log(err))
  })

  it('can generate from project blueprints', function() {
    app
      .generateFromBlueprint('project-blueprint', PROJECT_BLUEPRINT_DEST)
      .then(results => {
        return fs.pathExists(PROJECT_BLUEPRINT_DEST)
      })
      .then(exists => expect(exists).to.eql(true))
      .catch(err => console.log(err))
  })

  it('can resolve project blueprint over global blueprint', function() {
    app
      .generateFromBlueprint('blueprint', PROJECT_BLUEPRINT_DEST)
      .then(results => {
        return fs.readFile(
          path.resolve(PROJECT_BLUEPRINT_DEST, 'example.txt'),
          'utf8'
        )
      })
      .then(file => {
        expect(file).to.include('Hello')
      })
      .catch(err => console.log(err))
  })

  it('can replace blueprint template variables', function() {
    app
      .generateFromBlueprint('blueprint', PROJECT_BLUEPRINT_DEST, {
        name: 'Cliff'
      })
      .then(results => {
        return fs.readFile(
          path.resolve(PROJECT_BLUEPRINT_DEST, 'example.txt'),
          'utf8'
        )
      })
      .then(file => {
        expect(file.trim()).to.eql('Hello, Cliff!')
      })
      .catch(err => console.log(err))
  })

  it.skip('can rename files and directories')
})
