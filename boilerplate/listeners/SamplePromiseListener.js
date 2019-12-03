const ListenerInterface = toweran.ListenerInterface

class SamplePromiseListener extends ListenerInterface {
    handle() {
        return new Promise((resolve, error) => {
            if(true) {
                resolve()
            }

            error()
        })
    }
}

module.exports = SamplePromiseListener
