const os = require('os')
const path = require('path')

const { expect } = require('chai')

const App = require('../../lib/App')

describe('App', function() {
  it('can load config', function() {
    const app = new App()
    const HOME_BLUEPRINTS_DIR = path.resolve(os.homedir(), './.blueprints')
    expect(app.settings).to.be.an('object')
    expect(app.settings).to.have.property('globalBlueprintsPath')
    expect(app.settings.globalBlueprintsPath).to.eql(HOME_BLUEPRINTS_DIR)
    expect(app.settings).to.have.property('projectBlueprintsPath')
  })
})
