import _ from 'lodash';
import Config from 'ppr.config';

/**
 * EventBus constructor
 * @constructor
 */
export default class EventBus {
  constructor() {
    this.eventList = {};
    this.messageIndex = {};
  }

  /**
   * Get list of all events available
   * @returns {Object[]}
   */
  getEvents() {
    return this.eventList;
  }

  /**
   * Get events by message
   * @param {string} message target message
   * @returns {Object}
   */
  getEventsByMessage(message) {
    return typeof this.eventList[message] !== 'undefined' ?
      this.eventList[message] : {};
  }

  /**
   * Get events by scope
   * @param {Object} scope target scope
   * @returns {Object} list of events
   */
  getEventsByScope(scope) {
    const result = {};

    _.each(this.getEvents(), (subscribers, message) => {
      const messageSubscribers = {};

      _.each(subscribers, (subscriber, subscriberId) => {
        if (_.isEqual(subscriber.scope, scope)) {
          messageSubscribers[subscriberId] = subscriber;
        }
      });

      if (Object.keys(messageSubscribers).length > 0) {
        result[message] = messageSubscribers;
      }
    });

    return result;
  }

  /**
   * Log actions into console
   * @param {string} action  target action
   * @param {string} message target message
   * @param {...*}  [data]   data to be logged
   */
  static log(action, message, ...data) {
    if (Config.get('event_bus.debug', false) !== true) {
      return;
    }

    switch (action) {
      case 'subscribe': {
        console.log(`subscribe to event "${message}"`, data); // eslint-disable-line no-console
        break;
      }

      case 'unsubscribe': {
        console.log(`unsubscribe from event "${message}"`, data); // eslint-disable-line no-console
        break;
      }

      case 'publish': {
        console.log(`publish event "${message}"`, data); // eslint-disable-line no-console
        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * Subscribe to given event
   * @param {Object}   scope    target scope
   * @param {string}   message  target event name
   * @param {Function} callback function to be called
   * @param {string}   [name]   custom name for subscriber
   * @returns {string}
   */
  subscribe(scope, message, callback, name) {
    if (typeof this.eventList[message] === 'undefined') {
      this.eventList[message] = {};
    }

    const subscriberId = _.uniqueId(message);

    EventBus.log('subscribe', message, subscriberId, scope);

    this.eventList[message][subscriberId] = {
      scope,
      callback,
      name: name || subscriberId,
    };

    // Remember message for easy searching
    this.messageIndex[subscriberId] = message;

    return subscriberId;
  }

  /**
   * Unsubscribe from event
   * @param {string[]} subscriberId target subscriber id
   * @returns {Boolean} operation outcome
   */
  unsubscribe(subscriberId) {
    let targetSubscriberId = subscriberId;

    if (typeof targetSubscriberId === 'string') {
      targetSubscriberId = [targetSubscriberId];
    }

    _.each(targetSubscriberId, (id) => {
      if (typeof this.messageIndex[id] === 'undefined') {
        return;
      }

      const message = this.messageIndex[id];

      EventBus.log('unsubscribe', message, targetSubscriberId);

      // No message found
      if (typeof this.eventList[message][id] === 'undefined') {
        return;
      }

      delete this.eventList[message][id];

      // Remove empty list
      if (_.keys(this.eventList[message]).length === 0) {
        delete this.eventList[message];
      }
    });

    return true;
  }

  /**
   * Unsubscribe events by given scope and message
   * @param {Object} scope   target scope
   * @param {string} message target message
   */
  unsubscribeByScopeAndMessage(scope, message) {
    const events = this.getEventsByScope(scope);

    if (!Object.prototype.hasOwnProperty.call(events, message)) {
      return false;
    }

    return this.unsubscribe(Object.keys(events[message]));
  }

  /**
   * Unsubscribe all events by given scope
   * @param {Object} scope target scope
   */
  unsubscribeByScope(scope) {
    return Object.keys(this.getEventsByScope(scope))
      .map(message => this.unsubscribeByScopeAndMessage(scope, message));
  }

  /**
   * Publish event
   * @param {string} message
   * @param {...*}   data
   * @returns {boolean}
   */
  publish(message, ...data) {
    if (typeof this.eventList[message] === 'undefined') {
      return false;
    }

    return this.publishTo(_.map(this.eventList[message], 'name'), message, ...data);
  }

  /**
   * Publish event to given subscribers
   * @param {string|Object[]} target  list of target subscribers names
   * @param {string}          message target message
   * @param {...*}            data    data to be passed to subscriber
   * @returns {boolean}
   */
  publishTo(target, message, ...data) {
    let targetSubscribers = target;

    if (typeof this.eventList[message] === 'undefined') {
      return false;
    }

    // Turn target into array
    if (typeof targetSubscribers === 'string') {
      targetSubscribers = [targetSubscribers];
    }

    // Filter list of subscribers
    targetSubscribers = _.filter(this.eventList[message], subscriber => (
      _.indexOf(targetSubscribers, subscriber.name) > -1
    ));

    EventBus.log('publish', message, data, _.map(targetSubscribers, 'scope'));

    // Loop through subscribers
    _.each(targetSubscribers, (subscriber) => {
      subscriber.callback.apply(subscriber.scope, data);
    });

    return true;
  }
}
