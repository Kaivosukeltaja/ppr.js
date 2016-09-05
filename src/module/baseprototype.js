(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.module.base_prototype', ['jquery'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.module.base_prototype = factory(root.vendor.$);
  }
})(this, function($) {

  'use strict';

  return {

    isInitialized: false,
    configList: {},
    eventBus: undefined,
    messages: {},

    /**
     * Build module
     */
    build: function() {

    },

    /**
     * Initialize module
     * @param {Object} configs  list of configurations
     * @param {Object} eventBus global event bus instance
     */
    initialize: function(configs, eventBus) {

      // Already initialized
      if (this.isInitialized) {
        return false;
      }

      this.eventBus = eventBus;
      this.configList = $.extend({}, this.configList, configs);

      // Mark as initialized
      this.isInitialized = true;

      // Build
      this.build();

      return true;
    },

    /**
     * Get list of messages
     */
    getMessages: function() {
      return this.messages;
    }
  };
});
