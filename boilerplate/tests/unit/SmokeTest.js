'use strict'

describe(`Basic positive`, () => {
  it(`The app is able to be initialized without exceptions`, () => {
    const act = () => {
      const app = require('../bootstrap')
      app.register()
      app.init()
    }

    expect(act).not.toThrow(Error)
  })
})
