'use strict'

const BasicServiceProvider = toweran.BasicServiceProvider

/**
 * Service provider to handle events stuff
 * @property {ContainerInterface} _container
 */
class EventServiceProvider extends BasicServiceProvider {
  /**
   * Register event manager into container
   */
  register() {
    this._container.register('eventManager', require(toweran.FRAMEWORK_PATH + '/lib/EventManager'))
      .dependencies('config')
      .singleton()

    return this
  }

  /**
   * Boot event manager
   */
  boot() {
    this._container.get('eventManager').init()
  }
}

module.exports = EventServiceProvider
