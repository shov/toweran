'use strict'

require('../../bootstrap')

const fs = require('fs-extra')
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
          title: 'positive: contents no ES6 class, but exports a constructor of class 3',
          content: `
            'use strict'
            
            module.exports = function TestClassName () {}
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

  describe(`Load scripts the process`, () => {
    const dir = toweran.TEST_PATH + '/data/scriptToBeLoadedAndProcessed'
    fs.ensureDirSync(dir, 0o2775)

    pathPatternsDataProvider().forEach((pattern, dataSetIndex) => {
      it(`positive #${dataSetIndex}`, () => {

        fs.writeFileSync(dir + '/aScript.js', `
          'use strict'
          exports.foo = () => {}
        `)

        fs.writeFileSync(dir + '/ClassToBeTestedA.js', `
          'use strict'
          
          global.affectRequire = global.affectRequire || 0
          global.affectRequire += 1
          
          class ClassToBeTestedA {
            
          }
          module.exports = ClassToBeTestedA
        `)

        fs.writeFileSync(dir + '/ClassToBeTestedB.js', `
          'use strict'
          
          global.affectRequire = global.affectRequire || 0
          global.affectRequire += 1
          
          module.exports = function ClassToBeTestedB () {}
        `)

        const result = scriptLoader.processExpression(pattern, files => {
          return files
            .filter(scriptLoader.isClass.bind(scriptLoader))
            .reduce((result, file) => {
              const constructor = require(file)

              if (!constructor.prototype || !constructor.prototype.constructor || !constructor.prototype.constructor.name) {
                return result
              }

              const className = constructor.prototype.constructor.name

              if (className !== file.replace(/(.*)?\/([^\/]+)\.js$/, '$2')) {
                return result
              }

              result.push({
                file,
                className,
                constructor
              })

              return result
            }, [])
        })

        fs.unlinkSync(dir + '/aScript.js')
        fs.unlinkSync(dir + '/ClassToBeTestedA.js')
        fs.unlinkSync(dir + '/ClassToBeTestedB.js')

        expect(result.length).toBe(2)

        result.forEach(stats => {
          expect(stats.className).toBe(stats.constructor.prototype.constructor.name)
        })

        expect(global.affectRequire).toBe(2)
      })
    })

    function pathPatternsDataProvider() {
      return [
        dir,
        dir + '/*.js',
        dir + '/**/*.js',
      ]
    }
  })
})
