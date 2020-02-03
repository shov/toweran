'use strict'

//TODO: Global NS, contracts, exceptions, must. Make sure everything is here and remove the todo
//TODO: make PATH constants immutable if not testing env

const FRAMEWORK_PATH = __dirname
let must = null

/**
 * @property {string} FRAMEWORK_PATH - Path to the framework root
 * @property {Object} C - Constants
 * @property {Must} must - Object that helps to validate
 *
 * @property {App} App - The application constructor
 *
 * @property {InvalidArgumentException} InvalidArgumentException - Constructor
 * @property {ResourceNotFoundException} ResourceNotFoundException - Constructor
 *
 * @property {ContainerInterface} ContainerInterface - Interface
 * @property {ListenerInterface} ListenerInterface - Interface
 * @property {ContainerRegistrationInterface} ContainerRegistrationInterface - Interface
 * @property {LoggerInterface} LoggerInterface - Interface
 *
 * @property {BasicServiceProvider} BasicServiceProvider - Constructor
 *
 * @property {HelperServiceProvider} HelperServiceProvider - Constructor
 * @property {ConfigReader} ConfigReader - Constructor
 * @property {DependencyInjectionServiceProvider} DependencyInjectionServiceProvider - Constructor
 * @property {Logger} Logger - Constructor
 * @property {EventServiceProvider} EventServiceProvider - Constructor
 * @property {Container} Container - Constructor
 * @property {ContainerRegistration} ContainerRegistration - Constructor
 *
 * @type {{
 *   FRAMEWORK_PATH: string,
 *   App: App,
 *   C: {},
 *   must: Must,
 *   HelperServiceProvider: HelperServiceProvider,
 *   ConfigReader: ConfigReader,
 *   DependencyInjectionServiceProvider: DependencyInjectionServiceProvider,
 *   ListenerInterface: ListenerInterface,
 *   Logger: Logger,
 *   ContainerRegistrationInterface: ContainerRegistrationInterface,
 *   BasicServiceProvider: BasicServiceProvider,
 *   EventServiceProvider: EventServiceProvider,
 *   Container: Container,
 *   InvalidArgumentException: InvalidArgumentException,
 *   ContainerInterface: ContainerInterface,
 *   ResourceNotFoundException: ResourceNotFoundException,
 *   LoggerInterface: LoggerInterface,
 *   ContainerRegistration: ContainerRegistration
 * }}
 */
const toweran = {
  /**
   * Path to the framework root.
   * @type {string}
   */
  FRAMEWORK_PATH,

  /**
   * Constants
   */
  get C() {
    return require(FRAMEWORK_PATH + '/lib/constants')
  },

  /**
   * Object that helps to validate
   * @return {Must}
   */
  get must() {
    if (!must) {
      must = new (require(FRAMEWORK_PATH + '/lib/Must'))
    }
    return must
  },

  /**
   * @return {InvalidArgumentException}
   * @constructor
   */
  get InvalidArgumentException() {
    return require(FRAMEWORK_PATH + '/lib/exceptions/InvalidArgumentException')
  },

  /**
   * @return {ResourceNotFoundException}
   * @constructor
   */
  get ResourceNotFoundException() {
    return require(FRAMEWORK_PATH + '/lib/exceptions/ResourceNotFoundException')
  },

  /**
   * @return {LoggerInterface}
   * @constructor
   */
  get LoggerInterface() {
    return require(FRAMEWORK_PATH + '/lib/contracts/LoggerInterface')
  },

  /**
   * @return {ContainerRegistrationInterface}
   * @constructor
   */
  get ContainerRegistrationInterface() {
    return require(FRAMEWORK_PATH + '/lib/contracts/ContainerRegistrationInterface')
  },

  /**
   * @return {ContainerInterface}
   * @constructor
   */
  get ContainerInterface() {
    return require(FRAMEWORK_PATH + '/lib/contracts/ContainerInterface')
  },

  /**
   * @return {ListenerInterface}
   * @constructor
   */
  get ListenerInterface() {
    return require(FRAMEWORK_PATH + '/lib/contracts/ListenerInterface')
  },

  /**
   * @return {BasicServiceProvider}
   * @constructor
   */
  get BasicServiceProvider() {
    return require(FRAMEWORK_PATH + '/lib/contracts/BasicServiceProvider')
  },

  /**
   * @return {Logger}
   * @constructor
   */
  get Logger() {
    return require(FRAMEWORK_PATH + '/lib/Logger')
  },

  /**
   * @return {ContainerRegistration}
   * @constructor
   */
  get ContainerRegistration() {
    return require(FRAMEWORK_PATH + '/lib/ContainerRegistration')
  },

  /**
   * @return {Container}
   * @constructor
   */
  get Container() {
    return require(FRAMEWORK_PATH + '/lib/Container')
  },

  /**
   * @return {ConfigReader}
   * @constructor
   */
  get ConfigReader() {
    return require(FRAMEWORK_PATH + '/lib/ConfigReader')
  },

  /**
   * @return {HelperServiceProvider}
   * @constructor
   */
  get HelperServiceProvider() {
    return require(FRAMEWORK_PATH + '/lib/serviceProviders/HelperServiceProvider')
  },

  /**
   * @return {DependencyInjectionServiceProvider}
   * @constructor
   */
  get DependencyInjectionServiceProvider() {
    return require(FRAMEWORK_PATH + '/lib/serviceProviders/DependencyInjectionServiceProvider')
  },

  /**
   * @return {EventServiceProvider}
   * @constructor
   */
  get EventServiceProvider() {
    return require(FRAMEWORK_PATH + '/lib/serviceProviders/EventServiceProvider')
  },

  /**
   * @return {App}
   * @constructor
   */
  get App() {
    return require(FRAMEWORK_PATH + '/lib/App')
  },
}

module.exports = toweran