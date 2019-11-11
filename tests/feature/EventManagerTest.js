'use strict'

require('../bootstrap')
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

describe(`Event Manager feature tests`, () => {

    it('listeners should be called if an event dispatched', () => {
        const eventManager = new EventManager({
            events: { events: [{ event: 'eventName', listeners: [ new MockedListener ] }] }
        })

        eventManager.init()

        eventManager.dispatch('eventName')

        expect(listenerCalled).toBe(true)
    })

    it('listeners should be able accept optional payloads', () => {
        const eventManager = new EventManager({
            events: { events: [{ event: 'eventName', listeners: [ new MockedListener ] }] }
        })

        eventManager.init()

        eventManager.dispatch('eventName', mockedPayload)

        expect(listenerPayload).toBe(mockedPayload)
    })
})
