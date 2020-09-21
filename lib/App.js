'use strict'

const check = require('check-types')

const must = toweran.must

const {
  LoggerInterface,
  Container,
  ConfigReader,
  ConfigManager,
  BasicServiceProvider,
  EventServiceProvider,
  AppFacade,
  C,
} = toweran

/**
 * The Application
 */
class App {
  /**
   * Constructor
   * @param {LoggerInterface} logger
   */
  constructor(logger) {
    must.be.instance(logger, LoggerInterface)

    /**
     * @type {LoggerInterface}
     * @private
     */
    this._logger = logger

    /**
     * @type {ContainerInterface}
     * @private
     */
    this._container = new Container()

    /**
     * @type {BasicServiceProvider[]}
     * @private
     */
    this._serviceProviders = []

    /**
     * The thread name useful for logs
     * @type {string}
     */
    this.threadName = this.constructor.DEFAULT_THREAD_NAME
  }

  /**
   * Registration of everything in the container, call registration of the service providers
   * @param {{
   *   threadName: string,
   *   skipConfigFiles: boolean,
   *   configDir: string,
   *   config: {},
   * }} options
   * @return {App}
   */
  register(options = {}) {
    must.be.object(options)

    this.threadName = options.threadName || this.threadName

    this._logger.log(`${this.threadName}.Register...`)

    this._container.instance('app', this)
    this._container.instance('logger', this._logger)

    /**
     * Register global app facade
     */
    const appFacade = new AppFacade()
    appFacade.wrap(this)

    Object.defineProperty(toweran, 'app', {
      get: () => {
        return appFacade
      }
    })

    /**
     * So now we can freeze toweran
     */
    if (process.env.env !== C.APP_MODE.TESTING) {
      Object.freeze(toweran)
    }

    /**
     * The configuration.
     *
     * At first everything from APP_PATH/config folder
     * is being read. Each js file that returns an object will be processed
     * and the object will be added to the config with a key of the name of the file.
     *
     * Secondly if options.config is a valid object it's going to replace/patch
     * anything from already loaded config or add something new.
     *
     * @type {{}}
     * @private
     */
    this._rawConfig = {}

    //config files
    if (true !== options.skipConfigFiles) {
      const configDir = options.configDir || toweran.APP_PATH + '/config'
      this._rawConfig = (new ConfigReader).readDir(configDir)
    }

    //config option
    if (check.object(options.config)) {
      this._rawConfig = Object.assign(this._rawConfig, options.config)
    }

    const configManager = new ConfigManager(this._rawConfig)
    this._config = configManager.freeze().getAccessor()

    //set config accessor
    this._container.instance('config', this._config)

    /**
     * Most of service providers should be placed in config.app.serviceProviders as constructors
     * we validate and instantiate them here one by one, call register() on each of them and save
     * them in App._serviceProviders
     */
    if (check.array(this._config.app.serviceProviders())) {
      this._config.app.serviceProviders().forEach(spConstructor => {
        try {
          must.be.function(spConstructor)
            .and.be.object(spConstructor.prototype)
            .and.be.instance(spConstructor.prototype, BasicServiceProvider)

          /**
           * @type {BasicServiceProvider}
           */
          const sp = new spConstructor(this._container)

          sp.register()

          this._serviceProviders.push(sp)

        } catch (e) {
          if (!(e instanceof toweran.InvalidArgumentException)) {
            throw e
          }

          this._logger.warn(
            `Faced an entry that is not a constructor extending BasicServiceProvider in config.app.serviceProviders['${spConstructor}'], skip it.`)
        }
      })
    }

    return this
  }

  /**
   * Get core instances from the container and run init() on them one by one
   * @return {App}
   */
  boot() {
    this._logger.log(`${this.threadName}.Boot...`)

    this._serviceProviders.forEach(sp => sp.boot())

    return this
  }

  /**
   * Start servers, jobs, run boot() on the service providers
   * @return {App}
   */
  async start() {
    this._logger.log(`${this.threadName}.Start...`)

    /**
     * Start all application adapters by the event
     */
    await this._container.get('events.AppStartEvent').dispatch()

    /**
     * After the app has been started
     */
    await this._container.get('events.AppAfterStartedEvent').dispatch()

    return this
  }

  /**
   * Get something from the container
   * @param {string|symbol} key
   * @return {*}
   */
  get(key) {
    must.notEmptyStringOrSymbol(key)
    return this._container.get(key)
  }
}

/**
 * TODO: Default thread name, it's going to be used for tasks perhaps @url https://trello.com/c/IPVF7BXO/73-tasks-jobs-workers
 * @type {string}
 */
App.DEFAULT_THREAD_NAME = 'main'

module.exports = App
