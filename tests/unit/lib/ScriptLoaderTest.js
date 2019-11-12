'use strict'

require('../../bootstrap')

const fs = require('fs-extra')
const check = require('check-types')
const Logger = toweran.Logger

describe(`Check strategies`, () => {

  let logger

  /** @type {ScriptLoader} */
  let scriptLoader

  beforeAll(() => {
    logger = new Logger(toweran.TEST_PATH + '/data/logs', 'framework_testing')
  })

  beforeEach(() => {
    scriptLoader = new (require(toweran.FRAMEWORK_PATH + '/lib/ScriptLoader'))(
      logger
    )
  })

  describe(`Is file a JS script`, () => {
    it(`positive`, () => {
      fs.ensureDirSync(toweran.TEST_PATH + '/data/scriptToBeLoaded', 0o2775)
      fs.writeFileSync(toweran.TEST_PATH + '/data/scriptToBeLoaded/aScript.js', `
        'use strict'
        exports.foo = () => {}
      `)

      const result = scriptLoader.isJsFile(toweran.TEST_PATH + '/data/scriptToBeLoaded/aScript.js')
      fs.unlinkSync(toweran.TEST_PATH + '/data/scriptToBeLoaded/aScript.js')

      expect(result).toBe(true)

    })

    it(`negative: nonJs extension`, () => {
      fs.ensureDirSync(toweran.TEST_PATH + '/data/scriptToBeLoaded', 0o2775)
      fs.writeFileSync(toweran.TEST_PATH + '/data/scriptToBeLoaded/aScript.txt', `
        'use strict'
        exports.foo = () => {}
      `)

      const result = scriptLoader.isJsFile(toweran.TEST_PATH + '/data/scriptToBeLoaded/aScript.txt')
      fs.unlinkSync(toweran.TEST_PATH + '/data/scriptToBeLoaded/aScript.txt')

      expect(result).toBe(false)

    })

    it(`negative: nonexistent file`, () => {

      const result = scriptLoader.isJsFile(toweran.TEST_PATH + '/data/scriptToBeLoaded/someAbsence.js')

      expect(result).toBe(false)
    })
  })

  describe(`Is file a ES6 Class js script`, () => {

    es6classTestsDataProvider().forEach((dataSet, i) => {
      it(dataSet.title, () => {
        fs.ensureDirSync(toweran.TEST_PATH + `/data/scriptToBeLoaded/${i}`, 0o2775)
        fs.writeFileSync(toweran.TEST_PATH + `/data/scriptToBeLoaded/${i}/TestClassName.js`, dataSet.content)

        const result = scriptLoader.isClass(toweran.TEST_PATH + `/data/scriptToBeLoaded/${i}/TestClassName.js`)
        fs.unlinkSync(toweran.TEST_PATH + `/data/scriptToBeLoaded/${i}/TestClassName.js`)

        expect(result).toBe(dataSet.expected)

      })

    })

    function es6classTestsDataProvider() {
      return [
        {
          title: 'positive: contents ES6 class, export it',
          content: `
            'use strict'
            class TestClassName = {}
            module.exports = TestClassName
          `,
          expected: true
        },
        {
          title: 'positive: contents no ES6 class, but exports a constructor of class 1',
          content: `
            'use strict'
            const TestClassName = function () {}
            module.exports = TestClassName
          `,
          expected: true
        },
        {
          title: 'positive: contents no ES6 class, but exports a constructor of class 2',
          content: `
            'use strict'
            function TestClassName () {}
            module.exports = TestClassName
          `,
          expected: true
        },
        {
          title: 'negative: contents ES6 class, but doesn\'t export it',
          content: `
            'use strict'
            class TestClassName {}
            module.exports = 3
          `,
          expected: false
        },
        {
          title: 'negative: contents ES6 class, export it, bit with wrong name',
          content: `
            'use strict'
            class SomeClass {}
            module.exports = SomeClass
          `,
          expected: false
        },
        {
          title: 'negative: contents no ES6 class, exports a variable with expected name',
          content: `
            'use strict'
            const TestClassName = {}
            module.exports = TestClassName
          `,
          expected: false
        },
        {
          title: 'negative: contents no class',
          content: `
            'use strict'
            exports.foo = () => {}
          `,
          expected: false
        },
      ]
    }
  })
})
