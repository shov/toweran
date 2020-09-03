'use strict'

const check = require('check-types')

/**
 * Proxyfied functional accessor to wrapped object
 */
class ProxyfiedAccessor extends Function {
  /**
   * @param {*} value
   * @returns {ProxyfiedAccessor}
   */
  constructor(value) {
    super()
    this._value = value

    /**
     * Proxy handler
     * - if the accessor is called, "apply" function traps it and returns with the value
     * - if a prop of the accessor is tried to be got, "get" function traps it and
     *   depending on existing of called prop and it's type return new ProxyfiedAccessor with
     *   a value from the prop (if it's object) or undefined
     */
    const handler = {
      get: (target, prop, receiver) => {
        if (check.object(this._value) && prop in this._value) {
          return new ProxyfiedAccessor(this._value[prop])
        }

        return new ProxyfiedAccessor(undefined)
      },

      apply: (target, thisArg, args) => target._call()
    }

    /**
     * Returns the proxy of this accessor with the handler
     */
    return new Proxy(this, handler)
  }

  /**
   * Returns the wrapped value
   * @returns {*}
   * @private
   */
  _call() {
    return this._value
  }
}

module.exports = ProxyfiedAccessor