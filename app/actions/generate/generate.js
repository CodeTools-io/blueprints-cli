const path = require('path')
const fs = require('fs-extra')
const Blueprint = require('../../lib/Blueprint')
const { getMetadata, getTemplateData, log } = require('../../utilities')

const {
  CURRENT_PATH,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = async function generate(
  blueprintName,
  blueprintInstance,
  command
) {
  try {
    log.clear()
    const destination = command.dest || CURRENT_PATH
    const data = getTemplateData(command.args.slice(2))
    const metadata = getMetadata({
      blueprint: blueprintName,
      blueprintInstance,
    })
    const location = getBlueprintPath(blueprintName)

    if (!location) {
      log.error('Blueprint not found')
      return
    }

    const blueprint = new Blueprint({
      name: blueprintName,
      location,
    })

    function getBlueprintPath(name) {
      const globalBlueprintPath = path.resolve(
        GLOBAL_BLUEPRINTS_PATH,
        `./${name}`
      )
      const projectBlueprintPath = path.resolve(
        PROJECT_BLUEPRINTS_PATH,
        `./${name}`
      )

      if (fs.pathExistsSync(projectBlueprintPath)) {
        return projectBlueprintPath
      }

      if (fs.pathExistsSync(globalBlueprintPath)) {
        return globalBlueprintPath
      }

      return null
    }

    await blueprint.preGenerate({
      destination,
      data: {
        ...data,
        ...metadata,
      },
    })
    await blueprint.generate({
      destination,
      data: {
        ...data,
        ...metadata,
      },
    })
    await blueprint.postGenerate({
      destination,
      data: {
        ...data,
        ...metadata,
      },
    })

    this.output = log.output()
  } catch (error) {
    log.error(error)
  }
}
