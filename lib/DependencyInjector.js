'use strict'

const must = toweran.must
const check = require('check-types')
const escapeStringRegexp = require('escape-string-regexp')

const {
  InvalidArgumentException,
  APP_PATH,
  FRAMEWORK_PATH,
} = toweran;

/**
 * Check if pattern contains relative path
 * @param pattern
 * @return {boolean}
 */
const doesPatternContainRelativePath = (pattern) => {
  return /(\.\/|~\/)+/.test(pattern);
};

/**
 * Check if pattern start from the value of the "APP_PATH" variable.
 * @param pattern
 * @return {boolean}
 */
const doesPatternStartFromAppPath = (pattern) => {
  const escapedAppPath = escapeStringRegexp(toweran.APP_PATH);
  const regExp = new RegExp(`^${escapedAppPath}(\\/|\\\\)[^*\\/]+`);
  return regExp.test(pattern);
};

/**
 * Check if pattern start from the value of the "FRAMEWORK_PATH" variable.
 * @param pattern
 * @return {boolean}
 */
const doesPatternStartFromFrameworkPath = (pattern) => {
  const escapedFrameworkPath = escapeStringRegexp(FRAMEWORK_PATH);
  const regExp = new RegExp(`^${escapedFrameworkPath}(\\/|\\\\)[^*\\/]+`);
  return regExp.test(pattern);
};

/**
 * Handle Auto dependency injection
 */
class DependencyInjector {
  /**
   * DI
   * @param {LoggerInterface} logger
   * @param {{app:{di:[]}}} config TODO: use ConfigManager
   * @param {ContainerInterface} container
   * @param {ScriptLoader} scriptLoader
   * @param {AnnotationInspector} annotationInspector
   */
  constructor(logger, container, config, scriptLoader, annotationInspector) {
    /**
     * @type {LoggerInterface}
     * @private
     */
    this._logger = logger

    /**
     * @type {{app: {di: *[]}}}
     * @private
     */
    this._config = config

    /**
     * @type {ContainerInterface}
     * @private
     */
    this._container = container

    /**
     * @type {ScriptLoader}
     * @private
     */
    this._scriptLoader = scriptLoader

    /**
     * @type {AnnotationInspector}
     * @private
     */
    this._annnotationInspector = annotationInspector

    /**
     * @type {Function}
     * @private
     */
    this._isJsFileCb = (function (files) {
      must.be.arrayOf(files, 'string')
      return files.filter(this._scriptLoader.isJsFile.bind(this._scriptLoader))
    }).bind(this)

    /**
     * @type {Function}
     * @private
     */
    this._isClassCb = (function (files) {
      must.be.arrayOf(files, 'string')
      return files.filter(this._scriptLoader.isClass.bind(this._scriptLoader))
    }).bind(this)

    /**
     * @const
     * @type {symbol}
     */
    this.DEFAULT_STRATEGY = toweran.C.DI.DOT_NOTATION
  }

  /**
   * Initialization, boot step; gets registered di expressions from the config,
   * analyzes them and builds a line of candidates to be registered in the container
   * Expect to find DI sets in the config by the key "app.di"
   * Any path expression can be directory path or glob pattern, here are examples
   * {{di: [
   *   {
   *     path: `${toweran.APP_PATH}/app`,
   *     strategy: toweran.C.DI.DOT_NOTATION,
   *     base: `app`
   *     strict: true,
   *   },
   *   {
   *     path: {
   *       include: `${toweran.APP_PATH}/app/**`,
   *       exclude: `${toweran.APP_PATH}/app/http/**`,
   *     }
   *     strategy: toweran.C.DI.DOT_NOTATION,
   *     base: `app`
   *   },
   *   {
   *     path: {
   *       include: `${toweran.APP_PATH}/app`,
   *       exclude: [
   *         `${toweran.APP_PATH}/app/http/controllers`,
   *         `${toweran.APP_PATH}/app/http/middleware`,
   *       ],
   *     }
   *     strategy: toweran.C.DI.DOT_NOTATION,
   *     base: `app`
   *   },
   * ]}}
   * for more examples @see tests/unit/lib/DependencyInjector/InjectingTest.js
   */
  init() {
    if (!this._config.app || !this._config.app.di) {
      this._logger.warn(`No DI config found in app.di, skipped.`)
      return
    }

    must.be.array(this._config.app.di)

    //Parse the config
    let candidates = this._config.app.di.reduce((candidates, set, setIndex) => {

      //get parsed from a set
      const {pathData, strategy, base, strict} = this._parseConfigSet(set, setIndex)

      //get candidates
      const candidatesPortion = this._getCandidates(pathData, strategy, base, strict)

      return candidates.concat(candidatesPortion)
    }, [])

    //Register the candidates
    this._registerCandidates(candidates)
  }

