(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.storage', ['ppr.config', 'jquery'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('../../ppr.config'),
      require('jquery')
    );
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.library.utils.storage = factory(root.ppr.config, root.vendor._);
  }
})(this, function(Config, $) {

  'use strict';

  return {

    configList: $.extend({
      enabled: true
    }, Config.get('storage', {})),

    /**
     * Check whether storage is enabled
     * @returns {Boolean}
     */
    isEnabled: function() {
      return this.configList.enabled === true && this.isSupported();
    },

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

      if (!this.isEnabled()) {
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

      if (!this.isEnabled()) {
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
