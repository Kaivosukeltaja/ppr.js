import $ from 'jquery';
import _ from 'lodash';
import ObjectUtils from 'ppr.library.utils.object';

export default class BasePrototype {

  constructor(node, params = {}) {
    this.node = node;
    this.id = params.id || _.uniqueId('Component_');
    this.name = params.name || null;
    this.eventBus = params.eventBus || null;
    this.page = params.page || null;
    this.cacheData = this.data;
    this.children = undefined;
    this.data = {};
    this.parent = undefined;
    this.messages = {};
    this.isBuilt = false;

    this.node.attr({
      'data-component': this.name,
      'data-component-id': this.id,
    });

    // Set page data
    if (this.node.attr('data-component-data')) {
      this.data = Object.assign({}, this.data, ObjectUtils.parseJSON(
        this.node.attr('data-component-data'),
      ));
    }
  }

  /**
   * Function to be called when build is finished
   */
  afterBuild() {
    this.eventBus.publish('component_build_finished', this.id);
    this.isBuilt = true;
  }

  /**
   * Build component
   * @returns {Boolean|undefined}
   */
  build() { // eslint-disable-line
    return true;
  }

  /**
   * Get child components
   * @note: use carefully, its very slow
   * @return {Object[]} list of child components
   */
  getChildren() {
    if (typeof this.children === 'undefined') {
      const componentIds = [];
      _.each(this.node.find('[data-component]'), (elem) => {
        const componentId = $(elem).attr('data-component-id');
        const component = this.page.getComponent(componentId);

        if (component.getParent().id === this.id) {
          componentIds.push(componentId);
        }
      });

      this.children = componentIds;
    }

    const result = [];

    _.each(this.children, (component) => {
      result.push(this.page.getComponent(component));
    });

    return result;
  }

  /**
   * Get parent component
   * @return {Object} parent component instance or null
   */
  getParent() {
    if (typeof this.parent !== 'undefined') {
      return this.page.getComponent(this.parent);
    }

    const parentElem = this.node.parents('[data-component]:first');

    let parent = null;

    if (parentElem.length) {
      parent = parentElem.attr('data-component-id');
    }

    this.parent = parent;

    return this.page.getComponent(this.parent);
  }

  /**
   * Get list of required modules
   * @returns {Object[]}
   */
  getRequiredModules() { // eslint-disable-line
    return [];
  }

  /**
   * Check whether component is ready to be built
   * @returns {Object} promise
   */
  isBuildable() { // eslint-disable-line
    return $.Deferred().resolve().promise();
  }

  /**
   * Reset component to original state
   */
  reset() {
    this.data = $.extend(true, {}, this.cacheData);
    this.href = null;
    this.isBuilt = false;

    // Unsubscribe events
    this.eventBus.unsubscribeByScope(this);
  }

  /**
   * Set module messages
   * @param {Object} messages
   */
  setModuleMessages(messages) {
    this.messages = messages;
  }
}
