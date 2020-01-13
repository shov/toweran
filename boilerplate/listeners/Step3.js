const ListenerInterface = toweran.ListenerInterface

class Step3 extends ListenerInterface {
  handle() {
    console.log('step 3 called')
  }
}

module.exports = Step3
