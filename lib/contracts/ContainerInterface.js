'use strict'

/**
 * IoC Container interface
 */
class ContainerInterface {

  /**
   * Register something to the container
   * @param {string|symbol} key
   * @param {*} concrete
   * @return {ContainerRegistrationInterface}
   */
  register(key, concrete) {
    throw new Error(`Must be implemented in a child class!`)
  }

  /**
   * Get resolved from the container
   * @param {string|symbol} key
   * @return {*}
   */
  get(key) {
    throw new Error(`Must be implemented in a child class!`)
  }

  /**
   * Check if already registered
   * @param {string|symbol} key
   * @return {boolean}
   */
  has(key) {
    throw new Error(`Must be implemented in a child class!`)
  }

  /**
   * Register and override if already registered
   * @param {string|symbol} key
   * @param {*} concrete
   */
  registerForce(key, concrete) {
    throw new Error(`Must be implemented in a child class!`)
  }
}

module.exports = ContainerInterface
