'use strict'

/**
 * Handle Auto dependency injection
 */
class DependencyInjector {
  /**
   * DI
   * @param {LoggerInterface} logger
   * @param {ContainerInterface} container
   */
  constructor(logger, container) {
    /**
     * @type {LoggerInterface}
     * @private
     */
    this._logger = logger

    /**
     * @type {ContainerInterface}
     * @private
     */
    this._container = container
  }

  /**
   * Process files by a glob pattern to register every met file of javascript
   * if it contains ES6 class and export its constructor,
   * check @DI notations add it to the container with dependencies
   * keys are formed by the dot notation: like 'app.domain.auth.services.UserService'
   * @param {string} globPattern
   */
  process(globPattern) {
    //TODO: implement it processDir with dot notation
  }

}

module.exports = DependencyInjector
