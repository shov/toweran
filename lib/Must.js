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
    this._inspectStatement('an boolean', check.boolean, value)
    return this
  }

  /**
   * @param {number} value
   */
  number(value) {
    this._inspectStatement('a number', check.number, value)
    return this
  }

  /**
   * @param {number} value
   */
  integer(value) {
    this._inspectStatement('an integer', check.integer, value)
    return this
  }

  /**
   * @param {string} value
   */
  string(value) {
    this._inspectStatement('a string', check.string, value)
    return this
  }

  /**
   * @param {string} value
   */
  notEmptyString(value) {
    this._inspectStatement('not an empty string', check.nonEmptyString, value)
    return this
  }

  /**
   * @param {{}} value
   */
  object(value) {
    this._inspectStatement('an object', check.object, value)
    return this
  }

  /**
   * @param {function} value
   */
  function(value) {
    this._inspectStatement('a function', check.function, value)
    return this
  }

  /**
   * @param {[]} value
   */
  array(value) {
    this._inspectStatement('an array', check.array, value)
    return this
  }

  /**
   * @param {[]} value
   */
  notEmptyArray(value) {
    this._inspectStatement('not an empty array', check.nonEmptyArray, value)
    return this
  }

  /**
   * @param {symbol} value
   */
  symbol(value) {
    this._inspectStatement('a symbol', (value) => {
      return 'symbol' === typeof value
    }, value)
    return this
  }

  /**
   * @param {symbol|string} value
   */
  notEmptyStringOrSymbol(value) {
    this._inspectStatement('not an empty string or a symbol', (value) => {
      return 'symbol' === typeof value || check.nonEmptyString(value)
    }, value)
    return this
  }

  /**
   * @param {{}} value
   * @param {function} prototype
   */
  instance(value, prototype) {
    this.and.be.function(prototype)

    let constructorName
    try {
      constructorName = this._getConstructorName(prototype)
    } catch (e) {
      this._throw(`Wrong prototype given, not an anonymous constructor was expected!`)
    }

    this._inspectStatement(`an instance of ${constructorName}`, (value, prototype) => {
      return check.instance(value, prototype)
    }, value, prototype)
    return this
  }

  /**
   * Check an array to it be of one sort of things and check that sort
   * @param {[]} arrValue
   * @param {string|function} type
   */
  arrayOf(arrValue, type) {
    const allowedTypes = [
      'string', 'number', 'boolean', 'undefined', 'symbol',
      'object', 'function',
      'integer'
    ]

    switch (true) {
      case (check.string(type) && allowedTypes.includes(type)) :
        this._inspectStatement(`an array of ${type}`, (arrValue, type) => {

          if (!Array.isArray(arrValue)) {
            return false
          }

          return arrValue.every(entry => {
            return (null !== entry) && (
              'integer' === type
                ? check.integer(entry)
                : type === typeof entry
            )
          })

        }, arrValue, type)
        break

      case (check.function(type)) :
        let constructorName
        try {
          constructorName = this._getConstructorName(type)
        } catch (e) {
          this._throw(`Wrong prototype given, a name of type or not an anonymous constructor was expected!`)
        }

        this._inspectStatement(`an array of ${constructorName}`, (arrValue, type) => {

          if (!Array.isArray(arrValue)) {
            return false
          }

          return arrValue.every(entry => {
            return check.instance(entry, type)
          })

        }, arrValue, type)
        break

      default:
        this._throw('Type must be primitive name of Class constructor!')
    }
    return this
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
   * @param {*} args
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

  /**
   * Try to get constructor name from a prototype
   * @param {{}} prototype
   * @return {string}
   * @private
   */
  _getConstructorName(prototype) {
    const constructorName = prototype.prototype && prototype.prototype.constructor && prototype.prototype.constructor.name
      ? prototype.prototype.constructor.name
      : null
    this.and.be.notEmptyString(constructorName)
    return constructorName
  }
}

module.exports = Must
