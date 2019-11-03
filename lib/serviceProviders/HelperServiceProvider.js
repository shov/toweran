'use strict'

const BasicServiceProvider = toweran.BasicServiceProvider

/**
 * Register tools & helpers
 * @property {ContainerInterface} _container
 */
class HelperServiceProvider extends BasicServiceProvider {

  register() {
    this._container
      .register('scriptLoader', require(toweran.FRAMEWORK_PATH + '/lib/ScriptLoader'))
      .dependencies('logger')
  }
}

module.exports = HelperServiceProvider
