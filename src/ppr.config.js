(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.config', ['lodash'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'));
  }

  // Browser globals
  // istanbul ignore next
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
