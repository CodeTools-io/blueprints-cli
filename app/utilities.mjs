import path from 'path'
import { globby } from 'globby'
import inflection from 'inflection'
import * as prop from 'dot-prop'
import treeify from 'treeify'

/**
 * Returns absolute paths for a given glob pattern.
 * @param {string} glob - The glob pattern.
 * @param {object} options - Options for globby.
 * @returns {Promise<string[]>} A promise that resolves to an array of absolute file paths.
 */
export function getAbsolutePaths(glob, options = {}) {
  return globby(glob, options).then((results) => {
    const cwd = options.cwd ? options.cwd : process.cwd()

    return results.map((result) => {
      return path.resolve(cwd, result)
    })
  })
}

/**
 * Generates metadata for a given blueprint instance and blueprint.
 * @param {object} param0 - Object containing blueprintInstance and blueprint.
 * @returns {object} An object containing metadata information.
 */
export function getMetadata({ blueprintInstance, blueprint, destination }) {
  const standardBlueprintInstance = blueprintInstance.replace(/-/gi, '_')
  let data = {}
  data['blueprint'] = blueprint
  data['blueprintInstance'] = blueprintInstance
  data['blueprintInstanceDestination'] = destination
  data['blueprintInstance_ClassFormat'] = inflection.classify(standardBlueprintInstance)
  data['blueprintInstance_DashedFormat'] = inflection
    .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
    .toLowerCase()
  data['blueprintInstance_SlugFormat'] = data['blueprintInstance_DashedFormat']
  data['blueprintInstance_CamelCaseFormat'] = inflection.camelize(standardBlueprintInstance, true)
  data['blueprintInstance_PascalCaseFormat'] = inflection.camelize(standardBlueprintInstance, false)
  data['blueprintInstance_ConstantFormat'] = inflection.underscore(standardBlueprintInstance, true)
  data['blueprintInstance_SnakeCaseFormat'] = inflection.underscore(standardBlueprintInstance, true)

  const singlePluralVersions = Object.entries(data)
    .filter(([key, value]) => {
      return key !== 'blueprintInstanceDestination'
    })
    .reduce((accum, [key, value]) => {
      const pluralizedText =
        key === 'blueprintInstance_ConstantFormat'
          ? inflection.pluralize(value).toUpperCase()
          : inflection.pluralize(value)
      const singularizedText =
        key === 'blueprintInstance_ConstantFormat'
          ? inflection.singularize(value).toUpperCase()
          : inflection.singularize(value)

      return {
        ...accum,
        [`${key}Pluralized`]: pluralizedText,
        [`${key}Singularized`]: singularizedText,
      }
    }, {})

  return {
    ...data,
    ...singlePluralVersions,
  }
}

/**
 * Converts an array of key-value pairs to an object.
 * @param {Array<Array<string>>} keyValueEntries - Array of key-value pairs.
 * @returns {object} Object formed from key-value pairs.
 */
export function getObject(keyValueEntries) {
  let result = {}
  keyValueEntries.forEach(([key, value]) => {
    const arrayRegex = /([\w\.]+)\[(\d)*\]/
    const keySections = key.match(arrayRegex)

    if (keySections) {
      const index = Number.parseInt(keySections[2])
      const keyName = keySections[1]

      if (!prop.hasProperty(result, keyName)) {
        prop.setProperty(result, keyName, [])
      }

      const currentVal = prop.getProperty(result, keyName)

      if (Number.isInteger(index)) {
        currentVal[index] = value
      } else {
        currentVal.push(value)
      }
      prop.setProperty(result, keyName, currentVal)
    } else {
      prop.setProperty(result, key, value)
    }
  })
  return result
}

/**
 * Parses key-value pairs from an array.
 * @param {string[]} keyValues - Array of key-value strings.
 * @returns {Array<Array<string>>} An array of key-value pairs.
 */
export function getParsedKeyValues(keyValues = []) {
  return keyValues.map((keyVal) => keyVal.split('=', 2))
}

/**
 * Filters template arguments from an array of arguments.
 * @param {string[]} argv - Array of arguments.
 * @returns {string[]} An array of template arguments.
 */
export function getTemplateArgs(argv = []) {
  return argv.filter((arg) => !arg.startsWith('--'))
}

/**
 * Constructs template data from arguments.
 * @param {string[]} args - Array of arguments.
 * @returns {object} Object constructed from the template data.
 */
export function getTemplateData(args) {
  return pipe(args, getTemplateArgs, getParsedKeyValues, getObject)
}

/**
 * Logging class with various levels of logging.
 */
export class log {
  static queue = []

  static text(...value) {
    this.queue.push(...value)
  }

  static table(value) {
    this.queue.push(treeify.asTree(value))
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

/**
 * Applies a series of functions to a value.
 * @param {*} value - The initial value.
 * @param  {...Function} fns - Functions to apply.
 * @returns {*} The result after applying the functions.
 */
export function pipe(value, ...fns) {
  return fns.reduce((accum, fn) => fn(accum), value)
}

/**
 * Sets a value in an object, potentially creating nested arrays.
 * @param {object} data - The object to modify.
 * @param {string} key - The key in the object.
 * @param {*} value - The value to set.
 * @returns {object} The modified object.
 */
export function setValue(data, key, value) {
  const arrayRegex = /([\w\.]+)\[(\d)*\]/
  const keySections = key.match(arrayRegex)
  if (keySections) {
    const index = Number.parseInt(keySections[2])
    const keyName = keySections[1]

    if (!prop.hasProperty(data, keyName)) {
      prop.setProperty(data, keyName, [])
    }

    const currentVal = prop.getProperty(data, keyName)

    if (Number.isInteger(index)) {
      currentVal[index] = value
    } else {
      currentVal.push(value)
    }
    prop.setProperty(data, keyName, currentVal)
  } else {
    prop.setProperty(data, key, value)
  }
  return data
}
