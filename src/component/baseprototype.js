(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.component.base_prototype', ['ppr.library.utils.object'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('../library/utils/object'));
  }

  // Browser globals
  else {
    root.ppr.component.base_prototype = factory(root.ppr.library.utils.object);
  }
})(this, function(ObjectUtils) {

  'use strict';

  return {

    children: undefined,
    eventBus: null,
    data: {},
    href: null,
    id: null,
    name: null,
    node: null,
    page: null,
    parent: undefined,
    messages: {},

    isBuilt: false,

    // Cache
    cacheData: {},
    cacheSubscribers: [],

    /**
     * Function to be called when build is finished
     */
    afterBuild: function() {
      this.eventBus.publish('component_build_finished', this.id);
      this.isBuilt = true;
    },

    /**
     * Build component
     * @returns {Boolean|undefined}
     */
    build: function() {},

    /**
     * Get child components
     * @note: use carefully, its very slow
     * @return {Object[]} list of child components
     */
    getChildren: function() {
      var _this = this;

      if (typeof this.children === 'undefined') {
        var componentIds = [];

        _.each(this.node.find('[data-component]'), function(elem) {

          var componentId = $(elem).attr('data-component-id'),
            component = _this.page.getComponent(componentId);

          if (component.getParent().id === _this.id) {
            componentIds.push(componentId);
          }
        });

        this.children = componentIds;
      }

      var result = [];

      _.each(this.children, function(component) {
        result.push(_this.page.getComponent(component));
      });

      return result;
    },

    /**
     * Get parent component
     * @return {Object} parent component instance or null
     */
    getParent: function() {

      // Already resolved
      if (typeof this.parent !== 'undefined') {
        return this.page.getComponent(this.parent);
      }

      var parentElem = this.node.parents('[data-component]:first'),
        parent = null;

      if (parentElem.length) {
        parent = parentElem.attr('data-component-id');
      }

      this.parent = parent;

      return this.page.getComponent(this.parent);
    },

    /**
     * Get list of required modules
     * @returns {Object[]}
     */
    getRequiredModules: function() {

      return [];
    },

    /**
     * Initialize component
     * @param {Object} params
     */
    initialize: function(params) {

      this.id = params.id;
      this.node = params.node;
      this.name = params.name;
      this.eventBus = params.eventBus;
      this.page = params.page;

      // Keep default data
      this.cacheData = this.data;

      this.node.attr({
        'data-component': this.name,
        'data-component-id': this.id
      });

      // Set href
      if (this.node.attr('data-component-href')) {
        this.href = this.node.attr('data-component-href');
      }

      // Set page data
      if (this.node.attr('data-component-data')) {

        this.data = $.extend({}, this.data, ObjectUtils.parseJSON(
          this.node.attr('data-component-data')
        ));
      }
    },

    /**
     * Check whether component is ready to be built
     * @returns {Object} promise
     */
    isBuildable: function() {
      return $.Deferred().resolve().promise();
    },

    /**
     * Reset component to original state
     */
    reset: function() {

      this.data = $.extend(true, {}, this.cacheData);
      this.href = null;
      this.isBuilt = false;

      // Unsubscribe events
      this.eventBus.unsubscribe(this.cacheSubscribers);
    },

    /**
     * Set module messages
     * @param {Object} messages
     */
    setModuleMessages: function(messages) {
      this.messages = messages;
    }
  };
});
