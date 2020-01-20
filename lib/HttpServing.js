'use strict'

const check = require('check-types')

/**
 *  Provides HTTP(S) servers
 *  TODO: add possibility to start several servers the same time, e.g. one http and another https on difference ports
 */
class HttpServing {
  /**
   * DI
   * @param {{http: {}}} config
   * @param {{}} expressApp
   */
  constructor(config, expressApp) {
    const http = require('http')
    const https = require('https')
    const fs = require('fs')

    //Port
    this._port = this.constructor.DEFAULT_HHTP_PORT

    if(check.object(config.http) && check.number(config.http.port) && config.http.port > 0) {
      this._port = config.http.port
    }

    if(process.env.PORT && parseInt(process.env.PORT) > 0) {
      this._port = parseInt(process.env.PORT)
    }

    //Server, message
    this._server = null

    //if SSL then https
    const configSSL = (check.object(config.http) && check.boolean(config.http.ssl) && true === config.http.ssl)
    const envSSL = process.env.SSL && 'true' === process.env.SSL
    const envSSLDisabling = process.env.SSL && 'false' === process.env.SSL

    if(!envSSLDisabling && (envSSL || configSSL)) {

      let privateKeyPath = this.constructor.DEFAULT_SSP_PATHS.KEY
      let certificatePath = this.constructor.DEFAULT_SSP_PATHS.CERT

      if(check.object(config.http) && check.nonEmptyString(config.http.sslPrivateKey)) {
        privateKeyPath = config.http.sslPrivateKey
      }

      if(check.object(config.http) && check.nonEmptyString(config.http.sslCertificate)) {
        certificatePath = config.http.sslCertificate
      }

      privateKeyPath = process.env.SSL_KEY || privateKeyPath
      certificatePath = process.env.SSL_CERT || certificatePath

      const privateKey = fs.readFileSync(toweran.APP_PATH + privateKeyPath)
      const certificate = fs.readFileSync(toweran.APP_PATH + certificatePath)

      this._server = https.createServer({
        key: privateKey,
        cert: certificate
      }, expressApp)

      this._message = `[HTTPS] Start listening on ${this._port}`
    } else {

      this._server = http.createServer(expressApp)
      this._message = `[HTTP] Start listening on ${this._port}`
    }
  }

  /**
   * Get the instance of current server
   * @return {null|Server}
   */
  getServer() {
    return this._server
  }

  /**
   * Get the message of the server to be shown when do start
   * @return {string}
   */
  getStartingMessage() {
    return this._message
  }

  /**
   * Get the HTTP(S) port
   * @return {number}
   */
  getPort() {
    return this._port
  }
}

/**
 * @type {number}
 */
HttpServing.DEFAULT_HHTP_PORT = 3000

/**
 * @type {{CERT: string, KEY: string}}
 */
HttpServing.DEFAULT_SSP_PATHS = {
  KEY: '/certs/privatekey.pem',
  CERT: '/certs/certificate.pem',
}

module.exports = HttpServing
