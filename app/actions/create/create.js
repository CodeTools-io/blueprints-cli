const createFromDirectory = require('./lib/createFromDirectory')
const createBlank = require('./lib/createBlank')

module.exports = function create(blueprintName, command) {
  command.source
    ? createFromDirectory(blueprintName, command)
    : createBlank(blueprintName, command)
}
