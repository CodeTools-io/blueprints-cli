const path = require('path')
const globby = require('globby')
const inflection = require('inflection')
const prop = require('dot-prop')

function getAbsolutePaths(glob, options) {
  return globby(glob, options).then((results) => {
    const cwd = options.cwd ? options.cwd : process.cwd()

    return results.map((result) => {
      return path.resolve(cwd, result)
    })
  })
}

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

function getParsedKeyValues(keyValues = []) {
  return keyValues.map((keyVal) => keyVal.split('=', 2))
}

function getTemplateArgs(argv = []) {
  return argv.filter((arg) => !arg.startsWith('--'))
}

function getTemplateData(args) {
  return pipe(args, getTemplateArgs, getParsedKeyValues, getObject)
}

class log {
  static queue = []

  static text(...value) {
    this.queue.push(...value)
  }

  static info(value) {
    this.queue.push(`ℹ️ ${value}`)
  }

  static warning(value) {
    this.queue.push(`⚠️ ${value}`)
  }

  static success(value) {
    this.queue.push(`✅ ${value}`)
  }

  static error(value) {
    // throw new Error(`❌ ${value}`)
    console.error(`❌ ${value}`)

    return `❌ ${value}`
  }

  static output() {
    if (process.env.NODE_ENV !== 'test') {
      console.log(this.queue.join('\n'))
    }
    return this.queue.join('\n')
  }

  static clear() {
    this.queue = []
  }
}

function pipe(value, ...fns) {
  return fns.reduce((accum, fn) => fn(accum), value)
}

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
