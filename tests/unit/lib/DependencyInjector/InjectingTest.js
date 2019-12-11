'use strict'

require('../../../bootstrap')

const fs = require('fs-extra')
const check = require('check-types')
const rimraf = require('rimraf')
const path = require('path')

const must = toweran.must

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
    clean()
  })

  describe(`Run cases`, () => {

    const dataSetList = casesDataProvider()

    dataSetList.forEach((set, number) => {
      it(`#${number}, ${set.comment}`, () => {

        //duct tape
        set = casesDataProvider()[number]

        createClasses(set.classes)

        const config = {
          app: {
            di: set.di
          }
        }

        di = new (require(toweran.FRAMEWORK_PATH + '/lib/DependencyInjector'))(
          logger, container, config, scriptLoader, annotationInspector
        )

        di.init()

        for (let definition of set.classes) {
          const instance = container.get(definition.key)
          const constructor = require(definition.path)

          expect(instance instanceof constructor).toBe(true)

          expect(instance.expMethod()).toBe(definition.expVal)
        }
      })
    })
  })
})

function casesDataProvider() {
  return [
    {
      comment: `app as dir, flat`,
      di: [
        {
          path: `${toweran.APP_PATH}/app`,
          base: `app`,
        }
      ],
      classes: [
        {
          name: 'Foo',
          path: `${toweran.APP_PATH}/app/Foo.js`,
          key: 'app.Foo',
          dependencies: [
            {
              key: 'logger',
              variable: 'logger',
            }
          ],
          expMethod: () => {
            return 42
          },
          expVal: 42
        },
        {
          name: 'FooBar',
          path: `${toweran.APP_PATH}/app/FooBar.js`,
          key: 'app.FooBar',
          dependencies: [
            {
              key: 'app.Foo',
              variable: 'foo',
            },
            {
              key: 'logger',
              variable: 'logger',
            }
          ],
          expMethod: () => {
            return this.foo.expMethod()
          },
          expVal: 42
        }
      ]
    }
  ]
}

function createClasses(classes) {
  must.be.array(classes)

  for (let definition of classes) {
    let depKeys = definition.dependencies.reduce((text, d) => {
      return `${text}${!text.length ? '' : `\n`}* @DI ${d.key}`
    }, '')

    let depVarsLine = definition.dependencies.reduce((line, d) => {
      return `${line}${!line.length ? '' : ', '}${d.variable}`
    }, '')

    let props = definition.dependencies.reduce((text, d) => {
      return `${text}${!text.length ? '' : `\n`}this.${d.variable} = ${d.variable}`
    }, '')

    let body = `
      'use strict'
      
      class ${definition.name} {
         /**
          ${depKeys}
          */
          constructor(${depVarsLine}) {
            ${props}
          }
          
          expMethod() {
            return (${definition.expMethod.toString()})()
          }
      }
      
      module.exports = ${definition.name}
    `
    fs.ensureDirSync(definition.path.replace(/^(.*)\/([^/]+\.js)$/, '$1'), 0o2775)
    fs.writeFileSync(definition.path, body)
  }
}

function clean() {
  rimraf.sync(`${toweran.APP_PATH}/*`)
}
