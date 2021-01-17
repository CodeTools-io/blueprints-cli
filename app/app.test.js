const app = require('./app')
const fs = require('fs-extra')
const fsp = require('fs-extra').promises
const os = require('os')
const path = require('path')

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
  await fs.remove('.blueprints/OneIMade')
  await fs.remove('test_output')
})
describe('app', () => {
  describe('list', () => {
    test('can show global blueprints', async () => {
      const { output } = await run('list')
      const globalPath = path.resolve(os.homedir(), './.blueprints')
      const directoryContents = await fsp.readdir(globalPath, {
        withFileTypes: true,
      })
      const allBlueprintsFound = directoryContents.every((directoryContent) => {
        if (directoryContent.isFile()) {
          return true
        }
        const blueprintPath = path.resolve(globalPath, directoryContent.name)

        return output.includes(`${directoryContent.name} - ${blueprintPath}`)
      })

      expect(allBlueprintsFound).toBeTruthy()
    })

    test('can show project blueprints', async () => {
      const { output } = await run('list')
      const globalPath = path.resolve('./.blueprints')
      const directoryContents = await fsp.readdir(globalPath, {
        withFileTypes: true,
      })
      const allBlueprintsFound = directoryContents.every((directoryContent) => {
        if (directoryContent.isFile()) {
          return true
        }
        const blueprintPath = path.resolve(globalPath, directoryContent.name)

        return output.includes(`${directoryContent.name} - ${blueprintPath}`)
      })

      expect(allBlueprintsFound).toBeTruthy()
    })
  })

  describe('generate', () => {
    test('can show generation status', async () => {
      const { output } = await run('generate mockA mockAInstance')

      expect(output).toContain(`✅ executed preGenerate hook`)
      expect(output).toContain(`✅ created instance`)
      expect(output).toContain(`✅ executed postGenerate hook`)
    })

    test('can create blueprint instances', async () => {
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

      const fileContent = await fs.readFile(`test_output/Madilyn/Madilyn.txt`, {
        encoding: 'utf8',
      })

      expect(fileContent).toEqual('Madilyn content')
    })
  })

  describe('new', () => {
    test('can show creation status', async () => {
      const { output } = await run('new OneIMade')

      expect(output).toEqual(
        `OneIMade was created at ${process.cwd()}/.blueprints/OneIMade`
      )
    })

    test('can create blank blueprints', async () => {
      const { output } = await run('new OneIMade')
      const foundBlueprintFile = await fs.pathExists(
        '.blueprints/OneIMade/blueprint.json'
      )

      expect(foundBlueprintFile).toEqual(true)
    })

    test('can detect existing blueprints', async () => {
      await run('new OneIMade')
      const { output } = await run('new OneIMade')

      expect(output).toEqual('A blueprint named OneIMade already exists')
    })
  })
})
