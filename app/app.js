const path = require('path')
const fs = require('fs-extra')

const Blueprint = require('./lib/blueprint')

class App {
  constructor({ globalPath, projectPath }) {
    this.projectPath = projectPath
    this.globalPath = globalPath
  }

  removeBlueprint(name, { location }) {
    if (!name) {
      throw new Error('requires a name')
    }
    if (!location) {
      throw new Error('requires a location')
    }

    const blueprint = new Blueprint({
      name: name,
      location: location,
    })

    return blueprint.remove()
  }

  async getAllBlueprints(namespace = '') {
    const globalBlueprintsPath = path.resolve(this.globalPath, namespace)
    const projectBlueprintsPath = path.resolve(this.projectPath, namespace)
    const globalBlueprintsPathExists = await fs.pathExists(globalBlueprintsPath)
    const projectBlueprintsPathExists = await fs.pathExists(
      projectBlueprintsPath
    )
    let globalBlueprints = []
    let projectBlueprints = []

    if (globalBlueprintsPathExists) {
      globalBlueprints = await fs.readdir(globalBlueprintsPath, 'utf8')
    }

    if (projectBlueprintsPathExists) {
      projectBlueprints = await fs.readdir(projectBlueprintsPath, 'utf8')
    }

    return {
      global: globalBlueprints.reduce((accum, blueprint) => {
        const location = path.resolve(globalBlueprintsPath, `./${blueprint}`)

        if (fs.statSync(location).isDirectory()) {
          accum.push(
            new Blueprint({
              name: blueprint,
              location,
            })
          )
        }

        return accum
      }, []),
      project: projectBlueprints.reduce((accum, blueprint) => {
        const location = path.resolve(projectBlueprintsPath, `./${blueprint}`)

        if (fs.statSync(location).isDirectory()) {
          accum.push(
            new Blueprint({
              name: blueprint,
              location,
            })
          )
        }

        return accum
      }, []),
    }
  }
}

module.exports = App
