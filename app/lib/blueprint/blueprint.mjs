import path from 'path'
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
  }

  async loadConfigFile() {
    try {
      const configPath = path.resolve(this.location, './blueprint.json')

      if (fs.pathExistsSync(configPath)) {
        const configFile = await fs.readJson(configPath)

        this.config = merge({}, this.config, configFile)

        return true
      } else {
        return false
      }
    } catch (err) {
      return false
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

  async executeHook({ name, destination, data = {} }) {
    const mergedData = merge({}, this.config.data, data)
    const commands = this.config[name].map((configCommand) => {
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
    const hookModules = await Promise.allSettled(
      commands.map((command) => {
        const hook = import(path.resolve(this.location, command))

        return hook
      })
    )
    const hookFns = hookModules?.map((hookModule) => hookModule?.value?.default)
    const hookResults = await Promise.allSettled(
      hookFns.map((hookFn) => {
        return hookFn(mergedData, { _, fs, date, File, log })
      })
    )
    log.success(`executed ${name} hook`)
    return hookResults
  }

  async preGenerate({ destination, data = {} }) {
    const result = await this.executeHook({
      name: 'preGenerate',
      destination,
      data,
    })
    return Promise.resolve(result)
  }

  async postGenerate({ destination, data = {} }) {
    const result = await this.executeHook({
      name: 'postGenerate',
      destination,
      data,
    })
    return Promise.resolve(result)
  }

  async generate({ destination, data = {} }) {
    try {
      if (!destination) {
        throw new Error('no destination given for blueprint instance')
      }

      if (!fs.pathExistsSync(this.filesPath)) {
        throw new Error('blueprint does not exist')
      }
      const mergedData = merge({}, this.config.data, data)

      await fs.ensureDir(destination)

      scaffold(
        { source: this.filesPath, destination, onlyFiles: false },
        mergedData
      )

      log.success(`created instance`)

      return Promise.resolve({ type: this.name, location: destination, data })
    } catch (err) {
      throw err
    }
  }
}

export default Blueprint
