'use strict'

const must = toweran.must
const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')

/**
 * TODO: temporary solution, discuss it
 * A helper to load js files by rules, by glob patterns / paths
 */
class ScriptLoader {
  /**
   * DI
   * @param {LoggerInterface} logger
   */
  constructor(logger) {
    /**
     * @type {LoggerInterface}
     * @private
     */
    this._logger = logger
  }

  /**
   * Process a path/pattern of glob
   * @param {string} expression
   * @param {?function} cb
   * @return {string[]}
   */
  processExpression(expression, cb = null) {
    must.be.notEmptyString(expression)
      .and.be.nullOr.function(cb)

    const result = []

    //TODO: implement
    //1 check if expression is not a glob pattern but correct dir path, turn it to be a glob pattern
    //2 loop the glob pattern
    //2.1 put into cb each file, if cb return true, add it to the result
    //3 return result

    return result
  }

  /**
   * Predefined callback for processing
   * validate any js files
   * @param {string} file
   * @return {boolean}
   */
  isJsFile(file) {
    must.be.notEmptyString(file)
    //TODO: implement
  }

  /**
   * Predefined callback for processing
   * validate ES6Classes
   * @param {string} file
   * @return {boolean}
   */
  isES6Class(file) {
    must.be.notEmptyString(file)
  //TODO: implement
  }

}

module.exports = ScriptLoader