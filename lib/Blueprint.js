const os = require('os')
const path = require('path')

const fs = require('fs-extra')

const rc = require('rc')
const scaffold = require('scaffold-helper')

class Blueprint {
  constructor({ name, location, source }) {
    this.name = name
    this.location = location
    this.source = source
    this.filesPath = path.resolve(location, './files')
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
