'use strict'

const check = require('check-types')

const must = toweran.must

const LoggerInterface = toweran.LoggerInterface
const Container = toweran.Container
const ConfigReader = toweran.ConfigReader

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
  }

  /**
   * Registration of everything in the container, call registration of the service providers
   * @param {{}} options
   * @return {App}
   */
  register(options = {}) {
    this._logger.log(`${options.threadName + ' ' || App.DEFAULT_THREAD_NAME}App.Register...`)

    must.be.object(options)

    this._container.register('app', this).singleton()
    this._container.register('logger', this._logger).singleton()

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
    const configDir = options.configDir || toweran.APP_PATH + '/config'

    this._config = (new ConfigReader).readDir(configDir)

    if (check.object(options.config)) {
      this._config = Object.assign(this._config, options.config)
    }

    this._container.instance('config', this._config)

    //TODO: fetch service providers of the package and run register() on them
    //TODO: fetch app level service providers from the config and run register() on them

    return this
  }

  /**
   * Get core instances from the container and run init() on them one by one
   * @return {App}
   */
  boot() {
    this._logger.log(`${options.threadName + ' ' || App.DEFAULT_THREAD_NAME}Boot...`)

    //TODO: run .boot() on each of service providers (system and app)

    return this
  }

  /**
   * Start servers, jobs, run boot() on the service providers
   * @return {App}
   */
  start() {
    this._logger.log(`${options.threadName + ' ' || App.DEFAULT_THREAD_NAME}Start...`)

    //TODO: start all of adapters, probably by an event 'start_application'
    //TODO: then emmit an event of 'after_application_started' ?

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
