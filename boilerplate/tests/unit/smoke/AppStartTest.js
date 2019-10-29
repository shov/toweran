'use strict'

describe(`Application`, () => {
  let app

  beforeAll(() => {
    app = require('../../bootstrap')
  })

  it(`The app is able to be initialized without exceptions`, () => {
    const act = () => {
      app
        .register()
        .boot()
    }

    expect(act).not.toThrow(Error)
  })
})
