const path = require('path')
const fs = require('fs-extra')

const Blueprint = require('./lib/blueprint')

class App {
  constructor({ globalPath, projectPath }) {
    this.projectPath = projectPath
    this.globalPath = globalPath
  }
}

module.exports = App
