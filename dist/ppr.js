(function() {
  'use strict';

  // Required when using globals
  if (typeof define === 'undefined' && typeof exports === 'undefined') {
    window.ppr = { page: {}, component: {}, library: { utils: {} }, module: { model: {} }, ui: {} };
  }
})();

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.config', ['lodash'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'));
  }

  // Browser globals
  else {
    root.ppr.config = factory(root._);
  }
})(this, function(_) {

  'use strict';

  var configList = {};

  return {

    /**
     * Get configuration by name
     * @param {string} name         name of configuration
     * @param {*}      defaultValue defaultValue to be used when configuration is not found
     * @returns {*} configuration value
     */
    get: function(name, defaultValue) {
      return _.result(configList, name, defaultValue);
    },

    /**
     * Get list of configurations
     * @returns {Object}
     */
    getAll: function() {
      return configList;
    },

    /**
     * Set configuration
     * @param {Object[]|string} configs list of configuration or name of single configuration
     * @param {*}               [value] single configuration value
     */
    set: function(configs, value) {

      var list = configs;

      if (typeof configs === 'string') {
        list = {};
        list[configs] = value;
      }

      _.each(list, function(value, name) {
        _.set(configList, name, value);
      });
    },

    /**
     * Reset configurations
     */
    reset: function() {
      configList = {};
    }
  };
});

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

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.date', ['ppr.translation'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('../../ppr.translation'));
  }

  // Browser globals
  else {
    root.ppr.library.utils.date = factory(root.ppr.translation);
  }
})(this, function(Translation) {

  'use strict';

  return {
    /**
     * Get string as date object
     * @param {string|number} dateString
     * @returns {Object} date object
     */
    getAsDate: function(dateString) {

      // Already resolved
      if (typeof dateString === 'object') {
        return dateString;
      }

      // Already a number
      if (typeof dateString === 'number') {
        return new Date(dateString);
      }

      var match;

      // Format: 2016-03-31 13:00:00
      if (match = dateString.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/, 'g')) {
        return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
      }

      // Format: 31.03.2016 13:00:00
      // Format: 31.3.2016 5:00:00
      if (match = dateString.match(/^([0-9]{2}).([0-9]{1,2}).([0-9]{4}) ([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/, 'g')) {
        return new Date(match[3], match[2] - 1, match[1], match[4], match[5], match[6]);
      }

      return new Date(dateString);
    },

    /**
     * Calculate difference between 2 dates
     * @param {Object|string} toDate
     * @param {Object|string} [fromDate]
     * @returns {number}
     */
    getDifference: function(toDate, fromDate) {

      // Default value is current datetime
      if (typeof fromDate === 'undefined') {
        fromDate = new Date();
      }

      toDate = this.getAsDate(toDate);
      fromDate = this.getAsDate(fromDate);

      // Return in seconds
      return (fromDate.getTime() - toDate.getTime()) / 1000;
    },

    /**
     * Get time as difference string
     * @param {number} time in milliseconds
     * @returns {string}
     */
    getAsDifferenceString: function(time) {

      // Show in seconds
      if (time < 60) {
        return Math.floor(time) + Translation.translate('date.sec_ago');
      }

      // Show in minutes
      else if (time < 60 * 60) {
        return Math.floor(time / 60) + Translation.translate('date.min_ago');
      }

      // Show in hours
      else if (time < 60 * 60 * 24) {
        return Math.floor(time / 60 / 60) + Translation.translate('date.hour_ago');
      }

      return Math.floor(time / 60 / 60 / 24) + Translation.translate('date.day_ago');
    },

    /**
     * Get date as string in format dd.MM.yyyy HH:mm
     * @param {Object} date object
     * @returns {string} dateString
     */
    formatDate: function(date) {
      var yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(), // getMonth() is zero-based
        dd  = date.getDate().toString(),
        hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

      return dd + '.' + mm + '.' + yyyy + ' klo ' + hh + ':' + min;
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.loader', [
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('lodash')
    );
  }

  // Browser globals
  else {
    root.ppr.library.utils.loader = factory(root._);
  }
})(this, function(_) {

  'use strict';

  return {

    /**
     * Check whether code supports AMD
     * @returns {Boolean}
     */
    hasAMDSupport: function() {
      return typeof define === 'function' && define.amd;
    },

    /**
     * Check whether code supports CommonJS
     * @returns {Boolean}
     */
    hasCommonSupport: function() {
      return typeof exports === 'object';
    },

    /**
     * Load dependency universally
     * @param {Object[]|string} namespaces names of dependencies
     * @param {Object}          config     list of configurations
     * @param {function}        callback callback function
     * @returns {*}
     */
    load: function(namespaces, config, callback) {

      if (typeof callback !== 'function') {
        throw new Error('Callback has to present');
      }

      // Turn single into array
      if (typeof namespaces !== 'object') {
        namespaces = [namespaces];
      }

      var dependencies = [];

      // Use AMD
      if (this.hasAMDSupport()) {

        // Loading custom
        if (config.custom === true) {
          namespaces = _.map(namespaces, function(namespace) {

            // Last dot is after last slash
            if (namespace.lastIndexOf('.') > namespace.lastIndexOf('/')) {
              namespace = namespace.split('.');

              var className = namespace.pop();

              namespace = namespace.join('.') + '/' + className;
            }

            return namespace;
          });
        }

        return require(namespaces, callback);
      }

      // Use CommonJS
      else if (this.hasCommonSupport()) {

        _.each(namespaces, function(namespace) {

          namespace = namespace.split('.');

          // Remove first
          namespace.shift();

          namespace = _.map(namespace, _.camelCase);
          namespace.unshift('../..');

          namespace = namespace.join('/').toLowerCase().trim();

          dependencies.push(require(namespace));
        });

        return callback.apply(null, dependencies);
      }

      // Use globals
      _.each(namespaces, function(namespace) {
        dependencies.push(_.get(window, namespace));
      });

      return callback.apply(null, dependencies);
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.object', [], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory();
  }

  // Browser globals
  else {
    root.ppr.library.utils.object = factory();
  }
})(this, function() {

  'use strict';

  return {

    /**
     * Convert data to JSON string
     * @param {Object|Object[]} data
     * @return {string}
     */
    stringify: function(data) {

      var result;

      // Already resolved
      if (typeof data === 'string') {
        return data;
      }

      try {
        result = JSON.stringify(data);
      } catch (e) {
        result = '';
      }

      return result;
    },

    /**
     * Parse JSON string to object
     * @param {string} targetString
     * @return {Object|Object[]}
     */
    parseJSON: function(targetString) {

      var result;

      // Already resolved
      if (typeof targetString === 'object') {
        return targetString;
      }

      try {
        result = JSON.parse(targetString);
      } catch (e) {
        result = {};
      }

      return result;
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.request', ['lodash'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'));
  }

  // Browser globals
  else {
    root.ppr.library.utils.request = factory(root._);
  }
})(this, function() {

  'use strict';

  return {

    query: {},

    /**
     * Get query parameter
     * @param {string} name         name of query parameter
     * @param {*}      defaultValue default value of parameter
     * @param {string} sourceUrl    target source url
     * @return {string}
     */
    getQueryParam: function(name, defaultValue, sourceUrl) {
      var parameters = this.getQueryParams(sourceUrl);

      return parameters.hasOwnProperty(name) ? parameters[name] : (
        typeof defaultValue !== 'undefined' ? defaultValue : null
      );
    },

    /**
     * Get list of all query parameters
     * @return {Object}
     */
    getQueryParams: function(sourceUrl) {
      if (typeof sourceUrl === 'undefined') {
        sourceUrl = window.location.href;
      }

      var result = {},
        searchIndex = sourceUrl.indexOf('?'),
        queryString,
        queryVariables;

      // Already resolved
      if (this.query.hasOwnProperty(sourceUrl)) {
        return this.query[sourceUrl];
      }

      // No parameters found
      if (searchIndex === -1) {
        return result;
      }

      queryString = sourceUrl.substring(searchIndex + 1);
      queryVariables = queryString.split('&');

      _.each(queryVariables, function(parameterString) {
        var parameter = parameterString.split('=');

        result[parameter[0]] = parameter[1];
      });

      this.query[sourceUrl] = result;

      return result;
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.storage', [], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory();
  }

  // Browser globals
  else {
    root.ppr.library.utils.storage = factory();
  }
})(this, function() {

  'use strict';

  return {
    /**
     * Check whether storage is supported
     * @returns {Boolean}
     */
    isSupported: function() {
      return typeof window.localStorage !== 'undefined';
    },

    /**
     * Set item into storage
     * @param {string} key
     * @param {*}      value
     */
    set: function(key, value) {

      if (!this.isSupported()) {
        return null;
      }

      // Convert object into string
      if (typeof value === 'object') {

        try {
          value = JSON.stringify(value);
        } catch (e) {}
      }

      window.localStorage.setItem(key, value);
    },

    /**
     * Get item from storage
     * @param {string} key
     * @returns {*}
     */
    get: function(key) {

      if (!this.isSupported()) {
        return null;
      }

      var value = window.localStorage.getItem(key);

      try {
        value = JSON.parse(value);
      } catch (e) {}

      return value;
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.string', ['lodash'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'));
  }

  // Browser globals
  else {
    root.ppr.library.utils.string = factory(root._);
  }
})(this, function(_) {

  'use strict';

  return {

    /**
     * Generate hash from string
     * @param {string} targetString target string
     * @returns {number}
     */
    generateHash: function(targetString) {
      var hash = 0, i, chr, len;

      if (targetString.length === 0) {
        return hash;
      }

      for (i = 0, len = targetString.length; i < len; i++) {
        chr   = targetString.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
      }

      return hash;
    },

    /**
     * Remove all html from string
     * @param {string} targetString
     * @returns {string}
     */
    getAsPlainText: function(targetString) {

      return $('<p>').html(targetString).text();
    },

    /**
     * Linkify hash tags in text
     * @param {string} text  target text
     * @param {string} media target social media (supported values: facebook, instagram, twitter)
     * @returns {string}
     */
    linkifyHashTags: function(text, media) {
      var targetUrl, mediaUrls;

      mediaUrls = {
        twitter: 'https://twitter.com/hashtag/',
        facebook: 'https://www.facebook.com/hashtag/',
        instagram: 'https://www.instagram.com/explore/tags/'
      };

      media = media.toLowerCase();

      // Media is unsupported
      if (typeof mediaUrls[media] === 'undefined') {
        return text;
      }

      targetUrl = mediaUrls[media];

      text = text.replace(/[#]+[A-Za-z0-9-_äöåÄÖÅ]+/g, function(t) {
        var tag, link;

        tag = t.replace('#', '');

        link = $('<a>').
          attr('class', 'hashtag').
          attr('href', targetUrl + tag).
          attr('target', '_blank').
          text(t);

        return link[0].outerHTML;
      });

      return text;
    },

    /**
     * Replace variables with parameters in string
     * @param {string} targetString target string that has variables
     * @param {Object} params       parameters to replace variables
     * @returns {string}
     */
    replaceVariablesWithParameters: function(targetString, params) {

      _.each(params, function(value, key) {
        targetString = targetString.replace(':' + key, value);
      });

      return targetString;
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.window', [
      'ppr.config',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('../../ppr.config'),
      require('lodash')
    );
  }

  // Browser globals
  else {
    root.ppr.library.utils.window = factory(root.ppr.config, root._);
  }
})(this, function(Config, _) {

  'use strict';

  return {

    breakpoints: null,

    /**
     * Check whether given breakpoint exists
     * @param {string} breakpoint target breakpoint
     * @returns {Boolean}
     */
    isBreakpoint: function(breakpoint) {

      // Get breakpoints
      if (!this.breakpoints) {
        this.breakpoints = Config.get('window.breakpoints', {});
      }

      return typeof this.breakpoints[breakpoint] !== 'undefined';
    },

    /**
     * Check whether current window matches to mobile breakpoint
     * @returns {Boolean}
     */
    isMobile: function() {

      var _this = this,
        isMobile = false;

      _.each(Config.get('window.mobile_breakpoints', []), function(breakpoint) {

        if (!isMobile) {
          isMobile = _this.matchBreakpoint(breakpoint);
        }
      });

      return isMobile;
    },

    /**
     * Check whether current window match to breakpoint
     * @param {string} breakpoint name of breakpoint
     * @returns {Boolean}
     */
    matchBreakpoint: function(breakpoint) {

      // Breakpoint doesn't exist
      if (!this.isBreakpoint(breakpoint)) {
        return false;
      }

      // Match media is not supported
      if (typeof window.matchMedia !== 'function') {
        return false;
      }

      var breakpointDetails = this.breakpoints[breakpoint],
        targetWidth = _.replace(breakpointDetails, /[<>]/, '').trim();

      // Smaller than
      if (_.startsWith(breakpointDetails, '<')) {
        return window.matchMedia('(max-width: ' + targetWidth + 'px)').matches;
      }

      // Bigger than
      else if (_.startsWith(breakpointDetails, '>')) {
        return window.matchMedia('(min-width: ' + targetWidth + 'px)').matches;

      }

      return false;
    },

    /**
     * Get prefixed transformations
     * @param  {string} transform
     * @return {Object}
     */
    transformations: function(transform) {

      return {
        '-webkit-transform': transform,
        '-moz-transform': transform,
        '-ms-transform': transform,
        '-o-transform': transform,
        transform: transform
      };
    },

    /**
     * Transition callback
     * @returns {*}
     */
    whichTransitionEvent: function() {

      var t,
        el = document.createElement('fakeelement'),
        transitions = {
          transition: 'transitionend',
          OTransition: 'oTransitionEnd',
          MozTransition: 'transitionend',
          WebkitTransition: 'webkitTransitionEnd'
        };

      for (t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.translation', [
      'ppr.config',
      'ppr.library.utils.string',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('./ppr.config'),
      require('./library/utils/string'),
      require('lodash')
    );
  }

  // Browser globals
  else {
    root.ppr.translation = factory(root.ppr.config, root.ppr.library.utils.string, root._);
  }
})(this, function(Config, StringUtils, _) {

  'use strict';

  var Translation;

  Translation = {

    isInitialized: false,

    language: undefined,
    translationList: undefined,

    /**
     * Initialize translation wrapper
     */
    initialize: function() {

      this.language = Config.get('language', 'en');
      this.translationList = Config.get('translations', {});
    },

    /**
     * Get list of available translations
     */
    getAll: function() {

      // Needs to be initialized
      if (!this.isInitialized) {
        this.initialize();
      }

      return this.translationList;
    },

    /**
     * Helper method to get default language if attribute is not given
     * @param {string} [language] target language
     * @returns {string}
     */
    getLanguage: function(language) {
      return typeof language !== 'undefined' ? language : this.language;
    },

    /**
     * Helper method to get language prefixed key
     * @param {string} language target language
     * @param {string} key      target translation key
     * @returns {string}
     */
    getPrefixedKey: function(language, key) {
      return language + '.' + key;
    },

    /**
     * Translate given key into string
     * @param {string} key         target translation key
     * @param {Object} [variables] list of key-value pairs
     * @param {string} [language]  target language
     */
    translate: function(key, variables, language) {

      // Needs to be initialized
      if (!this.isInitialized) {
        this.initialize();
      }

      var translation = _.result(
        this.translationList, this.getPrefixedKey(
          this.getLanguage(language), key), key);

      // Has variables
      if (typeof variables !== 'undefined') {
        translation = StringUtils.replaceVariablesWithParameters(translation, variables);
      }

      return translation;
    },

    /**
     * Translate from custom source tree
     * @param {string} key          target key
     * @param {Object} customSource object that contains translations
     * @param {string} [language]     target language
     * @return {string|null} translated string
     */
    translateFromSource: function(key, customSource, language) {
      var targetLanguage = this.getLanguage(language),
        targetKey = this.getPrefixedKey(key, targetLanguage);

      return customSource.hasOwnProperty(targetKey) ? customSource[targetKey] : null;
    }
  };

  /**
   * Public API
   */
  return {

    /**
     * @inheritdoc
     */
    getAll: function() {
      return Translation.getAll();
    },

    /**
     * @inheritdoc
     */
    translate: function(key, variables, language) {
      return Translation.translate(key, variables, language);
    },

    /**
     * @inheritdoc
     */
    translateFromSource: function(key, customSource, language) {
      return Translation.translateFromSource(key, customSource, language);
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.component.base_prototype', ['ppr.library.utils.object'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('../library/utils/object'));
  }

  // Browser globals
  else {
    root.ppr.component.base_prototype = factory(root.ppr.library.utils.object);
  }
})(this, function(ObjectUtils) {

  'use strict';

  return {

    children: undefined,
    eventBus: null,
    data: {},
    href: null,
    id: null,
    name: null,
    node: null,
    page: null,
    parent: undefined,
    messages: {},

    isBuilt: false,

    // Cache
    cacheData: {},
    cacheSubscribers: [],

    /**
     * Function to be called when build is finished
     */
    afterBuild: function() {
      this.eventBus.publish('component_build_finished', this.id);
      this.isBuilt = true;
    },

    /**
     * Build component
     * @returns {Boolean|undefined}
     */
    build: function() {},

    /**
     * Get child components
     * @note: use carefully, its very slow
     * @return {Object[]} list of child components
     */
    getChildren: function() {
      var _this = this;

      if (typeof this.children === 'undefined') {
        var componentIds = [];

        _.each(this.node.find('[data-component]'), function(elem) {

          var componentId = $(elem).attr('data-component-id'),
            component = _this.page.getComponent(componentId);

          if (component.getParent().id === _this.id) {
            componentIds.push(componentId);
          }
        });

        this.children = componentIds;
      }

      var result = [];

      _.each(this.children, function(component) {
        result.push(_this.page.getComponent(component));
      });

      return result;
    },

    /**
     * Get parent component
     * @return {Object} parent component instance or null
     */
    getParent: function() {

      // Already resolved
      if (typeof this.parent !== 'undefined') {
        return this.page.getComponent(this.parent);
      }

      var parentElem = this.node.parents('[data-component]:first'),
        parent = null;

      if (parentElem.length) {
        parent = parentElem.attr('data-component-id');
      }

      this.parent = parent;

      return this.page.getComponent(this.parent);
    },

    /**
     * Get list of required modules
     * @returns {Object[]}
     */
    getRequiredModules: function() {

      return [];
    },

    /**
     * Initialize component
     * @param {Object} params
     */
    initialize: function(params) {

      this.id = params.id;
      this.node = params.node;
      this.name = params.name;
      this.eventBus = params.eventBus;
      this.page = params.page;

      // Keep default data
      this.cacheData = this.data;

      this.node.attr({
        'data-component': this.name,
        'data-component-id': this.id
      });

      // Set href
      if (this.node.attr('data-component-href')) {
        this.href = this.node.attr('data-component-href');
      }

      // Set page data
      if (this.node.attr('data-component-data')) {

        this.data = $.extend({}, this.data, ObjectUtils.parseJSON(
          this.node.attr('data-component-data')
        ));
      }
    },

    /**
     * Check whether component is ready to be built
     * @returns {Object} promise
     */
    isBuildable: function() {
      return $.Deferred().resolve().promise();
    },

    /**
     * Reset component to original state
     */
    reset: function() {

      this.data = $.extend(true, {}, this.cacheData);
      this.href = null;
      this.isBuilt = false;

      // Unsubscribe events
      this.eventBus.unsubscribe(this.cacheSubscribers);
    },

    /**
     * Set module messages
     * @param {Object} messages
     */
    setModuleMessages: function(messages) {
      this.messages = messages;
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.component.reloadable_prototype', [
      'ppr.component.base_prototype',
      'jquery'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('./baseprototype'),
      require('jquery')
    );
  }

  // Browser globals
  else {
    root.ppr.component.reloadable_prototype = factory(
      root.ppr.component.base_prototype,
      root.$
    );
  }
})(this, function(BasePrototype, $) {

  'use strict';

  return $.extend(true, {}, BasePrototype, {

    componentLoaderWrapper: null,

    /**
     * @inheritdoc
     */
    afterBuild: function() {

      this.componentLoaderWrapper = this.node.find('.component-loader__wrapper');

      this.eventBus.subscribe(this, 'reload', this.reload, this.id);
      this.eventBus.subscribe(this, 'reload_started', this.onReloadStarted, this.id);
      this.eventBus.subscribe(this, 'reload_ready', this.onReloadReady, this.id);
      this.eventBus.subscribe(this, 'reload_components', this.reload);

      // Publish build finished
      this.eventBus.publish('component_build_finished', this.id);
      this.isBuilt = true;

    },

    /**
     * Function to be called when reload is started
     */
    onReloadStarted: function() {

      if (this.componentLoaderWrapper.length) {
        this.componentLoaderWrapper.addClass('component-loader__wrapper--active');
      }
    },

    /**
     * Function to be called when ajax is done
     */
    onReloadReady: function(node) {

      // Pick first element
      node = node.filter('*:not(text):not(comment)');

      this.reset();

      // Replace nodes
      this.node.replaceWith(node);

      // Use existing id
      node.attr('data-component-id', this.id);

      // Rebuild component
      this.eventBus.publish('build_component', node);
    },

    /**
     * Reload component
     */
    reload: function() {

      var _this = this;

      this.eventBus.publishTo(this.id, 'reload_started');

      // Load component html
      $.get(this.href).done(function(html) {
        _this.eventBus.publishTo(_this.id, 'reload_ready', $(html));
      });
    }
  });
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.module.base_prototype', [], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory();
  }

  // Browser globals
  else {
    root.ppr.module.base_prototype = factory();
  }
})(this, function() {

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
    },

    /**
     * Get list of messages
     */
    getMessages: function() {
      return this.messages;
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.page.base_prototype', [
      'ppr.config',
      'ppr.library.utils.object',
      'ppr.library.utils.loader',
      'ppr.library.event_bus_prototype',
      'jquery',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('../ppr.config'),
      require('../library/utils/object'),
      require('../library/utils/loader'),
      require('../library/eventbusprototype'),
      require('jquery'),
      require('lodash')
    );
  }

  // Browser globals
  else {
    root.ppr.page.base_prototype = factory(
      root.ppr.config,
      root.ppr.library.utils.object,
      root.ppr.library.utils.loader,
      root.ppr.library.event_bus_prototype,
      root.$,
      root._
    );
  }
})(this, function(Config, ObjectUtils, UniversalLoader, EventBusPrototype, $, _) {

  'use strict';

  return {

    eventBus: new EventBusPrototype(Config.get('event_bus', {})),
    name: null,
    node: null,
    components: {},
    data: null,

    cacheComponentReady: [],

    /**
     * Function to be triggered when build is done
     */
    afterBuild: function() {

      this.setDefaultSubscribers();

      this.buildComponents();
      this.buildUIExtensions();
    },

    /**
     * Build page
     * @returns {Boolean|undefined}
     */
    build: function() {
      return true;
    },

    /**
     * Build component
     * @param {Object} node jQuery node of element
     */
    buildComponent: function(node) {

      var _this = this,
        namespace,
        name = node.attr('data-component').trim(),
        instanceName = _.snakeCase(name),
        params = {},
        loaderParams = {};

      // Use custom name if present
      if (name.length > 0) {
        namespace = 'ppr.component.' + instanceName;
        loaderParams.custom = true;
      } else {

        // Detected to be reloadable
        if (node.attr('data-component-href')) {
          namespace = 'ppr.component.reloadable_prototype';
          name = 'reloadable_prototype';
        }

        // Normal component
        else {
          namespace = 'ppr.component.base_prototype';
          name = 'base_prototype';
        }
      }

      // Use existing id
      if (node.attr('data-component-id')) {
        params.id = node.attr('data-component-id');
      }

      // Create new id
      else {
        params.id = _.uniqueId('Component_');
      }

      params.name = name;
      params.node = node;
      params.eventBus = this.eventBus;
      params.page = this;

      UniversalLoader.load(namespace, loaderParams, function(ComponentPrototype) {

        // Instantiate prototype
        var instance = new function() { return $.extend(true, {}, ComponentPrototype); };

        // Remember instance
        _this.components[params.id] = instance;

        // Initialize
        instance.initialize(params);

        // Map required modules to namespaces
        var requiredModuleNames = instance.getRequiredModules(),
          requiredModules = _.map(requiredModuleNames, function(namespace) {
            return 'ppr.module.' + namespace;
          });

        // Load modules
        UniversalLoader.load(requiredModules, { custom: true }, function() {

          var modules = Array.prototype.slice.call(arguments),
            messages = {};

          // Initialize modules
          _.each(modules, function(module, index) {
            module.initialize({}, _this.eventBus);
            messages[requiredModuleNames[index]] = module.getMessages();
          });

          instance.setModuleMessages(messages);

          // Wait until instance is buildable
          instance.isBuildable().then(function(data) {

            // Component build failed
            if (instance.build(data) === false) {

              // Remove reference
              delete _this.components[params.id];

              // Remove from DOM
              node.remove();

              return;
            }

            // After build
            instance.afterBuild();
          });
        });
      });
    },

    /**
     * Build all components in page
     */
    buildComponents: function() {

      var _this = this;

      // Loop through components
      this.node.find('[data-component]').each(function(index, element) {
        _this.eventBus.publish('build_component', $(element));
      });
    },

    /**
     * Build UI extensions
     */
    buildUIExtensions: function() {

      // Load builders
      UniversalLoader.load(Config.get('ui.builders', []), { custom: true }, function() {
        var builders = Array.prototype.slice.call(arguments);

        _.each(builders, function(builder) {
          builder.initialize();
        });
      });
    },

    /**
     * Get component by id
     * @param {string} id component id
     * @returns {Object}
     */
    getComponent: function(id) {
      return typeof this.components[id] !== 'undefined' ?
        this.components[id] : null;
    },

    /**
     * Initialize page instance
     * @param {Object} params list of parameters
     */
    initialize: function(params) {

      this.name = params.name;
      this.node = params.node;
      this.data = {};

      // Set page data
      if (this.node.attr('data-page-data')) {

        this.data = $.extend({}, this.data, ObjectUtils.parseJSON(
          this.node.attr('data-page-data')
        ));
      }
    },

    /**
     * Function to be called when each component is ready
     * @param {string} componentId
     */
    onComponentBuildFinished: function(componentId) {

      this.cacheComponentReady.push(componentId);

      // All components ready
      if (this.cacheComponentReady.length === _.keys(this.components).length) {
        this.eventBus.publish('page_build_finished');
      }
    },

    /**
     * Set default subscribers
     */
    setDefaultSubscribers: function() {

      this.eventBus.subscribe(this, 'build_component', this.buildComponent);
      this.eventBus.subscribe(this, 'component_build_finished', this.onComponentBuildFinished);
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.ui.builder_prototype', [
      'ppr.library.utils.loader',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('../library/utils/loader'),
      require('lodash')
    );
  }

  // Browser globals
  else {
    root.ppr.ui.builder_prototype = factory(root.ppr.library.utils.loader, root._);
  }
})(this, function(UniversalLoader, _) {

  'use strict';

  return {

    /**
     * Initialize builder
     * @returns {Boolean}
     */
    initialize: function() {
      var _this = this;

      if (!this.shouldBuild()) {
        return false;
      }

      UniversalLoader.load(this.getDependencies(), { custom: true }, function() {
        _this.build.apply(_this, Array.prototype.slice.call(arguments));
      });
    },

    /**
     * Check whether builder should build
     * @returns {Boolean}
     */
    shouldBuild: function() {
      return true;
    },

    /**
     * Get list of dependencies to be loaded
     * @returns {Object[]}
     */
    getDependencies: function() {
      return [];
    }
  };
});

