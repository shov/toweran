'use strict'

const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = {
  /**
   * Before middleware (before routes)
   */
  middleware: [
    {
      method: 'use',
      resolver: cors()
    },
    {
      method: 'use',
      resolver: bodyParser.json({limit: '5mb', extended: true})
    }
  ],

  /**
   * After middleware (after routes)
   */
  afterMiddleware: [
    /**
     * HTTP error handler
     */
    {
      method: 'use',
      resolver: (err, req, res, next) => {
        app.get('httpErrorHandler').handle(err, req, res, next)
      }
    }
  ],

  /**
   * Path to SSL key, it's recommended to use SSL_KEY in .env instead
   */
  sslPrivateKey: null,

  /**
   * Path to SSL crt, it's recommended to use SSL_CERT in .env instead
   */
  sslCertificate: null,
}