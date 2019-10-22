'use strict'

/**
 * Interface for logger
 */
class LoggerInterface {
  info(...message) {
    throw new Error(`Must be implemented in a child class!`)
  }

  log(...message) {
    throw new Error(`Must be implemented in a child class!`)
  }

  warn(...message) {
    throw new Error(`Must be implemented in a child class!`)
  }

  error(...message) {
    throw new Error(`Must be implemented in a child class!`)
  }
}

module.exports = LoggerInterface
