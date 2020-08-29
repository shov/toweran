const app = require('./bootstrap')

try {
  app
    .register({
      threadName: process.env.THREAD_NAME || null
    })
    .boot()
    .start()
} catch (e) {
  app.get('logger').error(e.message, e.stack)
}
