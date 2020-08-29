'use strict'

require('../../bootstrap')

const fs = require('fs-extra')
const Logger = toweran.Logger

//TODO: extend the tests, add more cases
describe(`Check @DI annotation`, () => {

  let logger

  /**
   * @type {AnnotationInspector}
   */
  let annotationInspector

  beforeAll(() => {
    logger = new Logger(toweran.TEST_PATH + '/data/logs', 'framework_testing')
  })

  beforeEach(() => {
    annotationInspector = new (require(toweran.FRAMEWORK_PATH + '/lib/AnnotationInspector'))(
      logger
    )
  })

  it(`Check ES6 class with annotations`, () => {
    fs.ensureDirSync(toweran.TEST_PATH + '/data/annotationInspector', 0o2775)
    fs.writeFileSync(toweran.TEST_PATH + '/data/annotationInspector/SomeClass.js', `
        'use strict'
        class SomeClass {
          constructor() {
            this.foo = 'bar'
          }
        }
        
        module.exports = SomeClass
      `)

    const result = annotationInspector.getAnnotatedDependencies(toweran.TEST_PATH + '/data/annotationInspector/SomeClass.js')
    fs.unlinkSync(toweran.TEST_PATH + '/data/annotationInspector/SomeClass.js')

    expect(result).toBe(null)
  })

  it(`Check ES6 class without annotations`, () => {
    fs.ensureDirSync(toweran.TEST_PATH + '/data/annotationInspector', 0o2775)
    fs.writeFileSync(toweran.TEST_PATH + '/data/annotationInspector/SomeClass.js', `
        'use strict'
        class SomeClass {
          /**
           * @DI x.something
           * @DI logger
           * @param {{}} x
           * @param {Logger} logger
           **/
          constructor(x, logger) {
            this._x = x
            this._logger = logger
          }
        }
        
        module.exports = SomeClass
      `)

    const result = annotationInspector.getAnnotatedDependencies(toweran.TEST_PATH + '/data/annotationInspector/SomeClass.js')
    fs.unlinkSync(toweran.TEST_PATH + '/data/annotationInspector/SomeClass.js')

    expect(result).toStrictEqual(['x.something', 'logger'])
  })
})