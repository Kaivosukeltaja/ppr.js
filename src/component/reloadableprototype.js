(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.component.reloadable_prototype', [
      'ppr.component.base_prototype',
      'jquery'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('./baseprototype'),
      require('jquery')
    );
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.component.reloadable_prototype = factory(
      root.ppr.component.base_prototype,
      root.vendor.$
    );
  }
})(this, function(BasePrototype, $) {

  'use strict';

  return $.extend(true, {}, BasePrototype, {

    componentLoaderWrapper: null,

    /**
     * @inheritdoc
     */
    afterBuild: function() {

      this.componentLoaderWrapper = this.node.find('.component-loader__wrapper');

      var subscribers = [
        this.eventBus.subscribe(this, 'reload', this.reload, this.id),
        this.eventBus.subscribe(this, 'reload_started', this.onReloadStarted, this.id),
        this.eventBus.subscribe(this, 'reload_ready', this.onReloadReady, this.id),
        this.eventBus.subscribe(this, 'reload_components', this.reload)
      ];

      this.cacheSubscribers = this.cacheSubscribers.concat(subscribers);

      // Publish build finished
      this.eventBus.publish('component_build_finished', this.id);

      this.isBuilt = true;
    },

    /**
     * Function to be called when reload is started
     */
    onReloadStarted: function() {

      if (this.componentLoaderWrapper.length) {
        this.componentLoaderWrapper.addClass('component-loader__wrapper--active');
      }
    },

    /**
     * Function to be called when ajax is done
     */
    onReloadReady: function(node) {

      // Pick first element
      node = node.filter('*:not(text):not(comment)');

      this.reset();

      // Replace nodes
      this.node.replaceWith(node);

      // Use existing id
      node.attr('data-component-id', this.id);

      // Rebuild component
      this.eventBus.publish('build_component', node);
    },

    /**
     * Reload component
     */
    reload: function() {

      var _this = this;

      this.eventBus.publishTo(this.id, 'reload_started');

      // Load component html
      $.get(this.href).done(function(html) {
        _this.eventBus.publishTo(_this.id, 'reload_ready', $(html));
      });
    }
  });
});
