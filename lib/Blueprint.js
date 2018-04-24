const os = require('os')
const path = require('path')

const fs = require('fs-extra')

const rc = require('rc')
const scaffold = require('scaffold-helper')

const DEFAULT_OPTIONS = {
  globalPath: path.resolve(os.homedir(), './.blueprints'),
  projectPath: path.resolve(process.cwd(), './.blueprints'),
  destination: path.resolve(process.cwd())
}

class Blueprint {
  constructor(name, data = {}, options = {}) {
    if (!name) {
      throw new Error('requires a name')
    }
    this.name = name
    this.data = data
    this.settings = Object.assign({}, DEFAULT_OPTIONS, options)
  }

  generate() {
    return this.getResolvedPath()
      .then(blueprintPath => {
        scaffold(
          {
            source: blueprintPath,
            destination: this.settings.destination,
            onlyFiles: false
          },
          this.data
        )
        return
      })
      .catch(err => {
        throw err
      })
  }

  getResolvedPath() {
    let globalPath = path.resolve(
      this.settings.globalPath,
      this.name,
      './files'
    )
    let projectPath = path.resolve(
      this.settings.projectPath,
      this.name,
      './files'
    )
    return Promise.all([fs.pathExists(globalPath), fs.pathExists(projectPath)])
      .then(results => {
        const [hasGlobalBlueprint, hasProjectBlueprint] = results

        if (hasProjectBlueprint) {
          return projectPath
        } else if (hasGlobalBlueprint) {
          return globalPath
        } else {
          throw new Error('No blueprint found')
        }
      })
      .catch(err => {
        throw err
      })
  }
}

module.exports = Blueprint
