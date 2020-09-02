'use strict'

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
 * @property {BasicMiddleware} BasicMiddleware - Constructor
 * @property {BasicEvent} BasicEvent - Constructor
 * @property {BasicFacade} BasicFacade - Constructor
 *
 * @property {HelperServiceProvider} HelperServiceProvider - Constructor
 * @property {ConfigReader} ConfigReader - Constructor
 * @property {DependencyInjectionServiceProvider} DependencyInjectionServiceProvider - Constructor
 * @property {Logger} Logger - Constructor
 * @property {EventServiceProvider} EventServiceProvider - Constructor
 * @property {HTTPServiceProvider} HTTPServiceProvider - Constructor
 * @property {Container} Container - Constructor
 * @property {ContainerRegistration} ContainerRegistration - Constructor
 * @property {ProxyfiedAccessor} ProxyfiedAccessor - Constructor
 * @property {ConfigManager} ConfigManager - Constructor
 * @property {ConfigAccessor} ConfigAccessor - Constructor
 * @property {AppFacade} AppFacade - Constructor
 * @property {AppFacade} app - global app instance
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
 *   BasicController: BasicController,
 *   BasicMiddleware: BasicMiddleware,
 *   BasicEvent: BasicEvent,
 *   BasicFacade: BasicFacade,
 *   HTTPServiceProvider: HTTPServiceProvider,
 *   ProxyfiedAccessor: ProxyfiedAccessor,
 *   ConfigManager: ConfigManager,
 *   ConfigAccessor: ConfigAccessor,
 *   AppFacade: AppFacade,
 *   app: AppFacade,
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
   * @return {BasicMiddleware}
   * @constructor
   */
  get BasicMiddleware() {
    return require(FRAMEWORK_PATH + '/lib/contracts/BasicMiddleware')
  },

  /**
   * @return {BasicEvent}
   * @constructor
   */
  get BasicEvent() {
    return require(FRAMEWORK_PATH + '/lib/contracts/BasicEvent')
  },

  /**
   * @returns {BasicFacade}
   * @constructor
   */
  get BasicFacade() {
    return require(FRAMEWORK_PATH + '/lib/contracts/BasicFacade')
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

  /**
   * @return {ConfigManager}
   * @constructor
   */
  get ConfigManager() {
    return require(FRAMEWORK_PATH + '/lib/ConfigManager')
  },

  /*
   * Gears
   */

  /**
   * @returns {ProxyfiedAccessor}
   * @constructor
   */
  get ProxyfiedAccessor() {
    return require(FRAMEWORK_PATH + '/lib/ProxyfiedAccessor')
  },

  /*
   * Aliases
   */

  /**
   * @typedef {ProxyfiedAccessor} ConfigAccessor
   *
   * @returns {ConfigAccessor}
   * @constructor
   */
  get ConfigAccessor() {
    return require(FRAMEWORK_PATH + '/lib/ProxyfiedAccessor')
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

  /*
   * Facades
   */

  /**
   * @returns {AppFacade}
   * @constructor
   */
  get AppFacade() {
    return require(FRAMEWORK_PATH + '/lib/facades/AppFacade')
  },


  /**
   * @return {App}
   * @constructor
   */
  get App() {
    return require(FRAMEWORK_PATH + '/lib/App')
  },

  /**
   * Global accessor to current app facade
   * @returns {AppFacade}
   */
  get app() {
    throw new Error(`Application has not been initialized!`)
  },
}

module.exports = toweran