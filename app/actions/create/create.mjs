import createFromDirectory from './lib/createFromDirectory.mjs'
import createBlank from './lib/createBlank.mjs'
import { log } from '../../utilities.mjs'

export default async function create(blueprintName, command) {
  try {
    log.clear()
    const result = command.source
      ? await createFromDirectory(blueprintName, command)
      : await createBlank(blueprintName, command)

    log.success(result.message)

    this.output = log.output()
  } catch (err) {
    this.output = log.error(err.message)
  }
}
