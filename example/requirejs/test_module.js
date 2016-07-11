define('ppr.module/test_module', ['ppr.module.base_prototype', 'jquery'], function(BasePrototype, $) {

  'use strict';

  return $.extend(true, {}, BasePrototype, {
    impressions: [],

    build: function() {
      var _this = this;

      this.eventBus.subscribe(this, 'page_build_finished', function() {
        console.log('page build finished: TEST', _this.impressions);
      });

      this.eventBus.subscribe(this, 'test_module_impression', function(data) {
        _this.impressions.push(data);
      });
    }
  });
});
