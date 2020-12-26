#!/usr/bin/env node

const pkg = require('../package')
const cli = require('commander')
const create = require('./actions/create')
const generate = require('./actions/generate')
const _import = require('./actions/import')
const initialize = require('./actions/initialize')
const list = require('./actions/list')
const remove = require('./actions/remove')
const help = require('./actions/help')

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
  .option(
    '-s, --source [sourcePath]',
    'Path to use for initial blueprint files',
    false
  )
  .description('Create a blueprint')
  .action(create)

cli
  .command('import <globalBlueprint> [localBlueprint]')
  .description('Create a project blueprint based on a global blueprint')
  .action(_import)

cli
  .command('init [projectPath]')
  .description('Initialize a local blueprints project')
  .action(initialize)

cli
  .command('remove <blueprint>')
  .alias('rm')
  .option('-g, --global', 'Removes the global blueprint')
  .description('Removes a blueprint')
  .action(remove)

cli.on('--help', help)

cli.parse(process.argv)
