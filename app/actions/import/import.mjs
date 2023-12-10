import path from 'path'
import fs from 'fs-extra'
import Blueprint from '../../lib/Blueprint/index.mjs'

import {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} from '../../config.mjs'

export default async function _import(
  globalBlueprintName,
  localBlueprintName,
  options
) {
  try {
    const blueprintName = localBlueprintName || globalBlueprintName
    const source = path.resolve(GLOBAL_BLUEPRINTS_PATH, globalBlueprintName)
    const location = path.resolve(PROJECT_BLUEPRINTS_PATH, `${blueprintName}`)

    if (!fs.pathExistsSync(source)) {
      console.error(`Global blueprint "${globalBlueprintName}" does not exist`)
      return
    }

    const blueprint = new Blueprint({
      name: blueprintName,
      source,
      location,
    })

    await blueprint.create()

    console.log(`${globalBlueprintName} was imported to ${location}`)
  } catch (err) {
    console.error(err)
  }
}
