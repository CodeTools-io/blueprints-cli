const os = require('os')
const path = require('path')
const GLOBAL_CONFIG_PATH =
  process.env.environment !== 'test'
    ? path.resolve(os.homedir(), './.blueprintsrc')
    : path.resolve(__dirname, './test/fixtures/.blueprintsrc')

module.exports = {
  GLOBAL_CONFIG_PATH
}
