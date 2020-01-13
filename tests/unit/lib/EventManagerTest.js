'use strict'

require('../../bootstrap')
const EventManager = require(toweran.FRAMEWORK_PATH + '/lib/EventManager')
const ListenerInterface = toweran.ListenerInterface

let listenerCalled = false
let listenerPayload = {}

/**
 * Mocked Listener
 * @type {ListenerInterface}
 */
const MockedListener = class extends ListenerInterface {
  constructor() {
    super()
  }

  handle(payload) {
    listenerCalled = true
    listenerPayload = payload
  }
}

/**
 * This is a sample payload
 * @type {{Object}}
 */
const mockedPayload = {
  name: 'test',
  email: 'test@test.com',
}

/*------------------------------------------------------*/

describe(`Event Manager unit tests`, () => {

  const InvalidArgumentException = toweran.InvalidArgumentException

  it(`should not created without passing config object`, () => {
    const act = () => {
      const eventManager = new EventManager()
    }

    expect(act).toThrow(InvalidArgumentException)
  })

  it(`should not created without config file`, () => {
    const act = () => {
      const eventManager = new EventManager({})
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`exists method should return true if event exists`, () => {
    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: []}]}
    })

    eventManager.init()

    const exists = eventManager.exists('eventName')

    expect(exists).toBe(true)
  })

  it(`exists method should return false if event not exists`, () => {
    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: []}]}
    })

    eventManager.init()

    const exists = eventManager.exists('undefinedEvent')

    expect(exists).toBe(false)
  })

  it(`should not be able to run before init`, async () => {
    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: []}]}
    })

    try {
      await eventManager.dispatch('eventName')
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it(`should be functional after initialization`, () => {
    const act = () => {
      const eventManager = new EventManager({
        events: {events: [{event: 'eventName', listeners: []}]}
      })

      eventManager.init()

      eventManager.dispatch('eventName')
    }

    expect(act).not.toThrow(Error)
  })

  it(`dispatch method can accept any payload`, () => {
    const act = () => {
      const eventManager = new EventManager({})

      eventManager.init()

      eventManager.dispatch('event', null)
      eventManager.dispatch('event')
      eventManager.dispatch('event', '')
      eventManager.dispatch('event', 'payload')
      eventManager.dispatch('event', {})
    }

    expect(act).not.toThrow(Error)
  })

  it('listeners should be called if an event dispatched', () => {
    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: [new MockedListener]}]}
    })

    eventManager.init()

    eventManager.dispatch('eventName')

    expect(listenerCalled).toBe(true)
  })

  it('listeners should be able accept optional payloads', () => {
    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: [new MockedListener]}]}
    })

    eventManager.init()

    eventManager.dispatch('eventName', mockedPayload)

    expect(listenerPayload).toBe(mockedPayload)
  })

  it('listeners can return promises', async () => {

    let state = false

    const mockedPromiseListener = class extends ListenerInterface {
      handle(payload) {
        return new Promise(resolve => {
          setTimeout(() => {
            state = true
            resolve()
          }, 0)
        })
      }
    }

    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: [new mockedPromiseListener()]}]}
    })

    eventManager.init()

    await eventManager.dispatch('eventName')

    expect(state).toEqual(true)
  })

  it('listeners can be async', async () => {

    let state = false

    const mockedAsyncListener = class extends ListenerInterface {
      async handle(payload) {
        state = true
      }
    }

    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: [new mockedAsyncListener()]}]}
    })

    eventManager.init()

    await eventManager.dispatch('eventName')

    expect(state).toEqual(true)
  })

  it('listeners can be non-promises', () => {

    let state = false

    const mockedNonPromiseListener = class extends ListenerInterface {
      handle(payload) {
        state = true
      }
    }

    const eventManager = new EventManager({
      events: {events: [{event: 'eventName', listeners: [new mockedNonPromiseListener()]}]}
    })

    eventManager.init()

    eventManager.dispatch('eventName')

    expect(state).toEqual(true)
  })
})
