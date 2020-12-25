const pipe = require('../pipe')
const getParsedKeyValues = require('../getParsedKeyValues')
const getTemplateArgs = require('../getTemplateArgs')
const getObject = require('../getObject')

module.exports = function getTemplateData(args) {
  return pipe(args, getTemplateArgs, getParsedKeyValues, getObject)
}
