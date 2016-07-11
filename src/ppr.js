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
