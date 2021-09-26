'use strict'

/**
 * Interface of a thing that's being registered
 */
class ContainerRegistrationInterface {
  /**
   * An entry is going to be resolved only once
   * then always the got instance will be returned
   * @return {ContainerRegistrationInterface}
   */
  singleton() {
    throw new Error(`Must be implemented in a child class!`)
  }

  /**
   * An entry dependencies list, cannot be used with instance() together
   * @return {ContainerRegistrationInterface}
   */
  dependencies(...things) {
    throw new Error(`Must be implemented in a child class!`)
  }

  /**
   * An entry is going to me resolved directly with given resolver always
   */
  instance() {
    throw new Error(`Must be implemented in a child class!`)
  }

  /**
   * TODO add factory
   */
}

module.exports = ContainerRegistrationInterface
