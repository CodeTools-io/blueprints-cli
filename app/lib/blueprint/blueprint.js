const path = require('path')
const child_process = require('child_process')
const fs = require('fs-extra')
const { default: scaffold } = require('scaffold-helper')
const _ = require('lodash')
const date = require('date-fns')
const { merge } = _
const log = require('../../utils/log')
const File = require('../../lib/File')

class Blueprint {
  constructor({ name, location, source }) {
    this.name = name
    this.location = location
    this.source = source
    this.filesPath = path.resolve(location, './files')

    this.config = {
      preGenerate: [],
      postGenerate: [],
      data: {},
    }

    this.loadConfigFile(location)
  }

  loadConfigFile(location) {
    const configPath = path.resolve(location, './blueprint.json')

    if (fs.pathExistsSync(configPath)) {
      const configFile = require(configPath)
      this.config = merge({}, this.config, configFile)
    }
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
      .catch((err) => {
        throw err
      })
  }

  create(options) {
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
            onlyFiles: false,
          },
          {}
        )

        return this
      })
      .catch((err) => {
        throw err
      })
  }

  preGenerate({ destination, data = {} }) {
    const mergedData = merge({}, this.config.data, data)

    this.config.preGenerate.forEach((configCommand) => {
      let command = configCommand
      command = command.replace('<blueprintName>', mergedData.blueprint)
      command = command.replace('<blueprintPath>', this.location)
      command = command.replace('<instanceName>', mergedData.blueprintInstance)
      command = command.replace(
        '<instancePath>',
        path.resolve(destination, mergedData.blueprintInstance)
      )

      log.success(`executed preGenerate hook`)

      const preGenerate = require(path.resolve(this.location, command))

      preGenerate(mergedData, { _, fs, date, File })
    })
  }

  postGenerate({ destination, data = {} }) {
    const mergedData = merge({}, this.config.data, data)

    this.config.postGenerate.forEach((configCommand) => {
      let command = configCommand
      command = command.replace('<blueprintName>', mergedData.blueprint)
      command = command.replace('<blueprintPath>', this.location)
      command = command.replace('<instanceName>', mergedData.blueprintInstance)
      command = command.replace(
        '<instancePath>',
        path.resolve(destination, mergedData.blueprintInstance)
      )

      log.success(`executed postGenerate hook`)

      const postGenerate = require(path.resolve(this.location, command))

      postGenerate(mergedData, { _, fs, date, File })
    })
  }

  generate({ destination, data = {} }) {
    if (!destination) {
      throw new Error('no destination given for blueprint instance')
    }

    if (!fs.pathExistsSync(this.filesPath)) {
      throw new Error('blueprint does not exist')
    }
    const mergedData = merge({}, this.config.data, data)

    return fs
      .ensureDir(destination)
      .then(() => {
        scaffold(
          { source: this.filesPath, destination, onlyFiles: false },
          mergedData
        )

        log.success(`created instance`)

        return { type: this.name, location: destination, data }
      })
      .catch((err) => {
        throw err
      })
  }
}

module.exports = Blueprint
