'use strict'

const {
  BasicController,
} = toweran

class WelcomeController extends BasicController {
  greetings(req, res, next) {
    res.send({
      message: `Toweran is on!`
    })
  }
}

module.exports = WelcomeController