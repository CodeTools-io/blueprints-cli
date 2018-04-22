const { expect } = require('chai')
const App = require('../../lib/app')

describe('App', function() {
  it('can load global config', function() {
    const app = new App()

    expect(app.settings.environment).to.eql('testGlobalConfig')
  })
  it.skip('can load project config')
  it.skip('can merge project config into global config')
  it.skip('can generate global blueprints')
  it.skip('can generate from project blueprints')
  it.skip('can replace blueprint template variables')
  it.skip('can rename files and directories')
})
