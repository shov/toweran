'use strict'

const BasicServiceProvider = toweran.BasicServiceProvider

/**
 * DI features
 * @property {ContainerInterface} _container
 */
class DependencyInjectionServiceProvider extends BasicServiceProvider {

  register() {
    this._container
      .register('di', require(toweran.FRAMEWORK_PATH + '/lib/DependencyInjector'))
      .singleton()
  }

  boot() {
    /**
     * @type {DependencyInjector}
     */
    const di = this._container.get('di')
    //TODO: get root paths to threat from config.app.di.paths and call di.process
  }
}

module.exports = DependencyInjectionServiceProvider
