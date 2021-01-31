const path = require('path')
const globby = require('globby')

module.exports = function getAbsolutePaths(glob, options) {
  return globby(glob, options).then((results) => {
    const cwd = options.cwd ? options.cwd : process.cwd()

    return results.map((result) => {
      return path.resolve(cwd, result)
    })
  })
}