(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr', [
      'jquery',
      'lodash',
      'ppr.library.utils.loader',
      'ppr.config'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('jquery'),
      require('lodash'),
      require('./library/utils/loader'),
      require('./ppr.config')
    );
  }

  // Browser globals
  else {
    root.ppr = root._.assign(root.ppr, factory(
      root.jQuery,
      root._,
      root.ppr.library.utils.loader,
      root.ppr.config
    ));
  }
})(this, function($, _, UniversalLoader, Config) {

  'use strict';

  return {

    /**
     * Build the library
     */
    build: function() {

      this.buildPage();
    },

    /**
     * Build page instance
     */
    buildPage: function() {

      var _this = this,
        namespace = 'ppr.page.base_prototype',
        node = $('body'),
        name = node.attr('data-page'),
        params = {},
        loaderParams = {};

      // Custom instance required
      if (typeof name !== 'undefined' && name.length > 0) {
        namespace = 'ppr.page.' + _.snakeCase(name.trim());
        loaderParams.custom = true;
      } else {
        name = 'base_prototype';
      }

      params.name = name;
      params.node = node;

      UniversalLoader.load(namespace, loaderParams, function(PagePrototype) {

        // Instantiate prototype
        var instance = new function() { return $.extend(true, {}, PagePrototype); };

        instance.initialize(params);

        // Remember instance
        _this.page_instance = instance;

        // Build
        instance.build();
        instance.afterBuild();
      });
    },

    /**
     * Load configuration asynchronously
     * @param {string} source url to load configuration
     * @returns {Object} promise
     */
    loadConfig: function(source) {
      var _this = this,
        deferred = $.Deferred();

      $.ajax({
        dataType: 'json',
        url: source,

        success: function(response) {
          _this.setConfig(response);
          deferred.resolve(response);
        },

        fail: function() {
          deferred.reject('Load configuration failed');
        }
      });

      return deferred.promise();
    },

    /**
     * Set configuration
     * @param {Object} configs list of configurations
     */
    setConfig: function(configs) {

      _.each(configs, function(value, key) {
        Config.set(key, value);
      });
    }
  };
});
