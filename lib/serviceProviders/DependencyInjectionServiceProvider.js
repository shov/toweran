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
      .dependencies('logger', 'config', 'container', 'scriptLoader', 'annotationInspector')
      .singleton()
  }

  boot() {
    this._container.get('di').init()
  }
}

module.exports = DependencyInjectionServiceProvider
