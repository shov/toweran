'use strict'
const {
  C
} = toweran

module.exports = [
  {//TODO: add naming for routes
    path: '/api/v1',
    method: 'get',
    resolver: (req, res, next) => {

      //TODO: make it easier
      const protocol = `http${process.env.SSL === 'true' ? 's' : ''}://`
      const url = `${protocol}${req.hostname}/api/v1/welcome`

      res.redirect(C.HTTP.MOVED_PERMANENTLY, url)
    },
    sub: [
      {
        path: '/welcome',
        method: 'get',
        resolver: {
          controller: 'WelcomeController',
          action: 'greetings'
        },
      }
    ]
  },
]