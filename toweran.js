'use strict'

//TODO: Global NS, contracts, exceptions, must. Make sure everything is here and remove the todo

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
 * @property {BadRequestException} BadRequestException - Constructor
 * @property {UnauthorizedException} UnauthorizedException - Constructor
 * @property {ForbiddenException} ForbiddenException - Constructor
 * @property {NotFoundException} NotFoundException - Constructor
 * @property {ValidationException} ValidationException - Constructor
 *
 * @property {ContainerInterface} ContainerInterface - Interface
 * @property {ListenerInterface} ListenerInterface - Interface
 * @property {ContainerRegistrationInterface} ContainerRegistrationInterface - Interface
 * @property {LoggerInterface} LoggerInterface - Interface
 *
 * @property {BasicServiceProvider} BasicServiceProvider - Constructor
 * @property {BasicController} BasicController - Constructor
 * @property {BasicEvent} BasicEvent - Constructor
 *
 * @property {HelperServiceProvider} HelperServiceProvider - Constructor
 * @property {ConfigReader} ConfigReader - Constructor
 * @property {DependencyInjectionServiceProvider} DependencyInjectionServiceProvider - Constructor
 * @property {Logger} Logger - Constructor
 * @property {EventServiceProvider} EventServiceProvider - Constructor
 * @property {HTTPServiceProvider} HTTPServiceProvider - Constructor
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
 *   ContainerRegistration: ContainerRegistration,
 *   BadRequestException: BadRequestException,
 *   UnauthorizedException: UnauthorizedException,
 *   ForbiddenException: ForbiddenException,
 *   NotFoundException: NotFoundException,
 *   ValidationException: ValidationException,
 *   BasicEvent: BasicEvent,
 *   HTTPServiceProvider: HTTPServiceProvider,
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

  /*
   * Exceptions
   */

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
   * @return {BadRequestException}
   * @constructor
   */
  get BadRequestException() {
    return require(FRAMEWORK_PATH + '/lib/exceptions/BadRequestException')
  },

  /**
   * @return {UnauthorizedException}
   * @constructor
   */
  get UnauthorizedException() {
    return require(FRAMEWORK_PATH + '/lib/exceptions/UnauthorizedException')
  },

  /**
   * @return {ForbiddenException}
   * @constructor
   */
  get ForbiddenException() {
    return require(FRAMEWORK_PATH + '/lib/exceptions/ForbiddenException')
  },

  /**
   * @return {NotFoundException}
   * @constructor
   */
  get NotFoundException() {
    return require(FRAMEWORK_PATH + '/lib/exceptions/NotFoundException')
  },

  /**
   * @return {ValidationException}
   * @constructor
   */
  get ValidationException() {
    return require(FRAMEWORK_PATH + '/lib/exceptions/ValidationException')
  },

  /*
   * Contracts: Interfaces & Basic classes
   */

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
   * @return {BasicController}
   * @constructor
   */
  get BasicController() {
    return require(FRAMEWORK_PATH + '/lib/contracts/BasicController')
  },

  /**
   * @return {BasicEvent}
   * @constructor
   */
  get BasicEvent() {
    return require(FRAMEWORK_PATH + '/lib/contracts/BasicEvent')
  },

  /*
   * Core constructors
   */

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

  /*
   * Core service providers
   */

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
   * @return {HTTPServiceProvider}
   * @constructor
   */
  get HTTPServiceProvider() {
    return require(FRAMEWORK_PATH + '/lib/serviceProviders/HTTPServiceProvider')
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