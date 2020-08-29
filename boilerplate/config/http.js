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
   * HTTP accessor port
   */
  port: process.env.PORT || 3000,

  /**
   * Start HTTP accessor with SSL (HTTPS)
   */
  ssl: process.env.HTTP_SSL ? 'true' === process.env.HTTP_SSL : false,

  /**
   * Path to SSL key
   */
  sslPrivateKey: process.env.HTTP_SSL_KEY || null,

  /**
   * Path to SSL crt
   */
  sslCertificate: process.env.HTTP_SSL_CERT || null,
}