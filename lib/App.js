'use strict'

const must = toweran.must
const LoggerInterface = toweran.LoggerInterface
const Container = toweran.Container

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
   */
  register(options = {}) {
    this._logger.log('Register...')

    must.be.object(options)

    this._container.register('app', this).singleton()
    this._container.register('logger', this._logger).singleton()

    if(options.skipGlobalApp !== true) {
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


  }

  /**
   * Get core instances from the container and run init() on them one by one
   */
  init() {
    this._logger.log('Init...')
  }

  /**
   * Start servers, jobs, run boot() on the service providers
   */
  start() {
    this._logger.log('Start...')
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

module.exports = App
