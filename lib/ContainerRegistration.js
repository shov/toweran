'use strict'

const must = toweran.must

const ContainerRegistrationInterface = toweran.ContainerRegistrationInterface

/**
 * A registration of something in the container
 * @implements ContainerRegistrationInterface
 */
class ContainerRegistration extends ContainerRegistrationInterface {
  /**
   * Constructor
   * @param {{[string]: TContainerStoredRegistration}} storage
   * @param {string|symbol} key
   * @param {*} concrete
   */
  constructor(storage, key, concrete) {
    super()
    must.be.notEmptyStringOrSymbol(key)

    this._storage = storage
    this._key = key
    this._concrete = concrete

    this._registration = {
      instance: false,
      singleton: false,
      dependencies: [],
      resolver: this._concrete,
    }

    this._storage[this._key] = this._registration
  }

  /**
   * An entry is going to be resolved only once
   * then always the got instance will be returned
   * @return {ContainerRegistrationInterface}
   */
  singleton() {
    this._registration.singleton = true

    return this
  }

  /**
   * An entry dependencies list, cannot be used with instance() together
   * @return {ContainerRegistrationInterface}
   */
  dependencies(...things) {
    this._registration.dependencies = [...this._registration.dependencies, ...things]

    return this
  }

  instance() {
    this._registration.instance = true

    return this
  }
}

module.exports = ContainerRegistration
