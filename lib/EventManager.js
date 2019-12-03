'use strict'

const ListenerInterface = toweran.ListenerInterface

const must = toweran.must
const check = require('check-types')

/**
 * Manage events and
 */
class EventManager {
  /**
   * DI
   * @param {{}} config
   */
  constructor(config) {
    must.be.object(config)

    this._config = config

    /**
     * Events & Listeners
     * @type {Array}
     * @private
     */
    this._events = []

    this._init = false
  }

  /**
   * Read events from the config file
   */
  init() {
    this._events = this._getEventsFromConfig()

    this._init = true
  }

  /**
   *
   * @param eventName
   * @param payload
   * @return {Promise<void>}
   */
  async dispatch(eventName, payload = null) {
    must.be.string(eventName)

    if(false === this._init) {
      throw new Error('event manager not initialized!')
    }

    const listeners = this._getListeners(eventName)

    for(let listener of listeners) {
      let response = listener.handle(payload)

      // If response doesn't return a promise so we already ran it.

      // Wait for each Promise to complete
      if(response instanceof Promise) {
        await response
      }

      /**
       * TODO we should discuss it
       *
       * What should happen when we have a mix of listeners with promises
       * and non-promises? should we run the others first then await for
       * promises or run them as a sequence?
       */
    }
  }

  /**
   * Check if an event exists
   * @param eventName
   * @returns {boolean}
   */
  exists(eventName) {
    must.be.string(eventName)

    return this._getEvent(eventName) ? true : false
  }

  /**
   * Get an event by name
   * @param eventName
   * @returns {*|null}
   * @private
   */
  _getEvent(eventName) {
    must.be.string(eventName)

    const event = this._events.find(element => element.event === eventName)

    return event || null
  }

  /**
   * Get listeners associated to event
   * @param eventName
   * @returns {Array}
   * @private
   */
  _getListeners(eventName) {
    must.be.string(eventName)

    const event = this._getEvent(eventName)

    return event ? event.listeners : []
  }

  /**
   * Check if given event has any listener
   * @param eventName
   * @returns {boolean}
   */
  hasListeners(eventName) {
    must.be.string(eventName)

    return this._getListeners(eventName).length ? true : false
  }

  /**
   * Get events from config object
   * @private
   */
  _getEventsFromConfig() {
    if (!check.object(this._config.events) || !check.array(this._config.events.events)) {
      return []
    }
    return this._config.events.events
  }
}

module.exports = EventManager
