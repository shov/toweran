'use strict'

const must = toweran.must

const ContainerRegistrationInterface = toweran.ContainerRegistrationInterface

/**
 * A registration of something in the container
 */
class ContainerRegistration extends ContainerRegistrationInterface {
  /**
   * Constructor
   * @param {Container} containerEngine
   * @param {string|symbol} key
   * @param {*} concrete
   */
  constructor(containerEngine, key, concrete) {
    super()
    must.be.notEmptyStringOrSymbol(key)

    this._containerEngine = containerEngine
    this._key = key
    this._concrete = concrete

    this._registration = this._containerEngine.register(this._key, this._concrete)
  }

  /**
   * An entry is going to be resolved only once
   * then always the got instance will be returned
   * @return {ContainerRegistrationInterface}
   */
  singleton() {
    this._registration.singleton()

    return this
  }

  /**
   * An entry dependencies list, cannot be used with instance() together
   * @return {ContainerRegistrationInterface}
   */
  dependencies(...things) {
    this._registration.dependencies(...things)

    return this
  }

}

module.exports = ContainerRegistration
