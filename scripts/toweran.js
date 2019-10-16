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

  switch (true) {
    case !args[0]:
      throw new Error(`unknown action, run \n$ npx toweran --help\nto get more information`)

    case 'create-project' === args[0]:
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

    const gitKeepExpression = new RegExp(`${projectDir}\/(${targetDirs.join('|')})\/(.*\/)?\.gitkeep$`, 'i')

    glob.sync(`${projectDir}/**/.gitkeep`).forEach(file => {
      if (gitKeepExpression.test(file)) {
        fs.removeSync(file)
      }
    })
  })()

} catch (e) {
  console.error(e.message)
  process.exit(1)
}
