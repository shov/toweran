const app = require('./bootstrap')

try {
  app.register()
  app.init()
  app.start()
} catch(e) {
  app.get('logger').error(e.message, e.stack)
}
