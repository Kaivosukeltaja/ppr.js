(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.event_bus_prototype', [
      'ppr.config',
      'jquery',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('../ppr.config'),
      require('jquery'),
      require('lodash'));
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.library.event_bus_prototype = factory(root.ppr.config, root.vendor.$, root.vendor._);
  }
})(this, function(Config, $, _) {

  'use strict';

  /**
   * EventBus constructor
   * @constructor
   */
  var EventBus = function() {

    this.eventList = {};
    this.messageIndex = {};
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
      if (Config.get('event_bus.debug', false) !== true) {
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
     * @param {string}   [name]   custom name for subscriber
     * @returns {string}
     */
    subscribe: function(scope, message, callback, name) {

      // Initialize array for message
      if (typeof this.eventList[message] === 'undefined') {
        this.eventList[message] = {};
      }

      var subscriberId = _.uniqueId(message);

      this.log('subscribe', message, subscriberId, scope);

      this.eventList[message][subscriberId] = {
        scope: scope,
        callback: callback,
        name: name || subscriberId
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

      // No subscribers found
      if (typeof this.eventList[message] === 'undefined') {
        return false;
      }

      var parameters = Array.prototype.slice.call(arguments);

      // Add subscriber names to parameters
      parameters.unshift(_.map(this.eventList[message], 'name'));

      return this.publishTo.apply(this, parameters);
    },

    /**
     * Publish event to given subscribers
     * @param {string|Object[]} target  list of target subscribers names
     * @param {string}          message target message
     * @param {...*}            data    data to be passed to subscriber
     * @returns {boolean}
     */
    publishTo: function(target, message, data) {

      // No subscribers found
      if (typeof this.eventList[message] === 'undefined') {
        return false;
      }

      // Turn target into array
      if (typeof target === 'string') {
        target = [target];
      }

      var messageData = Array.prototype.slice.call(arguments).splice(2),
        targetSubscribers;

      // Filter list of subscribers
      targetSubscribers = _.filter(this.eventList[message], function(subscriber) {
        return _.indexOf(target, subscriber.name) > -1;
      });

      this.log('publish', message, messageData, _.map(targetSubscribers, 'scope'));

      // Loop through subscribers
      _.each(targetSubscribers, function(subscriber) {
        subscriber.callback.apply(subscriber.scope, messageData);
      });
    }
  };

  return EventBus;
});
