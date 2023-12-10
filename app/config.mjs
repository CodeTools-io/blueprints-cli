import path from 'path'
import os from 'os'
import findUp from 'find-up'

export const CURRENT_PATH = process.cwd()
export const CURRENT_DIRNAME = path.basename(process.cwd())
export const PROJECT_BLUEPRINTS_PATH = findUp.sync('.blueprints', {
  type: 'directory',
})
export const PROJECT_ROOT_PATH = path.resolve(PROJECT_BLUEPRINTS_PATH, '../')
export const GLOBAL_BLUEPRINTS_PATH = path.resolve(
  os.homedir(),
  './.blueprints'
)
