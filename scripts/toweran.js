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

const moduleDir = path.resolve(__dirname + '/..')

try {

  //Process the input
  const [, , ...incomingArgs] = process.argv

  /**
   * Set options
   */
  const opts = {
    travisFixtures: false
  }

  /**
   * Set arguments
   */
  const args = []

  incomingArgs.forEach(val => {
    switch (true) {

      case '--help' === val:
        printHelp()
        process.exit(0)
        break

      case /^--.+$/.test(val):
        opts[argToOption(val)] = true
        break

      default:
        args.push(val)
    }
  })

  /**
   * As a default
   * @type {function}
   */
  let action = printHelp

  //Process arguments
  if (!args[0]) {
    throw new Error(`Unknown action, run \n$ npx toweran --help\nto get more information`)
  }

  //Choose the action
  switch (args[0]) {
    case 'create-project':
      action = createProject
      break

    default:
      throw new Error(`create-project is only one supported action for now! \n$ npx toweran create-project [project path]`)
  }

  //Call the action
  const restOfArgs = args.slice(1, args.length)
  action.apply({opts}, restOfArgs)


} catch (e) {
  console.error(e.message)
  process.exit(1)
}

/**
 * Create project action, roll-out the boilerplate in the given path
 * @param {string} targetPath
 */
function createProject(targetPath = '') {
  //Paths
  const projectDir = path.resolve(`${process.cwd()}/${targetPath}`)

  try {
    fs.ensureDirSync(projectDir, 0o2775)
  } catch (e) {
    throw new Error(`Given path '${projectDir}' is exists and is not a directory!`)
  }


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
      if (this.opts.travisFixtures) {
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
}

/**
 * Print the help
 */
function printHelp() {
  console.log(`To create a project structure from the boilerplate run\n$ npx toweran create-project [project path]`)
}

/**
 * A helper to convert options to object keys
 * @param str
 * @return {string}
 */
function argToOption(str) {
  return str.replace(/^--(.*)$/, '$1').replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )
}
