const app = require('./app')
const fs = require('fs-extra')
async function run(userInput) {
  const args = userInput.split(' ')
  const [commandName] = args

  await app.parseAsync(['node', 'bp', ...args])

  return app.commands.find((c) => c.name() === commandName)
}
beforeEach(async () => {
  await fs.mkdirp('test_output')
})
afterEach(async () => {
  await fs.remove('test_output')
})
describe('app', () => {
  describe('list', () => {
    test('can list blueprints', async () => {
      const { output } = await run('list')

      expect(output).toContain('--- Global Blueprints ---')
      expect(output).toContain('--- Project Blueprints ---')
      expect(output).toContain('action - ')
      expect(output).toContain('example - ')
      expect(output).toContain('util - ')
    })
  })

  describe('generate', () => {
    test('can show status', async () => {
      const { output } = await run('generate mockA mockAInstance')

      expect(output).toEqual(
        'Generated mockAInstance based on the mockA blueprint'
      )
    })

    test('can create files', async () => {
      const { output } = await run('generate mockB Allie')

      const blueprintInstanceFound = await fs.pathExists(`test_output/mockB`)

      expect(blueprintInstanceFound).toBeTruthy()
    })

    test('can rename filename variables', async () => {
      const { output } = await run('generate mockA Benjamin')

      const blueprintInstanceFound = await fs.pathExists(
        `test_output/Benjamin/Benjamin.txt`
      )

      expect(blueprintInstanceFound).toBeTruthy()
    })

    test('can inject data into templates', async () => {
      const { output } = await run('generate mockA Madilyn')

      const blueprintInstanceFound = await fs.pathExists(
        `test_output/Madilyn/Madilyn.txt`
      )

      expect(blueprintInstanceFound).toBeTruthy()
    })

    test('can inject data into templates', async () => {
      const { output } = await run('generate mockA Isaiah')

      const fileContent = await fs.readFile(`test_output/Isaiah/Isaiah.txt`, {
        encoding: 'utf8',
      })

      expect(fileContent).toEqual('Isaiah content')
    })
  })
})
