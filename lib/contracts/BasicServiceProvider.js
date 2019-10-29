'use strict'

const must = toweran.must

const ContainerInterface = toweran.ContainerInterface

/**
 * Basic class for service providers
 */
class BasicServiceProvider {

  /**
   * Constructor
   * @param {ContainerInterface} container
   */
  constructor(container) {
    must.be.instance(container, ContainerInterface)

    /**
     * @type {ContainerInterface}
     * @private
     */
    this._container = container
  }

  /**
   * To be called on the application registration step @see App.register
   */
  register() {
    //by default does nothing
  }

  /**
   * To be called on the application boot step @see App.boot
   */
  boot() {
    //by default does nothing
  }
}

module.exports = BasicServiceProvider
