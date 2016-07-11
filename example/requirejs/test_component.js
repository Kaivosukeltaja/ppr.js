define('ppr.component/test_component', ['ppr.component.reloadable_prototype', 'jquery'], function(ReloadablePrototype, $) {

  'use strict';

  return $.extend(true, {}, ReloadablePrototype, {

    build: function() {
      this.eventBus.publish('test_module_impression', { id: this.data.id });
    },

    getRequiredModules: function() {

      return ['test_module'];
    }
  });
})
