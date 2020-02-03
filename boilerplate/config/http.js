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
}