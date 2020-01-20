'use strict'

const BasicServiceProvider = toweran.BasicServiceProvider

/**
 * HTTP(S) and WebSokets services are registered here
 * @property {ContainerInterface} _container
 */
class HttpServiceProvider extends BasicServiceProvider {

  /**
   * Register dependencies and HTTP things
   */
  register() {
    this._container.instance('expressApp', require('express')())

    //TODO: add Socket.io here

    this._container.register('httpServing', require(toweran.FRAMEWORK_PATH + '/lib/HttpServing'))
      .dependencies('config', 'expressApp')
      .singleton()

    //TODO: add expressRouterFactory

    //TODO: add routesResolver that's to reads routes and put them to routes of express

    //TODO: add HttpErrorHandler

    //TODO: add WS the serving
  }

  //TODO: Then somewhere here I'm about to add an event subscription of starting app to take the servers and do the blocking start of them

}

module.exports = HttpServiceProvider
