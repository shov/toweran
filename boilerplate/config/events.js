module.exports = {
  /**
   * A collection of events & associated listeners
   */
  events: [
    {
      event: 'start_application',
      listeners: [
        //TODO: probably we better set dot notation hee and use container?
        //TODO: and it would be great if we have a possibility to use callbacks here
        // new (require('../listeners/SampleListener'))
      ],
    },
  ],
}
