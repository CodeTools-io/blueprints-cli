const os = require('os')
const path = require('path')

const fs = require('fs-extra')

const scaffold = require('scaffold-helper')

const Blueprint = require('./Blueprint')

class App {
  constructor({ globalPath, projectPath }) {
    this.projectPath = projectPath
    this.globalPath = globalPath
  }

  createBlueprint(name, { location, source }) {
    if (!name) {
      throw new Error('requires a name')
    }
    if (!location) {
      throw new Error('requires a location')
    }
    if (!source) {
      throw new Error('requires a source')
    }

    const blueprint = new Blueprint({
      name: name,
      location: location,
      source: source
    })

    return blueprint.save()
  }

  generateBlueprintInstance(name, destination, data = {}) {
    if (!name) {
      throw new Error('requires a name')
    }
    if (!destination) {
      throw new Error('requires a destination')
    }
    const blueprint = new Blueprint({
      name,
      location: this.getBlueprintPath(name)
    })

    return blueprint.generate(destination, data)
  }

  getBlueprintPath(name) {
    const globalBlueprintPath = path.resolve(this.globalPath, `./${name}`)
    const projectBlueprintPath = path.resolve(this.projectPath, `./${name}`)
    if (fs.pathExistsSync(projectBlueprintPath)) {
      return projectBlueprintPath
    }

    if (fs.pathExistsSync(globalBlueprintPath)) {
      return globalBlueprintPath
    }

    throw new Error('Blueprint not found')
  }

  getAllBlueprints() {
    const globalBlueprints = fs.readdir(this.globalPath, 'utf8')
    const projectBlueprints = fs.readdir(this.projectPath, 'utf8')
    return Promise.all([globalBlueprints, projectBlueprints]).then(
      blueprints => {
        const [globalBlueprints, projectBlueprints] = blueprints

        return {
          global: globalBlueprints.reduce((accum, blueprint) => {
            const location = path.resolve(this.globalPath, `./${blueprint}`)

            if (fs.statSync(location).isDirectory()) {
              accum.push(
                new Blueprint({
                  name: blueprint,
                  location
                })
              )
            }

            return accum
          }, []),
          project: projectBlueprints.reduce((accum, blueprint) => {
            const location = path.resolve(this.projectPath, `./${blueprint}`)

            if (fs.statSync(location).isDirectory()) {
              accum.push(
                new Blueprint({
                  name: blueprint,
                  location
                })
              )
            }

            return accum
          }, [])
        }
      }
    )
  }
}

module.exports = App
