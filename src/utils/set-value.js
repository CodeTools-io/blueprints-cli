const prop = require('dot-prop')

// Sets a property on an object based on a string
// Accepted Keys:
// - propName
// - propName.nestedProp
// - propName.nestedProp[indexNumber]
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

module.exports = setValue
