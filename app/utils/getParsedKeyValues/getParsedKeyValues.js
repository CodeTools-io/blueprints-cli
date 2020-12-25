module.exports = function getParsedKeyValues(keyValues = []) {
  return keyValues.map((keyVal) => keyVal.split('=', 2))
}
