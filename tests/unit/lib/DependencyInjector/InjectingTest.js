'use strict'

require('../../../bootstrap')

const fs = require('fs-extra')
const check = require('check-types')
const rimraf = require('rimraf')
const path = require('path')

const {
  TEST_PATH,
  FRAMEWORK_PATH,
  CONST,
  Container,
  must,
  Logger,
  ConfigManager
} = toweran

describe(`Load ES6 Classes, Dot notation`, () => {

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

  beforeAll(() => {
    logger = new Logger(TEST_PATH + '/data/logs', 'framework_testing')

    annotationInspector = new (require(FRAMEWORK_PATH + '/lib/AnnotationInspector'))(
      logger
    )

    scriptLoader = new (require(FRAMEWORK_PATH + '/lib/ScriptLoader'))(
      logger
    )

    //redefine app path
    toweran.APP_PATH = path.resolve(TEST_PATH + '/data/appRootDITesting')
    fs.ensureDirSync(toweran.APP_PATH, 0o2775)
  })

  beforeEach(() => {
    container = new (Container)()

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

        const config = new ConfigManager({
          app: {
            di: set.di
          }
        }).freeze().getAccessor()

        di = new (require(FRAMEWORK_PATH + '/lib/DependencyInjector'))(
          logger, config, container, scriptLoader, annotationInspector
        )

        di.init()

        for (let definition of set.classes) {

          if (definition.has) {
            const instance = container.get(definition.key)
            const constructor = require(definition.path)

            expect(instance instanceof constructor).toBe(true)

            expect(instance.expMethod()).toBe(definition.expVal)

          } else {
            expect(container.has(definition.key)).toBe(false)
          }

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
          path: `${toweran.APP_PATH}/0/app`,
          base: `app`,
        }
      ],
      classes: [
        {
          name: 'Foo',
          path: `${toweran.APP_PATH}/0/app/Foo.js`,
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
          expVal: 42,
          has: true,
        },
        {
          name: 'FooBar',
          path: `${toweran.APP_PATH}/0/app/FooBar.js`,
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
          expVal: 42,
          has: true,
        }
      ]
    },

    {
      comment: `app as glob, hierarchical`,
      di: [
        {
          path: `${toweran.APP_PATH}/1/app/**/*`,
          base: `app`,
        }
      ],
      classes: [
        {
          name: 'Foo',
          path: `${toweran.APP_PATH}/1/app/Foo.js`,
          key: 'app.Foo',
          dependencies: [
            {
              key: 'logger',
              variable: 'logger',
            },
            {
              key: 'app.domain.bar.FooBar',
              variable: 'fooBar',
            },
          ],
          expMethod: () => {
            return this.fooBar.expMethod()
          },
          expVal: 123,
          has: true,
        },
        {
          name: 'FooBar',
          path: `${toweran.APP_PATH}/1/app/domain/bar/FooBar.js`,
          key: 'app.domain.bar.FooBar',
          dependencies: [],
          expMethod: () => {
            return 123
          },
          expVal: 123,
          has: true,
        }
      ]
    },

    {
      comment: `app as glob, hierarchical, without base`,
      di: [
        {
          path: `${toweran.APP_PATH}/2/app/**/*`,
        }
      ],
      classes: [
        {
          name: 'Foo',
          path: `${toweran.APP_PATH}/2/app/Foo.js`,
          key: 'Foo',
          dependencies: [
            {
              key: 'logger',
              variable: 'logger',
            },
            {
              key: 'domain.bar.FooBar',
              variable: 'fooBar',
            },
          ],
          expMethod: () => {
            return this.fooBar.expMethod()
          },
          expVal: 456,
          has: true,
        },
        {
          name: 'FooBar',
          path: `${toweran.APP_PATH}/2/app/domain/bar/FooBar.js`,
          key: 'domain.bar.FooBar',
          dependencies: [],
          expMethod: () => {
            return 456
          },
          expVal: 456,
          has: true,
        }
      ]
    },

    {
      comment: `app as glob, hierarchical, with exclude as pattern`,
      di: [
        {
          path: {
            include: `${toweran.APP_PATH}/3/app/**/*`,
            exclude: `${toweran.APP_PATH}/3/app/http/**`,
          },
          base: 'app'
        }
      ],
      classes: [
        {
          name: 'Foo',
          path: `${toweran.APP_PATH}/3/app/Foo.js`,
          key: 'app.Foo',
          dependencies: [
            {
              key: 'logger',
              variable: 'logger',
            },
            {
              key: 'app.domain.bar.FooBar',
              variable: 'fooBar',
            },
          ],
          expMethod: () => {
            return this.fooBar.expMethod()
          },
          expVal: 456,
          has: true,
        },
        {
          name: 'FooBar',
          path: `${toweran.APP_PATH}/3/app/domain/bar/FooBar.js`,
          key: 'app.domain.bar.FooBar',
          dependencies: [],
          expMethod: () => {
            return 456
          },
          expVal: 456,
          has: true,
        },
        {
          name: 'AbController',
          path: `${toweran.APP_PATH}/3/app/http/controllers/AbController.js`,
          key: 'app.http.controllers.AbController',
          dependencies: [],
          expMethod: () => {
          },
          has: false,
        }
      ]
    },

    {
      comment: `three paths, with cross excludes, diff bases`,
      di: [
        {
          path: {
            include: `${toweran.APP_PATH}/4/app/**`,
            exclude: [
              `${toweran.APP_PATH}/4/app/http/**`,
              `${toweran.APP_PATH}/4/app/listeners/**`,
            ],
          },
          base: 'app'
        },
        {
          path: `${toweran.APP_PATH}/4/app/http/controllers/*Controller.js`,
        },
        {
          path: `${toweran.APP_PATH}/4/app/listeners/*Listener.js`,
        },
      ],
      classes: [
        {
          name: 'Foo',
          path: `${toweran.APP_PATH}/4/app/domain/bazX/Foo.js`,
          key: 'app.domain.bazX.Foo',
          dependencies: [
            {
              key: 'logger',
              variable: 'logger',
            },
            {
              key: 'app.domain.bar.FooBar',
              variable: 'fooBar',
            },
          ],
          expMethod: () => {
            return this.fooBar.expMethod()
          },
          expVal: 2989,
          has: true,
        },
        {
          name: 'FooBar',
          path: `${toweran.APP_PATH}/4/app/domain/bar/FooBar.js`,
          key: 'app.domain.bar.FooBar',
          dependencies: [],
          expMethod: () => {
            return 2989
          },
          expVal: 2989,
          has: true,
        },

        {
          name: 'SomeThing',
          path: `${toweran.APP_PATH}/4/app/http/controllers/SomeThing.js`,
          key: 'SomeThing',
          dependencies: [],
          expMethod: () => {
          },
          has: false,
        },
        { //app key
          name: 'SomeThing',
          path: `${toweran.APP_PATH}/4/app/http/controllers/SomeThing.js`,
          key: 'app.http.controllers.SomeThing',
          dependencies: [],
          expMethod: () => {
          },
          has: false,
        },

        {
          name: 'AbController',
          path: `${toweran.APP_PATH}/4/app/http/controllers/AbController.js`,
          key: 'AbController',
          dependencies: [
            {
              key: 'app.domain.bazX.Foo',
              variable: 'foo',
            },
          ],
          expMethod: () => {
            return this.foo.expMethod()
          },
          expVal: 2989,
          has: true,
        },

        { //app key
          name: 'StartListener',
          path: `${toweran.APP_PATH}/4/app/listeners/StartListener.js`,
          key: 'app.listeners.StartListener',
          dependencies: [
            {
              key: 'app.domain.bazX.Foo',
              variable: 'foo',
            },
          ],
          expMethod: () => {
            return this.foo.expMethod()
          },
          has: false,
        },
        {
          name: 'StartListener',
          path: `${toweran.APP_PATH}/4/app/listeners/StartListener.js`,
          key: 'StartListener',
          dependencies: [
            {
              key: 'app.domain.bazX.Foo',
              variable: 'foo',
            },
          ],
          expMethod: () => {
            return this.foo.expMethod()
          },
          expVal: 2989,
          has: true,
        }
      ]
    },

    {
      comment: `three paths, strategy, with cross excludes as dirs, diff bases`,
      di: [
        {
          path: {
            include: `${toweran.APP_PATH}/5/app/**/*`,
            exclude: [
              `${toweran.APP_PATH}/5/app/http`,
              `${toweran.APP_PATH}/5/app/listeners`,
            ],
          },
          strategy: CONST.DI.DOT_NOTATION,
          base: 'app'
        },
        {
          path: `${toweran.APP_PATH}/5/app/http/controllers/*Controller.js`,
          strategy: CONST.DI.DOT_NOTATION,
        },
        {
          path: `${toweran.APP_PATH}/5/app/listeners/*Listener.js`,
          strategy: CONST.DI.DOT_NOTATION,
        },
      ],
      classes: [
        {
          name: 'Foo',
          path: `${toweran.APP_PATH}/5/app/domain/bazX/Foo.js`,
          key: 'app.domain.bazX.Foo',
          dependencies: [
            {
              key: 'logger',
              variable: 'logger',
            },
            {
              key: 'app.domain.bar.FooBar',
              variable: 'fooBar',
            },
          ],
          expMethod: () => {
            return this.fooBar.expMethod()
          },
          expVal: 2989,
          has: true,
        },
        {
          name: 'FooBar',
          path: `${toweran.APP_PATH}/5/app/domain/bar/FooBar.js`,
          key: 'app.domain.bar.FooBar',
          dependencies: [],
          expMethod: () => {
            return 2989
          },
          expVal: 2989,
          has: true,
        },

        {
          name: 'SomeThing',
          path: `${toweran.APP_PATH}/5/app/http/controllers/SomeThing.js`,
          key: 'SomeThing',
          dependencies: [],
          expMethod: () => {
          },
          has: false,
        },
        { //app key
          name: 'SomeThing',
          path: `${toweran.APP_PATH}/5/app/http/controllers/SomeThing.js`,
          key: 'app.http.controllers.SomeThing',
          dependencies: [],
          expMethod: () => {
          },
          has: false,
        },

        {
          name: 'AbController',
          path: `${toweran.APP_PATH}/5/app/http/controllers/AbController.js`,
          key: 'AbController',
          dependencies: [
            {
              key: 'app.domain.bazX.Foo',
              variable: 'foo',
            },
          ],
          expMethod: () => {
            return this.foo.expMethod()
          },
          expVal: 2989,
          has: true,
        },

        { //app key
          name: 'StartListener',
          path: `${toweran.APP_PATH}/5/app/listeners/StartListener.js`,
          key: 'app.listeners.StartListener',
          dependencies: [
            {
              key: 'app.domain.bazX.Foo',
              variable: 'foo',
            },
          ],
          expMethod: () => {
            return this.foo.expMethod()
          },
          has: false,
        },
        {
          name: 'StartListener',
          path: `${toweran.APP_PATH}/5/app/listeners/StartListener.js`,
          key: 'StartListener',
          dependencies: [
            {
              key: 'app.domain.bazX.Foo',
              variable: 'foo',
            },
          ],
          expMethod: () => {
            return this.foo.expMethod()
          },
          expVal: 2989,
          has: true,
        }
      ]
    },
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
