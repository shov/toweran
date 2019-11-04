class ListenerInterface {
    handle() {
        throw new Error('Must be implemented in a child class!')
    }
}

module.exports = ListenerInterface
