'use strict'

describe(`App system providers`, () => {
  let app

  beforeAll(() => {
    app = require('../../bootstrap')
  })

  it(`Basic, positive, config SP treating`, () => {

    app
      .register({
        skipConfigFiles: true,
        config: {
          app: {
            serviceProviders: [
              {msg: 'not an instance of SP #1'},
              class extends toweran.BasicServiceProvider {
                register() {
                  this._container.instance('smokeTestObj', {})
                }

                boot() {
                  this._container.get('smokeTestObj').testVal = 42
                }
              },
              {msg: 'not an instance of SP #2'},
            ]
          }
        }
      })
      .boot()

    const smokeTestObj = app.get('smokeTestObj')

    expect(typeof smokeTestObj).toBe('object')

    expect(smokeTestObj).toStrictEqual({
      testVal: 42
    })
  })
})