const pkg = require('../package')
const { Command } = require('commander')
const create = require('./actions/create')
const generate = require('./actions/generate')
const _import = require('./actions/import')
const initialize = require('./actions/initialize')
const list = require('./actions/list')
const remove = require('./actions/remove')
const help = require('./actions/help')

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

module.exports = app
