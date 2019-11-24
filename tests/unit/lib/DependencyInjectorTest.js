'use strict'

require('../../bootstrap')

const fs = require('fs-extra')
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

    container = new (toweran.Container)()

    //to use in the tests
    container.instance('logger', logger)

    //redefine app path
    toweran.APP_PATH = path.resolve(toweran.TEST_PATH + '/data/app_root')
    fs.ensureDirSync(toweran.APP_PATH, 0o2775)

  })

  it(`Positive, load classes from sub-dir, path as string, dir`, () => {
    fs.ensureDirSync(toweran.APP_PATH + '/app', 0o2775)
    config = {
      app: {
        di: [
          {
            path: `${toweran.APP_PATH} + '/app'`
          }
        ]
      }
    }

    createFiles(config.app.di[0].path)

    di = new (require(toweran.FRAMEWORK_PATH + '/lib/DependencyInjector'))(
      logger, container, config, scriptLoader, annotationInspector
    )

    di.init()

    //TODO: resolve one from container, call a method, check expected

    unlinkFiles(config.app.di[0].path)
  })
})

function createFiles(dir) {
  //TODO: implement
}

function unlinkFiles(dir) {
  //TODO: implement
}