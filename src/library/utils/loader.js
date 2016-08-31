(function(root, factory) {

  // AMD
  // istanbul ignore next
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
  // istanbul ignore next
  else {
    root.ppr.library.utils.loader = factory(root._);
  }
})(this, function(_) {

  'use strict';

  return {

    bulkModules: null,

    /**
     * Add bulk modules to cache
     * @param {Object} modules
     */
    addBulkModules: function(modules) {

      this.bulkModules = _.merge(this.getBulkModules(), modules);
    },

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
     * Get list of modules loaded with bulk style
     */
    getBulkModules: function() {

      // Load bulk modules
      if (this.bulkModules === null) {
        this.bulkModules = this.loadBulkModules();
      }

      return this.bulkModules;
    },

    /**
     * Load dependency universally
     * @param {Object[]|string} namespaces names of dependencies
     * @param {Object}          config     list of configurations
     * @param {function}        callback callback function
     * @returns {*}
     */
    load: function(namespaces, config, callback) {

      var _this = this;

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

          dependencies.push(_.result(_this.getBulkModules(), namespace.join('.').toLowerCase().trim()));
        });

        return callback.apply(null, dependencies);
      }

      // Use globals
      _.each(namespaces, function(namespace) {
        dependencies.push(_.get(window, namespace));
      });

      return callback.apply(null, dependencies);
    },

    /**
     * Load all files when using CommonJS
     */
    loadBulkModules: function() {

      var result = {};

      // No support for CommonJS or already loaded
      if (!this.hasCommonSupport()) {
        return result;
      }

      var bulk = require('bulk-require');

      result = bulk(__dirname + '/../../', ['**/*.js']);

      return result;
    }
  };
});
