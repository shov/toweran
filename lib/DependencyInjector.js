'use strict'

/**
 * Handle Auto dependency injection
 */
class DependencyInjector {
  /**
   * DI
   * @param {LoggerInterface} logger
   * @param {{app:{di:[]}}} config TODO: use ConfigManager
   * @param {ContainerInterface} container
   */
  constructor(logger, container, config) {
    /**
     * @type {LoggerInterface}
     * @private
     */
    this._logger = logger

    /**
     * @type {{app: {di: *[]}}}
     * @private
     */
    this._config = config

    /**
     * @type {ContainerInterface}
     * @private
     */
    this._container = container

    /**
     * A list of candidates to be registered on application boot step
     * @type {Array}
     * @private
     */
    this._candidates = []
  }

  /**
   * Initialization, boot step; gets registered di expressions from the config,
   * analyzes them and builds a line of candidates to be registered in the container
   */
  init() {
    //TODO: get root paths to threat from config.app.di.paths and call di.process
  }

  /**
   * Try to register js file as a Class in the container, by strategy
   * @param {string} file
   * @param {symbol} strategy
   */
  registerClass(file, strategy = toweran.C.DI.DOT_NOTATION) {
    //TODO: implement
  }

  /**
   * Registering the candidates in the container
   * @private
   */
  _registerCandidates() {
    //TODO: implement
  }

}

module.exports = DependencyInjector
