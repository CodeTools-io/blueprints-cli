const path = require('path')
const child_process = require('child_process')
const fs = require('fs-extra')
const { default: scaffold } = require('scaffold-helper')
const _ = require('lodash')
const { merge } = _

class Blueprint {
  constructor ({ name, location, source }) {
    this.name = name
    this.location = location
    this.source = source
    this.filesPath = path.resolve(location, './files')
    this.configPath = path.resolve(location, './blueprint.json')
    this.config = {
      preGenerate: [],
      postGenerate: [],
      data: {}
    }

    if (fs.pathExistsSync(this.configPath)) {
      const configFile = require(this.configPath)
      this.config = merge({}, this.config, configFile)
    }
  }

  remove () {
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

  save (options) {
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

  preGenerate ({ destination, data = {} }) {
    const mergedData = merge({}, this.config.data, data)

    this.config.preGenerate.forEach(configCommand => {
      let command = configCommand
      command = command.replace('<blueprintName>', mergedData.blueprint)
      command = command.replace('<blueprintPath>', this.location)
      command = command.replace('<instanceName>', mergedData.blueprintInstance)
      command = command.replace(
        '<instancePath>',
        path.resolve(destination, mergedData.blueprintInstance)
      )
      console.log(`░░░░░░ ${command} ░░░░░░`)
      const preGenerate = require(command)

      preGenerate(mergedData, { _, fs })
    })
  }

  postGenerate ({ destination, data = {} }) {
    const mergedData = merge({}, this.config.data, data)

    this.config.postGenerate.forEach(configCommand => {
      let command = configCommand
      command = command.replace('<blueprintName>', mergedData.blueprint)
      command = command.replace('<blueprintPath>', this.location)
      command = command.replace('<instanceName>', mergedData.blueprintInstance)
      command = command.replace(
        '<instancePath>',
        path.resolve(destination, mergedData.blueprintInstance)
      )

      console.log(`░░░░░░ ${command} ░░░░░░`)
      const postGenerate = require(command)

      postGenerate(mergedData, { _, fs })
    })
  }

  generate ({ destination, data = {} }) {
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
        // return BlueprintInstance
        return { type: this.name, location: destination, data }
      })
      .catch(err => {
        throw err
      })
  }
}

module.exports = Blueprint
