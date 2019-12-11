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

    this._container
      .register('annotationInspector', require(toweran.FRAMEWORK_PATH + '/lib/AnnotationInspector'))
      .dependencies('logger')
  }
}

module.exports = HelperServiceProvider
