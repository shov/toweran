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
    this._config = config

    /**
     * Events & Listeners
     * @type {Array}
     * @private
     */
    this._events = []
  }

  /**
   * Read events from the config file
   */
  init() {
    this._events = this._getEventsFromConfig()
  }

  /**
   * Dispatch an event
   * @param eventName
   * @param payload
   */
  dispatch(eventName, payload = null) {
    must.be.string(eventName)

    this._getListeners(eventName)
      .forEach(listener => this._resolveListener(listener, payload))
  }

  /**
   * Based on the listener type does the suitable action
   * @param listener
   * @param payload
   * @private
   */
  async _resolveListener(listener, payload) {
    must.be.instance(listener, ListenerInterface)

    await listener.handle(payload)
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
