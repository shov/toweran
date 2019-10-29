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

/**
 * Contracts: Interfaces & Basic classes
 */
toweran.LoggerInterface = require(FRAMEWORK_PATH + '/lib/contracts/LoggerInterface')
toweran.ContainerRegistrationInterface = require(FRAMEWORK_PATH + '/lib/contracts/ContainerRegistrationInterface')
toweran.ContainerInterface = require(FRAMEWORK_PATH + '/lib/contracts/ContainerInterface')

toweran.BasicServiceProvider = require(FRAMEWORK_PATH + '/lib/contracts/BasicServiceProvider')

/**
 * Core constructors
 */
toweran.Logger = require(FRAMEWORK_PATH + '/lib/Logger')
toweran.ContainerRegistration = require(FRAMEWORK_PATH + '/lib/ContainerRegistration')
toweran.Container = require(FRAMEWORK_PATH + '/lib/Container')
toweran.ConfigReader = require(FRAMEWORK_PATH + '/lib/ConfigReader')

/**
 * Core service providers
 */
toweran.DependencyInjectionServiceProvider = require(FRAMEWORK_PATH + '/lib/serviceProviders/DependencyInjectionServiceProvider')

/**
 * The App
 */
toweran.App = require(FRAMEWORK_PATH + '/lib/App')
