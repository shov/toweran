'use strict'

const {
  must,
  ListenerInterface,
  InvalidArgumentException,
  ConfigAccessor,
} = toweran
const check = require('check-types')

/**
 * Manage events and
 */
class EventManager {
  /**
   * DI
   * @param {ConfigAccessor} config
   */
  constructor(config) {
    must.be.instance(config, ConfigAccessor)

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
   * Subscribe on event, add event if not exists
   * @param {string} eventName
   * @param {function|ListenerInterface} listener
   */
  subscribe(eventName, listener) {
    must.be.notEmptyString(eventName)
    if (!check.function(listener) && !(check.object(listener) && check.instance(listener, ListenerInterface))) {
      throw new InvalidArgumentException(`Wrong argument for event listener, function or instance of ListenerInterface is expected!`)
    }

    if (!this.exists(eventName)) {
      this._events.push({
        event: eventName,
        listeners: [
          listener
        ],
      })
      return
    }

    const index = this._events.findIndex(element => element.event === eventName)
    this._events[index].listeners.push(listener)
  }

  /**
   * Dispatch an event
   * @param eventName
   * @param payload
   * @return {Promise<void>}
   */
  async dispatch(eventName, payload = null) {
    must.be.string(eventName)

    if (false === this._init) {
      throw new Error(`Event manager not initialized!`)
    }

    const listeners = this._getListeners(eventName)

    const asyncListeners = []
    for (let listener of listeners) {
      let response

      //Closure
      if (check.function(listener)) {
        response = listener(payload)

        //ListenerInterface
      } else {
        response = listener.handle(payload)
      }

      // If response doesn't return a promise so we already ran it.

      // If it's async set it aside to the pool
      if (response instanceof Promise) {
        asyncListeners.push(response)
      }
    }

    //Await till all async listeners resolved
    await Promise.all(asyncListeners)
  }

  /**
   * Check if an event exists
   * @param eventName
   * @returns {boolean}
   */
  exists(eventName) {
    must.be.string(eventName)

    return !!this._getEvent(eventName)
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

    return !!this._getListeners(eventName).length
  }

  /**
   * Get events from config object
   * @private
   */
  _getEventsFromConfig() {
    if (!check.array(this._config.events.events())) {
      return []
    }
    return [...this._config.events.events()]
  }
}

module.exports = EventManager
