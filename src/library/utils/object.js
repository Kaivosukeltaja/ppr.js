(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.object', [], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory();
  }

  // Browser globals
  // istanbul ignore next
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
