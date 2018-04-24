const os = require('os')
const path = require('path')

const fs = require('fs-extra')

const rc = require('rc')
const scaffold = require('scaffold-helper')

const Blueprint = require('./Blueprint')

const DEFAULT_CONFIG = {
  globalBlueprintsPath: path.resolve(os.homedir(), './.blueprints'),
  projectBlueprintsPath: path.resolve(process.cwd(), './.blueprints')
}

class App {
  constructor() {
    try {
      this.loadConfig()
    } catch (e) {
      console.log(e)
    }
  }

  loadConfig(configOverride = false) {
    const excludedKeys = ['_', 'configs', 'config']
    const configs = rc('blueprints', DEFAULT_CONFIG)

    if (configOverride) {
      this.settings = configOverride
    } else {
      this.settings = Object.keys(configs).reduce((accum, configKey) => {
        if (!excludedKeys.includes(configKey)) {
          accum[configKey] = configs[configKey]
        }
        return accum
      }, {})
    }
  }

  generate(name, data = {}, options = {}) {
    if (!name) {
      throw new Error('requires a name')
    }
    const instance = new Blueprint(name, data, options)

    return instance.generate()
  }
}

module.exports = App
