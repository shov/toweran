module.exports = {
  /**
   * Events and listeners predefined relations, do not recommend to use
   * better use Events instead and subscribe on them with Listeners / callbacks
   * in the boot section of AppEventServiceProvider (you can create it on your own)
   *
   * Example of an entry:
   * {
   *   event: 'time_to_sleep',
   *   listeners: [
   *     new (require(APP_PATH + '/app/listeners/SleepTimeListener')),
   *     async () => {
   *       const logger = toweran.app.get('logger')
   *       for(let i = 1; i <= 2989; i++) {
   *         await new Promise(r => setInterval(() => {
   *           logger.log(`${i} sheep${i > 1 ? 's' : ''}`)
   *           r()
   *         }, 1000)
   *       }
   *     },
   *     () => { toweran.app.get('logger').log('Good Night!'); }
   *   ],
   *
   * }
   */
  events: [],
}
