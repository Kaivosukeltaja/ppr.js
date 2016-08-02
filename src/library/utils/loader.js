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

        this.loadBulk();

        _.each(namespaces, function(namespace) {

          namespace = namespace.split('.');

          // Remove first
          namespace.shift();
          namespace = _.map(namespace, _.camelCase);

          dependencies.push(_.result(_this.commonModules, namespace.join('.').toLowerCase().trim()));
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
    loadBulk: function() {

      // No support for CommonJS or already loaded
      if (!this.hasCommonSupport() || this.bulkLoaded === true) {
        return;
      }

      var bulk = require('bulk-require');
      this.commonModules = bulk(__dirname + '/../../', ['**/*.js']);

      this.bulkLoaded = true;
    }
  };
});
