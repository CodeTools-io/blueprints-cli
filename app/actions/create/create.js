const createFromDirectory = require('./lib/createFromDirectory')
const createBlank = require('./lib/createBlank')
const log = require('../../utils/log')

module.exports = async function create(blueprintName, command) {
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
