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

    /**
     * A lot of duct tape is going to be here because I want to inverse it, to make decision if it's instance later
     * TODO: get rid of addict-ioc, perhaps write a container from scratch (many of tests required)
     */
    this._registration = this._containerEngine.register(this._key, this._concrete)
    this._lockedAsInstance = false
    this._lockedAsAbstractRegistration = false
  }

  /**
   * An entry is going to be resolved only once
   * then always the got instance will be returned
   * @return {ContainerRegistrationInterface}
   */
  singleton() {
    if(this._lockedAsInstance) {
      throw new Error(`An instance mustn't be a singleton!`)
    }

    this._lockedAsAbstractRegistration = true

    this._registration.singleton()

    return this
  }

  /**
   * An entry dependencies list, cannot be used with instance() together
   * @return {ContainerRegistrationInterface}
   */
  dependencies(...things) {
    if(this._lockedAsInstance) {
      throw new Error(`An instance mustn't have dependencies!`)
    }

    this._lockedAsAbstractRegistration = true

    this._registration.dependencies(...things)

    return this
  }

  /**
   * Put into container already resolved instance, cannot has dependencies or be a singleton
   * @return {ContainerRegistrationInterface}
   */
  instance() {
    if(this._lockedAsAbstractRegistration) {
      throw new Error(`A registration already has dependencies of defined as a singleton, it mustn't be an instance!`)
    }

    this._lockedAsInstance = true

    this._containerEngine.unregister(this._key)
    this._registration = this._containerEngine.register(this._key, this._concrete)

    return this
  }
}

module.exports = ContainerRegistration
