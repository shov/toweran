'use strict'

const Annotation = require('simple-annotation')
const must = toweran.must
const check = require('check-types')

/**
 * Inspects files to get annotations and other stuff from
 */
class AnnotationInspector {
  /**
   * DI
   * @param {Logger} logger
   */
  constructor(logger) {
    /**
     * @type {Logger}
     * @private
     */
    this._logger = logger

    this._registerAnnotation()
  }

  /**
   * Get a list of dependencies from annotations
   * @param {string} file
   * @return {null|string[]}
   */
  getAnnotatedDependencies(file) {
    must.be.string(file)

    const logger = this._logger
    const annotated = this.getAnnotations(file)

    if (!annotated.DI || !Array.isArray(annotated.DI)) {
      return null
    }

    let dependencies = annotated.DI.reduce((list, diTag) => {

      //TODO: add another notations as function Name() and Name = function()
      if ('constructor' !== diTag.return) {
        logger.warn(`@DI is allowed only for ES6 constructors, it's defined for '${di.return}' in ${file}, skipped`)
        return list
      }

      if (!diTag.value || !check.nonEmptyString(diTag.value)) {
        this._logger.warn(`@DI annotation contains not a string! In ${file}, skipped`)
        return list
      }

      return list.concat(diTag.value.trim().split(','))

    }, [])


    if (0 === dependencies.length) {
      return null
    }

    return dependencies
  }

  /**
   * Get annotations from a file
   * @param path
   * @return {Array|*}
   */
  getAnnotations(path) {
    const annotator = new Annotation()
    annotator.setPath(path)

    return annotator.findAll()
  }

  /**
   * Register ES6 method definition annotations
   * @private
   */
  _registerAnnotation() {
    /**
     * Register DI annotation
     */
    Annotation.registerAnnotationReturnType(
      'ES6methods',
      function (attr) {

        const regex = /^\s*(.*?)[^\S\r\n]*\(/
        const parts = attr.str.match(regex)

        return (check.array(parts) && parts[1]) ? parts[1] : null
      }
    )

    Annotation.registerAnnotation('DI', 'string', 'ES6methods')
  }
}

module.exports = AnnotationInspector
