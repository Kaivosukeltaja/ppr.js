define('ppr.component/test-component', ['ppr.component.reloadableprototype', 'jquery'], function(ReloadablePrototype, $) {
  'use strict';

  function testComponent(node, params) {
      ReloadablePrototype.call(this, node, params);
  };

  testComponent.prototype = Object.create(ReloadablePrototype.prototype);
  testComponent.prototype.constructor = testComponent;
  testComponent.prototype.build = function() {
    var _this = this;

    this.node.on('click', '.btn', function(e) {
      e.preventDefault();

      _this.reload();
    });
  }

  return testComponent;
});
