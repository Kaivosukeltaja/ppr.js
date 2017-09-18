(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.config', ['module', 'exports', 'lodash'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('lodash'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global._);
    global.pprConfig = mod.exports;
  }
})(this, function (module, exports, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var configList = {};

  exports.default = {

    /**
     * Get configuration by name
     * @param {string} name         name of configuration
     * @param {*}      defaultValue defaultValue to be used when configuration is not found
     * @returns {*} configuration value
     */
    get: function get(name, defaultValue) {
      return _lodash2.default.result(configList, name, defaultValue);
    },


    /**
     * Get list of configurations
     * @returns {Object}
     */
    getAll: function getAll() {
      return configList;
    },


    /**
     * Set configuration
     * @param {Object[]|string} configs list of configuration or name of single configuration
     * @param {*}               [value] single configuration value
     */
    set: function set(configs, value) {
      var list = configs;

      if (typeof configs === 'string') {
        list = {};
        list[configs] = value;
      }

      _lodash2.default.each(list, function (listValue, name) {
        _lodash2.default.set(configList, name, listValue);
      });
    },


    /**
     * Reset configurations
     */
    reset: function reset() {
      configList = {};
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.eventbusprototype', ['module', 'exports', 'lodash', 'ppr.config'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('lodash'), require('ppr.config'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global._, global.pprConfig);
    global.pprLibraryEventbusprototype = mod.exports;
  }
})(this, function (module, exports, _lodash, _ppr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _ppr2 = _interopRequireDefault(_ppr);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var EventBus = function () {
    function EventBus() {
      _classCallCheck(this, EventBus);

      this.eventList = {};
      this.messageIndex = {};
    }

    /**
     * Get list of all events available
     * @returns {Object[]}
     */


    _createClass(EventBus, [{
      key: 'getEvents',
      value: function getEvents() {
        return this.eventList;
      }
    }, {
      key: 'getEventsByMessage',
      value: function getEventsByMessage(message) {
        return typeof this.eventList[message] !== 'undefined' ? this.eventList[message] : {};
      }
    }, {
      key: 'getEventsByScope',
      value: function getEventsByScope(scope) {
        var result = {};

        _lodash2.default.each(this.getEvents(), function (subscribers, message) {
          var messageSubscribers = {};

          _lodash2.default.each(subscribers, function (subscriber, subscriberId) {
            if (_lodash2.default.isEqual(subscriber.scope, scope)) {
              messageSubscribers[subscriberId] = subscriber;
            }
          });

          if (Object.keys(messageSubscribers).length > 0) {
            result[message] = messageSubscribers;
          }
        });

        return result;
      }
    }, {
      key: 'subscribe',
      value: function subscribe(scope, message, callback, name) {
        if (typeof this.eventList[message] === 'undefined') {
          this.eventList[message] = {};
        }

        var subscriberId = _lodash2.default.uniqueId(message);

        EventBus.log('subscribe', message, subscriberId, scope);

        this.eventList[message][subscriberId] = {
          scope: scope,
          callback: callback,
          name: name || subscriberId
        };

        // Remember message for easy searching
        this.messageIndex[subscriberId] = message;

        return subscriberId;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(subscriberId) {
        var _this = this;

        var targetSubscriberId = subscriberId;

        if (typeof targetSubscriberId === 'string') {
          targetSubscriberId = [targetSubscriberId];
        }

        _lodash2.default.each(targetSubscriberId, function (id) {
          if (typeof _this.messageIndex[id] === 'undefined') {
            return;
          }

          var message = _this.messageIndex[id];

          EventBus.log('unsubscribe', message, targetSubscriberId);

          // No message found
          if (typeof _this.eventList[message][id] === 'undefined') {
            return;
          }

          delete _this.eventList[message][id];

          // Remove empty list
          if (_lodash2.default.keys(_this.eventList[message]).length === 0) {
            delete _this.eventList[message];
          }
        });

        return true;
      }
    }, {
      key: 'unsubscribeByScopeAndMessage',
      value: function unsubscribeByScopeAndMessage(scope, message) {
        var events = this.getEventsByScope(scope);

        if (!Object.prototype.hasOwnProperty.call(events, message)) {
          return false;
        }

        return this.unsubscribe(Object.keys(events[message]));
      }
    }, {
      key: 'unsubscribeByScope',
      value: function unsubscribeByScope(scope) {
        var _this2 = this;

        return Object.keys(this.getEventsByScope(scope)).map(function (message) {
          return _this2.unsubscribeByScopeAndMessage(scope, message);
        });
      }
    }, {
      key: 'publish',
      value: function publish(message) {
        if (typeof this.eventList[message] === 'undefined') {
          return false;
        }

        for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          data[_key - 1] = arguments[_key];
        }

        return this.publishTo.apply(this, [_lodash2.default.map(this.eventList[message], 'name'), message].concat(data));
      }
    }, {
      key: 'publishTo',
      value: function publishTo(target, message) {
        for (var _len2 = arguments.length, data = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          data[_key2 - 2] = arguments[_key2];
        }

        var targetSubscribers = target;

        if (typeof this.eventList[message] === 'undefined') {
          return false;
        }

        // Turn target into array
        if (typeof targetSubscribers === 'string') {
          targetSubscribers = [targetSubscribers];
        }

        // Filter list of subscribers
        targetSubscribers = _lodash2.default.filter(this.eventList[message], function (subscriber) {
          return _lodash2.default.indexOf(targetSubscribers, subscriber.name) > -1;
        });

        EventBus.log('publish', message, data, _lodash2.default.map(targetSubscribers, 'scope'));

        // Loop through subscribers
        _lodash2.default.each(targetSubscribers, function (subscriber) {
          subscriber.callback.apply(subscriber.scope, data);
        });

        return true;
      }
    }], [{
      key: 'log',
      value: function log(action, message) {
        if (_ppr2.default.get('event_bus.debug', false) !== true) {
          return;
        }

        for (var _len3 = arguments.length, data = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          data[_key3 - 2] = arguments[_key3];
        }

        switch (action) {
          case 'subscribe':
            {
              console.log('subscribe to event "' + message + '"', data); // eslint-disable-line no-console
              break;
            }

          case 'unsubscribe':
            {
              console.log('unsubscribe from event "' + message + '"', data); // eslint-disable-line no-console
              break;
            }

          case 'publish':
            {
              console.log('publish event "' + message + '"', data); // eslint-disable-line no-console
              break;
            }

          default:
            {
              break;
            }
        }
      }
    }]);

    return EventBus;
  }();

  exports.default = EventBus;
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils.loader', ['module', 'exports', 'lodash', 'ppr.config'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('lodash'), require('ppr.config'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global._, global.pprConfig);
    global.pprLibraryUtilsLoader = mod.exports;
  }
})(this, function (module, exports, _lodash, _ppr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _ppr2 = _interopRequireDefault(_ppr);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  exports.default = {

    isInitialized: false,
    configList: {
      supportAMD: true,
      supportCommon: true
    },

    /**
     * Check whether code supports AMD
     * @returns {Boolean}
     */
    hasAMDSupport: function hasAMDSupport() {
      this.initialize();
      return this.configList.supportAMD === true && typeof define === 'function' && define.amd;
    },


    /**
     * Initialize
     */
    initialize: function initialize() {
      // Already initialized
      if (this.isInitialized === true) {
        return;
      }

      this.configList = _extends(this.configList, _ppr2.default.get('universal_loader', {}));

      // Mark as initialized
      this.isInitialized = true;
    },


    /**
     * Load dependency universally
     * @param {Object[]|string} namespaces names of dependencies
     * @param {function}        callback callback function
     * @returns {*}
     */
    load: function load(namespaces, callback) {
      if (!this.isInitialized) {
        this.initialize();
      }

      var targetNamespaces = namespaces;

      if (typeof callback !== 'function') {
        throw new Error('Callback has to present');
      }

      // Turn single into array
      if ((typeof targetNamespaces === 'undefined' ? 'undefined' : _typeof(targetNamespaces)) !== 'object') {
        targetNamespaces = [targetNamespaces];
      }

      var dependencies = [];

      // Use AMD
      if (this.hasAMDSupport()) {
        return require(targetNamespaces, callback); // eslint-disable-line
      }

      // Use globals
      _lodash2.default.each(targetNamespaces, function (namespace) {
        dependencies.push(_lodash2.default.get(window, _lodash2.default.camelCase(namespace)));
      });

      return callback.apply(undefined, dependencies);
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils.object', ['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.pprLibraryUtilsObject = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  exports.default = {

    /**
     * Convert data to JSON string
     * @param {Object|Object[]} data
     * @return {string}
     */
    stringify: function stringify(data) {
      var result = void 0;

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
    parseJSON: function parseJSON(targetString) {
      var result = void 0;

      // Already resolved
      if ((typeof targetString === 'undefined' ? 'undefined' : _typeof(targetString)) === 'object') {
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
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils.request', ['module', 'exports', 'lodash'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('lodash'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global._);
    global.pprLibraryUtilsRequest = mod.exports;
  }
})(this, function (module, exports, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    query: {},

    /**
     * Get query parameter
     * @param {string} name         name of query parameter
     * @param {*}      defaultValue default value of parameter
     * @param {string} sourceUrl    target source url
     * @return {string}
     */
    getQueryParam: function getQueryParam(name) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var sourceUrl = arguments[2];

      var parameters = this.getQueryParams(sourceUrl);

      if (Object.prototype.hasOwnProperty.call(parameters, name)) {
        return parameters[name];
      }

      return defaultValue;
    },


    /**
     * Get list of all query parameters
     * @return {Object}
     */
    getQueryParams: function getQueryParams() {
      var sourceUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;

      var result = {};
      var searchIndex = sourceUrl.indexOf('?');

      // Already resolved
      if (Object.prototype.hasOwnProperty.call(this.query, sourceUrl)) {
        return this.query[sourceUrl];
      }

      // No parameters found
      if (searchIndex === -1) {
        return result;
      }

      var queryString = sourceUrl.substring(searchIndex + 1);
      var hashIndex = queryString.indexOf('#');

      if (hashIndex > -1) {
        queryString = queryString.substr(0, hashIndex);
      }

      var queryVariables = queryString.split('&');

      _lodash2.default.each(queryVariables, function (parameterString) {
        var parameter = parameterString.split('=');

        result[parameter[0]] = parameter[1];
      });

      this.query[sourceUrl] = result;

      return result;
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils.storage', ['module', 'exports', 'ppr.config'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.config'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprConfig);
    global.pprLibraryUtilsStorage = mod.exports;
  }
})(this, function (module, exports, _ppr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ppr2 = _interopRequireDefault(_ppr);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  exports.default = {

    configList: {
      enabled: true
    },

    isInitialized: false,

    initialize: function initialize() {
      // Already initialized
      if (this.isInitialized === true) {
        return;
      }

      // Configure
      this.configList = _extends(this.configList, _ppr2.default.get('storage'));

      // Mark as initialized
      this.isInitialized = true;
    },


    /**
     * Check whether storage is enabled
     * @returns {Boolean}
     */
    isEnabled: function isEnabled() {
      this.initialize();
      return this.configList.enabled === true && this.isSupported();
    },


    /**
     * Check whether storage is supported
     * @returns {Boolean}
     */
    isSupported: function isSupported() {
      return typeof window.localStorage !== 'undefined' && window.localStorage !== null;
    },


    /**
     * Set item into storage
     * @param {string} key
     * @param {Boolean} value
     */
    set: function set(key, value) {
      if (!this.isEnabled()) {
        return false;
      }

      var targetValue = value;

      // Convert object into string
      if ((typeof targetValue === 'undefined' ? 'undefined' : _typeof(targetValue)) === 'object') {
        try {
          targetValue = JSON.stringify(targetValue);
        } catch (e) {
          targetValue = '';
        }
      }

      try {
        window.localStorage.setItem(key, targetValue);
      } catch (e) {
        return false;
      }

      return true;
    },


    /**
     * Get item from storage
     * @param {string} key
     * @returns {*}
     */
    get: function get(key) {
      if (!this.isEnabled()) {
        return null;
      }

      var value = window.localStorage.getItem(key);

      try {
        value = JSON.parse(value);
      } catch (e) {
        // Nothing
      }

      return value;
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils.string', ['module', 'exports', 'lodash', 'jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('lodash'), require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global._, global.$);
    global.pprLibraryUtilsString = mod.exports;
  }
})(this, function (module, exports, _lodash, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {

    /**
     * Generate hash from string
     * @param {string} targetString target string
     * @returns {number}
     */
    generateHash: function generateHash(targetString) {
      var hash = 0;
      var i = void 0;
      var chr = void 0;
      var len = void 0;

      if (targetString.length === 0) {
        return hash;
      }

      for (i = 0, len = targetString.length; i < len; i += 1) {
        chr = targetString.charCodeAt(i);
        hash = (hash << 5) - hash + chr; // eslint-disable-line no-bitwise
        hash |= 0; // eslint-disable-line no-bitwise
      }

      return hash;
    },


    /**
     * Remove all html from string
     * @param {string} targetString
     * @returns {string}
     */
    getAsPlainText: function getAsPlainText(targetString) {
      return (0, _jquery2.default)('<p>').html(targetString).text();
    },


    /**
     * Linkify hash tags in text
     * @param {string} text  target text
     * @param {string} media target social media (supported values: facebook, instagram, twitter)
     * @returns {string}
     */
    linkifyHashTags: function linkifyHashTags(text, media) {
      var mediaUrls = {
        twitter: 'https://twitter.com/hashtag/',
        facebook: 'https://www.facebook.com/hashtag/',
        instagram: 'https://www.instagram.com/explore/tags/'
      };

      var targetMedia = media.toLowerCase();

      // Media is unsupported
      if (typeof mediaUrls[targetMedia] === 'undefined') {
        return text;
      }

      var targetUrl = mediaUrls[targetMedia];

      var targetText = text.replace(/[#]+[A-Za-z0-9-_äöåÄÖÅ]+/g, function (t) {
        var tag = t.replace('#', '');
        var link = (0, _jquery2.default)('<a>').attr('class', 'hashtag').attr('href', targetUrl + tag).attr('target', '_blank').text(t);

        return link[0].outerHTML;
      });

      return targetText;
    },


    /**
     * Replace variables with parameters in string
     * @param {string} targetString target string that has variables
     * @param {Object} params       parameters to replace variables
     * @returns {string}
     */
    replaceVariablesWithParameters: function replaceVariablesWithParameters(targetString, params) {
      var stringValue = targetString;

      _lodash2.default.each(params, function (value, key) {
        stringValue = stringValue.replace(':' + key, value);
      });

      return stringValue;
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils.window', ['module', 'exports', 'lodash', 'ppr.config'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('lodash'), require('ppr.config'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global._, global.pprConfig);
    global.pprLibraryUtilsWindow = mod.exports;
  }
})(this, function (module, exports, _lodash, _ppr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _ppr2 = _interopRequireDefault(_ppr);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  exports.default = {

    configList: {
      breakpoints: {},
      mobile_breakpoints: []
    },

    isInitialized: false,

    initialize: function initialize() {
      // Already initialized
      if (this.isInitialized === true) {
        return;
      }

      // Configure
      this.configList = _extends(this.configList, _ppr2.default.get('window'));

      // Mark as initialized
      this.isInitialized = true;
    },


    /*
     * Check whether given breakpoint exists
     * @param {string} breakpoint target breakpoint
     * @returns {Boolean}
     */
    isBreakpoint: function isBreakpoint(breakpoint) {
      this.initialize();
      return typeof this.configList.breakpoints[breakpoint] !== 'undefined';
    },


    /**
     * Check whether given element is in viewport
     * @param {object} element HTML node
     * @return {Boolean} is in viewport
     */
    isElementInViewport: function isElementInViewport(element) {
      var el = element;

      // Support for jQuery node
      if (el instanceof $) {
        el = el[0];
      }

      var rect = el.getBoundingClientRect();
      var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      return rect.top >= -100 && rect.bottom <= viewportHeight + 100;
    },


    /**
     * Check whether current window matches to mobile breakpoint
     * @returns {Boolean}
     */
    isMobile: function isMobile() {
      var _this = this;

      this.initialize();

      var isMobile = false;

      _lodash2.default.each(this.configList.mobile_breakpoints, function (breakpoint) {
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
    matchBreakpoint: function matchBreakpoint(breakpoint) {
      this.initialize();

      // Breakpoint doesn't exist
      if (!this.isBreakpoint(breakpoint)) {
        return false;
      }

      // Match media is not supported
      if (typeof window.matchMedia !== 'function') {
        return false;
      }

      var breakpointDetails = this.configList.breakpoints[breakpoint];
      var targetWidth = _lodash2.default.replace(breakpointDetails, /[<>]/, '').trim();

      if (_lodash2.default.startsWith(breakpointDetails, '<')) {
        // Smaller than
        return window.matchMedia('(max-width: ' + targetWidth + 'px)').matches;
      } else if (_lodash2.default.startsWith(breakpointDetails, '>')) {
        // Bigger than
        return window.matchMedia('(min-width: ' + targetWidth + 'px)').matches;
      }

      return false;
    },


    /**
     * Get prefixed transformations
     * @param  {string} transform
     * @return {Object}
     */
    transformations: function transformations(transform) {
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
     */
    whichTransitionEvent: function whichTransitionEvent() {
      var el = document.createElement('fakeelement');
      var transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
      };

      // eslint-disable-next-line
      for (var a in transitions) {
        if (el.style[a] !== undefined) {
          return transitions[a];
        }
      }

      return null;
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.translation', ['module', 'exports', 'lodash', 'ppr.config', 'ppr.library.utils.string'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('lodash'), require('ppr.config'), require('ppr.library.utils.string'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global._, global.pprConfig, global.pprLibraryUtilsString);
    global.pprTranslation = mod.exports;
  }
})(this, function (module, exports, _lodash, _ppr, _pprLibraryUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _ppr2 = _interopRequireDefault(_ppr);

  var _pprLibraryUtils2 = _interopRequireDefault(_pprLibraryUtils);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Translation = {

    isInitialized: false,

    language: undefined,
    translationList: undefined,

    initialize: function initialize() {
      this.language = _ppr2.default.get('language', 'en');
      this.translationList = _ppr2.default.get('translations', {});
    },
    getAll: function getAll() {
      if (!this.isInitialized) {
        this.initialize();
      }

      return this.translationList;
    },
    getLanguage: function getLanguage(language) {
      return typeof language !== 'undefined' ? language : this.language;
    },
    getPrefixedKey: function getPrefixedKey(language, key) {
      return language + '.' + key;
    },
    translate: function translate(key, variables, language) {
      if (!this.isInitialized) {
        this.initialize();
      }

      var prefixedKey = this.getPrefixedKey(this.getLanguage(language), key);
      var translation = _lodash2.default.result(this.translationList, prefixedKey, key);

      // Has variables
      if (typeof variables !== 'undefined') {
        translation = _pprLibraryUtils2.default.replaceVariablesWithParameters(translation, variables);
      }

      return translation;
    }
  };

  exports.default = {

    /**
     * @inheritdoc
     */
    getAll: function getAll() {
      return Translation.getAll();
    },


    /**
     * @inheritdoc
     */
    translate: function translate(key, variables, language) {
      return Translation.translate(key, variables, language);
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils.date', ['module', 'exports', 'ppr.translation'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.translation'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprTranslation);
    global.pprLibraryUtilsDate = mod.exports;
  }
})(this, function (module, exports, _ppr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ppr2 = _interopRequireDefault(_ppr);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  exports.default = {
    /**
     * Get string as date object
     * @param {string|number} dateString
     * @returns {Object} date object
     */
    getAsDate: function getAsDate(dateString) {
      // Already resolved
      if ((typeof dateString === 'undefined' ? 'undefined' : _typeof(dateString)) === 'object') {
        return dateString;
      }

      // Already a number
      if (typeof dateString === 'number') {
        return new Date(dateString);
      }

      var match = dateString.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/, 'g');

      // Format: 2016-03-31 13:00:00
      if (match !== null) {
        return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
      }

      match = dateString.match(/^([0-9]{2}).([0-9]{1,2}).([0-9]{4}) ([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/, 'g');

      // Format: 31.03.2016 13:00:00
      // Format: 31.3.2016 5:00:00
      if (match !== null) {
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
    getDifference: function getDifference(toDate) {
      var fromDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

      var targetToDate = this.getAsDate(toDate);
      var targetFromDate = this.getAsDate(fromDate);

      // Return in seconds
      return (targetFromDate.getTime() - targetToDate.getTime()) / 1000;
    },


    /**
     * Get time as difference string
     * @param {number} time in milliseconds
     * @returns {string}
     */
    getAsDifferenceString: function getAsDifferenceString(time) {
      if (time < 60) {
        // Show in seconds
        return Math.floor(time) + _ppr2.default.translate('date.sec_ago');
      } else if (time < 60 * 60) {
        // Show in minutes
        return Math.floor(time / 60) + _ppr2.default.translate('date.min_ago');
      } else if (time < 60 * 60 * 24) {
        // Show in hours
        return Math.floor(time / 60 / 60) + _ppr2.default.translate('date.hour_ago');
      }

      return Math.floor(time / 60 / 60 / 24) + _ppr2.default.translate('date.day_ago');
    },


    /**
     * Get date as string in format dd.MM.yyyy HH:mm
     * @param {Object} date object
     * @returns {string} dateString
     */
    formatDate: function formatDate(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
      var dd = date.getDate().toString();
      var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

      return dd + '.' + mm + '.' + yyyy + ' klo ' + hh + ':' + min;
    }
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library.utils', ['module', 'exports', 'ppr.library.utils.date', 'ppr.library.utils.loader', 'ppr.library.utils.object', 'ppr.library.utils.request', 'ppr.library.utils.storage', 'ppr.library.utils.string', 'ppr.library.utils.window'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.library.utils.date'), require('ppr.library.utils.loader'), require('ppr.library.utils.object'), require('ppr.library.utils.request'), require('ppr.library.utils.storage'), require('ppr.library.utils.string'), require('ppr.library.utils.window'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprLibraryUtilsDate, global.pprLibraryUtilsLoader, global.pprLibraryUtilsObject, global.pprLibraryUtilsRequest, global.pprLibraryUtilsStorage, global.pprLibraryUtilsString, global.pprLibraryUtilsWindow);
    global.pprLibraryUtils = mod.exports;
  }
})(this, function (module, exports, _pprLibraryUtils, _pprLibraryUtils3, _pprLibraryUtils5, _pprLibraryUtils7, _pprLibraryUtils9, _pprLibraryUtils11, _pprLibraryUtils13) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pprLibraryUtils2 = _interopRequireDefault(_pprLibraryUtils);

  var _pprLibraryUtils4 = _interopRequireDefault(_pprLibraryUtils3);

  var _pprLibraryUtils6 = _interopRequireDefault(_pprLibraryUtils5);

  var _pprLibraryUtils8 = _interopRequireDefault(_pprLibraryUtils7);

  var _pprLibraryUtils10 = _interopRequireDefault(_pprLibraryUtils9);

  var _pprLibraryUtils12 = _interopRequireDefault(_pprLibraryUtils11);

  var _pprLibraryUtils14 = _interopRequireDefault(_pprLibraryUtils13);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    DateUtils: _pprLibraryUtils2.default,
    UniversalLoader: _pprLibraryUtils4.default,
    ObjectUtils: _pprLibraryUtils6.default,
    Request: _pprLibraryUtils8.default,
    Storage: _pprLibraryUtils10.default,
    StringUtils: _pprLibraryUtils12.default,
    WindowUtils: _pprLibraryUtils14.default
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.library', ['module', 'exports', 'ppr.library.eventbusprototype', 'ppr.library.utils'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.library.eventbusprototype'), require('ppr.library.utils'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprLibraryEventbusprototype, global.pprLibraryUtils);
    global.pprLibrary = mod.exports;
  }
})(this, function (module, exports, _pprLibrary, _pprLibrary3) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pprLibrary2 = _interopRequireDefault(_pprLibrary);

  var _pprLibrary4 = _interopRequireDefault(_pprLibrary3);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    EventBusPrototype: _pprLibrary2.default,
    Utils: _pprLibrary4.default
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.page.baseprototype', ['module', 'exports', 'jquery', 'lodash', 'ppr.config', 'ppr.library.utils.object', 'ppr.library.utils.loader', 'ppr.library.eventbusprototype'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('jquery'), require('lodash'), require('ppr.config'), require('ppr.library.utils.object'), require('ppr.library.utils.loader'), require('ppr.library.eventbusprototype'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.$, global._, global.pprConfig, global.pprLibraryUtilsObject, global.pprLibraryUtilsLoader, global.pprLibraryEventbusprototype);
    global.pprPageBaseprototype = mod.exports;
  }
})(this, function (module, exports, _jquery, _lodash, _ppr, _pprLibraryUtils, _pprLibraryUtils3, _pprLibrary) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _ppr2 = _interopRequireDefault(_ppr);

  var _pprLibraryUtils2 = _interopRequireDefault(_pprLibraryUtils);

  var _pprLibraryUtils4 = _interopRequireDefault(_pprLibraryUtils3);

  var _pprLibrary2 = _interopRequireDefault(_pprLibrary);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BasePrototype = function () {
    function BasePrototype(node) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePrototype);

      this.node = node;
      this.name = params.name || null;
      this.data = null;
      this.eventBus = new _pprLibrary2.default();
      this.components = {};
      this.modulePromises = {};
      this.cacheComponentReady = [];

      // Set page data
      if (this.node.attr('data-page-data')) {
        this.data = _extends({}, this.data, _pprLibraryUtils2.default.parseJSON(this.node.attr('data-page-data')));
      }
    }

    /**
     * Function to be triggered when build is done
     */


    _createClass(BasePrototype, [{
      key: 'afterBuild',
      value: function afterBuild() {
        this.setDefaultSubscribers();

        this.buildComponents(this.node);
        this.buildUIExtensions();
      }
    }, {
      key: 'build',
      value: function build() {
        // eslint-disable-line
        return true;
      }
    }, {
      key: 'buildComponent',
      value: function buildComponent(node) {
        var _this = this;

        var namespace = void 0;
        var name = node.attr('data-component').trim();

        var instanceName = _lodash2.default.snakeCase(name).replace(/_/g, '-');
        var params = {};

        // Use custom name if present
        if (name.length > 0) {
          namespace = 'ppr.component.' + instanceName;
        } else if (node.attr('data-component-href')) {
          // Reloadable component
          namespace = 'ppr.component.reloadableprototype';
          name = 'reloadable_prototype';
        } else {
          // Normal component
          namespace = 'ppr.component.baseprototype';
          name = 'base_prototype';
        }

        // Use existing id
        if (node.attr('data-component-id')) {
          params.id = node.attr('data-component-id');
        } else {
          params.id = _lodash2.default.uniqueId('Component_');
        }

        // Check that component is not already built
        if (typeof this.components[params.id] !== 'undefined') {
          if (this.components[params.id].isBuilt) {
            return false;
          }
        }

        params.name = name;
        params.eventBus = this.eventBus;
        params.page = this;

        _pprLibraryUtils4.default.load(namespace, function (ComponentPrototype) {
          if (typeof ComponentPrototype === 'undefined') {
            return;
          }

          // Instantiate prototype
          var instance = new ComponentPrototype(node, params);

          // Remember instance
          _this.components[params.id] = instance;

          // Map required modules to namespaces
          var moduleNames = instance.getRequiredModules();
          var modulePromises = moduleNames.map(function (moduleName) {
            return _this.getModule(moduleName);
          });

          Promise.all(modulePromises).then(function (modules) {
            var messages = {};

            // Initialize modules
            _lodash2.default.each(modules, function (module, key) {
              var moduleName = moduleNames[key].toLowerCase();
              messages[moduleName] = module.getMessages();
            });

            instance.setModuleMessages(messages);

            // Wait until instance is buildable
            instance.isBuildable().then(function (data) {
              if (instance.build(data) === false) {
                _this.removeComponent(params.id);
                return;
              }

              instance.afterBuild();

              // Build child components
              _this.buildComponents(node);
            });
          });
        });

        return true;
      }
    }, {
      key: 'buildComponents',
      value: function buildComponents(node) {
        var _this2 = this;

        var componentNodes = node.find('[data-component]');
        var childNodes = node.find('[data-component] [data-component]');
        componentNodes.not(childNodes).each(function (index, element) {
          return _this2.eventBus.publish('build_component', (0, _jquery2.default)(element));
        });
      }
    }, {
      key: 'buildUIExtensions',
      value: function buildUIExtensions() {
        var _this3 = this;

        // eslint-disable-line
        _pprLibraryUtils4.default.load(_ppr2.default.get('ui.builders', []), function () {
          for (var _len = arguments.length, builders = Array(_len), _key = 0; _key < _len; _key++) {
            builders[_key] = arguments[_key];
          }

          _lodash2.default.each(builders, function (builder) {
            builder.initialize(_this3);
          });
        });
      }
    }, {
      key: 'getComponent',
      value: function getComponent(id) {
        return typeof this.components[id] !== 'undefined' ? this.components[id] : null;
      }
    }, {
      key: 'getModule',
      value: function getModule(name) {
        var _this4 = this;

        if (Object.prototype.hasOwnProperty.call(this.modulePromises, name)) {
          return this.modulePromises[name];
        }

        var modulePromise = new Promise(function (resolve) {
          // eslint-disable-line
          var requireName = 'ppr.module.' + name;

          // Load module
          _pprLibraryUtils4.default.load(requireName, function (module) {
            module.initialize({}, _this4.eventBus);

            return resolve(module);
          });
        });

        this.modulePromises[name] = modulePromise;

        return modulePromise;
      }
    }, {
      key: 'onComponentBuildFinished',
      value: function onComponentBuildFinished(componentId) {
        this.cacheComponentReady.push(componentId);

        // All components ready
        if (this.cacheComponentReady.length === _lodash2.default.keys(this.components).length) {
          this.eventBus.publish('page_build_finished');
        }
      }
    }, {
      key: 'removeComponent',
      value: function removeComponent(ids) {
        var _this5 = this;

        var targetIds = ids;

        if (typeof ids === 'string') {
          targetIds = [ids];
        }

        _lodash2.default.each(targetIds, function (id) {
          var componentInstance = _this5.components[id];

          // Remove references
          if (typeof componentInstance !== 'undefined') {
            componentInstance.reset();
            componentInstance.node.remove();
            delete _this5.components[id];
          }
        });
      }
    }, {
      key: 'setDefaultSubscribers',
      value: function setDefaultSubscribers() {
        this.eventBus.subscribe(this, 'remove_component', this.removeComponent);
        this.eventBus.subscribe(this, 'build_components', this.buildComponents);
        this.eventBus.subscribe(this, 'build_component', this.buildComponent);
        this.eventBus.subscribe(this, 'build_extensions', this.buildUIExtensions);
        this.eventBus.subscribe(this, 'component_build_finished', this.onComponentBuildFinished);
      }
    }]);

    return BasePrototype;
  }();

  exports.default = BasePrototype;
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.page', ['module', 'exports', 'ppr.page.baseprototype'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.page.baseprototype'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprPageBaseprototype);
    global.pprPage = mod.exports;
  }
})(this, function (module, exports, _pprPage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pprPage2 = _interopRequireDefault(_pprPage);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    BasePrototype: _pprPage2.default
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.component.baseprototype', ['module', 'exports', 'jquery', 'lodash', 'ppr.library.utils.object'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('jquery'), require('lodash'), require('ppr.library.utils.object'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.$, global._, global.pprLibraryUtilsObject);
    global.pprComponentBaseprototype = mod.exports;
  }
})(this, function (module, exports, _jquery, _lodash, _pprLibraryUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _pprLibraryUtils2 = _interopRequireDefault(_pprLibraryUtils);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BasePrototype = function () {
    function BasePrototype(node) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePrototype);

      this.node = node;
      this.id = params.id || _lodash2.default.uniqueId('Component_');
      this.name = params.name || null;
      this.eventBus = params.eventBus || null;
      this.page = params.page || null;
      this.cacheData = this.data;
      this.children = undefined;
      this.data = {};
      this.parent = undefined;
      this.messages = {};
      this.isBuilt = false;

      this.node.attr({
        'data-component': this.name,
        'data-component-id': this.id
      });

      this.setDataFromNode(this.data);
    }

    /**
     * Function to be called when build is finished
     */


    _createClass(BasePrototype, [{
      key: 'afterBuild',
      value: function afterBuild() {
        this.eventBus.publish('component_build_finished', this.id);
        this.isBuilt = true;
      }
    }, {
      key: 'build',
      value: function build() {
        // eslint-disable-line
        return true;
      }
    }, {
      key: 'getChildren',
      value: function getChildren() {
        var _this = this;

        if (typeof this.children === 'undefined') {
          (function () {
            var componentIds = [];
            _lodash2.default.each(_this.node.find('[data-component]'), function (elem) {
              var componentId = (0, _jquery2.default)(elem).attr('data-component-id');
              var component = _this.page.getComponent(componentId);

              if (component.getParent().id === _this.id) {
                componentIds.push(componentId);
              }
            });

            _this.children = componentIds;
          })();
        }

        var result = [];

        _lodash2.default.each(this.children, function (component) {
          result.push(_this.page.getComponent(component));
        });

        return result;
      }
    }, {
      key: 'getParent',
      value: function getParent() {
        if (typeof this.parent !== 'undefined') {
          return this.page.getComponent(this.parent);
        }

        var parentElem = this.node.parents('[data-component]:first');

        var parent = null;

        if (parentElem.length) {
          parent = parentElem.attr('data-component-id');
        }

        this.parent = parent;

        return this.page.getComponent(this.parent);
      }
    }, {
      key: 'getRequiredModules',
      value: function getRequiredModules() {
        // eslint-disable-line
        return [];
      }
    }, {
      key: 'isBuildable',
      value: function isBuildable() {
        // eslint-disable-line
        return _jquery2.default.Deferred().resolve().promise();
      }
    }, {
      key: 'setDataFromNode',
      value: function setDataFromNode() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (this.node.attr('data-component-data')) {
          this.data = _extends({}, data, _pprLibraryUtils2.default.parseJSON(this.node.attr('data-component-data')));
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.data = _jquery2.default.extend(true, {}, this.cacheData);
        this.href = null;
        this.isBuilt = false;

        // Unsubscribe events
        this.eventBus.unsubscribeByScope(this);
      }
    }, {
      key: 'setModuleMessages',
      value: function setModuleMessages(messages) {
        this.messages = messages;
      }
    }]);

    return BasePrototype;
  }();

  exports.default = BasePrototype;
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.component.reloadableprototype', ['module', 'exports', 'jquery', 'ppr.component.baseprototype'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('jquery'), require('ppr.component.baseprototype'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.$, global.pprComponentBaseprototype);
    global.pprComponentReloadableprototype = mod.exports;
  }
})(this, function (module, exports, _jquery, _pprComponent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  var _pprComponent2 = _interopRequireDefault(_pprComponent);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ReloadablePrototype = function (_BasePrototype) {
    _inherits(ReloadablePrototype, _BasePrototype);

    function ReloadablePrototype(node) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, ReloadablePrototype);

      var _this = _possibleConstructorReturn(this, (ReloadablePrototype.__proto__ || Object.getPrototypeOf(ReloadablePrototype)).call(this, node, params));

      _this.href = null;

      // Set href
      if (_this.node.attr('data-component-href')) {
        _this.href = _this.node.attr('data-component-href');
      }

      _this.componentLoaderWrapper = null;
      return _this;
    }

    /**
     * @inheritdoc
     */


    _createClass(ReloadablePrototype, [{
      key: 'afterBuild',
      value: function afterBuild() {
        this.componentLoaderWrapper = this.node.find('.component-loader__wrapper');

        this.eventBus.subscribe(this, 'reload', this.reload, this.id);
        this.eventBus.subscribe(this, 'reload_started', this.onReloadStarted, this.id);
        this.eventBus.subscribe(this, 'reload_ready', this.onReloadReady, this.id);
        this.eventBus.subscribe(this, 'reload_components', this.reload);

        // Publish build finished
        this.eventBus.publish('component_build_finished', this.id);

        this.isBuilt = true;
      }
    }, {
      key: 'onReloadStarted',
      value: function onReloadStarted() {
        if (this.componentLoaderWrapper.length) {
          this.componentLoaderWrapper.addClass('component-loader__wrapper--active');
        }
      }
    }, {
      key: 'onReloadReady',
      value: function onReloadReady(node) {
        var wrappedNode = (0, _jquery2.default)('<div></div>').append(node);
        var targetNode = wrappedNode.find('[data-component]:first');

        this.reset();

        var childIds = this.node.find('[data-component-id]').map(function (index, element) {
          return (0, _jquery2.default)(element).attr('data-component-id');
        });

        // Remove child components
        if (childIds.length > 0) {
          this.eventBus.publish('remove_component', childIds);
        }

        // Replace nodes
        this.node.replaceWith(targetNode);
        this.node = targetNode;

        // Add data
        this.setDataFromNode({});

        // Use existing id
        targetNode.attr('data-component-id', this.id);

        // Rebuild component
        this.eventBus.publish('build_component', targetNode);
      }
    }, {
      key: 'reload',
      value: function reload() {
        var _this2 = this;

        this.eventBus.publishTo(this.id, 'reload_started');

        // Load component html
        _jquery2.default.get(this.href).done(function (html) {
          _this2.eventBus.publishTo(_this2.id, 'reload_ready', (0, _jquery2.default)(html));
        });
      }
    }]);

    return ReloadablePrototype;
  }(_pprComponent2.default);

  exports.default = ReloadablePrototype;
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.component', ['module', 'exports', 'ppr.component.baseprototype', 'ppr.component.reloadableprototype'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.component.baseprototype'), require('ppr.component.reloadableprototype'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprComponentBaseprototype, global.pprComponentReloadableprototype);
    global.pprComponent = mod.exports;
  }
})(this, function (module, exports, _pprComponent, _pprComponent3) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pprComponent2 = _interopRequireDefault(_pprComponent);

  var _pprComponent4 = _interopRequireDefault(_pprComponent3);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    BasePrototype: _pprComponent2.default,
    ReloadablePrototype: _pprComponent4.default
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("ppr.module.baseprototype", ["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.pprModuleBaseprototype = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BasePrototype = function () {
    function BasePrototype() {
      _classCallCheck(this, BasePrototype);
    }

    _createClass(BasePrototype, null, [{
      key: "initialize",
      value: function initialize(configs, eventBus) {
        this.eventBus = eventBus;
        this.configList = _extends({}, {}, configs);
        this.messages = {};
      }
    }, {
      key: "build",
      value: function build() {
        // eslint-disable-line
        return true;
      }
    }, {
      key: "getMessages",
      value: function getMessages() {
        return this.messages;
      }
    }]);

    return BasePrototype;
  }();

  exports.default = BasePrototype;
  module.exports = exports["default"];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.module', ['module', 'exports', 'ppr.module.baseprototype'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.module.baseprototype'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprModuleBaseprototype);
    global.pprModule = mod.exports;
  }
})(this, function (module, exports, _pprModule) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pprModule2 = _interopRequireDefault(_pprModule);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    BasePrototype: _pprModule2.default
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.ui.builderprototype', ['module', 'exports', 'ppr.library.utils.loader'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.library.utils.loader'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprLibraryUtilsLoader);
    global.pprUiBuilderprototype = mod.exports;
  }
})(this, function (module, exports, _pprLibraryUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pprLibraryUtils2 = _interopRequireDefault(_pprLibraryUtils);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BuilderPrototype = function () {
    function BuilderPrototype() {
      _classCallCheck(this, BuilderPrototype);
    }

    _createClass(BuilderPrototype, [{
      key: 'build',
      value: function build() {
        // eslint-disable-line
        return false;
      }
    }], [{
      key: 'initialize',
      value: function initialize(page) {
        if (!this.shouldBuild()) {
          return false;
        }

        var targetDependencies = this.getDependencies();
        var instance = new this();

        // Remember page
        instance.page = page;

        _pprLibraryUtils2.default.load(targetDependencies, function () {
          instance.build.apply(instance, arguments);
        });

        return true;
      }
    }, {
      key: 'shouldBuild',
      value: function shouldBuild() {
        // eslint-disable-line
        return true;
      }
    }, {
      key: 'getDependencies',
      value: function getDependencies() {
        // eslint-disable-line
        return [];
      }
    }]);

    return BuilderPrototype;
  }();

  exports.default = BuilderPrototype;
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr.ui', ['module', 'exports', 'ppr.ui.builderprototype'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('ppr.ui.builderprototype'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pprUiBuilderprototype);
    global.pprUi = mod.exports;
  }
})(this, function (module, exports, _pprUi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _pprUi2 = _interopRequireDefault(_pprUi);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    BuilderPrototype: _pprUi2.default
  };
  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ppr', ['module', 'exports', 'jquery', 'lodash', 'ppr.library.utils.loader', 'ppr.config'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('jquery'), require('lodash'), require('ppr.library.utils.loader'), require('ppr.config'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.$, global._, global.pprLibraryUtilsLoader, global.pprConfig);
    global.ppr = mod.exports;
  }
})(this, function (module, exports, _jquery, _lodash, _pprLibraryUtils, _ppr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  var _lodash2 = _interopRequireDefault(_lodash);

  var _pprLibraryUtils2 = _interopRequireDefault(_pprLibraryUtils);

  var _ppr2 = _interopRequireDefault(_ppr);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {

    /**
     * Build the library
     */
    build: function build() {
      this.buildPage();
    },


    /**
     * Build page instance
     */
    buildPage: function buildPage() {
      var _this = this;

      var node = (0, _jquery2.default)('body');
      var params = {};

      var namespace = 'ppr.page.baseprototype';
      var name = node.attr('data-page');

      // Custom instance required
      if (typeof name !== 'undefined' && name.length > 0) {
        namespace = 'ppr.page.' + _lodash2.default.snakeCase(name.trim()).replace(/_/g, '-');
      } else {
        name = 'base_prototype';
      }

      params.name = name;

      _pprLibraryUtils2.default.load(namespace, function (PagePrototype) {
        var instance = new PagePrototype(node, params);

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
    loadConfig: function loadConfig(source) {
      var _this2 = this;

      var deferred = _jquery2.default.Deferred();

      _jquery2.default.ajax({
        dataType: 'json',
        url: source,

        success: function success(response) {
          _this2.setConfig(response);
          deferred.resolve(response);
        },

        fail: function fail() {
          deferred.reject('Load configuration failed');
        }
      });

      return deferred.promise();
    },


    /**
     * Set configuration
     * @param {Object} configs list of configurations
     */
    setConfig: function setConfig(configs) {
      _lodash2.default.each(configs, function (value, key) {
        _ppr2.default.set(key, value);
      });
    }
  };
  module.exports = exports['default'];
});