'use strict'

const check = require('check-types')
const {
  must,
  ProxyfiedAccessor
} = toweran

/**
 * Takes care of config. Protects it, provides with an access to it.
 */
class ConfigManager {
  /**
   * @DI rawConfig
   * @param rawConfig
   */
  constructor(rawConfig) {
    must.be.object(rawConfig)

    this._rawConfig = rawConfig
  }

  /**
   * Freeze the config
   * @returns {ConfigManager}
   */
  freeze() {
    this._rawConfig = this._deepFreeze(this._rawConfig)
    return this
  }

  /**
   * Config accessor
   * - to get value call it with ()
   * - to get prop use .
   * - it throws no errors whatever long chain of non-existing props you build, finally you get value of undefined
   *
   * config.app.disableTasks() //false
   * config.app.disableTasks.bar.baz() //undefined
   *
   * @returns {ProxyfiedAccessor}
   */
  getAccessor() {
    return new ProxyfiedAccessor(this._rawConfig)
  }

  /**
   * Deep freezing
   * @param {{}|[]} node
   * @returns {{}|[]}
   * @private
   */
  _deepFreeze(node) {
    const props = Object.getOwnPropertyNames(node)

    for (let name of props) {
      let value = node[name]

      const isArray = check.array(value)
      const isObject = check.object(value)

      if (isArray || isObject) {
        if (isArray) {
          value.forEach(el => this._deepFreeze(el))
        }

        this._deepFreeze(value)
      }
    }

    return Object.freeze(node)
  }
}

module.exports = ConfigManager