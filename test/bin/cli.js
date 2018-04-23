const os = require('os')
const path = require('path')
const { exec } = require('child_process')

const { expect } = require('chai')
const fs = require('fs-extra')

const {
  setConfig,
  DEST_DIR,
  GLOBAL_BLUEPRINT_DEST,
  PROJECT_BLUEPRINT_DEST
} = require('../helpers')

beforeEach(function() {
  return fs.ensureDir(DEST_DIR)
})

afterEach(function() {
  return fs.remove(DEST_DIR)
})

describe('CLI', function() {
  it('can generate files', function(done) {
    exec('bp generate example', function() {
      const examplePath = path.resolve(DEST_DIR, 'file.txt')
      expect(fs.readFileSync(examplePath, 'utf8').trim()).to.contain('Hello')
      done()
    })
  })
  it('can generate files with data', function(done) {
    exec('bp generate example name="Jane"', function() {
      const examplePath = path.resolve(DEST_DIR, 'file.txt')
      const exampleContent = fs.readFileSync(examplePath, 'utf8').trim()
      expect(exampleContent).to.equal('Hello, Jane!')
      done()
    })
  })
  it('can generate files to destination', function(done) {
    exec('bp generate example name="Jane" --dest="./other"', function() {
      const examplePath = path.resolve(
        process.cwd(),
        './other/test/fixtures/tmp/file.txt'
      )
      const fileExists = fs.pathExistsSync(examplePath)
      expect(fileExists).to.eql(true)
      done()
      fs.remove(path.resolve(process.cwd(), './other'))
    })
  })
})
