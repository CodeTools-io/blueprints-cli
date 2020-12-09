const App = require('../../app')

const {
  PROJECT_BLUEPRINTS_PATH,
  GLOBAL_BLUEPRINTS_PATH,
} = require('../../config')

module.exports = async function list(namespace = '') {
  const app = new App({
    globalPath: GLOBAL_BLUEPRINTS_PATH,
    projectPath: PROJECT_BLUEPRINTS_PATH,
  })
  const blueprints = await app.getAllBlueprints(namespace)

  console.log(`--- Global Blueprints ---`)
  if (blueprints.global && blueprints.global.length) {
    blueprints.global.forEach((blueprint) => {
      console.log(`${blueprint.name} - ${blueprint.location}`)
    })
  } else {
    console.log(`no global blueprints found`)
  }

  console.log(`\n--- Project Blueprints ---`)
  if (blueprints.project && blueprints.project.length) {
    blueprints.project.forEach((blueprint) => {
      console.log(`${blueprint.name} - ${blueprint.location}`)
    })
  } else {
    console.log(`no project blueprints found`)
  }
}
