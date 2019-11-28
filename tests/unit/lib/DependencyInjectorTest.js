'use strict'

require('../../bootstrap')

const fs = require('fs-extra')
const check = require('check-types')
const path = require('path')
const Logger = toweran.Logger

//TODO: write well described and full covering tests
describe(`Load ES6 Classes`, () => {

  let logger

  /**
   * @type {AnnotationInspector}
   */
  let annotationInspector

  /** @type {ScriptLoader} */
  let scriptLoader

  /**
   * @type {ContainerInterface}
   */
  let container

  /**
   * @type {DependencyInjector}
   */
  let di

  /**
   * @type {{app:{di:[]}}}
   */
  let config

  beforeAll(() => {
    logger = new Logger(toweran.TEST_PATH + '/data/logs', 'framework_testing')

    annotationInspector = new (require(toweran.FRAMEWORK_PATH + '/lib/AnnotationInspector'))(
      logger
    )

    scriptLoader = new (require(toweran.FRAMEWORK_PATH + '/lib/ScriptLoader'))(
      logger
    )

    //redefine app path
    toweran.APP_PATH = path.resolve(toweran.TEST_PATH + '/data/appRootDITesting')
    fs.ensureDirSync(toweran.APP_PATH, 0o2775)

  })

  beforeEach(() => {
    container = new (toweran.Container)()

    //to use in the tests
    container.instance('logger', logger)
  })

  afterEach(() => {
    unlinkFiles(toweran.APP_PATH)
  })

  it(`Positive, load classes from sub-dir, path as string, dir`, () => {
    fs.ensureDirSync(toweran.APP_PATH + '/app', 0o2775)
    config = {
      app: {
        di: [
          {
            path: `${toweran.APP_PATH}/app`
          }
        ]
      }
    }

    createFiles(config.app.di[0].path)

    di = new (require(toweran.FRAMEWORK_PATH + '/lib/DependencyInjector'))(
      logger, container, config, scriptLoader, annotationInspector
    )

    di.init()

    const alpha = container.get(`app.Alpha`)

    expect(check.object(alpha)).toBe(true)
    expect(check.instance(alpha, require(`${toweran.APP_PATH}/app/Alpha`)))
    expect(alpha.invoke()).toBe(42)

  })

  it(`Positive, load classes from sub-dir, path as object, include and exclude, glob pattern`, () => {
    fs.ensureDirSync(toweran.APP_PATH + '/app', 0o2775)
    config = {
      app: {
        di: [
          {
            path: {
              include: [`${toweran.APP_PATH}/app/**/*.js`],
              exclude: `${toweran.APP_PATH}/app/noIndex`,
            }
          }
        ]
      }
    }

    createFiles()

    di = new (require(toweran.FRAMEWORK_PATH + '/lib/DependencyInjector'))(
      logger, container, config, scriptLoader, annotationInspector
    )

    di.init()

    const alpha = container.get(`app.Alpha`)

    expect(check.object(alpha)).toBe(true)
    expect(check.instance(alpha, require(`${toweran.APP_PATH}/app/Alpha`)))
    expect(alpha.invoke()).toBe(42)
    expect(container.has('app.noIndex.Gray')).toBe(false)

  })
})

function createFiles() {
  const dir  = `${toweran.APP_PATH}/app`

  fs.ensureDirSync(`${dir}/domain/x`, 0o2775)
  fs.ensureDirSync(`${dir}/noIndex`, 0o2775)
  fs.writeFileSync(`${dir}/Alpha.js`, `
  'use strict'
  
  class Alpha {
    /**
     * @DI app.domain.x.Beta
     * @DI logger
     * @param {Beta} beta
     * @param {Logger} logger
     **/
     constructor(beta, logger) {
       this._beta = beta
       
       this._logger = logger
       logger.log('Alpha created')
     }
     
     invoke() {
       this._logger.log('Call invoke on alpha')
       return this._beta.getZetta().secret
     }
  }
  
  module.exports = Alpha
  `)

  fs.writeFileSync(`${dir}/domain/x/Beta.js`, `
  'use strict'
  
  class Beta {
    /**
     * @DI app.domain.x.Zetta
     * @DI logger
     * @param {Zetta} zetta
     * @param {Logger} logger
     **/
     constructor(zetta, logger) {
       this._zetta = zetta
       
       this._logger = logger
       logger.log('Beta created')
     }
     
     getZetta() {
       this._logger.log('Call get zetta on beta')
       return this._zetta
     }
  }
  
  module.exports = Beta
  `)

  fs.writeFileSync(`${dir}/domain/x/Zetta.js`, `
  'use strict'
  
  class Zetta {
    /**
     * @DI logger
     * @param {Logger} logger
     **/
     constructor(logger) {
       this._secret = 42
       
       this._logger = logger
       logger.log('Zetta created')
     }
     
     get secret() {
       return this._secret
     }
  }
  
  module.exports = Zetta
  `)

  fs.writeFileSync(`${dir}/noIndex/Gray.js`, `
  'use strict'
  
  class Gray {
    /**
     * @DI logger
     * @param {Logger} logger
     **/
     constructor(logger) {
       this._secret = 55
       
       this._logger = logger
       logger.log('Gray created')
     }
     
     get secret() {
       return this._secret
     }
  }
  
  module.exports = Gray
  `)
}

function unlinkFiles() {
  const dir = `${toweran.APP_PATH}/app`

  fs.unlinkSync(`${dir}/Alpha.js`)
  fs.unlinkSync(`${dir}/domain/x/Beta.js`)
  fs.unlinkSync(`${dir}/domain/x/Zetta.js`)
  fs.unlinkSync(`${dir}/noIndex/Gray.js`)
}