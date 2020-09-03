'use strict'

const path = require('path')

global.toweran = require('../toweran')
toweran.APP_PATH = __dirname

/**
 * DotEnv config
 */
require('dotenv').config({
  path: path.join(toweran.APP_PATH + '/.env'),
})

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