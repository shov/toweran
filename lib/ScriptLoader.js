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
   * Process a path/pattern of glob
   * @param {string} expression
   * @param {?function} cb
   * Into the callback will be passed a list of files that were found by the given pattern,
   * an end-user should treat them and return an array of result that's going to be returned by the method
   *
   * @return {[*]|string[]}
   */
  processExpression(expression, cb = null) {
    must.be.notEmptyString(expression)
      .and.be.nullOr.function(cb)

    cb = cb || (files => files.filter(this.isJsFile))


    let result = []

    //If expression is not a glob pattern but correct dir path, turn it to be a glob pattern
    try {
      if (!/(\*|\?)/.test(expression) && fs.statSync(expression).isDirectory()) {
        expression = path.resolve(expression) + '/**/*.js'
      }

    } catch (e) {
      throw new toweran.InvalidArgumentException(`Wrong expression given '${expression}', expected glob pattern or existing dir!`)
    }

    glob.sync(expression).forEach(file => {
      result.push(file)
    })

    result = cb(result)

    must.be.array(result)

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

    //check just by extension
    if (!/.+\.js$/.test(file)) {
      return false
    }

    try {
      fs.accessSync(file, fs.constants.R_OK)
    } catch (e) {
      return false
    }

    return true
  }

  /**
   * Predefined callback for processing
   * validate if a file is a module of ES6 class or exports a constructor
   * @param {string} file
   * @return {boolean}
   */
  isClass(file) {
    must.be.notEmptyString(file)

    if (!this.isJsFile(file)) {
      return false
    }

    const content = fs.readFileSync(file).toString()

    file.match(/^(.*)\/([^\/]*)\.js$/)
    const expectedClassName = RegExp.$2

    const es6ClassFound = (new RegExp(`class\\s\+${expectedClassName}`)).test(content)
    const constructorFound = (new RegExp(`(function\\s\+${expectedClassName}|${expectedClassName}(\\s\+)\?=(\\s\+)\?function)`)).test(content)

    const classIsDefined = es6ClassFound || constructorFound

    const classIsExported = (new RegExp(`module.exports(\\s\+)\?=(\\s\+)\?${expectedClassName}`)).test(content)

    const rightNamedConstructorIsExported = (new RegExp(`module.exports(\\s\+)\?=(\\s\+)\?function\\s\+${expectedClassName}`)).test(content)

    return (classIsDefined && classIsExported) || rightNamedConstructorIsExported
  }

}

module.exports = ScriptLoader
