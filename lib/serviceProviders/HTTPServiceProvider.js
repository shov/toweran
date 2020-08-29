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

    //TODO: add Socket.io here @url https://trello.com/c/KFCXzYom/71-socketio-adapter

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

    //TODO: add WS the serving @url https://trello.com/c/KFCXzYom/71-socketio-adapter
  }

  /**
   * Resolving the routes
   */
  boot() {

    const config = this._container.get('config')

    if (!check.object(config.http())) {
      return
    }

    /**
     * @type {RoutesResolver}
     */
    const routesResolver = this._container.get('RoutesResolver')

    //Middleware
    if (check.array(config.http.middleware())) {
      routesResolver.resolveRoutes('http.middleware', config.http.middleware())
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
    if (check.array(config.http.afterMiddleware())) {
      routesResolver.resolveRoutes('http.afterMiddleware', config.http.afterMiddleware())
    }

    const expressApp = this._container.get('expressApp')
    expressApp.use(routesResolver.getRouter())

    /** @type {AppStartEvent} */
    const appStartEvent = this._container.get('events.AppStartEvent')

    /** @type {HTTPAfterStartedEvent} */
    const httpAfterStartedEvent = this._container.get('events.HTTPAfterStartedEvent')

    //Start serving HTTP
    appStartEvent.addListener(() => {

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

          httpAfterStartedEvent.dispatch().catch(e => {
            throw e
            /**
             * TODO call global/available app error handler to handle or halt the app @url https://trello.com/c/nRiWRJav/72-globally-available-error-handler-handle-http-critical-errors
             */
          })
        })
    })
  }
}

module.exports = HTTPServiceProvider
