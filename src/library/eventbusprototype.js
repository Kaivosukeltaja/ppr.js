(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.event_bus_prototype', ['jquery', 'lodash'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('jquery'),
      require('lodash'));
  }

  // Browser globals
  else {
    root.ppr.library.event_bus_prototype = factory(root.$, root._);
  }
})(this, function($, _) {

  'use strict';

  /**
   * EventBus constructor
   * @constructor
   * @param {Object} configs list of configurations
   */
  var EventBus = function(configs) {

    this.eventList = {};
    this.messageIndex = {};

    this.configList = $.extend({}, {
      debug: false
    }, configs);
  };

  EventBus.prototype = {

    /**
     * Get list of all events available
     * @returns {Object[]}
     */
    getEvents: function() {
      return this.eventList;
    },

    /**
     * Get events by message
     * @param {string} message target message
     * @returns {Object}
     */
    getEventsByMessage: function(message) {

      return typeof this.eventList[message] !== 'undefined' ?
        this.eventList[message] : {};
    },

    /**
     * Log actions into console
     * @param {string} action  target action
     * @param {string} message target message
     * @param {...*}  [data]   data to be logged
     */
    log: function(action, message, data) {

      // Logging is disabled
      if (this.configList.debug !== true) {
        return false;
      }

      // Remove first 2 items
      var parameters = Array.prototype.slice.call(arguments).splice(2, 2);

      switch (action) {
        case 'subscribe': {
          console.log('subscribe to event "' + message + '"', parameters);
          break;
        }

        case 'unsubscribe': {
          console.log('unsubscribe from event "' + message + '"', parameters);
          break;
        }

        case 'publish': {
          console.log('publish event "' + message + '"', parameters);
          break;
        }
      }
    },

    /**
     * Subscribe to given event
     * @param {Object}   scope    target scope
     * @param {string}   message  target event name
     * @param {Function} callback function to be called
     * @returns {string}
     */
    subscribe: function(scope, message, callback) {

      // Initialize array for message
      if (typeof this.eventList[message] === 'undefined') {
        this.eventList[message] = {};
      }

      var subscriberId = _.uniqueId(message);

      this.log('subscribe', message, subscriberId, scope);

      this.eventList[message][subscriberId] = {
        scope: scope,
        callback: callback
      };

      // Remember message for easy searching
      this.messageIndex[subscriberId] = message;

      return subscriberId;
    },

    /**
     * Unsubscribe from event
     * @param {string[]} subscriberId target subscriber id
     * @returns {Boolean} operation outcome
     */
    unsubscribe: function(subscriberId) {

      // Turn into array
      if (typeof subscriberId === 'string') {
        subscriberId = [subscriberId];
      }

      var _this = this;

      _.each(subscriberId, function(id) {

        // No message found
        if (typeof _this.messageIndex[id] === 'undefined') {
          return false;
        }

        var message = _this.messageIndex[id];

        _this.log('unsubscribe', message, subscriberId);

        // No message found
        if (typeof _this.eventList[message][id] === 'undefined') {
          return false;
        }

        delete _this.eventList[message][id];

        // Remove empty list
        if (_.keys(_this.eventList[message]).length === 0) {
          delete _this.eventList[message];
        }
      });

      return true;
    },

    /**
     * Publish event
     * @param {string} message
     * @param {...*}   data
     * @returns {boolean}
     */
    publish: function(message, data) {

      var messageData = Array.prototype.slice.call(arguments);

      // Remove first item
      messageData.shift();

      this.log('publish', message, messageData, _.map(this.eventList[message], 'scope'));

      // No subscribers found
      if (typeof this.eventList[message] === 'undefined') {
        return false;
      }

      _.each(this.eventList[message], function(subscriber) {
        subscriber.callback.apply(subscriber.scope, messageData);
      });
    }
  };

  return EventBus;
});
