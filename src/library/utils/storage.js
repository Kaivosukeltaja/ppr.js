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
