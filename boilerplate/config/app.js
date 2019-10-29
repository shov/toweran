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
