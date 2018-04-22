const fs = require('fs-extra')

const { GLOBAL_CONFIG_PATH } = require('../config')

class App {
  constructor() {
    this.loadConfig()
  }
  loadConfig() {
    let globalConfig = this.loadGlobalConfig()

    this.settings = globalConfig
  }
  loadGlobalConfig() {
    return fs.readJsonSync(GLOBAL_CONFIG_PATH)
  }
}

module.exports = App
