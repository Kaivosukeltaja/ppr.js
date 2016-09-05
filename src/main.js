(function() {
  'use strict';

  // Required when using globals
  if (typeof define === 'undefined' && typeof exports === 'undefined') {
    window.ppr = { page: {}, component: {}, library: { utils: {} }, module: { model: {} }, ui: {} };

    // Use noConflict versions
    window.vendor = {};
    window.vendor.$ = window.$.noConflict();
    window.vendor._ = window._.noConflict();
  }
})();
