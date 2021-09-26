'use strict'

const BasicEvent = toweran.BasicEvent

/**
 * Event called right after the app started
 */
class AppAfterStartedEvent extends BasicEvent {

  get name() {
    return toweran.CONST.FRAMEWORK_EVENTS.APP_AFTER_STARTED
  }
}

module.exports = AppAfterStartedEvent
