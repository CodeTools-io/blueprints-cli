const path = require('path')
const globby = require('globby')
const inflection = require('inflection')
const prop = require('dot-prop')

// Filename: ./app/utils/get-template-data.js
// const setValue = require('./set-value')

// function getTemplateData(args) {
//   const rawData = args.filter((arg) => !arg.startsWith('--'))

//   return rawData.reduce((data, arg) => {
//     const [key, value] = arg.split('=', 2)

//     return setValue(data, key, value)
//   }, {})
// }

// module.exports = getTemplateData

// Filename: ./app/utils/getAbsolutePaths/getAbsolutePaths.js
// const path = require('path')
// const globby = require('globby')

function getAbsolutePaths(glob, options) {
  return globby(glob, options).then((results) => {
    const cwd = options.cwd ? options.cwd : process.cwd()

    return results.map((result) => {
      return path.resolve(cwd, result)
    })
  })
}

// Filename: ./app/utils/getAbsolutePaths/index.js
// module.exports = require('./getAbsolutePaths')

// Filename: ./app/utils/getMetadata/getMetadata.js
// const inflection = require('inflection')

function getMetadata({ blueprintInstance, blueprint }) {
  const standardBlueprintInstance = blueprintInstance.replace(/-/gi, '_')
  let data = {}
  data['blueprint'] = blueprint
  data['blueprintInstance'] = blueprintInstance
  data['blueprintInstance_ClassFormat'] = inflection.classify(
    standardBlueprintInstance
  )
  data[
    'blueprintInstance_dashed-format'
  ] = inflection
    .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
    .toLowerCase()
  data[
    'blueprintInstance_DashedFormat'
  ] = inflection
    .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
    .toLowerCase()
  data['blueprintInstance_slug-format'] =
    data['blueprintInstance_dashed-format']
  data['blueprintInstance_SlugFormat'] = data['blueprintInstance_dashed-format']
  data['blueprintInstance_camelCaseFormat'] = inflection.camelize(
    standardBlueprintInstance,
    true
  )
  data['blueprintInstance_CamelCaseFormat'] = inflection.camelize(
    standardBlueprintInstance,
    true
  )
  data['blueprintInstance_pascalCaseFormat'] = inflection.camelize(
    standardBlueprintInstance
  )
  data['blueprintInstance_PascalCaseFormat'] = inflection.camelize(
    standardBlueprintInstance
  )
  data['blueprintInstance_ConstantFormat'] = inflection
    .underscore(standardBlueprintInstance)
    .toUpperCase()

  const singlePluralVersions = Object.entries(data).reduce(
    (accum, [key, value]) => {
      if (key === 'blueprintInstance_ConstantFormat') {
        return {
          ...accum,
          [`${key}Pluralized`]: inflection.pluralize(value).toUpperCase(),
          [`${key}Singularized`]: inflection.singularize(value).toUpperCase(),
        }
      }
      return {
        ...accum,
        [`${key}Pluralized`]: inflection.pluralize(value),
        [`${key}Singularized`]: inflection.singularize(value),
      }
    },
    {}
  )

  return {
    ...data,
    ...singlePluralVersions,
  }
}

// module.exports = getMetadata

// Filename: ./app/utils/getMetadata/index.js
// module.exports = require('./getMetadata')

// Filename: ./app/utils/getObject/getObject.js
// const prop = require('dot-prop')

function getObject(keyValueEntries) {
  let result = {}
  keyValueEntries.forEach(([key, value]) => {
    const arrayRegex = /([\w\.]+)\[(\d)*\]/
    const keySections = key.match(arrayRegex)

    if (keySections) {
      const index = Number.parseInt(keySections[2])
      const keyName = keySections[1]

      if (!prop.has(result, keyName)) {
        prop.set(result, keyName, [])
      }

      const currentVal = prop.get(result, keyName)

      if (Number.isInteger(index)) {
        currentVal[index] = value
      } else {
        currentVal.push(value)
      }
      prop.set(result, keyName, currentVal)
    } else {
      prop.set(result, key, value)
    }
  })
  return result
}

// Filename: ./app/utils/getObject/index.js
// module.exports = require('./getObject')

// Filename: ./app/utils/getParsedKeyValues/getParsedKeyValues.js
function getParsedKeyValues(keyValues = []) {
  return keyValues.map((keyVal) => keyVal.split('=', 2))
}

// Filename: ./app/utils/getParsedKeyValues/index.js
// module.exports = require('./getParsedKeyValues')

// Filename: ./app/utils/getTemplateArgs/getTemplateArgs.js
function getTemplateArgs(argv = []) {
  return argv.filter((arg) => !arg.startsWith('--'))
}

// Filename: ./app/utils/getTemplateArgs/index.js
// module.exports = require('./getTemplateArgs')

// Filename: ./app/utils/getTemplateData/getTemplateData.js
// const pipe = require('../pipe')
// const getParsedKeyValues = require('../getParsedKeyValues')
// const getTemplateArgs = require('../getTemplateArgs')
// const getObject = require('../getObject')

function getTemplateData(args) {
  return pipe(args, getTemplateArgs, getParsedKeyValues, getObject)
}

// Filename: ./app/utils/getTemplateData/index.js
// module.exports = require('./getTemplateData')

// Filename: ./app/utils/log/index.js
// module.exports = require('./log')

// Filename: ./app/utils/log/log.js
let queue = []

function log(...value) {
  queue = [...queue, ...value]

  return queue
}

log.info = function (value) {
  queue = [...queue, `ℹ️ ${value}`]
}

log.warning = function (value) {
  queue = [...queue, `⚠️ ${value}`]
}

log.success = function (value) {
  queue = [...queue, `✅ ${value}`]
}

log.error = function (value) {
  // throw new Error(`❌ ${value}`)
  console.error(`❌ ${value}`)

  return `❌ ${value}`
}

log.output = function () {
  if (process.env.NODE_ENV !== 'test') {
    console.log(queue.join('\n'))
  }
  return queue.join('\n')
}

log.clear = function () {
  queue = []
}

// module.exports = log

// Filename: ./app/utils/pipe/index.js
// module.exports = require('./pipe')

// Filename: ./app/utils/pipe/pipe.js
function pipe(value, ...fns) {
  return fns.reduce((accum, fn) => fn(accum), value)
}

// Filename: ./app/utils/set-value.js
// const prop = require('dot-prop')

// Sets a property on an object based on a string
// Accepted Keys:
// - propName
// - propName.nestedProp
// - propName.nestedProp[indexNumber]
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

// module.exports = setValue
module.exports = {
  getTemplateData,
  getAbsolutePaths,
  getMetadata,
  getObject,
  getParsedKeyValues,
  getTemplateArgs,
  getTemplateData,
  log,
  pipe,
  setValue,
}
