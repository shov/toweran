'use strict'

const { get, set, mergeWith } = require('lodash')
const must = toweran.must

module.exports = class ConfigManager {
    constructor(config = {}) {
        this._config = config
    }

    /**
     * Get something from config
     * @param {string} key
     * @param {any} defaultValue
     */
    get(key, defaultValue= undefined) {
        must.be.string(key)
        return get(this._config, key, defaultValue)
    }

    /**
     * Set something into config
     * @param key
     * @param value
     */
    set(key, value) {
        must.be.string(key)
        set(this._config, key, value)
    }

    /**
     * Merge a key with given value
     * @param {string} key
     * @param {Object} value
     * @return {any}
     */
    merge(key, value) {
        must.be.string(key)
        must.be.object(value)
        return mergeWith(value, this.get(key))
    }
}
