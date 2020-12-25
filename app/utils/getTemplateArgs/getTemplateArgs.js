module.exports = function getTemplateArgs(argv = []) {
  return argv.filter((arg) => !arg.startsWith('--'))
}
