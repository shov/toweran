'use strict'

/**
 * Basic middleware class
 */
class BasicMiddleware extends toweran.BasicController {

  /**
   * If a middleware should call after an action,
   * by default it's "before" middleware, it's called before the action
   * @returns {boolean}
   */
  get isAfter() {
    return false
  }

  /**
   * Middleware handler
   * @param {{}} req
   * @param {{}} res
   * @param {function} next
   */
  handle(req, res, next) {
    throw new Error(`Must be implemented`)
  }
}

module.exports = BasicMiddleware