'use strict'

const BasicEvent = toweran.BasicEvent

/**
 * Event called right after HTTP adapter started listening
 */
class HTTPAfterStartedEvent extends BasicEvent {

  get name() {
    return toweran.CONST.FRAMEWORK_EVENTS.HTTP_AFTER_STARTED
  }
}

module.exports = HTTPAfterStartedEvent
