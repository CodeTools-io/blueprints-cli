const path = require('path')

const { expect } = require('chai')
const fs = require('fs-extra')

const App = require('../../lib/app')
const DEST_DIR = path.resolve(__dirname, '../fixtures/tmp')

beforeEach(function() {
  return fs.ensureDir(DEST_DIR)
})
afterEach(function() {
  return fs.remove(DEST_DIR)
})
function setTestConfig(app) {
  app.loadConfig({
    globalBlueprintsPath: path.resolve(
      __dirname,
      '../fixtures/global-blueprints'
    ),
    projectBlueprintsPath: path.resolve(
      __dirname,
      '../fixtures/project-blueprints'
    )
  })
}

describe('App', function() {
  it('can load config', function() {
    const app = new App()
    expect(app.settings).to.be.an('object')
    expect(app.settings).to.have.property('globalBlueprintsPath')
    expect(app.settings).to.have.property('projectBlueprintsPath')
  })
  it('can generate global blueprints', function() {
    const BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-global')
    const app = new App()
    setTestConfig(app)

    app
      .generateFromBlueprint('global-blueprint', BLUEPRINT_DEST)
      .then(results => {
        return fs.pathExists(BLUEPRINT_DEST)
      })
      .then(exists => expect(exists).to.eql(true))
      .catch(err => console.log(err))
  })
  it('can generate from project blueprints', function() {
    const BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-local')
    const app = new App()
    setTestConfig(app)

    app
      .generateFromBlueprint('project-blueprint', BLUEPRINT_DEST)
      .then(results => {
        return fs.pathExists(BLUEPRINT_DEST)
      })
      .then(exists => expect(exists).to.eql(true))
      .catch(err => console.log(err))
  })
  it('can resolve project blueprint over global blueprint', function() {
    const BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-local')
    const app = new App()
    setTestConfig(app)

    app
      .generateFromBlueprint('blueprint', BLUEPRINT_DEST)
      .then(results => {
        return fs.readFile(path.resolve(BLUEPRINT_DEST, 'example.txt'), 'utf8')
      })
      .then(file => {
        expect(file).to.include('Hello')
      })
      .catch(err => console.log(err))
  })
  it('can replace blueprint template variables', function() {
    const BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-local')
    const app = new App()
    setTestConfig(app)

    app
      .generateFromBlueprint('blueprint', BLUEPRINT_DEST, { name: 'Cliff' })
      .then(results => {
        return fs.readFile(path.resolve(BLUEPRINT_DEST, 'example.txt'), 'utf8')
      })
      .then(file => {
        expect(file.trim()).to.eql('Hello, Cliff!')
      })
      .catch(err => console.log(err))
  })
  it.skip('can rename files and directories')
})
