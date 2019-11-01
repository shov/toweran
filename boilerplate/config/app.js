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
    toweran.DependencyInjectionServiceProvider,

    //App service providers
  ],

  /**
   * Dependency Injection
   */
  di: [
    {
      /**
       * TODO: path can be a string, then include it
       * TODO: include/exclude each could be a string, then turn it to array
       * TODO: exclude has higher priority than include
       * TODO: a file mustn't be read twice
       * TODO: a path could be glob pattern ar a path to a directory
       */
      path: {
        include: `${toweran.APP_PATH}/app`,
        exclude: [
          `${toweran.APP_PATH}/app/http`,
          `${toweran.APP_PATH}/app/serviceProviders`,
        ]
      },
      strategy: toweran.C.DI.DOT_NOTATION,
      base: `app.`
    }
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
