'use strict'

const {
  BasicFacade,
} = toweran

/**
 * Facade for app object, to be global
 */
class AppFacade extends BasicFacade {
  /**
   * Get something from the container
   * @param {string|symbol} key
   * @return {*}
   */
  get(key) {
    return this._wrapped.get(key)
  }
}

module.exports = AppFacade