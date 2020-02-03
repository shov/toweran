'use strict'

/**
 * Global constants, TODO: hope we can have a better solution or this is already good enough
 */
module.exports = {
  /**
   * Dependency Injection
   */
  DI: {
    DOT_NOTATION: Symbol(`Dot notation: like "app.domain.auth.service.UserService"`),
  },

  /**
   * HTTP response codes
   */
  HTTP: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,

    MOVED_PERMANENTLY: 301,
    FOUND: 302,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ALLOWED: 405,

    IM_A_TEAPOT: 418,
    UNPROCESSABLE_ENTITY: 422,

    TOO_MANY_REQUESTS: 429,

    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  }
}