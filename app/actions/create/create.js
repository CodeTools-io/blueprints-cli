const createFromDirectory = require('./lib/createFromDirectory')
const createBlank = require('./lib/createBlank')

module.exports = async function create(blueprintName, command) {
  try {
    const result = command.source
      ? await createFromDirectory(blueprintName, command)
      : await createBlank(blueprintName, command)

    if (process.env.NODE_ENV !== 'test') console.log(result.message)

    this.output = result.message
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.log(err.message)

    this.output = err.message
  }
}
