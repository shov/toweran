'use strict'

//TODO: Global NS, contracts, exceptions, must. Make sure everything is here and remove the todo
//TODO: make PATH constants immutable if not testing env
const path = require('path')

/**
 * Toweran namespace
 * @type {{}}
 */
global.toweran = {}


toweran.FRAMEWORK_PATH = path.resolve(__dirname)
const FRAMEWORK_PATH = toweran.FRAMEWORK_PATH

/**
 * Constants
 */
toweran.C = require(FRAMEWORK_PATH + '/lib/constants')

/**
 * Exceptions
 */
toweran.InvalidArgumentException = require(FRAMEWORK_PATH + '/lib/exceptions/InvalidArgumentException')
toweran.ResourceNotFoundException = require(FRAMEWORK_PATH + '/lib/exceptions/ResourceNotFoundException')

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
toweran.ListenerInterface = require(FRAMEWORK_PATH + '/lib/contracts/ListenerInterface')

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
toweran.HelperServiceProvider = require(FRAMEWORK_PATH + '/lib/serviceProviders/HelperServiceProvider')
toweran.DependencyInjectionServiceProvider = require(FRAMEWORK_PATH + '/lib/serviceProviders/DependencyInjectionServiceProvider')
toweran.EventServiceProvider = require(FRAMEWORK_PATH + '/lib/serviceProviders/EventServiceProvider')

/**
 * The App
 */
toweran.App = require(FRAMEWORK_PATH + '/lib/App')
