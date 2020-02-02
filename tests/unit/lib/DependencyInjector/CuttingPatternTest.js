'use strict'

require('../../../bootstrap')
const { sep } = require('path'); // system path separator

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
        comment: 'root dir',
        pattern: '/a',
        result: '/a',
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

  function windowsDataProvider() {
    return [
      {
        comment: 'dir',
        pattern: 'D:\\a\\b\\c\\root\\app',
        result: 'D:/a/b/c/root/app',
      },
      {
        comment: 'dir with trailing slash',
        pattern: 'd:\\a\\b\\c\\root\\app\\',
        result: 'd:/a/b/c/root/app',
      },
      {
        comment: 'root dir',
        pattern: 'd:\\a',
        result: 'd:/a',
      },
      {
        comment: 'pattern simple',
        pattern: 'd:\\a\\b\\c\\root/app/*',
        result: 'd:/a/b/c/root/app',
      },
      {
        comment: 'pattern double',
        pattern: 'd:\\a\\b\\c\\root\\app/**/*',
        result: 'd:/a/b/c/root/app',
      },
      {
        comment: 'pattern mixed',
        pattern: 'c:\\a\\b\\c\\root/lib/provider*/**/*',
        result: 'c:/a/b/c/root/lib',
      },
      {
        comment: 'pattern question mixed',
        pattern: 'd:\\a\\b\\c\\root\\adapters/http?/*',
        result: 'd:/a/b/c/root/adapters',
      },
    ]
  }

  if (sep === '/') {
    dataProvider().forEach((set, index) => {
      it(`#${index}, ${set.comment}`, () => {
        expect(diStub.cutPattern(set.pattern)).toBe(set.result)
      })
    })
  } else if (sep === '\\') {
    windowsDataProvider().forEach((set, index) => {
      it(`#${index}, ${set.comment}`, () => {
        expect(diStub.cutPattern(set.pattern)).toBe(set.result)
      })
    })
  } else {
    throw new Error(`Unknown system path separator "${sep}"!`)
  }
})
