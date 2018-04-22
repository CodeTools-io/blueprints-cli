const os = require('os')
const path = require('path')

const _ = require('lodash')
const fs = require('fs-extra')
const rc = require('rc')

const DEFAULT_CONFIG = {
  blueprintsDirectory: '.blueprints'
}

class App {
  constructor() {
    try {
      this.loadConfig()
    } catch (e) {
      console.log(e)
    }
  }
  loadConfig() {
    const excludedKeys = ['_', 'configs', 'config']
    const configs = rc('blueprints', DEFAULT_CONFIG)
    this.settings = Object.keys(configs).reduce((accum, configKey) => {
      if (!excludedKeys.includes(configKey)) {
        accum[configKey] = configs[configKey]
      }
      return accum
    }, {})
  }
}

module.exports = App
