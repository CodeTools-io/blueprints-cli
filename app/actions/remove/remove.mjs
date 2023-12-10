import path from 'path'
import Blueprint from '../../lib/Blueprint/index.mjs'

import {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} from '../../config.mjs'

export default async function remove(blueprintName, options) {
  try {
    const isGlobal = options.global || false
    const globalLocation = path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
    const projectLocation = path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)
    const location = isGlobal ? globalLocation : projectLocation

    const blueprint = new Blueprint({
      name: blueprintName,
      location: location,
    })

    await blueprint.remove()

    console.log(`${blueprintName} was removed from: ${location}`)
  } catch (err) {
    console.error(err)
  }
}
