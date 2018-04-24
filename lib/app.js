const os = require('os')
const path = require('path')

const fs = require('fs-extra')

const rc = require('rc')
const scaffold = require('scaffold-helper')

const Blueprint = require('./Blueprint')

const DEFAULT_OPTIONS = {
  globalBlueprintsPath: path.resolve(os.homedir(), './.blueprints'),
  projectBlueprintsPath: path.resolve(process.cwd(), './.blueprints')
}

class App {
  constructor(options = {}) {
    this.settings = Object.assign({}, DEFAULT_OPTIONS, options)
  }

  generateBlueprintInstance(name, data = {}, options = {}) {
    if (!name) {
      throw new Error('requires a name')
    }
    const instance = new Blueprint(name, data, options)

    return instance.generate()
  }

  getBlueprints() {
    const globalBlueprints = fs.readdir(
      this.settings.globalBlueprintsPath,
      'utf8'
    )
    const projectBlueprints = fs.readdir(
      this.settings.projectBlueprintsPath,
      'utf8'
    )
    return Promise.all([globalBlueprints, projectBlueprints]).then(
      blueprints => {
        const [globalBlueprints, projectBlueprints] = blueprints

        return {
          globals: globalBlueprints.map(blueprint => {
            return {
              name: blueprint,
              path: path.resolve(this.settings.globalBlueprintsPath, blueprint)
            }
          }),
          projects: projectBlueprints.map(blueprint => {
            return {
              name: blueprint,
              path: path.resolve(this.settings.projectBlueprintsPath, blueprint)
            }
          })
        }
      }
    )
  }
}

module.exports = App
