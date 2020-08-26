'use strict'

const {
  must,
  InvalidArgumentException,
  BasicController,
  BasicMiddleware,
} = toweran

const check = require('check-types')

/**
 * Resolving of the http routes
 */
class RoutesResolver {

  /**
   * @DI logger
   * @DI app
   * @DI expressRouterFactory
   * @param {Logger} logger
   * @param {App} app
   * @param {function: Router} expressRouterFactory
   */
  constructor(logger, app, expressRouterFactory) {
    /**
     * @type {Logger}
     * @private
     */
    this._logger = logger

    /**
     * @type {App}
     * @private
     */
    this._app = app

    /**
     * @type {Router}
     * @private
     */
    this._expressRouter = expressRouterFactory()

    /**
     * @const
     * @type {string[]}
     */
    this.SUPPORTED_METHODS = this.constructor.SUPPORTED_METHODS
  }

  /**
   * @typedef {{
   *    path: ?string,
   *    method: string,
   *    resolver: {
   *      controller: string,
   *      action: string
   *    }|*,
   *    sub: ?RouterDefinitionList,
   *    middleware: ?[function|BasicMiddleware],
   *  }} RouterDefinition
   */

  /**
   * @typedef {[RouterDefinition]} RouterDefinitionList
   */

  /**
   * Add a named group of routes' definitions to express Route
   *
   *  Supported combinations:
   *  - sub
   *    sub is made for wrapping by path, so path is requires if sub is used
   *    * it can be just {sub, path} means wrapping only
   *    * it can be with resolving on the path, {sub, path, <resolving keys>}
   *    * middleware can be added to apply on each wrapped
   *  - resolving
   *    it requires {method, resolver}, will apply on any incoming request
   *    * path can be added, then will apply for path
   *    * middleware can be added
   *    * resolver can be a callback or an object of {controller, action} where they are names
   *    * middleware is an array, an element can be a callback or a name of middleware
   *    * controllers are instantiated and validated to be instances of BasicController and have the action as a method
   *    * middleware by name are instantiated and validated to be instances of BasicMiddleware
   *
   *
   * @param {string} sourceName
   * @param {RouterDefinitionList} routeDefinitionList
   *
   * Supported options
   * @param {{
   *   pathPrefix: string
   * }} options
   */
  resolveRoutes(sourceName, routeDefinitionList, options = {}) {
    must.be.notEmptyString(sourceName)
      .and.be.arrayOf(routeDefinitionList, 'object')
      .and.be.object(options)

    const pathPrefix = options.pathPrefix || ''
    must.be.string(pathPrefix)

    if (routeDefinitionList.length < 1) {
      this._logger.warn(`Routes list of ${sourceName} is empty. Skip.`)
      return
    }

    /**
     * A helper for reducer error logging
     * @param {string} sourceName
     * @param {string} prefix
     * @param {number} index
     */
    const reducerLogNesting = (sourceName, prefix, index) => {
      return `${sourceName}${prefix ? `[${prefix}]` : ''}[${index}]`
    }

    /**
     * Reducer to run thru all definitions
     * @param {{pathPrefix: string, middleware: [function|string], routes: RouterDefinitionList}} result
     * @param {RouterDefinition} block
     */
    const definitionsReducer = (result, block, index) => {
      //Sub
      let subDetected = false
      if (check.array(block.sub)) {
        subDetected = true
      }

      //Path
      let currPath = result.pathPrefix ? result.pathPrefix : null
      if (check.nonEmptyString(block.path)) {
        currPath = result.pathPrefix + block.path
      }

      //Sub without path error
      if (!currPath && subDetected) {
        throw new InvalidArgumentException(`Route definition ${reducerLogNesting(sourceName, result.pathPrefix, index)} contains sub, path is required!`)
      }

      //Middleware
      let tailedMiddleware = []
      if (check.nonEmptyArray(block.middleware)) {
        tailedMiddleware = block.middleware
      }

      //Method
      let doResolving = true
      if (!check.nonEmptyString(block.method)) {
        if (!subDetected) {
          throw new InvalidArgumentException(
            `Route block ${reducerLogNesting(sourceName, result.pathPrefix, index)} contains no method and doesn't wrap anything!`)
        }

        //Sub detected, but there is no method, hence the block is only for wrapping
        doResolving = false

      } else if (!this.SUPPORTED_METHODS.includes(block.method)) {
        throw new InvalidArgumentException(
          `Route block ${reducerLogNesting(sourceName, result.pathPrefix, index)} contains unsupported method "${block.method}"!`)
      }

      //Resolving
      if (doResolving) {
        if (!check.function(block.resolver) && !check.object(block.resolver)) {
          throw new InvalidArgumentException(
            `Route block ${reducerLogNesting(sourceName, result.pathPrefix, index)} contains wrong resolver format!`)
        }

        result.routes.push({
          path: currPath,
          method: block.method,
          resolver: block.resolver,
          middleware: result.middleware.concat(tailedMiddleware),
        })
      }

      //Wrapped
      let wrapped = []
      if (subDetected) {
        wrapped = block.sub.reduce(definitionsReducer, {
          pathPrefix: currPath,
          middleware: result.middleware.concat(tailedMiddleware),
          routes: []
        }).routes
      }

      result.routes = result.routes.concat(wrapped)

      return result
    }

    const parsedRoutes = routeDefinitionList.reduce(definitionsReducer, {
      pathPrefix: '', middleware: [], routes: [],
    }).routes

    /**
     * A helper for registration error logging
     * @param {string} sourceName
     * @param {string} path
     * @param {string} method
     */
    const registrationLogNesting = (sourceName, path, method) => {
      return `${sourceName}${path ? `[${path}]` : ''}[${method}]`
    }

    //Registration
    parsedRoutes.forEach(
      /**
       * @param {RouterDefinition} definition
       */
      definition => {
        const {path, method, resolver, middleware} = definition

        let routerArguments = []

        if (check.nonEmptyString(path)) {
          routerArguments.push(path)
        }

        let actionResolver = null
        switch (true) {
          //Closure resolver
          case(check.function(resolver)):
            actionResolver = resolver
            break

          //Controller resolver
          case(
            check.object(resolver)
            && check.nonEmptyString(resolver.controller)
            && check.nonEmptyString(resolver.action)
          ):
            const controllerName = resolver.controller
            const actionName = resolver.action

            const controller = this._app.get(controllerName)

            if (!check.object(controller) || !check.instance(controller, BasicController)) {
              throw new Error(`Route definition ${registrationLogNesting(sourceName, path, method)} controller is not a controller!`)
            }

            if (!check.function(controller[actionName])) {
              throw new Error(
                `Route definition ${registrationLogNesting(sourceName, path, method)}[${controllerName + '.' + actionName}] is not a function!`)
            }

            actionResolver = (req, res, next) => {
              return controller[actionName](req, res, next)
            }
            break

          //No supported resolver found, should be validated off on reducing step, but for a case...
          default:
            throw new InvalidArgumentException(
              `Route definition ${registrationLogNesting(sourceName, path, method)} contains wrong resolver!`)
        }

        const beforeMiddleware = []
        const afterMiddleware = []

        middleware.forEach((middlewareDefinition, index) => {
          switch (true) {
            case(check.function(middlewareDefinition)):
              beforeMiddleware.push(middlewareDefinition)
              break

            case(check.nonEmptyString(middlewareDefinition)):
              const middleware = this._app.get(middlewareDefinition)

              if (!check.object(middleware) || !check.instance(middleware, BasicMiddleware)) {
                throw new Error(
                  `Route definition ${registrationLogNesting(sourceName, path, method)} middleware (${index})`
                  + ` is not a middleware!`)
              }

              const handle = (...args) => {
                return middleware.handle(...args)
              }

              let targetScope = beforeMiddleware

              if (middleware.isAfter) {
                targetScope = afterMiddleware
              }

              targetScope.push(handle)
              break

            default:
              throw new InvalidArgumentException(
                `Route definition ${registrationLogNesting(sourceName, path, method)} linked to a wrong middleware (${index})!`)
          }
        })

        routerArguments = routerArguments.concat(beforeMiddleware)
        routerArguments.push(actionResolver)
        routerArguments = routerArguments.concat(afterMiddleware)

        this._expressRouter[method](...routerArguments)
      })
  }

  /**
   * Get fulfilled express router
   * @returns {Router}
   */
  getRouter() {
    return this._expressRouter
  }
}

/**
 * A list of supported express methods
 * @type {string[]}
 */
RoutesResolver.SUPPORTED_METHODS = [
  'use', 'all', 'param', 'get', 'post', 'put', 'delete', 'options',
]

module.exports = RoutesResolver