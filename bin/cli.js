#!/usr/bin/env node

const fs = require('fs-extra')
const os = require('os')
const path = require('path')

const prop = require('dot-prop')
const cli = require('commander')

const App = require('../lib/App')

const CURRENT_PATH = process.cwd()
const CURRENT_DIRNAME = path.basename(process.cwd())
const PROJECT_ROOT_PATH = getProjectRoot(process.cwd())
const PROJECT_BLUEPRINTS_PATH = path.resolve(PROJECT_ROOT_PATH, './.blueprints')
const GLOBAL_BLUEPRINTS_PATH = path.resolve(os.homedir(), './.blueprints')

const app = new App({
  globalPath: GLOBAL_BLUEPRINTS_PATH,
  projectPath: PROJECT_BLUEPRINTS_PATH
})

function setValue(data, key, value) {
  const arrayRegex = /([\w\.]+)\[(\d)*\]/
  const keySections = key.match(arrayRegex)
  if (keySections) {
    const index = Number.parseInt(keySections[2])
    const keyName = keySections[1]

    if (!prop.has(data, keyName)) {
      prop.set(data, keyName, [])
    }

    const currentVal = prop.get(data, keyName)

    if (Number.isInteger(index)) {
      currentVal[index] = value
    } else {
      currentVal.push(value)
    }
    prop.set(data, keyName, currentVal)
  } else {
    prop.set(data, key, value)
  }
  return data
}

function getProjectRoot(directory) {
  const isProjectRoot = fs.pathExistsSync(
    path.resolve(directory, './.blueprints')
  )

  if (isProjectRoot) {
    return directory
  }

  return getProjectRoot(path.resolve(directory, '../'))
}

cli
  .command('generate <blueprint>')
  .option('-d, --dest <destination>', 'Which directory to place the files')
  .alias('g')
  .description('Generate files with a blueprint')
  .action(function generate(blueprint, options) {
    const destination = options.dest || CURRENT_PATH
    const args = process.argv.slice(4)
    const rawData = args.filter(arg => !arg.startsWith('--'))
    const data = rawData.reduce((data, arg) => {
      const [key, value] = arg.split('=', 2)

      return setValue(data, key, value)
    }, {})

    app.generateBlueprintInstance(blueprint, destination, data)
  })

cli
  .command('list')
  .alias('ls')
  .description('List all available blueprints')
  .action(function list() {
    const blueprints = app.getAllBlueprints()

    blueprints
      .then(results => {
        console.log(`--- Global Blueprints ---`)
        if (results.global && results.global.length) {
          results.global.forEach(result => {
            console.log(`${result.name} - ${result.location}`)
          })
        } else {
          console.log(`no global blueprints found`)
        }

        console.log(`\n--- Project Blueprints ---`)
        if (results.project && results.project.length) {
          results.project.forEach(result => {
            console.log(`${result.name} - ${result.location}`)
          })
        } else {
          console.log(`no project blueprints found`)
        }
      })
      .catch(err => {
        throw err
      })
  })

cli
  .command('init [blueprint]')
  .option('-g, --global', 'Creates the blueprint globally')
  .description('Create blueprint with contents of current directory')
  .action(function initialize(blueprint, options) {
    const blueprintName = blueprint || CURRENT_DIRNAME
    const isGlobal = options.global || false
    const source = CURRENT_PATH
    const globalLocation = path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
    const projectLocation = path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)
    const location = isGlobal ? globalLocation : projectLocation

    app
      .createBlueprint(blueprintName, { source, location })
      .then(blueprint => {
        console.log(`${blueprint.name} was created at: ${blueprint.location}`)
      })
      .catch(err => {
        throw err
      })
  })

cli
  .command('remove <blueprint>')
  .alias('rm')
  .option('-g, --global', 'Removes the global blueprint')
  .description('Removes a blueprint')
  .action(function remove(blueprint, options) {
    const blueprintName = blueprint
    const isGlobal = options.global || false
    const globalLocation = path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
    const projectLocation = path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)
    const location = isGlobal ? globalLocation : projectLocation

    app
      .removeBlueprint(blueprintName, { location })
      .then(blueprint => {
        console.log(`${blueprint.name} was removed from: ${blueprint.location}`)
      })
      .catch(err => {
        throw err
      })
  })
cli.parse(process.argv)
