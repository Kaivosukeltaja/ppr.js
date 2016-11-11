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
    },

    /**
     * Legacy browser compatible replacement for Object.assign
     * From: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
     */
    assign: function(target) {
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }

      return output;
    }
  };
});
