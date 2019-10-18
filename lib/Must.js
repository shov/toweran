'use strict'

const check = require('check-types')

const InvalidArgumentException = toweran.InvalidArgumentException

/**
 * A tool to check types of arguments
 * probably could be used @see https://www.npmjs.com/package/must instead
 * or it's going to be redundant since we move to TS
 */
class Must {
  /**
   * @param {{predicates: ?Array}} options
   */
  constructor(options = {}) {
    this._predicates = []
    if (options.predicates && check.array(options.predicates)) {
      this._predicates = options.predicates
    }

    /**
     * @const
     */
    this.PREDICATES = {
      NOT_BE: 'notBe', NULL_OR: 'nullOr',
    }

  }

  /**
   * Get check instance
   */
  check() {
    return check
  }

  /**
   * -------------- Predicates: --------------
   */

  /**
   * Get new clear instance
   * @return {Must}
   */
  get and() {
    return new this.constructor()
  }

  /**
   * Set predicate to be
   * @return {Must}
   */
  get be() {
    return new this.constructor({predicates: this._predicates})
  }

  /**
   * Set predicate to be not, has higher priority then be()
   * @return {Must}
   */
  get notBe() {
    return new this.constructor({predicates: this._predicates.concat([this.PREDICATES.NOT_BE])})
  }

  get nullOr() {
    return new this.constructor({predicates: this._predicates.concat([this.PREDICATES.NULL_OR])})
  }

  /**
   * -------------- Statements: --------------
   */

  /**
   * @param {boolean} value
   */
  boolean(value) {
    this._inspectStatement('boolean', check.boolean, value)
  }

  /**
   * @param {number} value
   */
  number(value) {
    this._inspectStatement('number', check.number, value)
  }

  /**
   * @param {number} value
   */
  integer(value) {
    this._inspectStatement('integer', check.integer, value)
  }

  /**
   * @param {string} value
   */
  string(value) {
    this._inspectStatement('string', check.string, value)
  }

  /**
   * @param {string} value
   */
  notEmptyString(value) {
    this._inspectStatement('not an empty string', check.nonEmptyString, value)
  }

  /**
   * @param {{}} value
   */
  object(value) {
    this._inspectStatement('object', check.object, value)
  }

  /**
   * @param {function} value
   */
  function(value) {
    this._inspectStatement('function', check.function, value)
  }

  /**
   * @param {[]} value
   */
  array(value) {
    this._inspectStatement('array', check.array, value)
  }

  /**
   * @param {[]} value
   */
  notEmptyArray(value) {
    this._inspectStatement('not an empty array', check.nonEmptyArray, value)
  }

  /**
   * @param {{}} value
   * @param {function} prototype
   */
  instance(value, prototype) {
    this.and.be.function(prototype)
    this.and.be.string(prototype.prototype.constructor.name || null)

    this._inspectStatement(`instance of ${prototype.prototype.constructor.name}`, (value, prototype) => {
      return check.instance(value, prototype)
    }, value, prototype)
  }

  /**
   * Check an array that it's an array of one sort of things and check that sort
   * @param {[]} arrValue
   * @param {string|function} type
   */
  arrayOf(arrValue, type) {
    this.and.be.array(arrValue)

    if (check.string(type) && check.function(this[type]) && type.indexOf('_') !== 0) {
      this._inspectStatement(`array of ${type}`, (arrValue, type) => {
        try {
          arrValue.forEach(val => this[type](val))
        } catch (e) {
          return false
        }
        return true
      }, arrValue, type)
    }

    if(check.function(type) && check.string(type.prototype.constructor.name || null)) {
      this._inspectStatement(`array of ${type.prototype.constructor.name}`, (arrValue, type) => {
        try {
          arrValue.forEach(val => this.instance(val, type))
        } catch (e) {
          return false
        }
        return true
      }, arrValue, type)
    }

    this._throw('Type must be primitive name of Class constructor!')
  }

  /**
   * -------------- Treating predicates: --------------
   */

  /**
   * null predicate inspection
   * @param value
   * @return {boolean}
   * @private
   */
  _nullInspection(value) {
    return null === value && this._predicates.includes(this.PREDICATES.NULL_OR)
  }

  /**
   * notBe/Be predicate inspection
   * @param {boolean} result
   * @return {boolean}
   * @private
   */
  _beingInspection(result) {
    return this._predicates.includes(this.PREDICATES.NOT_BE) ? !result : result
  }

  /**
   * -------------- Other stuff: --------------
   */

  /**
   * Perform the checking
   * @param {string} statementName
   * @param {function} method
   * @param {*[]} args
   * @private
   */
  _inspectStatement(statementName, method, ...args) {
    const result = this._beingInspection(
      this._nullInspection(...args) || method(...args)
    )

    if (!result) {
      this._throw(this._msg(statementName))
    }
  }

  /**
   * Former a message of an error
   * @param statementPoint
   * @return {string}
   * @private
   */
  _msg(statementPoint) {
    return `Invalid value has been given! Expected it ${
      this._predicates.includes(this.PREDICATES.NOT_BE) ? 'not to be' : 'to be'
      } ${statementPoint}${
      this._predicates.includes(this.PREDICATES.NULL_OR) ? ' or null' : ''
      }!`
  }

  /**
   * Throw an exception of Invalid Argument
   * @param {?string} msg
   * @private
   */
  _throw(msg = null) {
    if (!check.nonEmptyString(msg)) {
      msg = null
    }

    throw new InvalidArgumentException(msg || `Invalid value has been given!`)
  }
}

module.exports = Must
