#!/usr/bin/env node

/**
 * The script of rolling out the boilerplate
 * start new project from
 * npm i toweran && npx toweran create-project .
 */

//Dependencies
const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

try {

  //Process arguments
  const [, , ...args] = process.argv
  const options = {}

  switch (true) {
    case !args[0]:
      throw new Error(`unknown action, run \n$ npx toweran --help\nto get more information`)

    case 'create-project' === args[0]:

      if ('--travis-fixtures' === args[2]) {
        options.travisFixtures = true
      }

      break
    case '--help' === args[0]:
      console.log(`To create a project structure from the boilerplate run\n$ npx toweran create-project [project path]`)
      process.exit(0)
      break

    default:
      throw new Error(`create-project is only one supported action for now! \n$ npx toweran create-project [project path]`)
  }

  args[1] = args[1] || ''


  //Paths
  const projectDir = path.resolve(`${process.cwd()}/${args[1]}`)

  try {
    fs.ensureDirSync(projectDir, 0o2775)
  } catch (e) {
    throw new Error(`Given path '${projectDir}' is exists and is not a directory!`)
  }

  const moduleDir = path.resolve(__dirname + '/..')

    //Copy boilerplate
  ;(() => {
    const targetDirs = []

    glob.sync(`${moduleDir}/boilerplate/*`).forEach(file => {
      const fileName = file.replace(/(.*)\/boilerplate\/([^\/]*)$/i, '$2')

      if (fs.lstatSync(file).isDirectory()) {
        targetDirs.push(fileName)
      }

      fs.copySync(file, `${projectDir}/${fileName}`)
    })

    fs.copySync(`${moduleDir}/boilerplate/.gitignore.content`, `${projectDir}/.gitignore`)

    fs.copySync(`${moduleDir}/boilerplate/.env-example`, `${projectDir}/.env-example`)
    fs.copySync(`${moduleDir}/boilerplate/.env-example`, `${projectDir}/.env`)

    const gitKeepExpression = new RegExp(`${projectDir}\/(${targetDirs.join('|')})\/(.*\/)?\.gitkeep$`, 'i')

    glob.sync(`${projectDir}/**/.gitkeep`).forEach(file => {
      if (gitKeepExpression.test(file)) {
        fs.removeSync(file)
      }
    })

    let bootstrapFileContent = fs.readFileSync(`${projectDir}/bootstrap.js`, 'utf-8')
    bootstrapFileContent = bootstrapFileContent.replace(`require('../toweran')`, `require('toweran')`)
    fs.writeFileSync(`${projectDir}/bootstrap.js`, bootstrapFileContent, 'utf8')

    if (fs.existsSync(`${projectDir}/package.json`)) {
      try {
        let packageJsonContent = fs.readFileSync(`${projectDir}/package.json`, 'utf-8')
        packageJsonContent = JSON.parse(packageJsonContent)
        packageJsonContent.jest = {
          "testRegex": "/tests/.*Test.js$",
          "rootDir": "."
        }

        if (!packageJsonContent.scripts) {
          packageJsonContent.scripts = {}
        }

        packageJsonContent.scripts.test = "jest --runInBand"

        //Push dependencies manually for travis test environment
        if(options.travisFixtures) {
          let modulePackageJson = fs.readFileSync(`${moduleDir}/package.json`, 'utf-8')
          modulePackageJson = JSON.parse(modulePackageJson)

          packageJsonContent.dependencies = modulePackageJson.dependencies
          packageJsonContent.dependencies.toweran = 'file:/..'

          packageJsonContent.devDependencies = modulePackageJson.devDependencies
        }

        packageJsonContent = JSON.stringify(packageJsonContent, null, 2) + '\n'

        fs.writeFileSync(`${projectDir}/package.json`, packageJsonContent, 'utf-8')

      } catch (e) {
        console.warn(`x package.json is found, but can't update!`)
      }
    }

    console.log(`🏰 Done`)
  })()

} catch (e) {
  console.error(e.message)
  process.exit(1)
}
