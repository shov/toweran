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
  const EXISTING_MIDDLEWARE_NAME = 'existingMiddleware'
  const EXISTING_AFTER_MIDDLEWARE_NAME = 'existingAfterMiddleware'

  class ExistingController extends toweran.BasicController {
    constructor() {
      super()
      this.notAFunction = null
    }

    existingAction(req, res, next) {
    }
  }

  class ExistingMiddleware extends toweran.BasicMiddleware {
    handle(req, res, next) {
    }
  }

  class ExistingAfterMiddleware extends toweran.BasicMiddleware {
    get isAfter() {
      return true
    }

    handle(req, res, next) {
      return true
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

      if (expression === EXISTING_MIDDLEWARE_NAME) {
        return new ExistingMiddleware()
      }

      if (expression === EXISTING_AFTER_MIDDLEWARE_NAME) {
        return new ExistingAfterMiddleware()
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
        ],
      },
      {
        path: '/api/v1',
        middleware: [
          () => {
          },
          () => {
          }
        ],
        sub: [
          {
            resolver: () => {
            },
            method: 'post'
          },
          {
            path: '/verify',
            method: 'put',
            middleware: [EXISTING_MIDDLEWARE_NAME],
            resolver: () => {
            },
            sub: [
              {
                path: '/secret',
                method: 'put',
                resolver: {
                  controller: EXISTING_CONTROLLER_NAME,
                  action: EXISTING_ACTION
                }
              }
            ]
          }
        ]
      },
    ]
    const expected = [
      {path: '/api/v1/books', method: 'get', validCb: true, count: 1},
      {path: '/api/v1/books', method: 'post', validCb: true, count: 1},
      {path: '/', method: 'get', validCb: true, count: 1},
      {path: '/api/v1/rpc', method: 'get', validCb: true, count: 1},
      {path: '/api/v1/rpc/find-way', method: 'get', validCb: true, count: 1},
      {path: '/api/v1/rpc/find-way/back', method: 'get', validCb: true, count: 1},
      {path: '/api/v1', method: 'post', validCb: true, count: 3},
      {path: '/api/v1/verify', method: 'put', validCb: true, count: 4},
      {path: '/api/v1/verify/secret', method: 'put', validCb: true, count: 4},
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

  it(`No path no sub, positive`, () => {
    const definitions = [
      {
        method: 'use',
        resolver: (req, res, next) => {
        },
      },
    ]

    const expected = [
      {path: null, method: 'use', validCb: true, count: 1},
    ]

    routesResolver.resolveRoutes('test', definitions)
    const result = routesResolver.getRouter()

    expect(result.registered).toStrictEqual(expected)
  })

  it(`Sun and no path`, () => {
    const definitions = [
      {
        sub: []
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

  it(`Not valid middleware`, () => {
    const definitions = [
      {
        path: '/',
        method: 'get',
        middleware: ['no middleware'],
        resolver: {
          controller: EXISTING_CONTROLLER_NAME,
          action: EXISTING_ACTION,
        },
      },
    ]

    expect(() => {
      routesResolver.resolveRoutes('test', definitions)
    }).toThrow(Error)
  })

  it(`After middleware, positive`, () => {
    const definitions = [
      {
        method: 'use',
        middleware: [EXISTING_MIDDLEWARE_NAME, EXISTING_AFTER_MIDDLEWARE_NAME, () => {}],
        resolver: {
          controller: EXISTING_CONTROLLER_NAME,
          action: EXISTING_ACTION,
        },
      },
    ]

    const specRouteResolver = new RoutesResolver(logger, app, () => {
      return new AfterTriggerRouterMock()
    })

    const expected = [
      [0, 0, 0, 1],
    ]

    specRouteResolver.resolveRoutes('test', definitions)
    const result = specRouteResolver.getRouter()

    expect(result.registered).toStrictEqual(expected)

  })
})

class RouterMock {
  constructor() {
    this.registered = []
  }

  register(method, ...args) {
    this.registered.push({
      method,
      path: args[1] ? args[0] : null,
      validCb: (args[1] ? args.slice(1).reduce((acc, f) => {
        return acc && check.function(f)
      }, true) : check.function(args[0])),
      count: args.length > 1 ? args.length - 1 : 1
    })
  }
}

for (let method of RoutesResolver.SUPPORTED_METHODS) {
  RouterMock.prototype[method] = function (...args) {
    this.register(method, ...args)
  }
}

class AfterTriggerRouterMock {
  constructor() {
    this.registered = []
  }

  register(method, ...args) {
    this.registered.push([...args.map(f => {
      if(!check.function(f)) {
        throw new Error(`Expect no path for this test`)
      }
      //0 for resolver and before middleware, 1 for after middleware
      return (f() === true) ? 1 : 0
    })])
  }
}

for (let method of RoutesResolver.SUPPORTED_METHODS) {
  AfterTriggerRouterMock.prototype[method] = function (...args) {
    this.register(method, ...args)
  }
}