'use strict'

const check = require('check-types')

/**
 *  Provides HTTP(S) servers
 *  TODO: add possibility to start several servers the same time, e.g. one http and another https on difference ports @url https://trello.com/c/COfoJCyj/43-add-possibility-to-start-several-servers-the-same-time-eg-one-http-and-another-https-on-difference-ports
 */
class HTTPServing {
  /**
   * DI
   * @param {*} config
   * @param {{}} expressApp
   */
  constructor(config, expressApp) {
    const http = require('http')
    const https = require('https')
    const fs = require('fs')

    //Port
    this._port = this.constructor.DEFAULT_HHTP_PORT

    if(check.number(config.http.port()) && config.http.port() > 0) {
      this._port = config.http.port()
    }

    if(process.env.PORT && parseInt(process.env.PORT) > 0) {
      this._port = parseInt(process.env.PORT)
    }

    //Server, message
    this._server = null

    //if SSL then https
    const configSSL = (true === config.http.ssl())
    const envSSL = process.env.HTTP_SSL && 'true' === process.env.HTTP_SSL
    const envSSLDisabling = process.env.HTTP_SSL && 'false' === process.env.HTTP_SSL

    if(!envSSLDisabling && (envSSL || configSSL)) {

      let privateKeyPath = this.constructor.DEFAULT_SSL_PATHS.KEY
      let certificatePath = this.constructor.DEFAULT_SSL_PATHS.CERT

      if(check.nonEmptyString(config.http.sslPrivateKey())) {
        privateKeyPath = config.http.sslPrivateKey()
      }

      if(check.nonEmptyString(config.http.sslCertificate())) {
        certificatePath = config.http.sslCertificate()
      }

      privateKeyPath = process.env.HTTP_SSL_KEY || privateKeyPath
      certificatePath = process.env.HTTP_SSL_CERT || certificatePath

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
HTTPServing.DEFAULT_HHTP_PORT = 3000

/**
 * @type {{CERT: string, KEY: string}}
 */
HTTPServing.DEFAULT_SSL_PATHS = {
  KEY: '/certs/privatekey.pem',
  CERT: '/certs/certificate.pem',
}

module.exports = HTTPServing
