#!/usr/bin/env node

const prop = require('dot-prop')
const cli = require('commander')
const App = require('../lib/app')

const app = new App()

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

cli
  .command(`generate <blueprint>`)
  .option('-d, --dest <destination>', 'Which directory to place the files')
  .alias('g')
  .description('Generate files with a blueprint')
  .action(function(blueprint, options) {
    const destination = options.dest || './'
    const args = process.argv.slice(4)
    const rawData = args.filter(arg => !arg.startsWith('--'))
    const data = rawData.reduce((data, arg) => {
      const [key, value] = arg.split('=', 2)

      return setValue(data, key, value)
    }, {})
    app.generateFromBlueprint(blueprint, destination, data)
  })

cli.parse(process.argv)
