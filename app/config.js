const path = require('path')
const os = require('os')
const findUp = require('find-up')

const CURRENT_PATH = process.cwd()
const CURRENT_DIRNAME = path.basename(process.cwd())
const PROJECT_BLUEPRINTS_PATH = findUp.sync('.blueprints', {
  type: 'directory',
})
const PROJECT_ROOT_PATH = path.resolve(PROJECT_BLUEPRINTS_PATH, '../')
const GLOBAL_BLUEPRINTS_PATH = path.resolve(os.homedir(), './.blueprints')

module.exports = {
  CURRENT_PATH,
  CURRENT_DIRNAME,
  PROJECT_ROOT_PATH,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
}
