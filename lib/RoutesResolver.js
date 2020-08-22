'use strict'

const {
  must,
  InvalidArgumentException,
  BasicController,
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
   * @typedef {[
   *  {
   *    path: ?string,
   *    method: string,
   *    resolver: {
   *      controller: string,
   *      action: string
   *    }|*,
   *    sub: ?RouterDefinitionList
   *  }
   * ]} RouterDefinitionList
   */

  /**
   * Add a named group of routes' definitions to express Route
   *
   * There are several possible cases:
   *  - path, method, resolver (callback) - regular short route
   *  - path, method, resolver (controller action) - regular route
   *  - method, resolver (callback) - regular short middleware
   *  - method, resolver (controller action) - technically possible middleware, not recommended. Middleware are coming soon :)
   *  - path, sub - regular wrapper
   *  - path, method, resolver, sub - wrapper + root endpoint
   *  - sub without path - isn't allowed, sub is for wrapping by path
   *  - the rest of cases are not allowed as well
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

    routeDefinitionList.forEach((definition, index) => {
      //Sub definitions
      let subDetected = false
      if (check.array(definition.sub)) {
        subDetected = true
      }

      //Method
      let doResolving = true
      if (!check.nonEmptyString(definition.method)) {
        if (!subDetected) {
          throw new InvalidArgumentException(
            `Route definition ${sourceName}[${index}] contains no method and doesn't wrap anything!`)
        }

        //Sub detected, but there is no method, hence the definition is only for wrapping
        doResolving = false

      } else if (!this.SUPPORTED_METHODS.includes(definition.method)) {
        throw new InvalidArgumentException(
          `Route definition ${sourceName}[${index}] contains unsupported method "${definition.method}"!`)
      }

      //Path
      let pathDetected = false
      if (check.nonEmptyString(definition.path)) {
        pathDetected = true
      }

      if(!pathDetected && subDetected) {
        throw new InvalidArgumentException(`Route definition ${sourceName}[${index}] contains sub, path is required!`)
      }

      //Resolver
      if (doResolving) {

        const routerArguments = []

        if(pathDetected) {
          routerArguments.push(pathPrefix + definition.path)
        }

        switch (true) {
          //Closure resolver
          case(check.function(definition.resolver)):
            routerArguments.push(definition.resolver)
            break

          //Controller resolver
          case(
            check.object(definition.resolver)
            && check.nonEmptyString(definition.resolver.controller)
            && check.nonEmptyString(definition.resolver.action)
          ):
            const controllerName = definition.resolver.controller
            const actionName = definition.resolver.action

            const controller = this._app.get(controllerName)

            if (!check.object(controller) || !check.instance(controller, BasicController)) {
              throw new Error(`Route definition ${sourceName}[${index}][${controllerName}] is not a controller!`)
            }

            if (!check.function(controller[actionName])) {
              throw new Error(`Route definition ${sourceName}[${index}][${controllerName + '.' + actionName}] is not a function!`)
            }

            routerArguments.push((req, res, next) => {
              controller[actionName](req, res, next)
            })
            break

          //No supported resolver found
          default:
            throw new InvalidArgumentException(`Route definition ${sourceName}[${index}] contains wrong resolver!`)
        }

        this._expressRouter[definition.method](...routerArguments)
      }

      //Sub definitions resolving
      if (subDetected) {
        const options = {
          pathPrefix: pathPrefix + definition.path
        }

        this.resolveRoutes(sourceName + '[sub]', definition.sub, options)
      }
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