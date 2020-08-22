'use strict'

require('../../bootstrap')

const {
  FRAMEWORK_PATH,
  InvalidArgumentException
} = toweran

const fs = require('fs-extra')
const Logger = toweran.Logger
const RoutesResolver = require(FRAMEWORK_PATH + '/lib/RoutesResolver.js')
const check = require('check-types')

describe(`Test routers loading`, () => {

  const EXISTING_CONTROLLER_NAME = 'ExistingController'
  const EXISTING_ACTION = 'existingAction'

  class ExistingController extends toweran.BasicController {
    constructor() {
      super()
      this.notAFunction = null
    }

    existingAction(req, res, next) {
    }
  }

  /**
   * @type {LoggerInterface}
   */
  let logger

  /**
   * @type {RoutesResolver}
   */
  let routesResolver

  /**
   * @type {{get: function(expression: string): *}}
   */
  let app = {
    get: (expression) => {
      if (expression === EXISTING_CONTROLLER_NAME) {
        return new ExistingController()
      }

      return {}
    }
  }

  /**
   * A mock for express routrer factory
   */
  let expressRouterFactory = () => {
    return new RouterMock()
  }

  beforeAll(() => {
    logger = new Logger(toweran.TEST_PATH + '/data/logs', 'framework_testing')
  })

  beforeEach(() => {
    routesResolver = new RoutesResolver(logger, app, expressRouterFactory)
  })

  it(`Resolving mixed type of routes, positive`, () => {
    const definitions = [
      {
        path: '/api/v1',
        sub: [
          {
            path: '/books',
            method: 'get',
            resolver: {
              controller: EXISTING_CONTROLLER_NAME,
              action: EXISTING_ACTION
            }
          },
          {
            path: '/books',
            method: 'post',
            resolver: () => {
            }
          },
        ]
      },
      {
        path: '/',
        method: 'get',
        resolver: (req, res, next) => {
        }
      },
      {
        path: '/api/v1/rpc',
        method: 'get',
        resolver: () => {
        },
        sub: [
          {
            path: '/find-way',
            method: 'get',
            resolver: {
              controller: EXISTING_CONTROLLER_NAME,
              action: EXISTING_ACTION
            },
            sub: [
              {
                path: '/back',
                method: 'get',
                resolver: {
                  controller: EXISTING_CONTROLLER_NAME,
                  action: EXISTING_ACTION
                },
              },
            ]
          },
        ]
      },
    ]
    const expected = [
      {path: '/api/v1/books', method: 'get', validCb: true},
      {path: '/api/v1/books', method: 'post', validCb: true},
      {path: '/', method: 'get', validCb: true},
      {path: '/api/v1/rpc', method: 'get', validCb: true},
      {path: '/api/v1/rpc/find-way', method: 'get', validCb: true},
      {path: '/api/v1/rpc/find-way/back', method: 'get', validCb: true},
    ]

    routesResolver.resolveRoutes('test', definitions)
    const result = routesResolver.getRouter()

    expect(result.registered).toStrictEqual(expected)
  })

  it(`Neither sub, nor method`, () => {
    const definitions = [
      {
        path: '/',
        resolver: (req, res, next) => {
        },
      },
    ]

    expect(() => {
      routesResolver.resolveRoutes('test', definitions)
    }).toThrow(InvalidArgumentException)
  })

  it(`Not supported method`, () => {
    const definitions = [
      {
        path: '/',
        method: 'III_O_C',
        resolver: (req, res, next) => {
        },
      },
    ]

    expect(() => {
      routesResolver.resolveRoutes('test', definitions)
    }).toThrow(InvalidArgumentException)
  })

  it(`No path`, () => {
    const definitions = [
      {
        method: 'get',
        resolver: (req, res, next) => {
        },
      },
    ]

    expect(() => {
      routesResolver.resolveRoutes('test', definitions)
    }).toThrow(InvalidArgumentException)
  })

  it(`Not valid resolver`, () => {
    const definitions = [
      {
        path: '/',
        method: 'get',
        resolver: 42,
      },
    ]

    expect(() => {
      routesResolver.resolveRoutes('test', definitions)
    }).toThrow(InvalidArgumentException)
  })

  it(`Not valid controller`, () => {
    const definitions = [
      {
        path: '/',
        method: 'get',
        resolver: {
          controller: 'NoController',
          action: 'noLukaAnyMore',
        },
      },
    ]

    expect(() => {
      routesResolver.resolveRoutes('test', definitions)
    }).toThrow(Error)
  })

  it(`Not valid action`, () => {
    const definitions = [
      {
        path: '/',
        method: 'get',
        resolver: {
          controller: EXISTING_CONTROLLER_NAME,
          action: 'notAFunction',
        },
      },
    ]

    expect(() => {
      routesResolver.resolveRoutes('test', definitions)
    }).toThrow(Error)
  })
})

class RouterMock {
  constructor() {
    this.registered = []
  }

  register(method, path, cb) {
    this.registered.push({
      method,
      path,
      validCb: check.function(cb)
    })
  }
}

for (let method of RoutesResolver.SUPPORTED_METHODS) {
  RouterMock.prototype[method] = function (...args) {
    this.register(method, ...args)
  }
}