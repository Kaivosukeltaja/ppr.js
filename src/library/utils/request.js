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
