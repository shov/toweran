'use strict'

const BasicEvent = toweran.BasicEvent

/**
 * Application start the event
 */
class AppStartEvent extends BasicEvent {

  get name() {
    return toweran.C.FRAMEWORK_EVENTS.APP_START
  }
}

module.exports = AppStartEvent