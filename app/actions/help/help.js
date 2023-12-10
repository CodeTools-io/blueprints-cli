const { log } = require('../../utilities')
module.exports = function help() {
  log.clear()
  log.text('')
  log.text(
    'Pipes:\n',
    'ClassFormat (ex. ComponentName)\n',
    'DashedFormat (ex. component-name)\n',
    'CamelCaseFormat (ex. componentName)\n',
    'PascalCaseFormat (ex. ComponentName)\n',
    'SlugFormat (ex. component-name)\n',
    'ConstantFormat (ex. COMPONENT_NAME)\n'
  )
  return log.output()
}
