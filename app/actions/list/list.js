const path = require('path')
const fs = require('fs-extra')

const Blueprint = require('../../lib/Blueprint')
const log = require('../../utils/log')

const {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = async function list(namespace = '', options) {
  try {
    log.clear()
    const blueprints = await getAllBlueprints(namespace)

    log(`--- Global Blueprints ---`)
    if (blueprints.global && blueprints.global.length) {
      blueprints.global.forEach((blueprint) => {
        log(`\n${blueprint.name} - ${blueprint.location}`)
        if (options.long && blueprint.config.description) {
          log(`  Description: ${blueprint.config.description}`)
        }
      })
    } else {
      log(`no global blueprints found`)
    }

    log(`\n--- Project Blueprints ---`)
    if (blueprints.project && blueprints.project.length) {
      blueprints.project.forEach((blueprint) => {
        log(`\n${blueprint.name} - ${blueprint.location}`)
        if (options.long && blueprint.config.description) {
          log(`  Description: ${blueprint.config.description}`)
        }
      })
    } else {
      log(`no project blueprints found`)
    }

    async function getAllBlueprints(namespace = '') {
      const globalBlueprintsPath = path.resolve(
        GLOBAL_BLUEPRINTS_PATH,
        namespace
      )
      const projectBlueprintsPath = path.resolve(
        PROJECT_BLUEPRINTS_PATH,
        namespace
      )
      const globalBlueprintsPathExists = await fs.pathExists(
        globalBlueprintsPath
      )
      const projectBlueprintsPathExists = await fs.pathExists(
        projectBlueprintsPath
      )
      let globalBlueprints = []
      let projectBlueprints = []
      let excludedPaths = ['.git', 'node_modules', '.gitignore', '.DS_Store']

      if (globalBlueprintsPathExists) {
        globalBlueprints = await fs.readdir(globalBlueprintsPath, 'utf8')
      }

      if (projectBlueprintsPathExists) {
        projectBlueprints = await fs.readdir(projectBlueprintsPath, 'utf8')
      }

      return {
        global: globalBlueprints
          .reduce((accum, blueprint) => {
            const location = path.resolve(
              globalBlueprintsPath,
              `./${blueprint}`
            )

            if (fs.statSync(location).isDirectory()) {
              accum.push(
                new Blueprint({
                  name: blueprint,
                  location,
                })
              )
            }

            return accum
          }, [])
          .filter((blueprint) => {
            return !excludedPaths.includes(blueprint.name)
          }),
        project: projectBlueprints
          .reduce((accum, blueprint) => {
            const location = path.resolve(
              projectBlueprintsPath,
              `./${blueprint}`
            )

            if (fs.statSync(location).isDirectory()) {
              accum.push(
                new Blueprint({
                  name: blueprint,
                  location,
                })
              )
            }

            return accum
          }, [])
          .filter((blueprint) => {
            return !excludedPaths.includes(blueprint.name)
          }),
      }
    }
    this.output = log.output()
  } catch (err) {
    log.error(err)
  }
}
