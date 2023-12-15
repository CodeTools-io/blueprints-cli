import {
  getAbsolutePaths,
  getMetadata,
  getObject,
  getParsedKeyValues,
  getTemplateArgs,
  getTemplateData,
  log,
  pipe,
  setValue,
} from './utilities.mjs'
import path from 'path'
import { fileURLToPath } from 'url'
import { jest } from '@jest/globals'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

describe('Utilities', () => {
  describe('getAbsolutePaths', () => {
    test('can get absolute paths', async () => {
      const result = await getAbsolutePaths('test/*', {
        cwd: path.resolve(__dirname),
        expandDirectories: true,
      })

      expect(result[0]).toContain('app/test/example.txt')
    })
  })
  describe('getMetadata', () => {
    test('can get metadata', () => {
      const result = getMetadata({
        blueprint: 'Component',
        blueprintInstance: 'Button',
        destination: 'someLocation'
      })

      expect(result).toMatchSnapshot()
    })
  })
  describe('getObject', () => {
    test('can parse standard keys', () => {
      const result = getObject([['title', 'working']])

      expect(result).toEqual({ title: 'working' })
    })

    test('can parse property keys', () => {
      const result = getObject([['info.name', 'Cliff']])

      expect(result).toEqual({ info: { name: 'Cliff' } })
    })

    test('can parse array indexes', () => {
      const result = getObject([
        ['colors[0]', 'blue'],
        ['colors[1]', 'red'],
      ])

      expect(result).toEqual({ colors: ['blue', 'red'] })
    })
  })
  describe('getParsedKeyValues', () => {
    test('can parse key values', () => {
      const result = getParsedKeyValues(['something=working'])

      expect(result).toEqual([['something', 'working']])
    })
  })
  describe('getTemplateArgs', () => {
    test('can get template args', () => {
      const result = getTemplateArgs([
        '--global',
        '--check="working"',
        'title="working"',
        'toggleSomething',
        'description=yep',
      ])

      expect(result).toEqual([
        'title="working"',
        'toggleSomething',
        'description=yep',
      ])
    })
  })
  describe('getTemplateData', () => {
    test('can get data', () => {
      const result = getTemplateData(['title=working'])

      expect(result).toEqual({ title: 'working' })
    })
  })
  describe('log', () => {
    const original = console.error

    beforeEach(() => {
      console.error = jest.fn()
    })

    afterEach(() => {
      console.error = original
    })

    test('can log standard output', () => {
      log.clear()
      log.text('first')
      log.text('second')
      log.text('third')
      const result = log.output()

      expect(result).toMatchSnapshot()
    })

    test('can log warning output', () => {
      log.clear()
      log.warning('first warning')
      log.warning('second warning')
      log.warning('third warning')
      const result = log.output()

      expect(result).toMatchSnapshot()
    })

    test('can log error output', () => {
      log.error('first error')
      expect(console.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('pipe', () => {
    test('can pipe data through functions', () => {
      const data = ['red', 'white', 'blue']
      const capitalize = (args) => args.map((arg) => arg.toUpperCase())
      const appendUnderscore = (args) => args.map((arg) => `${arg}_`)
      const prependUnderscore = (args) => args.map((arg) => `_${arg}`)
      const result = pipe(data, capitalize, appendUnderscore, prependUnderscore)

      expect(result).toEqual(['_RED_', '_WHITE_', '_BLUE_'])
    })
  })

  describe('setValue', () => {
    test('can set value', () => {
      const result = setValue({}, 'levelOne', true)

      expect(result).toMatchInlineSnapshot(`
        {
          "levelOne": true,
        }
      `)
    })

    test('can set nested object value', () => {
      const result = setValue({}, 'levelOne.levelTwo', true)

      expect(result).toMatchInlineSnapshot(`
        {
          "levelOne": {
            "levelTwo": true,
          },
        }
      `)
    })

    test('can set array values', () => {
      const result = setValue(
        {
          levelOne: {
            levelTwo: ['correctValue', 'wrongValue'],
          },
        },
        'levelOne.levelTwo[1]',
        'correctValue'
      )

      expect(result).toMatchInlineSnapshot(`
        {
          "levelOne": {
            "levelTwo": [
              "correctValue",
              "correctValue",
            ],
          },
        }
      `)
    })
  })
})
