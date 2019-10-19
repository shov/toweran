'use strict'

require('../../bootstrap')

/**
 * TODO: For sure not 100% cover, but most of cases, could be improved
 */

describe(`Helper of validation of types and instances, "Must"`, () => {

  /**
   * @type {Must}
   */
  const must = toweran.must
  const InvalidArgumentException = toweran.InvalidArgumentException

  it(`Boolean positive cases`, () => {
    const act = () => {
      must.be.boolean(true)
      must.be.boolean(false)

      must.notBe.boolean('true')
      must.notBe.boolean('false')
      must.notBe.boolean('')
      must.notBe.boolean(0)
      must.notBe.boolean(1)

      must.be.nullOr.boolean(true)
      must.be.nullOr.boolean(false)
      must.be.nullOr.boolean(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Boolean negative cases`, () => {
    const acts = [
      () => {
        must.notBe.boolean(true)
      },
      () => {
        must.notBe.boolean(false)
      },

      () => {
        must.be.boolean('true')
      },
      () => {
        must.be.boolean('false')
      },
      () => {
        must.be.boolean('')
      },
      () => {
        must.be.boolean(0)
      },
      () => {
        must.be.boolean(1)
      },

      () => {
        must.notBe.nullOr.boolean(true)
      },
      () => {
        must.notBe.nullOr.boolean(false)
      },
      () => {
        must.notBe.nullOr.boolean(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Number positive cases`, () => {
    const act = () => {
      must.be.number(0)
      must.be.number(1)
      must.be.number(1.212)
      must.be.number(0.001)
      must.be.number(0o2)
      must.be.number(0xA)
      must.be.number(0b11)

      must.notBe.number(NaN)
      must.notBe.number(Infinity)
      must.notBe.number(-Infinity)
      must.notBe.number(true)
      must.notBe.number('0')
      must.notBe.number('90')
      must.notBe.number(null)

      must.be.nullOr.number(10)
      must.be.nullOr.number(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Number negative cases`, () => {
    const acts = [
      () => {
        must.notBe.number(0)
      },
      () => {
        must.notBe.number(1)
      },
      () => {
        must.notBe.number(1.212)
      },
      () => {
        must.notBe.number(0.001)
      },
      () => {
        must.notBe.number(0o2)
      },
      () => {
        must.notBe.number(0xA)
      },
      () => {
        must.notBe.number(0b11)
      },

      () => {
        must.be.number(NaN)
      },
      () => {
        must.be.number(Infinity)
      },
      () => {
        must.be.number(-Infinity)
      },
      () => {
        must.be.number(true)
      },
      () => {
        must.be.number('0')
      },
      () => {
        must.be.number('90')
      },
      () => {
        must.be.number(null)
      },

      () => {
        must.notBe.nullOr.number(10)
      },
      () => {
        must.notBe.nullOr.number(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Integer positive cases`, () => {
    const act = () => {
      must.be.integer(0)
      must.be.integer(1)
      must.be.integer(0o2)
      must.be.integer(0xA)
      must.be.integer(0b11)

      must.notBe.integer(1.212)
      must.notBe.integer(0.001)
      must.notBe.integer(NaN)
      must.notBe.integer(Infinity)
      must.notBe.integer(-Infinity)
      must.notBe.integer(true)
      must.notBe.integer('0')
      must.notBe.integer('90')
      must.notBe.integer(null)

      must.be.nullOr.integer(10)
      must.be.nullOr.integer(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Integer negative cases`, () => {
    const acts = [
      () => {
        must.be.integer(0)
      },
      () => {
        must.be.integer(1)
      },
      () => {
        must.be.integer(0o2)
      },
      () => {
        must.be.integer(0xA)
      },
      () => {
        must.be.integer(0b11)
      },

      () => {
        must.notBe.integer(1.212)
      },
      () => {
        must.notBe.integer(0.001)
      },
      () => {
        must.notBe.integer(NaN)
      },
      () => {
        must.notBe.integer(Infinity)
      },
      () => {
        must.notBe.integer(-Infinity)
      },
      () => {
        must.notBe.integer(true)
      },
      () => {
        must.notBe.integer('0')
      },
      () => {
        must.notBe.integer('90')
      },
      () => {
        must.notBe.integer(null)
      },

      () => {
        must.be.nullOr.integer(10)
      },
      () => {
        must.be.nullOr.integer(null)
      },
    ]

    acts.forEach(a => expect(a).not.toThrow(InvalidArgumentException))
  })

  it(`String positive cases`, () => {
    const act = () => {
      must.be.string('hello')
      must.be.string('')

      must.notBe.string(new String(''))
      must.notBe.string(1.212)
      must.notBe.string(0)
      must.notBe.string(NaN)
      must.notBe.string(Infinity)
      must.notBe.string(-Infinity)
      must.notBe.string(true)
      must.notBe.string(0b11)
      must.notBe.string({})
      must.notBe.string(null)

      must.be.nullOr.string('full')
      must.be.nullOr.string(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`String negative cases`, () => {
    const acts = [
      () => {
        must.notBe.string('hello')
      },
      () => {
        must.notBe.string('')
      },

      () => {
        must.be.string(new String(''))
      },
      () => {
        must.be.string(1.212)
      },
      () => {
        must.be.string(0)
      },
      () => {
        must.be.string(NaN)
      },
      () => {
        must.be.string(Infinity)
      },
      () => {
        must.be.string(-Infinity)
      },
      () => {
        must.be.string(true)
      },
      () => {
        must.be.string(0b11)
      },
      () => {
        must.be.string({})
      },
      () => {
        must.be.string(null)
      },

      () => {
        must.notBe.nullOr.string('full')
      },
      () => {
        must.notBe.nullOr.string(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Not an empty string positive cases`, () => {
    const act = () => {
      must.be.notEmptyString('hello')
      must.be.notEmptyString('0')

      must.notBe.notEmptyString('')
      must.notBe.notEmptyString(new String(''))
      must.notBe.notEmptyString(1.212)
      must.notBe.notEmptyString(0)
      must.notBe.notEmptyString(NaN)
      must.notBe.notEmptyString(Infinity)
      must.notBe.notEmptyString(-Infinity)
      must.notBe.notEmptyString(true)
      must.notBe.notEmptyString(0b11)
      must.notBe.notEmptyString({})
      must.notBe.notEmptyString(null)

      must.be.nullOr.notEmptyString('full')
      must.be.nullOr.notEmptyString(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Not an empty string negative cases`, () => {
    const acts = [
      () => {
        must.notBe.notEmptyString('hello')
      },
      () => {
        must.notBe.notEmptyString('0')
      },

      () => {
        must.be.notEmptyString('')
      },
      () => {
        must.be.notEmptyString(new String(''))
      },
      () => {
        must.be.notEmptyString(1.212)
      },
      () => {
        must.be.notEmptyString(0)
      },
      () => {
        must.be.notEmptyString(NaN)
      },
      () => {
        must.be.notEmptyString(Infinity)
      },
      () => {
        must.be.notEmptyString(-Infinity)
      },
      () => {
        must.be.notEmptyString(true)
      },
      () => {
        must.be.notEmptyString(0b11)
      },
      () => {
        must.be.notEmptyString({})
      },
      () => {
        must.be.notEmptyString(null)
      },

      () => {
        must.notBe.nullOr.notEmptyString('full')
      },
      () => {
        must.notBe.nullOr.notEmptyString(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Object positive cases`, () => {
    const act = () => {
      must.be.object({})
      must.be.object(new Object())

      must.notBe.object(new String(''))
      must.notBe.object(function () {
      })
      must.notBe.object(() => {
      })
      must.notBe.object(Date)
      must.notBe.object('hello')
      must.notBe.object('')
      must.notBe.object(1.212)
      must.notBe.object([])
      must.notBe.object(NaN)
      must.notBe.object(Infinity)
      must.notBe.object(-Infinity)
      must.notBe.object(true)
      must.notBe.object(0b11)
      must.notBe.object(null)

      must.be.nullOr.object({})
      must.be.nullOr.object(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Object negative cases`, () => {
    const acts = [
      () => {
        must.notBe.object({})
      },
      () => {
        must.notBe.object(new Object())
      },

      () => {
        must.be.object(new String(''))
      },
      () => {
        must.be.object(function () {
        })
      },
      () => {
        must.be.object(() => {
        })
      },
      () => {
        must.be.object(Date)
      },
      () => {
        must.be.object('hello')
      },
      () => {
        must.be.object('')
      },
      () => {
        must.be.object(1.212)
      },
      () => {
        must.be.object([])
      },
      () => {
        must.be.object(NaN)
      },
      () => {
        must.be.object(Infinity)
      },
      () => {
        must.be.object(-Infinity)
      },
      () => {
        must.be.object(true)
      },
      () => {
        must.be.object(0b11)
      },
      () => {
        must.be.object(null)
      },

      () => {
        must.notBe.nullOr.object({})
      },
      () => {
        must.notBe.nullOr.object(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Function positive cases`, () => {
    const act = () => {
      must.be.function(function () {
      })
      must.be.function(() => {
      })
      must.be.function(Date)

      must.notBe.function({})
      must.notBe.function(new Object())
      must.notBe.function(new String(''))
      must.notBe.function('hello')
      must.notBe.function('')
      must.notBe.function(1.212)
      must.notBe.function([])
      must.notBe.function(NaN)
      must.notBe.function(Infinity)
      must.notBe.function(-Infinity)
      must.notBe.function(true)
      must.notBe.function(0b11)
      must.notBe.function(null)

      must.be.nullOr.function(() => {
      })
      must.be.nullOr.function(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Function negative cases`, () => {
    const acts = [
      () => {
        must.notBe.function(function () {
        })
      },
      () => {
        must.notBe.function(() => {
        })
      },
      () => {
        must.notBe.function(Date)
      },

      () => {
        must.be.function({})
      },
      () => {
        must.be.function(new Object())
      },
      () => {
        must.be.function(new String(''))
      },
      () => {
        must.be.function('hello')
      },
      () => {
        must.be.function('')
      },
      () => {
        must.be.function(1.212)
      },
      () => {
        must.be.function([])
      },
      () => {
        must.be.function(NaN)
      },
      () => {
        must.be.function(Infinity)
      },
      () => {
        must.be.function(-Infinity)
      },
      () => {
        must.be.function(true)
      },
      () => {
        must.be.function(0b11)
      },
      () => {
        must.be.function(null)
      },

      () => {
        must.notBe.nullOr.function(() => {
        })
      },
      () => {
        must.notBe.nullOr.function(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Array positive cases`, () => {
    const act = () => {
      must.be.array([])
      must.be.array([1, 2, 3, 'rrr', {}, []])
      must.be.array(new Array(5))

      must.notBe.array(function () {
      })
      must.notBe.array(() => {
      })
      must.notBe.array(Date)
      must.notBe.array({})
      must.notBe.array(new Object())
      must.notBe.array(new String(''))
      must.notBe.array('hello')
      must.notBe.array('')
      must.notBe.array(1.212)
      must.notBe.array(NaN)
      must.notBe.array(Infinity)
      must.notBe.array(-Infinity)
      must.notBe.array(true)
      must.notBe.array(0b11)
      must.notBe.array(null)

      must.be.nullOr.array([])
      must.be.nullOr.array(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Array negative cases`, () => {
    const acts = [
      () => {
        must.notBe.array([])
      },
      () => {
        must.notBe.array([1, 2, 3, 'rrr', {}, []])
      },
      () => {
        must.notBe.array(new Array(5))
      },

      () => {
        must.be.array(function () {
        })
      },
      () => {
        must.be.array(() => {
        })
      },
      () => {
        must.be.array(Date)
      },
      () => {
        must.be.array({})
      },
      () => {
        must.be.array(new Object())
      },
      () => {
        must.be.array(new String(''))
      },
      () => {
        must.be.array('hello')
      },
      () => {
        must.be.array('')
      },
      () => {
        must.be.array(1.212)
      },
      () => {
        must.be.array(NaN)
      },
      () => {
        must.be.array(Infinity)
      },
      () => {
        must.be.array(-Infinity)
      },
      () => {
        must.be.array(true)
      },
      () => {
        must.be.array(0b11)
      },
      () => {
        must.be.array(null)
      },

      () => {
        must.notBe.nullOr.array([])
      },
      () => {
        must.notBe.nullOr.array(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Not empty array positive cases`, () => {
    const act = () => {
      must.be.notEmptyArray([1, 2, 3, 'rrr', {}, []])
      must.be.notEmptyArray(new Array(5))

      must.notBe.notEmptyArray([])
      must.notBe.notEmptyArray(function () {
      })
      must.notBe.notEmptyArray(() => {
      })
      must.notBe.notEmptyArray(Date)
      must.notBe.notEmptyArray({})
      must.notBe.notEmptyArray(new Object())
      must.notBe.notEmptyArray(new String(''))
      must.notBe.notEmptyArray('hello')
      must.notBe.notEmptyArray('')
      must.notBe.notEmptyArray(1.212)
      must.notBe.notEmptyArray(NaN)
      must.notBe.notEmptyArray(Infinity)
      must.notBe.notEmptyArray(-Infinity)
      must.notBe.notEmptyArray(true)
      must.notBe.notEmptyArray(0b11)
      must.notBe.notEmptyArray(null)

      must.be.nullOr.notEmptyArray([1, 2, 3])
      must.be.nullOr.notEmptyArray(null)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Not empty array negative cases`, () => {
    const acts = [
      () => {
        must.notBe.notEmptyArray([1, 2, 3, 'rrr', {}, []])
      },
      () => {
        must.notBe.notEmptyArray(new Array(5))
      },

      () => {
        must.be.notEmptyArray([])
      },
      () => {
        must.be.notEmptyArray(function () {
        })
      },
      () => {
        must.be.notEmptyArray(() => {
        })
      },
      () => {
        must.be.notEmptyArray(Date)
      },
      () => {
        must.be.notEmptyArray({})
      },
      () => {
        must.be.notEmptyArray(new Object())
      },
      () => {
        must.be.notEmptyArray(new String(''))
      },
      () => {
        must.be.notEmptyArray('hello')
      },
      () => {
        must.be.notEmptyArray('')
      },
      () => {
        must.be.notEmptyArray(1.212)
      },
      () => {
        must.be.notEmptyArray(NaN)
      },
      () => {
        must.be.notEmptyArray(Infinity)
      },
      () => {
        must.be.notEmptyArray(-Infinity)
      },
      () => {
        must.be.notEmptyArray(true)
      },
      () => {
        must.be.notEmptyArray(0b11)
      },
      () => {
        must.be.notEmptyArray(null)
      },

      () => {
        must.notBe.nullOr.notEmptyArray([1, 2, 3])
      },
      () => {
        must.notBe.nullOr.notEmptyArray(null)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Instance positive cases`, () => {
    const day = new Date()
    const x = new class X {
    }

    const act = () => {
      must.be.instance(day, Date)
      must.be.instance(x, X)
      must.be.instance({}, Object)
      must.be.instance(day, Object)

      must.notBe.instance(day, function () {
      })
      must.notBe.instance(day, () => {
      })
      must.notBe.instance(day, String)
      must.notBe.instance(day, X)
      must.notBe.instance(x, Date)
      must.notBe.instance(null, Date)
      must.notBe.instance(null, X)

      must.be.nullOr.instance(day, Date)
      must.be.nullOr.instance(x, X)
      must.be.nullOr.instance(null, Date)
      must.be.nullOr.instance(null, X)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`Instance array negative cases`, () => {
    const day = new Date()
    const X = function () {
    }
    const x = new X()

    const acts = [
      () => {
        must.notBe.instance(day, Date)
      },
      () => {
        must.notBe.instance(x, X)
      },

      () => {
        must.notBe.instance({}, 4)
      },
      () => {
        must.be.instance({}, 4)
      },

      () => {
        must.notBe.instance(day, Object)
      },
      () => {
        must.be.instance(day, function () {
        })
      },
      () => {
        must.be.instance(day, () => {
        })
      },
      () => {
        must.be.instance(day, String)
      },
      () => {
        must.be.instance(day, X)
      },
      () => {
        must.be.instance(x, Date)
      },
      () => {
        must.be.instance(null, Date)
      },
      () => {
        must.be.instance(null, X)
      },

      () => {
        must.notBe.nullOr.instance(day, Date)
      },
      () => {
        must.notBe.nullOr.instance(x, X)
      },
      () => {
        must.notBe.nullOr.instance(null, Date)
      },
      () => {
        must.notBe.nullOr.instance(null, X)
      },
    ]

    acts.forEach(a => expect(a).toThrow(InvalidArgumentException))
  })

  it(`Array of positive cases`, () => {
    const day = new Date()
    const x = new class X {
    }

    const act = () => {
      must.be.arrayOf([new Date(), day, day], Date)
      must.be.arrayOf([3, 4.5, 5], 'number')
      must.be.arrayOf([3, 4, 5], 'integer')
      must.be.arrayOf([], 'integer')
      must.be.arrayOf([], X)
      must.be.arrayOf([{}, {}], Object)
      must.be.arrayOf([{}, day], Object)
      must.be.arrayOf([{}, x], Object)
      must.be.arrayOf([{}, x], 'object')
      must.be.arrayOf([() => {
      }, x.constructor, function () {
      }], 'function')
      must.be.arrayOf(['', 'rrr'], 'string')
      must.be.arrayOf([undefined, undefined], 'undefined')
      must.be.arrayOf([true, false], 'boolean')
      must.be.arrayOf([Symbol('xx')], 'symbol')

      must.notBe.arrayOf([null, 3], 'number')
      must.notBe.nullOr.arrayOf([null, 3], 'number')
      must.notBe.arrayOf([new Date(), day, day], X)
      must.notBe.arrayOf([3, 4.5, 5], X)
      must.notBe.arrayOf([3, 4, 5], 'string')
      must.notBe.arrayOf([{}, {}], 'symbol')

      must.be.nullOr.arrayOf(null, 'string')
      must.be.nullOr.arrayOf([''], 'string')
      must.be.nullOr.arrayOf(null, X)
      must.be.nullOr.arrayOf([x], X)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  //TODO: Array of negative cases

  //TODO: Symbol positive cases
  //TODO: Symbol negative cases

  //TODO: Not empty string or symbol positive cases
  //TODO: Not empty string or symbol negative cases
})
