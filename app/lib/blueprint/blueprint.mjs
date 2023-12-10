import path from 'path'
import child_process from 'child_process'
import fs from 'fs-extra'
import scaffoldHelper from 'scaffold-helper'
import _ from 'lodash'
import date from 'date-fns'
const { merge } = _
import File from '../../lib/File/index.mjs'
import { log } from '../../utilities.mjs'

const scaffold = scaffoldHelper.default

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

  async loadConfigFile(location) {
    const configPath = path.resolve(location, './blueprint.json')
    console.log(configPath)
    if (fs.pathExistsSync(configPath)) {
      const configFile = await fs.readJson(configPath)
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

  async preGenerate({ destination, data = {} }) {
    const mergedData = merge({}, this.config.data, data)

    const commands = this.config.preGenerate.map((configCommand) => {
      let command = configCommand
      command = command.replace('<blueprintName>', mergedData.blueprint)
      command = command.replace('<blueprintPath>', this.location)
      command = command.replace('<instanceName>', mergedData.blueprintInstance)
      command = command.replace(
        '<instancePath>',
        path.resolve(destination, mergedData.blueprintInstance)
      )
      return command
    })
    console.log(commands)
    const preGenerateFns = await Promise.allSettled(
      commands.map((command) => {
        log.success(`executed preGenerate hook`)

        const preGenerate = import(path.resolve(this.location, command))

        return pregenerate
      })
    )
    console.log(preGenerateFns)

    preGenerateFns.forEach((preGenerateFn) => {
      preGenerateFn(mergedData, { _, fs, date, File })
    })
  }

  async postGenerate({ destination, data = {} }) {
    const mergedData = merge({}, this.config.data, data)
    const commands = this.config.postGenerate.map((configCommand) => {
      let command = configCommand
      command = command.replace('<blueprintName>', mergedData.blueprint)
      command = command.replace('<blueprintPath>', this.location)
      command = command.replace('<instanceName>', mergedData.blueprintInstance)
      command = command.replace(
        '<instancePath>',
        path.resolve(destination, mergedData.blueprintInstance)
      )
      return command
    })
    const postGenerateFns = await Promise.allSettled(
      commands.map((command) => {
        log.success(`executed postGenerate hook`)

        const postGenerate = import(path.resolve(this.location, command))

        return postGenerate
      })
    )

    postGenerateFns.forEach((postGenerateFn) => {
      postGenerateFn(mergedData, { _, fs, date, File })
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

export default Blueprint
