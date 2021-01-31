const getAbsolutePaths = require('./getAbsolutePaths')
const path = require('path')

describe('getAbsolutePaths', () => {
  test('can get absolute paths', async () => {
    const result = await getAbsolutePaths('test/*', {
      cwd: path.resolve(__dirname),
      expandDirectories: true,
    })

    expect(result[0]).toContain('app/utils/getAbsolutePaths/test/example.txt')
  })
})
