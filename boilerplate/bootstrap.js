'use strict'

const path = require('path')
const fs = require('fs-extra')

global.toweran = require('../toweran')
toweran.APP_PATH = __dirname

/**
 * Environment
 *  - can be loaded from .env file if it exists (Higher priority)
 *  - can be provided by the OS environment, control panel of serverless solutions
 */
const dotEnvSrc = path.join(toweran.APP_PATH + '/.env')
try {
  if (fs.lstatSync(dotEnvSrc).isFile()) {
    fs.accessSync(dotEnvSrc, fs.constants.R_OK) //throws
    require('dotenv').config({
      path: dotEnvSrc,
    })
  }
} catch (e) {
  //OS env is used only.
  //Since we have no logger initialized,
  //we will involves console output to info.
  //TODO: TBD
  console.info(`.env is not readable, so OS env is used only. (OK for serverless solutions)`)
}

/**
 * A directory where the logs are going to be stored
 * @type {string}
 */
const logsDir = path.resolve(process.env.LOGS_ABS_PATH || `${toweran.APP_PATH}${process.env.LOGS_PATH || '/logs'}`)

/**
 * @type {LoggerInterface}
 */
const logger = new toweran.Logger(logsDir, process.env.THREAD_NAME)

/**
 * @type {App}
 */
const app = new toweran.App(logger)

module.exports = app