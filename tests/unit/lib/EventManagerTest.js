'use strict'

require('../../bootstrap')
const {
  FRAMEWORK_PATH,
  ListenerInterface,
  InvalidArgumentException,
  ConfigManager,
} = toweran

const EventManager = require(FRAMEWORK_PATH + '/lib/EventManager')

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

const closureListener = (payload) => {
  payload.called = true
}

const asyncClosureListener = async (payload) => {
  payload.called = true
}

/**
 * This is a sample payload
 * @type {{Object}}
 */
const mockedPayload = {
  name: 'test',
  email: 'test@test.com',
}

const oneEventConfig = new ConfigManager({
  events: {
    events: [{event: 'eventName', listeners: []}]
  }
}).freeze().getAccessor()

const emptyConfig = new ConfigManager({}).freeze().getAccessor()

/*------------------------------------------------------*/

describe(`Event Manager unit tests`, () => {

  it(`should not created without passing config object`, () => {
    const act = () => {
      const eventManager = new EventManager()
    }

    expect(act).toThrow(InvalidArgumentException)
  })

  it(`should not created without config file`, () => {
    const act = () => {
      const eventManager = new EventManager(emptyConfig)
    }

    expect(act).not.toThrow(InvalidArgumentException)
  })

  it(`exists method should return true if event exists`, () => {
    const eventManager = new EventManager(oneEventConfig)

    eventManager.init()

    const exists = eventManager.exists('eventName')

    expect(exists).toBe(true)
  })

  it(`exists method should return false if event not exists`, () => {
    const eventManager = new EventManager(oneEventConfig)

    eventManager.init()

    const exists = eventManager.exists('undefinedEvent')

    expect(exists).toBe(false)
  })

  it(`should not be able to run before init`, async () => {
    const eventManager = new EventManager(oneEventConfig)

    try {
      await eventManager.dispatch('eventName')
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it(`should be functional after initialization`, () => {
    const act = () => {
      const eventManager = new EventManager(oneEventConfig)

      eventManager.init()

      eventManager.dispatch('eventName')
    }

    expect(act).not.toThrow(Error)
  })

  it(`dispatch method can accept any payload`, () => {
    const act = () => {
      const eventManager = new EventManager(emptyConfig)

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
    const eventManager = new EventManager(mockedListenerConfig)

    eventManager.init()

    eventManager.dispatch('eventName')

    expect(listenerCalled).toBe(true)
  })

  const mockedListenerConfig = new ConfigManager({
    events: {events: [{event: 'eventName', listeners: [new MockedListener]}]}
  }).freeze().getAccessor()

  it('listeners should be able accept optional payloads', () => {
    const eventManager = new EventManager(mockedListenerConfig)

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

    const config = new ConfigManager({
      events: {events: [{event: 'eventName', listeners: [new mockedPromiseListener()]}]}
    }).freeze().getAccessor()

    const eventManager = new EventManager(config)

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

    const config = new ConfigManager({
      events: {events: [{event: 'eventName', listeners: [new mockedAsyncListener()]}]}
    }).freeze().getAccessor()

    const eventManager = new EventManager(config)

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

    const config = new ConfigManager({
      events: {events: [{event: 'eventName', listeners: [new mockedNonPromiseListener()]}]}
    }).freeze().getAccessor()

    const eventManager = new EventManager(config)

    eventManager.init()

    eventManager.dispatch('eventName')

    expect(state).toEqual(true)
  })

  it('closure listener from config', () => {
    const config = new ConfigManager({
      events: {events: [{event: 'eventName', listeners: [closureListener]}]}
    }).freeze().getAccessor()

    const eventManager = new EventManager(config)

    eventManager.init()

    const state = {called: false}
    eventManager.dispatch('eventName', state)

    expect(state.called).toEqual(true)
  })

  it('closure listener from subscription', () => {
    const eventManager = new EventManager(emptyConfig)

    eventManager.init()
    eventManager.subscribe('eventName', closureListener)

    const state = {called: false}
    eventManager.dispatch('eventName', state)

    expect(state.called).toEqual(true)
  })

  it('async closure listener from subscription', async () => {
    const eventManager = new EventManager(emptyConfig)

    eventManager.init()
    eventManager.subscribe('eventName', asyncClosureListener)

    const state = {called: false}
    await eventManager.dispatch('eventName', state)

    expect(state.called).toEqual(true)
  })
})
