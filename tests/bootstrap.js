'use strict'

/**
 * Environment
 */
process.env.env = 'testing'
process.env.NODE_ENV = 'testing'

/*
 * Register global NS
 */
global.toweran = require('../toweran')

toweran.TEST_PATH = __dirname