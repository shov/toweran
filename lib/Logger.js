'use strict'

const {
  must,
  App,
  LoggerInterface,
} = toweran

const {createLogger, format, transports} = require('winston')
require('winston-daily-rotate-file')


/**
 * A Winston-based logger
 */
class Logger extends LoggerInterface {
  /**
   * Constructor
   * @param {string} path
   * @param {?string} appName
   */
  constructor(path = Logger.DEFAULT_LOGS_DIR, appName = null) {
    super()

    must.be.notEmptyString(path)

    appName = appName || Logger.DEFAULT_APP_NAME

    /**
     * @type {string}
     * @private
     */
    this._appName = appName

    this._mode = process.env.NODE_ENV

    /**
     * @type {string}
     * @private
     */
    this._logsDir = this._prepareLogsPath(path)

    this._winstonLogger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
      ),
      transports: [
        new transports.Console({format: format.simple()}),
        new (transports.DailyRotateFile)(this._winstonConfig({filename: `${this._logsDir}/${this._appName}_${this._mode}_default-%DATE%.log`})),
        new (transports.DailyRotateFile)(this._winstonConfig({filename: `${this._logsDir}/${this._appName}_${this._mode}_warn-%DATE%.log`, level: 'warn'})),
        new (transports.DailyRotateFile)(this._winstonConfig({
          filename: `${this._logsDir}/${this._appName}_${this._mode}_error-%DATE%.log`,
          level: 'error'
        })),
      ],
      exitOnError: false
    })
  }

  info(...message) {
    this._winstonLogger.log({
      level: 'info',
      message
    })
  }

  log(...message) {
    this.info(...message)
  }

  warn(...message) {
    this._winstonLogger.log({
      level: 'warn',
      message
    })
  }

  error(...message) {
    this._winstonLogger.log({
      level: 'error',
      message
    })
  }

  /**
   * Check / create a dir to store logs there
   * @param {string} logsDir
   * @return {string}
   * @private
   */
  _prepareLogsPath(logsDir) {
    must.be.notEmptyString(logsDir)

    const fs = require('fs-extra')
    const path = require('path')
    logsDir = path.resolve(logsDir)

    try {
      fs.ensureDirSync(logsDir, 0o2775)
    } catch (e) {
      throw new Error(`Can't read/create logs directory '${logsDir}' !`)
    }

    return logsDir
  }

  /**
   * Generate configuration object for a logger object of the winston
   * @param {object} options
   * @return {{zippedArchive: boolean, filename: string, datePattern: string, maxSize: string, maxFiles: string}}
   * @private
   */
  _winstonConfig(options) {
    must.be.object(options)

    const path = require('path')

    return Object.keys(options).reduce((result, key) => {
      result[key] = options[key]
      return result
    }, {
      filename: path.resolve(this._logsDir + '/default-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  }
}

Logger.DEFAULT_APP_NAME = App.DEFAULT_THREAD_NAME
Logger.DEFAULT_LOGS_DIR = '/var/logs/toweran'

module.exports = Logger
