'use strict'

require('../../../bootstrap')

describe(`Dependency Injector pattern cutting`, () => {
  const DependencyInjectorOrigin = require(toweran.FRAMEWORK_PATH + '/lib/DependencyInjector')
  const cutPattern = DependencyInjectorOrigin.prototype._cutPattern

  const diStub = {}
  diStub.cutPattern = cutPattern.bind(diStub)

  function dataProvider() {
    return [
      {
        comment: 'dir',
        pattern: '/a/b/c/root/app',
        result: '/a/b/c/root/app',
      },
      {
        comment: 'dir with trailing slash',
        pattern: '/a/b/c/root/app/',
        result: '/a/b/c/root/app',
      },
      {
        comment: 'pattern simple',
        pattern: '/a/b/c/root/app/*',
        result: '/a/b/c/root/app',
      },
      {
        comment: 'pattern double',
        pattern: '/a/b/c/root/app/**/*',
        result: '/a/b/c/root/app',
      },
      {
        comment: 'pattern mixed',
        pattern: '/a/b/c/root/lib/provider*/**/*',
        result: '/a/b/c/root/lib',
      },
      {
        comment: 'pattern question mixed',
        pattern: '/a/b/c/root/adapters/http?/*',
        result: '/a/b/c/root/adapters',
      },
    ]
  }

  dataProvider().forEach((set, index) => {
    it(`#${index}, ${set.comment}`, () => {
      expect(diStub.cutPattern(set.pattern)).toBe(set.result)
    })
  })

})
