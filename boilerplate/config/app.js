'use strict'

/**
 * Application configuration
 */
module.exports = {
  /**
   * Application level service providers, must be {BasicServiceProvider} child classes (constructors)
   */
  serviceProviders: [
    //Core service providers
    toweran.HelperServiceProvider,
    toweran.DependencyInjectionServiceProvider,
    toweran.EventServiceProvider,
    toweran.HTTPServiceProvider,

    //App service providers
  ],

  /**
   * Dependency Injection
   */
  di: [

    /** Domain */
    {
      path: {
        include: `${toweran.APP_PATH}/app/domain`,
      },
      strategy: toweran.C.DI.DOT_NOTATION,
      base: `app.domain`,
    },

    /** Events */
    {
      path: {
        include: `${toweran.APP_PATH}/app/events/*Event.js`,
      },
      strategy: toweran.C.DI.DOT_NOTATION,
      base: `app.events`,
    },

    /** Listeners */
    {
      path: {
        include: `${toweran.APP_PATH}/app/listeners/*Listener.js`,
      },
      strategy: toweran.C.DI.DOT_NOTATION,
      base: `app.listeners`,
    },

    /** HTTP */
    {
      path: {
        include: `${toweran.APP_PATH}/app/http/controllers/*Controller.js`,
      },
      strategy: toweran.C.DI.DOT_NOTATION,
    },
    {
      path: {
        include: `${toweran.APP_PATH}/app/http/middleware/*Middleware.js`,
      },
      strategy: toweran.C.DI.DOT_NOTATION,
    },
  ],

  /**
   * Jobs
   */
  jobs: [],

  /**
   * A way to temporary disable the jobs
   */
  disableJobs: process.env.APP_DISABLE_JOBS ? 'true' === process.env.APP_DISABLE_JOBS : false,

  /**
   * Tasks
   */
  tasks: [],

  /**
   * A way to temporary disable the the tasks
   */
  disableTasks: process.env.APP_DISABLE_TASKS ? 'true' === process.env.APP_DISABLE_TASKS : false,
}
