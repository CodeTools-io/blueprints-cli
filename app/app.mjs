import { Command } from 'commander'
import pkg from './pkg.mjs'
import create from './actions/create/index.mjs'
import generate from './actions/generate/index.mjs'
import _import from './actions/import/index.mjs'
import initialize from './actions/initialize/index.mjs'
import list from './actions/list/index.mjs'
import remove from './actions/remove/index.mjs'
import help from './actions/help/index.mjs'

const app = new Command()

app.name(pkg.name).description(pkg.description).version(pkg.version)

app
  .command('generate')
  .description('Generate files with a blueprint')
  .argument('<blueprint>', 'name of the blueprint to use')
  .argument('<blueprintInstance>', 'name of the blueprint instance to create')
  .option('-d, --dest <destination>', 'Which directory to place the files')
  .alias('g')
  .action(generate)

app
  .command('list')
  .description('List all available blueprints')
  .alias('ls')
  .argument('[namespace]', 'namespace of the blueprints to show')
  .option('-l, --long', 'Shows more detail about the blueprints', false)
  .action(list)

app
  .command('new')
  .description('Create a blueprint')
  .argument('<blueprint>', 'name of blueprint to create')
  .option('-g, --global', 'Creates the blueprint globally', false)
  .option(
    '-s, --source [sourcePath]',
    'Path to use for initial blueprint files',
    false
  )
  .action(create)

app
  .command('import')
  .description('Create a project blueprint based on a global blueprint')
  .argument('<globalBlueprint>', 'name of the global blueprint to use')
  .argument('<localBlueprint>', 'name of the project blueprint create')
  .action(_import)

app
  .command('init')
  .description('Initialize a local blueprints project')
  .argument('[projectPath]', 'path where blueprints should be initialized')
  .action(initialize)

app
  .command('remove')
  .description('Removes a blueprint')
  .alias('rm')
  .argument('<blueprint>', 'name of the blueprint to remove')
  .option('-g, --global', 'Removes the global blueprint')
  .action(remove)

app.on('--help', help)

export default app
