'use strict'

const LoggerInterface = toweran.LoggerInterface
const must = toweran.must

const {createLogger, format, transports} = require('winston')
require('winston-daily-rotate-file')


/**
 * A Winston-based logger
 * TODO: a lot of things are hardcoded
 * TODO: there is no wat to configure the logger well, but it's possible to override it in the  container
 */
class Logger extends LoggerInterface {
  /**
   * Constructor
   * @param {string} path
   * @param {string} appName
   */
  constructor(path = Logger.DEFAULT_LOGS_DIR, appName = Logger.DEFAULT_APP_NAME) {
    super()

    must
      .be.notEmptyString(path)
      .and.be.notEmptyString(appName)

    /**
     * @type {string}
     * @private
     */
    this._appName = appName

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
        new (transports.DailyRotateFile)(this._winstonConfig({filename: `${this._logsDir}/${this._appName}_default-%DATE%.log`})),
        new (transports.DailyRotateFile)(this._winstonConfig({filename: `${this._logsDir}/${this._appName}_warn-%DATE%.log`, level: 'warn'})),
        new (transports.DailyRotateFile)(this._winstonConfig({
          filename: `${this._logsDir}/${this._appName}_error-%DATE%.log`,
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

    const fs = require('fs')
    const path = require('path')
    logsDir = path.resolve(logsDir)

    try {
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir)
      }
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

Logger.DEFAULT_APP_NAME = 'app'
Logger.DEFAULT_LOGS_DIR = '/var/logs/toweran'

module.exports = Logger
