const app = require('./app')

async function run(commandName) {
  const result = await app.parseAsync(['node', 'bp', commandName])

  return app.commands.find((c) => c.name() === commandName)
}

describe('app', () => {
  test('can list blueprints', async () => {
    const { output } = await run('list')

    expect(output).toContain('--- Global Blueprints ---')
    expect(output).toContain('--- Project Blueprints ---')
    expect(output).toContain('action - ')
    expect(output).toContain('example - ')
    expect(output).toContain('util - ')
  })
})
