'use strict'
const {
  C
} = toweran

module.exports = [
  {//TODO: add naming for routes @url https://trello.com/c/2dvTqDXY/68-routes-naming
    path: '/api/v1',
    method: 'get',
    resolver: (req, res, next) => {

      //TODO: make it easier, AppFacade::linkTo @url https://trello.com/c/YiQMJXKH/70-global-app-facade-and-aliases
      const protocol = `http${process.env.HTTP_SSL === 'true' ? 's' : ''}://`
      const url = `${protocol}${req.hostname}:${process.env.PORT}/api/v1/welcome`

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