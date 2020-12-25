const prop = require('dot-prop')

module.exports = function getObject(keyValueEntries) {
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
