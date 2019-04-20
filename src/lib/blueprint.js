const os = require('os')
const path = require('path')

const fs = require('fs-extra')

const rc = require('rc')
const { default: scaffold } = require('scaffold-helper')

class Blueprint {
  constructor({ name, location, source }) {
    this.name = name
    this.location = location
    this.source = source
    this.filesPath = path.resolve(location, './files')
    this.preGenerateScript = path.resolve(location, './preGenerate.js')
    this.postGenerateScript = path.resolve(location, './postGenerate.js')
  }

  remove() {
    if (!this.name) {
      throw new Error('No name specified')
    }
    if (!this.location) {
      throw new Error('No location specified')
    }
    if (!fs.statSync(this.location).isDirectory()) {
      throw new Error('Blueprint not found')
    }
    return fs
      .remove(this.location)
      .then(() => {
        return this
      })
      .catch(err => {
        throw err
      })
  }

  save(options) {
    if (!this.source) {
      throw new Error('No source specified')
    }
    if (!this.location) {
      throw new Error('No location specified')
    }
    return fs
      .ensureDir(this.location)
      .then(() => {
        scaffold(
          {
            source: this.source,
            destination: this.filesPath,
            onlyFiles: false
          },
          {}
        )

        return this
      })
      .catch(err => {
        throw err
      })
  }

  preGenerate(destination, data = {}) {
    return new Promise((resolve, reject) => {
      if (fs.pathExistsSync(this.preGenerateScript)) {
        const blueprintScript = require(this.preGenerateScript)

        blueprintScript(destination, data)
      }

      resolve()
    })
  }

  postGenerate(destination, data = {}) {
    return new Promise((resolve, reject) => {
      if (fs.pathExistsSync(this.postGenerateScript)) {
        const blueprintScript = require(this.postGenerateScript)

        blueprintScript(destination, data)
      }

      resolve()
    })
  }

  generate(destination, data = {}) {
    if (!destination) {
      throw new Error('no destination given for blueprint instance')
    }

    if (!fs.pathExistsSync(this.filesPath)) {
      throw new Error('blueprint does not exist')
    }

    return fs
      .ensureDir(destination)
      .then(() => {
        scaffold(
          { source: this.filesPath, destination, onlyFiles: false },
          data
        )
        // return BlueprintInstance
        return { type: this.name, location: destination, data }
      })
      .catch(err => {
        throw err
      })
  }
}

module.exports = Blueprint
