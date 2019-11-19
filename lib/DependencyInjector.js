'use strict'

const must = toweran.must
const check = require('check-types')

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
   */
  constructor(logger, container, config, scriptLoader) {
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
     * @type {Function}
     * @private
     */
    this._isJsFileCb = (function (files) {
      return files.filter(this._scriptLoader.isJsFile.bind(this._scriptLoader))
    }).bind(this)

    /**
     * @type {Function}
     * @private
     */
    this._isClassCb = (function (files) {
      return files.filter(this._scriptLoader.isClass.bind(this._scriptLoader))
    }).bind(this)

    /**
     * @const
     * @type {symbol}
     */
    this.DEFAULT_STRATEGY = toweran.C.DI.DOT_NOTATION

    /**
     * A list of candidates to be registered on application boot step
     * @type {Array}
     * @private
     */
    this._candidates = []
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
   *     base: `app.`
   *     strict: true,
   *   },
   *   {
   *     path: {
   *       include: `${toweran.APP_PATH}/app`,
   *       exclude: `${toweran.APP_PATH}/app/http`,
   *     }
   *     strategy: toweran.C.DI.DOT_NOTATION,
   *     base: `app.`
   *   },
   *   {
   *     path: {
   *       include: `${toweran.APP_PATH}/app`,
   *       exclude: `${toweran.APP_PATH}/app/http`,
   *     }
   *     strategy: toweran.C.DI.DOT_NOTATION,
   *     base: `app.`
   *   },
   * ]}}
   */
  init() {
    if (!this._config.app || !this._config.app.di) {
      this._logger.warn(`No DI config found in app.di, skipped.`)
      return
    }

    must.be.array(this._config.app.di)

    //Parse the config
    let candidates = this._config.app.di.redu((candidates, set, setIndex) => {

      //get parsed from a set
      const {pathData, strategy, base, strict} = this._parseConfigSet(set, setIndex)

      //get candidates
      const candidatesPortion = this._getCandidatesCandidates(pathData, strategy, base)

      return candidates.concat(candidatesPortion)
    }, [])

    //Register the candidates
    this._registerCandidates(candidates)
  }

  /**
   * Try to register js file as a Class in the container, by strategy, skip in case of fail
   * @param {string} file
   * @param {symbol} strategy
   * @param {*[]} args
   */
  registerClass(file, strategy = toweran.C.DI.DOT_NOTATION, ...args) {
    if (!this._isStrategyValid(strategy)) {
      throw new toweran.InvalidArgumentException(`Not known strategy, cant register a class! (file ${file})`)
    }

    switch (strategy) {
      case toweran.C.DI.DOT_NOTATION:
        try {
          this._dotNotationClassRegistration(file, args[0] || '')
        } catch (e) {
          logger.warn(`${e.message}`)
          logger.warn(`Class in file ${file} is corrupted, can't load, skip!`)
        }

        break
    }
  }

  /**
   * Try to register js file as a Class in the container, by strategy, or fail wit an exception
   * @throw {Error}
   * @param {string} file
   * @param {symbol} strategy
   * @param {*[]} args
   */
  registerClassStrict(file, strategy = toweran.C.DI.DOT_NOTATION, ...args) {
    if (!this._isStrategyValid(strategy)) {
      throw new toweran.InvalidArgumentException(`Not known strategy, cant register a class! (file ${file})`)
    }

    switch (strategy) {
      case toweran.C.DI.DOT_NOTATION:
        this._dotNotationClassRegistration(file, args[0] || '')
        break
    }
  }

  /**
   * Register a class in the container by the dot notation
   * @param file
   * @param base
   * @private
   */
  _dotNotationClassRegistration(file, base) {
    const constructor = require(file)

    const name = file.replace(/^(.*)\/([^/.]+).js$/, '$2')

    const key = base + file
      .replace(toweran.APP_PATH || toweran.FRAMEWORK_PATH, '')
      .replace(/^(.*).js$/, '$1')
      .replace('/', '.')

    if (
      !check.function(constructor)
      || !constructor.prototype
      || !constructor.prototype.constructor
      || !check.nonEmptyString(constructor.prototype.constructor.name)
    ) {
      throw new Error(`The file exports not a constructor`)
    }

    if (name !== constructor.prototype.constructor.name) {
      throw new Error(`The constructor has not expected name! Expected: ${name}, given: ${constructor.prototype.constructor.name}`)
    }

    //TODO: inspecting DI arguments, register class in the container

  }

  /**
   * Parse a config DI set
   * @param {{path: *, base: *, strict: boolean}} set
   * @param {number|string} setIndex
   * @return {{pathData: {include: string[], exclude: string[]}, strategy: number | symbol, base: *}}
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

    //Check exclude
    if (!pathData.exclude) {
      pathData.exclude = []
    }

    if (check.string(pathData.exclude)) {
      pathData.exclude = [pathData.exclude]
    }

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
    return [
      toweran.C.DI.DOT_NOTATION
    ].includes(strategy)
  }

  /**
   * Get candidates from parsed config a set
   * @param {{include: string[], exclude: string[]}} pathData
   * @param {symbol} strategy
   * @param base
   * @param {string} strict
   * @return {[{file: string, strategy: symbol, base: *}]}
   * @private
   */
  _getCandidatesCandidates(pathData, strategy, base, strict) {
    const toExclude = [...new Set(
      pathData.exclude
        .reduce((files, pattern) => {
          const foundFiles = this._scriptLoader.processExpression(pattern, this._isJsFileCb)
          return files.concat(foundFiles)
        }, [])
    )]

    return pathData.include
      .reduce((files, pattern) => {
        const foundFiles = this._scriptLoader.processExpression(pattern, this._isClassCb)
        return files.concat(foundFiles)
      }, [])
      .filter(file => !toExclude.includes(file))
      .map(file => {
        return {
          file,
          strategy,
          base,
          strict,
        }
      })
  }

  /**
   * Registering the candidates in the container
   * @param {[{file: string, strategy: symbol, base: *, strict: boolean}]} candidates
   * @private
   */
  _registerCandidates(candidates) {
    candidates.forEach(c => {
      this['registerClass' + (c.strict ? 'Strict' : '')](c.file, c.strategy, c.base)
    })
  }
}

module.exports = DependencyInjector
