'use strict'

const {
  must
} = toweran

/**
 * Basic facade
 */
class BasicFacade {
  constructor() {
    /**
     * @type {?Object}
     * @protected
     */
    this._wrapped = null
  }

  /**
   * Wrap the object
   * @param {Object} object
   */
  wrap(object) {
    must.be.object(object)
    this._wrapped = object
  }
}

module.exports = BasicFacade