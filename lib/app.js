const os = require('os')
const path = require('path')

const _ = require('lodash')
const fs = require('fs-extra')
const rc = require('rc')
const generate = require('scaffold-helper')

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
  generateFromBlueprint(name, destination, data = {}) {
    if (!name || !destination) {
      throw new Error('requires a name and destination argument')
    }
    return this._getBlueprintPath(name)
      .then(blueprintPath => {
        generate(
          {
            source: blueprintPath,
            destination,
            onlyFiles: false
          },
          data
        )
        return
      })
      .catch(err => err)
  }
  _getBlueprintPath(name) {
    let globalBlueprintPath = path.resolve(
      this.settings.globalBlueprintsPath,
      name,
      './files'
    )
    let projectBlueprintPath = path.resolve(
      this.settings.projectBlueprintsPath,
      name,
      './files'
    )
    return Promise.all([
      fs.pathExists(globalBlueprintPath),
      fs.pathExists(projectBlueprintPath)
    ]).then(results => {
      const [hasGlobalBlueprint, hasProjectBlueprint] = results

      if (hasProjectBlueprint) {
        return projectBlueprintPath
      } else if (hasGlobalBlueprint) {
        return globalBlueprintPath
      } else {
        return new Error('No blueprint found')
      }
    })
  }
}

module.exports = App
