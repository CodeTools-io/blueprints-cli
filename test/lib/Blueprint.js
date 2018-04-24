const os = require('os')
const path = require('path')

const { expect } = require('chai')
const fs = require('fs-extra')
const Blueprint = require('../../lib/Blueprint')

const FIXTURE_DIR = path.resolve(__dirname, '../fixtures')
const GLOBAL_BLUEPRINTS_PATH = path.resolve(FIXTURE_DIR, './global-blueprints')
const PROJECT_BLUEPRINTS_PATH = path.resolve(
  FIXTURE_DIR,
  './project-blueprints'
)

const DEST_DIR = path.resolve(__dirname, '../fixtures/tmp')
const GLOBAL_BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-global')
const PROJECT_BLUEPRINT_DEST = path.resolve(DEST_DIR, './generated-from-local')

beforeEach(function() {
  return fs.ensureDir(DEST_DIR)
})
afterEach(function() {
  return fs.remove(DEST_DIR)
})

describe('Blueprint', function() {
  it('can generate global blueprints', function() {
    const blueprint = new Blueprint(
      'global-blueprint',
      {},
      {
        globalPath: GLOBAL_BLUEPRINTS_PATH,
        projectPath: PROJECT_BLUEPRINTS_PATH,
        destination: GLOBAL_BLUEPRINT_DEST
      }
    )
    return blueprint
      .generate()
      .then(results => {
        return fs.pathExists(GLOBAL_BLUEPRINT_DEST)
      })
      .then(exists => expect(exists).to.eql(true))
  })

  it('can generate from project blueprints', function() {
    const blueprint = new Blueprint(
      'project-blueprint',
      {},
      {
        globalPath: GLOBAL_BLUEPRINTS_PATH,
        projectPath: PROJECT_BLUEPRINTS_PATH,
        destination: PROJECT_BLUEPRINT_DEST
      }
    )
    return blueprint
      .generate()
      .then(results => {
        return fs.pathExists(PROJECT_BLUEPRINT_DEST)
      })
      .then(exists => expect(exists).to.eql(true))
  })

  it('can resolve project blueprint over global blueprint', function() {
    const blueprint = new Blueprint(
      'blueprint',
      {},
      {
        globalPath: GLOBAL_BLUEPRINTS_PATH,
        projectPath: PROJECT_BLUEPRINTS_PATH,
        destination: PROJECT_BLUEPRINT_DEST
      }
    )
    blueprint
      .generate()
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
    const blueprint = new Blueprint(
      'blueprint',
      { name: 'Cliff' },
      {
        globalPath: GLOBAL_BLUEPRINTS_PATH,
        projectPath: PROJECT_BLUEPRINTS_PATH,
        destination: PROJECT_BLUEPRINT_DEST
      }
    )
    blueprint
      .generate()
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

  it('can rename files and directories', function() {
    const blueprint = new Blueprint(
      'blueprint',
      { name: 'Cliff' },
      {
        globalPath: GLOBAL_BLUEPRINTS_PATH,
        projectPath: PROJECT_BLUEPRINTS_PATH,
        destination: PROJECT_BLUEPRINT_DEST
      }
    )
    blueprint
      .generate()
      .then(results => {
        return Promise.all([
          fs.readFile(
            path.resolve(PROJECT_BLUEPRINT_DEST, 'example.txt'),
            'utf8'
          ),
          fs.readFile(
            path.resolve(PROJECT_BLUEPRINT_DEST, './users/Cliff.txt'),
            'utf8'
          )
        ])
      })
      .then(file => {
        expect(file[0].trim()).to.eql('Hello, Cliff!')
        expect(file[1].trim()).to.eql('Hi, Cliff!')
      })
      .catch(err => console.log(err))
  })
})
