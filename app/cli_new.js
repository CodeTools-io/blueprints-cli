#!/usr/bin/env node

// Import required external modules
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const findUp = require('find-up')
const { Command } = require('commander')
const _ = require('lodash')
const date = require('date-fns')
const inflection = require('inflection')
const globby = require('globby')
const { merge } = _

// Constants for paths
const CURRENT_PATH = process.cwd()
const CURRENT_DIRNAME = path.basename(process.cwd())
const PROJECT_BLUEPRINTS_PATH = findUp.sync('.blueprints', {
  type: 'directory',
})
const PROJECT_ROOT_PATH = path.resolve(PROJECT_BLUEPRINTS_PATH, '../')
const GLOBAL_BLUEPRINTS_PATH = path.resolve(os.homedir(), './.blueprints')

// Helper Functions
function getTemplateData(args) {
  const rawData = args.filter((arg) => !arg.startsWith('--'))
  return rawData.reduce((data, arg) => {
    const [key, value] = arg.split('=', 2)
    return _.set(data, key, value)
  }, {})
}

function getMetadata({ blueprintInstance, blueprint }) {
  const standardBlueprintInstance = blueprintInstance.replace(/-/gi, '_')
  let data = {
    blueprint: blueprint,
    blueprintInstance: blueprintInstance,
    blueprintInstance_ClassFormat: inflection.classify(
      standardBlueprintInstance
    ),
    'blueprintInstance_dashed-format': inflection
      .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
      .toLowerCase(),
    blueprintInstance_DashedFormat: inflection
      .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
      .toLowerCase(),
    'blueprintInstance_slug-format': inflection
      .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
      .toLowerCase(),
    blueprintInstance_SlugFormat: inflection
      .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
      .toLowerCase(),
    blueprintInstance_camelCaseFormat: inflection.camelize(
      standardBlueprintInstance,
      true
    ),
    blueprintInstance_CamelCaseFormat: inflection.camelize(
      standardBlueprintInstance,
      true
    ),
    blueprintInstance_pascalCaseFormat: inflection.camelize(
      standardBlueprintInstance
    ),
    blueprintInstance_PascalCaseFormat: inflection.camelize(
      standardBlueprintInstance
    ),
    blueprintInstance_ConstantFormat: inflection
      .underscore(standardBlueprintInstance)
      .toUpperCase(),
  }
  const singlePluralVersions = _.mapValues(data, (value, key) => {
    if (key === 'blueprintInstance_ConstantFormat') {
      return {
        [`${key}Pluralized`]: inflection.pluralize(value).toUpperCase(),
        [`${key}Singularized`]: inflection.singularize(value).toUpperCase(),
      }
    }
    return {
      [`${key}Pluralized`]: inflection.pluralize(value),
      [`${key}Singularized`]: inflection.singularize(value),
    }
  })
  return _.assign({}, data, ..._.values(singlePluralVersions))
}

// Logging utility
let logQueue = []
const log = {
  info: (...value) => logQueue.push(`ℹ️ ${value.join('')}`),
  warning: (value) => logQueue.push(`⚠️ ${value}`),
  success: (value) => logQueue.push(`✅ ${value}`),
  error: (value) => {
    console.error(`❌ ${value}`)
    return `❌ ${value}`
  },
  output: () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(logQueue.join('\n'))
    }
    return logQueue.join('\n')
  },
  clear: () => {
    logQueue = []
  },
}

// Class Blueprint
class Blueprint {
  constructor({ name, location, source }) {
    this.name = name
    this.location = location
    this.source = source
    this.filesPath = path.resolve(location, './files')
    this.config = { preGenerate: [], postGenerate: [], data: {} }
    this.loadConfigFile(location)
  }

  loadConfigFile(location) {
    const configPath = path.resolve(location, './blueprint.json')
    if (fs.pathExistsSync(configPath)) {
      const configFile = require(configPath)
      this.config = merge({}, this.config, configFile)
    }
  }

  // Additional methods for remove, create, preGenerate, postGenerate, generate...
}

// Class File
class File {
  constructor(absolutePath, options = {}) {
    this.path = absolutePath
    this.operations = []
    this.options = { encoding: 'utf8', ...options }
    this.content = fs.readFile(absolutePath, this.options)
  }

  registerOperation(fn) {
    this.operations.push({ fn })
    return this
  }

  apply() {
    return this.content
      .then((content) => {
        return this.operations.reduce(
          (accum, operation) => operation.fn(accum),
          [content]
        )
      })
      .then((content) => {
        this.operations = []
        this.content = content
        return this
      })
  }

  save() {
    return fs.writeFile(this.path, this.content, this.options)
  }

  ensureText(value) {
    return this.registerOperation((currentValue) => {
      const hasText = _.some(currentValue, (lineOfText) =>
        lineOfText.includes(value)
      )
      return hasText ? `${currentValue}` : `${currentValue}\n${value}`
    })
  }

