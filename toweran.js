'use strict'

//TODO: Global NS, contracts, exceptions, must. Make sure everything is here and remove the todo

const path = require('path')

/**
 * Toweran namespace
 * @type {{}}
 */
global.toweran = {}


toweran.FRAMEWORK_PATH = path.resolve(__dirname)
const FRAMEWORK_PATH = toweran.FRAMEWORK_PATH

/**
 * Exceptions
 */
toweran.InvalidArgumentException = require(FRAMEWORK_PATH + '/lib/exceptions/InvalidArgumentException')

/**
 * Object that helps to validate
 * @type {Must}
 */
toweran.must = new (require(FRAMEWORK_PATH + '/lib/Must'))