  /**
   * Try to register js file as a Class in the container, by strategy, skip in case of fail
   * @param {string} pattern
   * @param {string} filePath
   * @param {symbol} strategy
   * @param {*[]} args
   */
  registerClass(pattern, filePath, strategy = toweran.C.DI.DOT_NOTATION, ...args) {
    must.be.notEmptyString(pattern)
      .and.be.notEmptyString(filePath)

    if (!this._isStrategyValid(strategy)) {
      throw new toweran.InvalidArgumentException(`Not known strategy, cant register a class! (pattern ${pattern}, file ${filePath})`)
    }

    switch (strategy) {
      case toweran.C.DI.DOT_NOTATION:
        try {
          this._dotNotationClassRegistration(pattern, filePath, args[0] || '')
        } catch (e) {
          this._logger.warn(`${e.message}`)
          this._logger.warn(`Class in file ${filePath} is corrupted, can't load, skip!`)
        }

        break
    }
  }

  /**
   * Try to register js file as a Class in the container, by strategy, or fail wit an exception
   * @throw {Error}
   * @param {string} pattern
   * @param {string} filePath
   * @param {symbol} strategy
   * @param {*[]} args
   */
  registerClassStrict(pattern, filePath, strategy = toweran.C.DI.DOT_NOTATION, ...args) {
    must.be.notEmptyString(pattern)
      .and.be.notEmptyString(filePath)

    if (!this._isStrategyValid(strategy)) {
      throw new toweran.InvalidArgumentException(`Not known strategy, cant register a class! (pattern ${pattern}, file ${filePath})`)
    }

    switch (strategy) {
      case toweran.C.DI.DOT_NOTATION:
        this._dotNotationClassRegistration(pattern, filePath, args[0] || '')
        break
    }
  }

