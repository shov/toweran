'use strict'

const fs = require('fs-extra')

describe(`App configuration test`, () => {
  let app

  beforeAll(() => {
    app = require('../../bootstrap')
  })

  it(`Basic positive`, () => {

    fs.ensureDirSync(toweran.TEST_PATH + '/data/config', 0o2775)
    fs.writeFileSync(toweran.TEST_PATH + '/data/config/app.js', `
    'use strict'
    module.exports = {
      things: []
    }
    `)

    fs.writeFileSync(toweran.TEST_PATH + '/data/config/events.js', `
    'use strict'
    module.exports = {
      events: []
    }
    `)

    app
      .register({
        configDir: toweran.TEST_PATH + '/data/config',
        config: {mocked: 'mocked'}
      })
      .boot()

    fs.unlinkSync(toweran.TEST_PATH + '/data/config/app.js')
    fs.unlinkSync(toweran.TEST_PATH + '/data/config/events.js')

    const config = app.get('config')

    expect(typeof config).toBe('object')

    expect(config).toStrictEqual({
      app: {things: []},
      events: {events: []},
      mocked: 'mocked'
    })
  })

})
