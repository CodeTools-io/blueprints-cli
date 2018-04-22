const { expect } = require('chai')
const App = require('../../lib/app')

describe('App', function() {
  it('can load config', function() {
    const app = new App()
    expect(app.settings).to.be.an('object')
    expect(app.settings).to.be.include({
      blueprintsDirectory: '.blueprints'
    })
  })
  it.skip('can generate global blueprints')
  it.skip('can generate from project blueprints')
  it.skip('can replace blueprint template variables')
  it.skip('can rename files and directories')
})
