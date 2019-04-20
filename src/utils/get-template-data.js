const setValue = require('./set-value')

function getTemplateData(args) {
  const rawData = args.filter(arg => !arg.startsWith('--'))

  return rawData.reduce((data, arg) => {
    const [key, value] = arg.split('=', 2)

    return setValue(data, key, value)
  }, {})
}

module.exports = getTemplateData
