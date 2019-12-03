const ListenerInterface = toweran.ListenerInterface

class AfterAppStartedListener extends ListenerInterface {
    handle() {
        console.log('yey application started successfully')
    }
}

module.exports = AfterAppStartedListener
