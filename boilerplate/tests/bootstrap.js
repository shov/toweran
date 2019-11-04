'use strict'

/**
 * Environment
 */
process.env.env = 'testing'
process.env.NODE_ENV = 'testing'

const app = require('../bootstrap')

toweran.TEST_PATH = __dirname

/**
 * Prevent the application to be started in the testing mode
 */
const preventStart = function () {
  throw new Error(`Mustn't be started in the testing mode!`)
}

app.start = preventStart.bind(app)

module.exports = app
