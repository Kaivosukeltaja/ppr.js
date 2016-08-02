(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.ui.builder_prototype', [
      'ppr.library.utils.loader',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('../library/utils/loader'),
      require('lodash')
    );
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.ui.builder_prototype = factory(root.ppr.library.utils.loader, root._);
  }
})(this, function(UniversalLoader, _) {

  'use strict';

  return {

    /**
     * Initialize builder
     * @returns {Boolean}
     */
    initialize: function() {
      var _this = this;

      if (!this.shouldBuild()) {
        return false;
      }

      UniversalLoader.load(this.getDependencies(), { custom: true }, function() {
        _this.build.apply(_this, Array.prototype.slice.call(arguments));
      });
    },

    /**
     * Check whether builder should build
     * @returns {Boolean}
     */
    shouldBuild: function() {
      return true;
    },

    /**
     * Get list of dependencies to be loaded
     * @returns {Object[]}
     */
    getDependencies: function() {
      return [];
    }
  };
});
