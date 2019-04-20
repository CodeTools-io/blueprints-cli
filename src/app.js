const os = require('os')
const path = require('path')

const fs = require('fs-extra')

const Blueprint = require('./lib/blueprint')

class App {
  constructor({ globalPath, projectPath }) {
    this.projectPath = projectPath
    this.globalPath = globalPath
  }

  createBlueprint(blueprintName, options) {
    if (!blueprintName) {
      throw new Error('requires a name')
    }

    const blueprintPath = options.global
      ? path.resolve(this.globalPath, blueprintName)
      : path.resolve(process.cwd(), `./.blueprints/${blueprintName}`)

    if (fs.pathExistsSync(blueprintPath)) {
      throw new Error(`A blueprint called ${blueprintName} already exists`)
    }

    return Promise.all([
      fs.ensureDir(
        path.resolve(blueprintPath, './files/__blueprintInstance__')
      ),
      fs.outputJson(
        path.resolve(blueprintPath, './blueprint.json'),
        {},
        { space: 2 }
      )
    ])
      .then(() => {
        console.log(`${blueprintName} was created at ${blueprintPath}`)
      })
      .catch(err => {
        console.error(err)
        fs.remove(path.resolve(blueprintPath)).catch(rmError => {
          console.error(rmError)
        })
      })
  }

  initializeBlueprint(name, { location, source }) {
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

  removeBlueprint(name, { location }) {
    if (!name) {
      throw new Error('requires a name')
    }
    if (!location) {
      throw new Error('requires a location')
    }

    const blueprint = new Blueprint({
      name: name,
      location: location
    })

    return blueprint.remove()
  }

  async generateBlueprintInstance(name, destination, data = {}) {
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

    await blueprint.preGenerate({ destination, data })
    await blueprint.generate({ destination, data })
    await blueprint.postGenerate({ destination, data })
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
              location
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
              location
            })
          )
        }

        return accum
      }, [])
    }
  }
}

module.exports = App
