'use strict'

const {
  FRAMEWORK_PATH,
  BasicServiceProvider
} = toweran

const check = require('check-types')

/**
 * HTTP(S) and WebSockets services are registered here
 * @property {ContainerInterface} _container
 */
class HTTPServiceProvider extends BasicServiceProvider {

  /**
   * Register dependencies and HTTP things
   */
  register() {
    this._container.instance('expressApp', require('express')())

    //TODO: add Socket.io here

    this._container.register('httpServing', require(FRAMEWORK_PATH + '/lib/HTTPServing'))
      .dependencies('config', 'expressApp')
      .singleton()

    this._container.instance('expressRouterFactory', () => {
      return require('express').Router()
    })

    this._container.register('RoutesResolver', require(FRAMEWORK_PATH + '/lib/RoutesResolver'))
      .dependencies('logger', 'app', 'expressRouterFactory')

    this._container.register('httpErrorHandler', require(FRAMEWORK_PATH + '/lib/HTTPErrorHandler'))
      .dependencies('logger')
      .singleton()

    //TODO: add WS the serving
  }

  /**
   * Resolving the routes
   */
  boot() {

    const config = this._container.get('config')
    //TODO: refactor with config manager

    if(!check.object(config.http)) {
      return
    }

    /**
     * @type {RoutesResolver}
     */
    const routesResolver = this._container.get('RoutesResolver')

    //Middleware
    if(check.array(config.http.middleware)) {
      routesResolver.resolveRoutes('http.middleware', config.http.middleware)
    }

    //Routes
    /**
     * @type {ScriptLoader}
     */
    const scriptLoader = this._container.get('scriptLoader')

    const routeFiles = scriptLoader.processExpression(toweran.APP_PATH + '/routes')

    routeFiles.forEach(filePath => {
      const definitionList = require(filePath)
      routesResolver.resolveRoutes(filePath, definitionList)
    })

    //After middleware
    if(check.array(config.http.afterMiddleware)) {
      routesResolver.resolveRoutes('http.afterMiddleware', config.http.afterMiddleware)
    }

    const expressApp = this._container.get('expressApp')
    expressApp.use(routesResolver.getRouter())

    //Start serving HTTP
    /**
     * @type {EventManager}
     */
    const eventManager = this._container.get('eventManager')
    eventManager.subscribe('start_application', () => {

      /**
       * @type {HTTPServing}
       */
      const httpServing = this._container.get('httpServing')

      /**
       * @type {Logger}
       */

      const logger = this._container.get('logger')
      httpServing
        .getServer()
        .listen(httpServing.getPort(), () => {
        logger.log(httpServing.getStartingMessage())
      })
    })
  }
}

module.exports = HTTPServiceProvider
