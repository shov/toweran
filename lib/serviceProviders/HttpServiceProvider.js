'use strict'

const {
  FRAMEWORK_PATH,
  BasicServiceProvider
} = toweran

/**
 * HTTP(S) and WebSockets services are registered here
 * @property {ContainerInterface} _container
 */
class HttpServiceProvider extends BasicServiceProvider {

  /**
   * Register dependencies and HTTP things
   */
  register() {
    this._container.instance('expressApp', require('express')())

    //TODO: add Socket.io here

    this._container.register('httpServing', require(FRAMEWORK_PATH + '/lib/HttpServing'))
      .dependencies('config', 'expressApp')
      .singleton()

    this._container.instance('expressRouterFactory', () => {
      return () => require('express').Router()
    })

    //TODO: add routesResolver that's to reads routes and put them to routes of express

    this._container.register('httpErrorHandler', require(FRAMEWORK_PATH + '/lib/HTTPErrorHandler'))
      .dependencies('logger')
      .singleton()

    //TODO: add WS the serving
  }

  /**
   * Resolving the routes
   */
  boot() {
    //TODO: resolve before middleware
    //TODO: load routes, resolve
    //TODO: resolve after middleware

    //TODO: subscribe on starting the app (start_application) to run http servers
  }

}

module.exports = HttpServiceProvider
