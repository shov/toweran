'use strict'

/**
 * Application configuration
 * TODO: implement environment pattern everywhere
 */
module.exports = {
  /**
   * Application level service providers, must be instances of {BasicServiceProvider}
   */
  serviceProviders: [],

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
