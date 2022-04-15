const fs = require('fs-extra')
const { some } = require('lodash')

class File {
  constructor (absolutePath, options = {}) {
    this.path = absolutePath
    this.operations = []
    this.options = { encoding: 'utf8', ...options }
    this.content = fs.readFile(absolutePath, this.options)
  }

  registerOperation (fn) {
    this.operations.push({ fn })

    return this
  }

  apply () {
    return this.content
      .then(content => {
        return this.operations.reduce(
          (accum, operation) => {
            return operation.fn(accum)
          },
          [content]
        )
      })
      .then(content => {
        this.operations = []
        this.content = content
        return this
      })
  }

  save () {
    return fs.writeFile(this.path, this.content, this.options)
  }

  ensureText (value) {
    return this.registerOperation(currentValue => {
      const hasText = some(currentValue, lineOfText =>
        lineOfText.includes(value)
      )

      if (!hasText) {
        return `${currentValue}\n${value}`
      }

      return `${currentValue}`
    })
  }

  appendText (value) {
    return this.registerOperation(currentValue => {
      return `${currentValue}${value}`
    })
  }

  prependText (value) {
    return this.registerOperation(currentValue => {
      return `${value}${currentValue}`
    })
  }

  replaceText (searchTerm, replacement) {
    return this.registerOperation(currentValue => {
      return currentValue.replace(searchTerm, replacement)
    })
  }
}

module.exports = File
