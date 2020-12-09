module.exports = function help() {
  console.log('')
  console.group(
    'Pipes:\n',
    'ClassFormat (ex. ComponentName)\n',
    'DashedFormat (ex. component-name)\n',
    'CamelCaseFormat (ex. componentName)\n',
    'PascalCaseFormat (ex. ComponentName)\n',
    'SlugFormat (ex. component-name)\n',
    'ConstantFormat (ex. COMPONENT_NAME)\n'
  )
}
