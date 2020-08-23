'use strict'

require('../../bootstrap')

const {
  FRAMEWORK_PATH,
} = toweran


const check = require('check-types')
const ConfigReader = require(FRAMEWORK_PATH + '/lib/ConfigManager')

describe(`Test config manager`, () => {

  testDataProvider().forEach((data, i) => {
    it(`Case ${i}`, done => {

      const cm = new ConfigReader(data.rawConfig)
      const config = cm.freeze().getAccessor()

      if (check.function(data.expectedValue) && new data.expectedValue instanceof Error) {

        expect(() => {
          data.action(config)
        }).toThrow(data.expectedValue)

      } else {

        const result = data.action(config)

        if (data.isValuePrimitive) {
          expect(result).toBe(data.expectedValue)
        } else {
          expect(result).toStrictEqual(data.expectedValue)
        }

      }

      done()
    })
  })

  function testDataProvider() {
    return [
      //Access non-existing prop
      {
        rawConfig: {},
        action(config) {
          //doesn't exist, so expect undefined
          return config.app.disableJobs()
        },
        isValuePrimitive: true,
        expectedValue: undefined,
      },

      //Positive access to a primitive
      {
        rawConfig: {
          app: {
            serviceProviders: [],
            di: [
              {
                path: {
                  include: `/x/app/domain`,
                },
                strategy: toweran.C.DI.DOT_NOTATION,
                base: `app.domain`,
              },
            ],
            jobs: [],
            disableJobs: false,
            tasks: [],
            disableTasks: false,
          }
        },
        action(config) {
          return config.app.disableJobs()
        },
        isValuePrimitive: true,
        expectedValue: false,
      },

      //Positive access to an object
      {
        rawConfig: {
          app: {
            serviceProviders: [],
            di: [
              {
                path: {
                  include: `/x/app/domain`,
                },
                strategy: toweran.C.DI.DOT_NOTATION,
                base: `app.domain`,
              },
            ],
            jobs: [],
            disableJobs: false,
            tasks: [],
            disableTasks: false,
          }
        },
        action(config) {
          return config.app()
        },
        isValuePrimitive: false,
        expectedValue: {
          serviceProviders: [],
          di: [
            {
              path: {
                include: `/x/app/domain`,
              },
              strategy: toweran.C.DI.DOT_NOTATION,
              base: `app.domain`,
            },
          ],
          jobs: [],
          disableJobs: false,
          tasks: [],
          disableTasks: false,
        },
      },

      //Positive access to an array
      {
        rawConfig: {
          app: {
            serviceProviders: [],
            di: [
              {
                path: {
                  include: `/x/app/domain`,
                },
                strategy: toweran.C.DI.DOT_NOTATION,
                base: `app.domain`,
              },
            ],
            jobs: [],
            disableJobs: false,
            tasks: [],
            disableTasks: false,
          }
        },
        action(config) {
          return config.app.di()
        },
        isValuePrimitive: false,
        expectedValue: [
          {
            path: {
              include: `/x/app/domain`,
            },
            strategy: toweran.C.DI.DOT_NOTATION,
            base: `app.domain`,
          },
        ],
      },

      //Modify a not wrapped config object
      {
        rawConfig: {
          app: {
            serviceProviders: [],
            di: [
              {
                path: {
                  include: `/x/app/domain`,
                },
                strategy: toweran.C.DI.DOT_NOTATION,
                base: `app.domain`,
              },
            ],
            jobs: [],
            disableJobs: false,
            tasks: [],
            disableTasks: false,
          }
        },
        action(config) {
          //it's frozen and cannot be change
          config.app.di()[0].base = 'luka, go away now!'
          return config.app.di()
        },
        isValuePrimitive: false,
        expectedValue: TypeError,
      },

      //Modify a wrapped config object
      {
        rawConfig: {
          app: {
            serviceProviders: [],
            di: [
              {
                path: {
                  include: `/x/app/domain`,
                },
                strategy: toweran.C.DI.DOT_NOTATION,
                base: `app.domain`,
              },
            ],
            jobs: [],
            disableJobs: false,
            tasks: [],
            disableTasks: false,
          }
        },
        action(config) {
          //it's frozen and cannot be change
          config.app().di = {}
          return config.app.di()
        },
        isValuePrimitive: false,
        expectedValue: TypeError,
      },

    ]
  }

  it(`Test stored functions`, done => {

    const cm = new ConfigReader({
      dynamic: {
        roles: () => {
          return [1,2,3]
        }
      }
    })

    const config = cm.freeze().getAccessor()

    const result = config.dynamic.roles()()

    expect(result).toStrictEqual([1,2,3])

    done()
  })
})