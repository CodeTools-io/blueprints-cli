const os = require('os')
const path = require('path')

const { expect } = require('chai')
const fs = require('fs-extra')
const Blueprint = require('../../../src/lib/blueprint')

const FIXTURE_DIR = path.resolve(__dirname, '../../fixtures')
const BLUEPRINTS_DIR = path.resolve(FIXTURE_DIR, './blueprints')
const EXAMPLE_SOURCE_DIR = path.resolve(FIXTURE_DIR, './source-folder')

const TEMP_DIR = path.resolve(__dirname, '../../fixtures/tmp')

beforeEach(function() {
  return fs.ensureDir(TEMP_DIR)
})
afterEach(function() {
  return Promise.all([fs.remove(TEMP_DIR)])
})

describe('Blueprint', function() {
  it('can generate blueprint instances', function() {
    const blueprint = new Blueprint({
      name: 'example',
      location: path.resolve(BLUEPRINTS_DIR, './example')
    })
    return blueprint
      .generate({
        destination: path.resolve(TEMP_DIR, './example-instance'),
        data: { name: 'Cliff' }
      })
      .then(blueprintInstance => {
        const instancePath = path.resolve(TEMP_DIR, './example-instance')
        const textfilePath = path.resolve(instancePath, './users/Cliff.txt')
        const postGenerateFilePath = path.resolve(
          instancePath,
          './users/Cliff.txt'
        )
        expect(blueprintInstance).to.include({
          type: 'example',
          location: instancePath
        })
        expect(fs.pathExistsSync(instancePath)).to.eql(true)
        expect(fs.pathExistsSync(postGenerateFilePath)).to.eql(true)
        expect(fs.readFileSync(textfilePath, 'utf8')).to.contain(
          'Hello, Cliff!'
        )
      })
  })

  it('can create new blueprints', function() {
    const blueprint = new Blueprint({
      name: 'modal',
      location: path.resolve(TEMP_DIR, './modal'),
      source: EXAMPLE_SOURCE_DIR
    })
    return blueprint.save().then(newBlueprint => {
      expect(newBlueprint).to.contain({
        name: 'modal',
        location: path.resolve(TEMP_DIR, './modal')
      })
    })
  })

  it('can remove blueprints', function() {
    const blueprint = new Blueprint({
      name: 'modal',
      location: path.resolve(TEMP_DIR, './modal'),
      source: EXAMPLE_SOURCE_DIR
    })
    return blueprint.save().then(newBlueprint => {
      return newBlueprint.remove().then(oldBlueprint => {
        expect(fs.pathExistsSync(oldBlueprint)).to.eql(false)
      })
    })
  })
})
