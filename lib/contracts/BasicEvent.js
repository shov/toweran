'use strict'

/**
 * A base for OO event representation
 * made to avoid using ugly string hooks
 */
class BasicEvent {
  constructor(eventManager) {
    /**
     * @type {EventManager}
     * @private
     */
    this._eventManager = app.get('eventManager')
  }

  /**
   * Dispatching an event
   * @returns {Promise<void>}
   */
  async dispatch() {
    await this._eventManager.dispatch(this.name)
  }

  /**
   * Subscribe on the event
   * @param {Function|ListenerInterface} listener
   */
  addListener(listener) {
    this._eventManager.subscribe(this.name, listener)
  }

  /**
   * Event name
   * @return {string}
   */
  get name() {
    throw new Error(`Must be implemented`)
  }

  set name(_) {
    throw new Error(`Changing the event name not recommended, create new event and set it in the get name() method`)
  }
}

module.exports = BasicEvent