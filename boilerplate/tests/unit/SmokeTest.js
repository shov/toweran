'use strict'

const fs = require('fs-extra')

describe(`Basic positive`, () => {
  it(`The app is able to be initialized without exceptions`, () => {
    const act = () => {
      const app = require('../bootstrap')
      app
        .register()
        .boot()
    }

    expect(act).not.toThrow(Error)
  })

  it(`The app has configuration`, () => {
    const app = require('../bootstrap')

    fs.ensureDirSync(toweran.TEST_PATH + '/data/config', 0o2775)
    fs.writeFileSync(toweran.TEST_PATH + '/data/config/app.js', `
    'use strict'
    module.exports = {
      things: []
    }
    `)

    app
      .register({
        configDir: toweran.TEST_PATH + '/data/config',
        config: {mocked: 'mocked'}
      })
      .boot()

    const config = app.get('config')

    expect(typeof config).toBe('object')

    expect(config).toStrictEqual({
      app: {things: []},
      mocked: 'mocked'
    })
  })
})
