const ListenerInterface = toweran.ListenerInterface

class AfterAppStarted extends ListenerInterface {
    handle() {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('application started')
                resolve()
            }, 3000)
        })
    }
}

module.exports = AfterAppStarted
