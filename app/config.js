const path = require('path')
const os = require('os')
const pkgDir = require('pkg-dir')
const CURRENT_PATH = process.cwd()
const CURRENT_DIRNAME = path.basename(process.cwd())
const PROJECT_ROOT_PATH = pkgDir.sync() || CURRENT_PATH
const PROJECT_BLUEPRINTS_PATH = path.resolve(PROJECT_ROOT_PATH, './.blueprints')
const GLOBAL_BLUEPRINTS_PATH = path.resolve(os.homedir(), './.blueprints')

module.exports = {
  CURRENT_PATH,
  CURRENT_DIRNAME,
  PROJECT_ROOT_PATH,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
}
