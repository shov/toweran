'use strict'

const {
  must,
  CONST,
  ContainerInterface,
  ContainerRegistration,
} = toweran

/**
 * @typedef {{
 *     instance: boolean,
 *     singleton: boolean,
 *     dependencies: string[],
 *     resolver: *
 *  }} TContainerStoredRegistration
 */

/**
 * IoC Container
 * TODO: add bind, allow to reconnect resolvers on register stage, but restrict on boot and further @url https://trello.com/c/HLxNtFVY/74-di-add-bind-re-bind-that-allow-to-reconnect-resolvers-on-register-stage-but-restrict-on-boot-and-further
 * @implements ContainerInterface
 */
class Container extends ContainerInterface {
  /**
   * Constructor
   */
  constructor() {
    super()

    /**
     * @type {{[string]: TContainerStoredRegistration}}
     * @private
     */
    this._storage = {}

    //Register itself
    this.instance('container', this)
  }

  /**
   * Register something to the container
   * @param {string|symbol} key
   * @param {*} concrete
   * @return {ContainerRegistrationInterface}
   */
  register(key, concrete) {
    must.be.notEmptyStringOrSymbol(key)

    return new ContainerRegistration(this._storage, key, concrete)
  }

  /**
   * Register something to the container as instance
   * @param {string|symbol} key
   * @param {*} concrete
   * @return {ContainerInterface}
   */
  instance(key, concrete) {
    must.be.notEmptyStringOrSymbol(key)

    if (this.has(key)) {
      throw new Error(`Cannot register ${key} in the container, already registered!`)
    }

    this._storage[key] = {
      instance: true,
      singleton: false,
      dependencies: [],
      resolver: concrete,
    }

    return this
  }

  /**
   * Get resolved from the container
   * @param {string|symbol} key
   * @return {*}
   */
  get(key) {
    must.be.notEmptyStringOrSymbol(key)

    if (!this.has(key)) {
      throw new Error(`Cannot resolve key ${key}, not found!`)
    }

    const stored = this._storage[key]
    if (stored.instance) {
      return stored.resolver
    }

    if (stored.singleton) {
      stored.resolver = new stored.resolver(...stored.dependencies.map(key => this.get(key)))
      stored.instance = true
      return stored.resolver
    }

    return new stored.resolver(...stored.dependencies.map(key => this.get(key)))
  }

  /**
   * Check if already registered
   * @param {string|symbol} key
   * @return {boolean}
   */
  has(key) {
    must.be.notEmptyStringOrSymbol(key)

    return !!this._storage[key]
  }

  /**
   * Register and override if already registered
   * @param {string|symbol} key
   * @param {*} concrete
   * @return {ContainerRegistrationInterface}
   */
  registerForce(key, concrete) {
    must.be.notEmptyStringOrSymbol(key)

    if (CONST.APP_MODE.TESTING !== process.env.NODE_ENV) {
      throw new Error(`Force registration in the container allowed only in testing environment!`)
    }

    if (this.has(key)) {
      delete this._storage[key]
    }

    return this.register(key, concrete)
  }

  /**
   * Register and override if already registered as an instance
   * @param {string|symbol} key
   * @param {*} concrete
   * @return {ContainerInterface}
   */
  instanceForce(key, concrete) {
    must.be.notEmptyStringOrSymbol(key)

    if (CONST.APP_MODE.TESTING !== process.env.NODE_ENV) {
      throw new Error(`Force registration in the container allowed only in testing environment!`)
    }

    must.be.notEmptyStringOrSymbol(key)

    this._storage[key] = {
      instance: true,
      singleton: false,
      dependencies: [],
      resolver: concrete,
    }

    return this
  }
}

module.exports = Container
