const os = require('os')
const path = require('path')

const _ = require('lodash')
const fs = require('fs-extra')
const rc = require('rc')
const generate = require('scaffold-helper')

const DEFAULT_CONFIG = {
  blueprintsDirectory: '.blueprints',
  globalBlueprintsPath: path.resolve(os.homedir(), './.blueprints')
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
  generateFromBlueprint(name, destination, data = {}) {
    if (!name || !destination) {
      throw new Error('requires a name and destination argument')
    }
    let globalBlueprintPath = path.resolve(
      this.settings.globalBlueprintsPath,
      name,
      './files'
    )
    return Promise.all([fs.pathExists(globalBlueprintPath)]).then(results => {
      const [hasGlobalBlueprint] = results

      if (hasGlobalBlueprint) {
        generate(
          {
            source: globalBlueprintPath,
            destination,
            onlyFiles: false
          },
          data
        )
      }
    })
  }
}

module.exports = App
