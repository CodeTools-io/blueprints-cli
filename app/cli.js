#!/usr/bin/env node

const pkg = require('../package')
const path = require('path')
const cli = require('commander')
const App = require('./app')
const create = require('./actions/create')
const generate = require('./actions/generate')
const initialize = require('./actions/initialize')
const list = require('./actions/list')
const remove = require('./actions/remove')
const help = require('./actions/help')

const {
  CURRENT_PATH,
  CURRENT_DIRNAME,
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('./config')

const app = new App({
  globalPath: GLOBAL_BLUEPRINTS_PATH,
  projectPath: PROJECT_BLUEPRINTS_PATH,
})

cli.version(pkg.version)

cli
  .command('generate <blueprint> <blueprintInstance>')
  .option('-d, --dest <destination>', 'Which directory to place the files')
  .alias('g')
  .description('Generate files with a blueprint')
  .action(generate)

cli
  .command('list [namespace]')
  .alias('ls')
  .description('List all available blueprints')
  .action(list)

cli
  .command('new <blueprint>')
  .option('-g, --global', 'Creates the blueprint globally', false)
  .description('Create a generic blueprint')
  .action(create)

cli
  .command('init [blueprint]')
  .option('-g, --global', 'Creates the blueprint globally')
  .description('Create blueprint with contents of current directory')
  .action(initialize)

cli
  .command('remove <blueprint>')
  .alias('rm')
  .option('-g, --global', 'Removes the global blueprint')
  .description('Removes a blueprint')
  .action(remove)

cli.on('--help', help)

cli.parse(process.argv)