  // Additional methods for appendText, prependText, replaceText...
}

// Application Actions
async function create(blueprintName, command) {
  try {
    log.clear()
    const result = command.source
      ? await createFromDirectory(blueprintName, command)
      : await createBlank(blueprintName, command)

    log.success(result.message)
  } catch (err) {
    log.error(err.message)
  }
}

async function generate(blueprintName, blueprintInstance, command) {
  try {
    log.clear()
    const destination = command.dest || CURRENT_PATH
    const data = getTemplateData(command.args.slice(2))
    const metadata = getMetadata({
      blueprint: blueprintName,
      blueprintInstance,
    })
    const location = getBlueprintPath(blueprintName)

    if (!location) {
      log.error('Blueprint not found')
      return
    }

    const blueprint = new Blueprint({
      name: blueprintName,
      location,
    })

    await blueprint.preGenerate({
      destination,
      data: _.assign({}, data, metadata),
    })
    await blueprint.generate({
      destination,
      data: _.assign({}, data, metadata),
    })
    await blueprint.postGenerate({
      destination,
      data: _.assign({}, data, metadata),
    })
  } catch (error) {
    log.error(error)
  }
}

function help() {
  log.clear()
  log.info(
    'Pipes:\n',
    'ClassFormat (ex. ComponentName)\n',
    'DashedFormat (ex. component-name)\n',
    'CamelCaseFormat (ex. componentName)\n',
    'PascalCaseFormat (ex. ComponentName)\n',
    'SlugFormat (ex. component-name)\n',
    'ConstantFormat (ex. COMPONENT_NAME)\n'
  )
  return log.output()
}

async function _import(globalBlueprintName, localBlueprintName, options) {
  try {
    const blueprintName = localBlueprintName || globalBlueprintName
    const source = path.resolve(GLOBAL_BLUEPRINTS_PATH, globalBlueprintName)
    const location = path.resolve(PROJECT_BLUEPRINTS_PATH, `${blueprintName}`)

    if (!fs.pathExistsSync(source)) {
      console.error(`Global blueprint "${globalBlueprintName}" does not exist`)
      return
    }

    const blueprint = new Blueprint({
      name: blueprintName,
      source,
      location,
    })

    await blueprint.create()

    console.log(`${globalBlueprintName} was imported to ${location}`)
  } catch (err) {
    console.error(err)
  }
}

async function initialize(projectPath, command) {
  const projectBlueprintsPath = projectPath
    ? path.resolve(projectPath, './.blueprints')
    : path.resolve('./.blueprints')

  await fs.ensureDir(projectBlueprintsPath)

  console.log(
    `Project initialized. Blueprints can now be added to ${projectBlueprintsPath}`
  )
}

async function list(namespace = '', options) {
  try {
    log.clear()
    const blueprints = await getAllBlueprints(namespace)

    log(`--- Global Blueprints ---`)
    blueprints.global.forEach((blueprint) => {
      log(`\n${blueprint.name} - ${blueprint.location}`)
      if (options.long && blueprint.config.description) {
        log(`  Description: ${blueprint.config.description}`)
      }
    })

    log(`\n--- Project Blueprints ---`)
    blueprints.project.forEach((blueprint) => {
      log(`\n${blueprint.name} - ${blueprint.location}`)
      if (options.long && blueprint.config.description) {
        log(`  Description: ${blueprint.config.description}`)
      }
    })
  } catch (err) {
    log.error(err)
  }
}

async function remove(blueprintName, options) {
  try {
    const isGlobal = options.global || false
    const location = isGlobal
      ? path.resolve(GLOBAL_BLUEPRINTS_PATH, blueprintName)
      : path.resolve(PROJECT_BLUEPRINTS_PATH, blueprintName)

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

// CLI setup
const pkg = require('../package')
const app = new Command()

app.version(pkg.version)

app
  .command('generate <blueprint> <blueprintInstance>')
  .option('-d, --dest <destination>', 'Which directory to place the files')
  .alias('g')
  .description('Generate files with a blueprint')
  .action(generate)

app
  .command('list [namespace]')
  .alias('ls')
  .description('List all available blueprints')
  .option('-l, --long', 'Shows more detail about the blueprints', false)
  .action(list)

app
  .command('new <blueprint>')
  .option('-g, --global', 'Creates the blueprint globally', false)
  .option(
    '-s, --source [sourcePath]',
    'Path to use for initial blueprint files',
    false
  )
  .description('Create a blueprint')
  .action(create)

app
  .command('import <globalBlueprint> [localBlueprint]')
  .description('Create a project blueprint based on a global blueprint')
  .action(_import)

app
  .command('init [projectPath]')
  .description('Initialize a local blueprints project')
  .action(initialize)

app
  .command('remove <blueprint>')
  .alias('rm')
  .option('-g, --global', 'Removes the global blueprint')
  .description('Removes a blueprint')
  .action(remove)

app.on('--help', help)

app.parse(process.argv)

module.exports = app
