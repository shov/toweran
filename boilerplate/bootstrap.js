'use strict'

const path = require('path')

global.toweran = require('../toweran')
toweran.APP_PATH = __dirname

if (process.env.env !== 'testing') {
  Object.freeze(toweran)
}

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
const logsDir = path.resolve(toweran.APP_PATH + '/logs')

/**
 * @type {LoggerInterface}
 */
const logger = new toweran.Logger(logsDir)

/**
 * @type {App}
 */
const app = new toweran.App(logger)

module.exports = app