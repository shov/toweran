'use strict'

module.exports = [
  {
    path: '/api/v1',
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