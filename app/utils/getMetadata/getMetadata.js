const inflection = require('inflection')

function getMetadata ({ blueprintInstance, blueprint }) {
  const standardBlueprintInstance = blueprintInstance.replace(/-/gi, '_')
  let data = {}
  data['blueprint'] = blueprint
  data['blueprintInstance'] = blueprintInstance
  data['blueprintInstance_ClassFormat'] = inflection.classify(
    standardBlueprintInstance
  )
  data['blueprintInstance_dashed-format'] = inflection
    .transform(standardBlueprintInstance, ['underscore', 'dasherize'])
    .toLowerCase()
  data['blueprintInstance_DashedFormat'] = inflection
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
          [`${key}_plural`]: inflection.pluralize(value).toUpperCase(),
          [`${key}_singular`]: inflection.singularize(value).toUpperCase()
        }
      }
      return {
        ...accum,
        [`${key}_plural`]: inflection.pluralize(value),
        [`${key}_singular`]: inflection.singularize(value)
      }
    },
    {}
  )

  return {
    ...data,
    ...singlePluralVersions
  }
}

module.exports = getMetadata