  /**
   * Register a class in the container by the dot notation
   * @param {string} pattern
   * @param {string} filePath
   * @param {?string} base
   * @private
   */
  _dotNotationClassRegistration(pattern, filePath, base = null) {
    must.be.notEmptyString(pattern)
      .and.be.notEmptyString(filePath)
      .and.be.nullOr.string(base)

    const name = filePath.replace(/^(.*)\/([^/.]+).js$/, '$2')

    const begin = this._cutPattern(pattern)
    let tail = filePath.split(begin)[1]

    must.be.notEmptyString(tail)

    if (!base) {
      tail = tail.slice(1)
    }

    const key = `${(base ? base : '')}${tail}`
      .replace(/^(.*)\.js$/, '$1')
      .replace(/\//g, '.')

    if (this._container.has(key)) {
      this._logger.warn(`The key '${key}' is already registered, skip.`)
      return
    }

    const imported = require(filePath)

    if (
      !check.function(imported)
      || !imported.prototype
      || !imported.prototype.constructor
      || !check.nonEmptyString(imported.prototype.constructor.name)
    ) {
      throw new Error(`The file exports not a constructor`)
    }

    if (name !== imported.prototype.constructor.name) {
      throw new Error(`The constructor has not expected name! Expected: ${name}, given: ${imported.prototype.constructor.name}`)
    }

    const dependencies = this._annnotationInspector.getAnnotatedDependencies(filePath)

    //TODO: add a possibility to register factories and singletons by annotations
    const registration = this._container.register(key, imported)

    if (dependencies) {
      registration.dependencies(...dependencies)
    }
  }

  /**
   * Parse a config DI set
   * @param {{
   *   path: string|string[]|{include:string|string[], exclude:string|string[]},
   *   base: *,
   *   strategy: ?symbol,
   *   strict: ?boolean
   * }} set
   * @param {number|string} setIndex
   * @return {{
   *   pathData: {
   *     include: string[],
   *     exclude: string[]
   *   },
   *   strategy: number | symbol,
   *   base: *
   * }}
   * @private
   */
  _parseConfigSet(set, setIndex = '-') {
    must.be.object(set)

    //Validate path, can be an object or not empty string as only one patch to  include
    if (!check.nonEmptyString(set.path) && !check.object(set.path)) {
      throw new toweran.InvalidArgumentException(`DI path must be nonempty string or object! Set index: ${setIndex}`)
    }

    const pathData = check.object(set.path) ? {...set.path} : {include: [set.path]}

    //Check includes
    if (!pathData.include || pathData.include.length < 1) {
      throw new toweran.InvalidArgumentException(`DI path set must includes at least one path! Set index: ${setIndex}`)
    }

    if (check.string(pathData.include)) {
      pathData.include = [pathData.include]
    }

    //Check excludes
    if (!pathData.exclude) {
      pathData.exclude = []
    }

    if (check.string(pathData.exclude)) {
      pathData.exclude = [pathData.exclude]
    }

    // Validate paths
    [
      ...pathData.include,
      ...pathData.exclude,
    ].forEach((pattern) => {

      if (doesPatternContainRelativePath(pattern)) {
        throw new InvalidArgumentException('Pattern must not contain relative paths!')
      }

      if ( !doesPatternStartFromAppPath(pattern)
        && !doesPatternStartFromFrameworkPath(pattern)
      ) {
        throw new InvalidArgumentException('Pattern must start from the application root dir or the framework path, but mustn\'t point to a root itself!')
      }
    });

    //Strategy
    const strategy = set.strategy || this.DEFAULT_STRATEGY
    if (!this._isStrategyValid(strategy)) {
      throw new toweran.InvalidArgumentException(`DI path set strategy is not known! Set index: ${setIndex}`)
    }

    //Base
    const base = set.base || null

    //Strictness
    const strict = set.strict || false
    must.be.boolean(strict)

    return {
      pathData,
      strategy,
      base,
      strict,
    }
  }

  /**
   * Validate if strategy are known
   * @param {symbol} strategy
   * @return {boolean}
   * @private
   */
  _isStrategyValid(strategy) {
    must.be.symbol(strategy)

    return [
      toweran.C.DI.DOT_NOTATION
    ].includes(strategy)
  }

  /**
   * Get candidates from parsed config a set
   * @param {{include: string[], exclude: string[]}} pathData
   * @param {symbol} strategy
   * @param {*} base
   * @param {boolean} strict
   * @return {{
   *   pattern: string,
   *   filePath: string,
   *   strategy: symbol,
   *   base: *,
   *   strict: boolean
   *   }[]}
   * @private
   */
  _getCandidates(pathData, strategy, base = null, strict) {
    must.be.object(pathData)
      .and.be.arrayOf(pathData.include, 'string')
      .and.be.arrayOf(pathData.exclude, 'string')
      .and.be.symbol(strategy)
      .and.be.boolean(strict)

    const toExclude = [...new Set(
      pathData.exclude
        .reduce((files, pattern) => {
          const foundFiles = this._scriptLoader.processExpression(pattern, this._isJsFileCb)
          return files.concat(foundFiles)
        }, [])
    )]

    return pathData.include
      .reduce((files, pattern) => {

        //get files with patterns of include
        const foundFiles = this._scriptLoader
          .processExpression(pattern, this._isClassCb)
          .map(filePath => {
            return {
              filePath,
              pattern,
            }
          })
        return files.concat(foundFiles)

      }, [])

      //exclude
      .filter(data => !toExclude.includes(data.filePath))

      //forming
      .map(data => {
        return {
          pattern: data.pattern,
          filePath: data.filePath,
          strategy,
          base,
          strict,
        }
      })
  }

  /**
   * Registering the candidates in the container
   * @param {{
   *   pattern: string,
   *   filePath: string,
   *   strategy: symbol,
   *   base: *,
   *   strict: boolean
   *   }[]} candidates
   * @private
   */
  _registerCandidates(candidates) {
    must.be.arrayOf(candidates, 'object')

    candidates.forEach(c => {
      must.be.notEmptyString(c.pattern)
        .and.be.notEmptyString(c.filePath)
        .and.be.symbol(c.strategy)

      c.base = c.base || null

      this['registerClass' + (c.strict ? 'Strict' : '')](c.pattern, c.filePath, c.strategy, c.base)
    })
  }

  /**
   * A helper method to prepare a pattern to be turned to dot notation key
   * @see tests/unit/lib/DependencyInjector/CuttingPatternTest.js
   * @param {string} pattern
   * @private
   */
  _cutPattern(pattern) {
    must.be.notEmptyString(pattern)

    const patternParts = pattern.match(/^(\/[^*?]*[^/*?]+)(\/(.*)|\/)?$/)
    if (!check.array(patternParts) || !patternParts[1]) {
      throw new Error(`Unexpected pattern ${pattern}!`)
    }

    return patternParts[1]
  }
}

module.exports = DependencyInjector