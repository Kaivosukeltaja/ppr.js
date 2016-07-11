(function(root, factory) {

  // AMD
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
  else {
    root.ppr.component.reloadable_prototype = factory(
      root.ppr.component.base_prototype,
      root.$
    );
  }
})(this, function(BasePrototype, $) {

  'use strict';

  return $.extend(true, {}, BasePrototype, {

    global_reload: true,

    componentLoaderWrapper: null,

    /**
     * @inheritdoc
     */
    afterBuild: function() {

      this.componentLoaderWrapper = this.node.find('.component-loader__wrapper');

      this.subscribe(this, 'reload', this.reload);
      this.subscribe(this, 'reload_started', this.onReloadStarted);
      this.subscribe(this, 'reload_ready', this.onReloadReady);

      if (this.global_reload) {

        // Subscribe to reload components
        this.eventBus.subscribe(this, 'reload_components', this.reload);
      }

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

      this.publish('reload_started');

      // Load component html
      $.get(this.href).done(function(html) {
        _this.publish('reload_ready', $(html));
      });
    }
  });
});
