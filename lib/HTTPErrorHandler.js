'use strict'

const check = require('check-types')

const {
  CONST,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ValidationException,
} = toweran

/**
 * After middleware that handles HTTP Exceptions
 */
class HTTPErrorHandler {
  /**
   * DI
   * @param {Logger} logger
   */
  constructor(logger) {
    this._logger = logger
  }

  handle(err, req, res, next) {

    this._logger.error(err.message, err.stack)

    let respCode = CONST.HTTP.INTERNAL_SERVER_ERROR

    switch (true) {
      case (check.instance(err, BadRequestException)):
        respCode = CONST.HTTP.BAD_REQUEST
        break
      case (check.instance(err, UnauthorizedException)):
        respCode = CONST.HTTP.UNAUTHORIZED
        break
      case (check.instance(err, ForbiddenException)):
        respCode = CONST.HTTP.FORBIDDEN
        break
      case (check.instance(err, NotFoundException)):
        respCode = CONST.HTTP.NOT_FOUND
        break
      case (check.instance(err, ValidationException)):
        respCode = CONST.HTTP.UNPROCESSABLE_ENTITY
        break
    }

    res.status(respCode).send({
      errors: [{msg: err.message}]
    })
  }
}

module.exports = HTTPErrorHandler
