module.exports = {
  /**
   * A collection of events & associated listeners
   */
  events: [
    /**
     * TODO:
     *  1. I don't like this structure. It can be easier
     *  2. Also event & listeners keys are redundant. we can skip them as we got a better idea
     */
    {
      event: 'sample_event_name',
      listeners:[
        // TODO: and it would be great if we have a possibility to use callbacks here
        // new (require('../listeners/SampleAsyncListener'))
        // new (require('../listeners/SamplePromiseListener'))
        // new (require('../listeners/SampleNormalListener'))
      ]
    },
    {
      event: 'start_application',
      listeners: [
        new (require('../listeners/AppStartedListener')),
        // 'listeners.AppStartedListener' => not implemented yet
      ],
    },
    {
      event: 'after_application_started',
      listeners: [
        new (require('../listeners/AfterAppStartedListener')),
      ],
    },
  ],
}
