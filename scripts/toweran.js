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
const chalk = require('chalk')

const symbol = {
  v: '✓',
  i: 'i',
  x: '✗'
}

const moduleDir = path.resolve(__dirname + '/..')

try {

  //Process the input
  const [, , ...incomingArgs] = process.argv

  /**
   * Set options
   */
  const opts = {
    ciFixtures: false,
    skipEnv: false,
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
        console.log(val)
        console.log(`-> ${argToOption(val)}`)
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
    throw new Error(chalk`{red ${symbol.x}} Unknown action, run: \n\t$ npx toweran --help\nto get more information`)
  }

  //Choose the action
  switch (args[0]) {
    case 'create-project':
      action = createProject
      console.info(chalk`{green ${symbol.v}} Creating a project...`)
      break

    default:
      throw new Error(chalk`{red ${symbol.x}} create-project is only one supported action for now! \n\t$ npx toweran create-project [project path]`)
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
  //TODO fix the path @url https://trello.com/c/28jFSc5x/69-support-create-project-from-and
  const projectDir = path.resolve(`${process.cwd()}/${targetPath}`)

  try {
    fs.ensureDirSync(projectDir, 0o2775)
  } catch (e) {
    throw new Error(chalk`{red ${symbol.x}} Given path '${projectDir}' exists and is not a directory!`)
  }

  console.info(chalk`{green ${symbol.v}} The path is good-to-go: ${projectDir}`)

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

  if (!this.opts.skipEnv) {
    console.info(chalk`{yellow ${symbol.i}} skip .env`)
    fs.copySync(`${moduleDir}/boilerplate/.env-example`, `${projectDir}/.env`)
  }

  console.info(chalk`{green ${symbol.v}} The boilerplate has been copied`)

  const gitKeepExpression = new RegExp(`${projectDir}\/(${targetDirs.join('|')})\/(.*\/)?\.gitkeep$`, 'i')

  glob.sync(`${projectDir}/**/.gitkeep`).forEach(file => {
    if (gitKeepExpression.test(file)) {
      fs.removeSync(file)
    }
  })

  console.info(chalk`{green ${symbol.v}} Clean up is done`)

  let bootstrapFileContent = fs.readFileSync(`${projectDir}/bootstrap.js`, 'utf-8')
  bootstrapFileContent = bootstrapFileContent.replace(`require('../toweran')`, `require('toweran')`)
  fs.writeFileSync(`${projectDir}/bootstrap.js`, bootstrapFileContent, 'utf8')

  console.info(chalk`{green ${symbol.v}} Toweran dependence set as an module`)

  if (fs.existsSync(`${projectDir}/package.json`)) {
    console.info(chalk`{yellow ${symbol.i}} package.json has been detected`)

    try {
      let packageJsonContent = fs.readFileSync(`${projectDir}/package.json`, 'utf-8')
      packageJsonContent = JSON.parse(packageJsonContent)
      packageJsonContent.jest = {
        "testRegex": ".*Test.js$",
        "roots": ["tests"]
      }

      if (!packageJsonContent.scripts) {
        packageJsonContent.scripts = {}
      }

      packageJsonContent.scripts.test = "jest -i --forceExit"
      packageJsonContent.scripts.start = "node index.js"

      let modulePackageJson = fs.readFileSync(`${moduleDir}/package.json`, 'utf-8')
      modulePackageJson = JSON.parse(modulePackageJson)

      //Push dependencies manually for ci test environment
      if (this.opts.ciFixtures) {
        console.info(chalk`{yellow ${symbol.i}} CI fixtures are on`)

        packageJsonContent.dependencies = modulePackageJson.dependencies
        packageJsonContent.dependencies.toweran = 'file:/..'

      }

      //TODO: merge them @url https://trello.com/c/28jFSc5x/69-support-create-project-from-and
      packageJsonContent.devDependencies = modulePackageJson.devDependencies

      packageJsonContent = JSON.stringify(packageJsonContent, null, 2) + '\n'

      fs.writeFileSync(`${projectDir}/package.json`, packageJsonContent, 'utf-8')

      console.info(chalk`{green ${symbol.v}} package.json has been updated`)

    } catch (e) {
      console.warn(chalk`{orange ${symbol.x}} Can't update package.json, skip`)
    }
  }

  console.log(`🏰 Done`)
}

/**
 * Print the help
 */
function printHelp() {
  console.log(chalk`{yellow ${symbol.i}} To create a project structure from the boilerplate run:\n\t$ npx toweran create-project [project path]`)
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
