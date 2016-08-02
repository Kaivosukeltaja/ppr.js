(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.window', [
      'ppr.config',
      'jquery',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('../../ppr.config'),
      require('jquery'),
      require('lodash')
    );
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.library.utils.window = factory(root.ppr.config, root.$, root._);
  }
})(this, function(Config, $, _) {

  'use strict';

  return {

    configList: $.extend(true, {
      breakpoints: {},
      mobile_breakpoints: []
    }, Config.get('window', {})),

    /**
     * Check whether given breakpoint exists
     * @param {string} breakpoint target breakpoint
     * @returns {Boolean}
     */
    isBreakpoint: function(breakpoint) {
      return typeof this.configList.breakpoints[breakpoint] !== 'undefined';
    },

    /**
     * Check whether current window matches to mobile breakpoint
     * @returns {Boolean}
     */
    isMobile: function() {

      var _this = this,
        isMobile = false;

      _.each(this.configList.mobile_breakpoints, function(breakpoint) {

        if (!isMobile) {
          isMobile = _this.matchBreakpoint(breakpoint);
        }
      });

      return isMobile;
    },

    /**
     * Check whether current window match to breakpoint
     * @param {string} breakpoint name of breakpoint
     * @returns {Boolean}
     */
    matchBreakpoint: function(breakpoint) {

      // Breakpoint doesn't exist
      if (!this.isBreakpoint(breakpoint)) {
        return false;
      }

      // Match media is not supported
      if (typeof window.matchMedia !== 'function') {
        return false;
      }

      var breakpointDetails = this.configList.breakpoints[breakpoint],
        targetWidth = _.replace(breakpointDetails, /[<>]/, '').trim();

      // Smaller than
      if (_.startsWith(breakpointDetails, '<')) {
        return window.matchMedia('(max-width: ' + targetWidth + 'px)').matches;
      }

      // Bigger than
      else if (_.startsWith(breakpointDetails, '>')) {
        return window.matchMedia('(min-width: ' + targetWidth + 'px)').matches;

      }

      return false;
    },

    /**
     * Get prefixed transformations
     * @param  {string} transform
     * @return {Object}
     */
    transformations: function(transform) {

      return {
        '-webkit-transform': transform,
        '-moz-transform': transform,
        '-ms-transform': transform,
        '-o-transform': transform,
        transform: transform
      };
    },

    /**
     * Transition callback
     * @returns {*}
     */
    whichTransitionEvent: function() {

      var t,
        el = document.createElement('fakeelement'),
        transitions = {
          transition: 'transitionend',
          OTransition: 'oTransitionEnd',
          MozTransition: 'transitionend',
          WebkitTransition: 'webkitTransitionEnd'
        };

      for (t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  };
});
