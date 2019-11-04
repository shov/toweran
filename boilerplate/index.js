const app = require('./bootstrap')

try {
  app
    .register()
    .boot()
    .start()
} catch (e) {
  app.get('logger').error(e.message, e.stack)
}
