'use strict'

const check = require('check-types')

const must = toweran.must

const LoggerInterface = toweran.LoggerInterface
const Container = toweran.Container
const ConfigReader = toweran.ConfigReader
const BasicServiceProvider = toweran.BasicServiceProvider
const EventServiceProvider = toweran.EventServiceProvider

/**
 * The Application
 */
class App {
  /**
   * Constructor
   * @param {LoggerInterface} logger
   */
  constructor(logger) {
    must.be.instance(logger, LoggerInterface)

    /**
     * @type {LoggerInterface}
     * @private
     */
    this._logger = logger

    /**
     * @type {ContainerInterface}
     * @private
     */
    this._container = new Container()

    /**
     * @type {BasicServiceProvider[]}
     * @private
     */
    this._serviceProviders = []

    /**
     * The thread name useful for logs
     * @type {string}
     */
    this.threadName = this.constructor.DEFAULT_THREAD_NAME

    /**
     * The event manager
     * @type {EventManager}
     * @private
     */
    this._eventManager = null
  }

  /**
   * Registration of everything in the container, call registration of the service providers
   * @param {{
   *   threadName: string,
   *   skipGlobalApp: boolean,
   *   skipConfigFiles: boolean,
   *   configDir: string,
   *   config: {},
   * }} options
   * @return {App}
   */
  register(options = {}) {
    must.be.object(options)

    this.threadName = options.threadName || this.threadName

    this._logger.log(`${this.threadName}App.Register...`)

    must.be.object(options)

    this._container.instance('app', this)
    this._container.instance('logger', this._logger)

    if (options.skipGlobalApp !== true) {
      /**
       * Global App Facade
       */
      global.app = {}

      /**
       * Get something from the container
       * @param {string|symbol} key
       * @return {*}
       */
      global.app.get = (key) => {
        return this.get(key)
      }
    }

    /**
     * The configuration.
     *
     * At first everything from APP_PATH/config folder
     * is being read. Each js file that returns an object will be processed
     * and the object will be added to the config with a key of the name of the file.
     *
     * Secondly if options.config is a valid object it's going to replace/patch
     * anything from already loaded config or add something new.
     *
     * @type {{}}
     * @private
     */
    this._config = {}

    //config files
    if (true !== options.skipConfigFiles) {
      const configDir = options.configDir || toweran.APP_PATH + '/config'
      this._config = (new ConfigReader).readDir(configDir)
    }

    //config option
    if (check.object(options.config)) {
      this._config = Object.assign(this._config, options.config)
    }

    this._container.instance('config', this._config)

    /**
     * Register events, listeners & boot event manager
     */
    const eventServiceProvider = new EventServiceProvider(this._container)
    eventServiceProvider.register().boot()

    this._eventManager = this._container.get('eventManager')

    /**
     * Most of service providers should be placed in config.app.serviceProviders as constructors
     * we validate and instantiate them here one by one, call register() on each of them and save
     * them in App._serviceProviders
     */
    if (check.object(this._config.app) && check.array(this._config.app.serviceProviders)) {
      this._config.app.serviceProviders.forEach(spConstructor => {
        try {
          must.be.function(spConstructor)
            .and.be.object(spConstructor.prototype)
            .and.be.instance(spConstructor.prototype, BasicServiceProvider)

          /**
           * @type {BasicServiceProvider}
           */
          const sp = new spConstructor(this._container)

          sp.register()

          this._serviceProviders.push(sp)

        } catch (e) {
          if (!(e instanceof toweran.InvalidArgumentException)) {
            throw e
          }
        }
      })
    }

    return this
  }

  /**
   * Get core instances from the container and run init() on them one by one
   * @return {App}
   */
  boot() {
    this._logger.log(`${this.threadName}.Boot...`)

    this._serviceProviders.forEach(sp => sp.boot())

    return this
  }

  /**
   * Start servers, jobs, run boot() on the service providers
   * @return {App}
   */
  start() {
    this._logger.log(`${this.threadName}.Start...`)

    /**
     * Start all application adapters by the event
     */
    this._eventManager.dispatch('start_application')

    //TODO: it should be called after all listeners of 'start_application' are done their things ?? TBD
    this._eventManager.dispatch('after_application_started')

    return this
  }

  /**
   * Get something from the container
   * @param {string|symbol} key
   * @return {*}
   */
  get(key) {
    must.notEmptyStringOrSymbol(key)
    return this._container.get(key)
  }
}

/**
 * TODO: Default thread name, it's going to be used for tasks perhaps
 * @type {string}
 */
App.DEFAULT_THREAD_NAME = ''

module.exports = App
