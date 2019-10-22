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
   * Put into container already resolved instance, cannot has dependencies or be a singleton
   * @return {ContainerRegistrationInterface}
   */
  instance() {
    throw new Error(`Must be implemented in a child class!`)
  }
}

module.exports = ContainerRegistrationInterface
