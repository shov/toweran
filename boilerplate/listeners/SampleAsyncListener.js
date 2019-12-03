const ListenerInterface = toweran.ListenerInterface

class SampleAsyncListener extends ListenerInterface {
    async handle() {
       // Do what ever you want
    }
}

module.exports = SampleAsyncListener
