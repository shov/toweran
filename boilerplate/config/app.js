'use strict'

/**
 * Application configuration
 * TODO: implement environment pattern everywhere
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
        include: `${toweran.APP_PATH}/events/*Event.js`,
      },
      strategy: toweran.C.DI.DOT_NOTATION,
      base: `app.events`,
    },

    /** Listeners */
    {
      path: {
        include: `${toweran.APP_PATH}/listeners/*Listener.js`,
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
  disableJobs: false,

  /**
   * Tasks
   */
  tasks: [],

  /**
   * A way to temporary disable the the tasks
   */
  disableTasks: false,
}
