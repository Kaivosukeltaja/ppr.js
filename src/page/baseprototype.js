import $ from 'jquery';
import _ from 'lodash';
import Config from 'ppr.config';
import ObjectUtils from 'ppr.library.utils.object';
import UniversalLoader from 'ppr.library.utils.loader';
import EventBusPrototype from 'ppr.library.eventbusprototype';

export default class BasePrototype {

  constructor(node, params = {}) {
    this.node = node;
    this.name = params.name || null;
    this.data = null;
    this.eventBus = new EventBusPrototype();
    this.components = {};
    this.modulePromises = {};
    this.cacheComponentReady = [];

    // Set page data
    if (this.node.attr('data-page-data')) {
      this.data = Object.assign({}, this.data, ObjectUtils.parseJSON(this.node.attr('data-page-data')));
    }
  }

  /**
   * Function to be triggered when build is done
   */
  afterBuild() {
    this.setDefaultSubscribers();

    this.buildComponents(this.node);
    this.buildUIExtensions();
  }

  /**
   * Build page
   * @returns {Boolean|undefined}
   */
  build() { // eslint-disable-line
    return true;
  }

  /**
   * Build component
   * @param {Object} node jQuery node of element
   */
  buildComponent(node) {
    let namespace;
    let name = node.attr('data-component').trim();

    const instanceName = _.snakeCase(name).replace(/_/g, '-');
    const params = {};

    // Use custom name if present
    if (name.length > 0) {
      namespace = `ppr.component.${instanceName}`;
    } else if (node.attr('data-component-href')) { // Reloadable component
      namespace = 'ppr.component.reloadableprototype';
      name = 'reloadable_prototype';
    } else { // Normal component
      namespace = 'ppr.component.baseprototype';
      name = 'base_prototype';
    }

    // Use existing id
    if (node.attr('data-component-id')) {
      params.id = node.attr('data-component-id');
    } else {
      params.id = _.uniqueId('Component_');
    }

    // Check that component is not already built
    if (typeof this.components[params.id] !== 'undefined') {
      if (this.components[params.id].isBuilt) {
        return false;
      }
    }

    params.name = name;
    params.eventBus = this.eventBus;
    params.page = this;

    UniversalLoader.load(namespace, (ComponentPrototype) => {
      if (typeof ComponentPrototype === 'undefined') {
        return;
      }

      // Instantiate prototype
      const instance = new ComponentPrototype(node, params);

      // Remember instance
      this.components[params.id] = instance;

      // Map required modules to namespaces
      const modulePromises = instance.getRequiredModules().map(moduleName => this.getModule(moduleName));

      Promise.all(modulePromises).then((modules) => {
        const messages = {};

        // Initialize modules
        _.each(modules, (module) => {
          const moduleName = module.name.toLowerCase();
          messages[moduleName] = module.getMessages();
        });

        instance.setModuleMessages(messages);

        // Wait until instance is buildable
        instance.isBuildable().then((data) => {
          if (instance.build(data) === false) {
            this.removeComponent(params.id);
            return;
          }

          instance.afterBuild();

          // Build child components
          this.buildComponents(node);
        });
      });
    });

    return true;
  }

  /**
   * Build all components in container node
   */
  buildComponents(node) {
    const componentNodes = node.find('[data-component]');
    const childNodes = node.find('[data-component] [data-component]');
    componentNodes.not(childNodes).each((index, element) => this.eventBus.publish('build_component', $(element)));
  }

  /**
   * Build UI extensions
   */
  buildUIExtensions() { // eslint-disable-line
    UniversalLoader.load(Config.get('ui.builders', []), (...builders) => {
      _.each(builders, (builder) => {
        builder.initialize(this);
      });
    });
  }

  /**
   * Get component by id
   * @param {string} id component id
   * @returns {Object}
   */
  getComponent(id) {
    return typeof this.components[id] !== 'undefined' ?
      this.components[id] : null;
  }

  /**
   * Get module by name
   * @param {string} name name of module
   * @returns {Object}
   */
  getModule(name) {
    if (Object.prototype.hasOwnProperty.call(this.modulePromises, name)) {
      return this.modulePromises[name];
    }

    const modulePromise = new Promise((resolve) => { // eslint-disable-line
      const requireName = `ppr.module.${name}`;

      // Load module
      UniversalLoader.load(requireName, (module) => {
        module.initialize({}, this.eventBus);

        return resolve(module);
      });
    });

    this.modulePromises[name] = modulePromise;

    return modulePromise;
  }

  /**
   * Function to be called when each component is ready
   * @param {string} componentId
   */
  onComponentBuildFinished(componentId) {
    this.cacheComponentReady.push(componentId);

    // All components ready
    if (this.cacheComponentReady.length === _.keys(this.components).length) {
      this.eventBus.publish('page_build_finished');
    }
  }

  /**
   * Remove component
   * @param {Object[]|string} ids target component id
   */
  removeComponent(ids) {
    let targetIds = ids;

    if (typeof ids === 'string') {
      targetIds = [ids];
    }

    _.each(targetIds, (id) => {
      const componentInstance = this.components[id];

      // Remove references
      if (typeof componentInstance !== 'undefined') {
        componentInstance.reset();
        componentInstance.node.remove();
        delete this.components[id];
      }
    });
  }

  /**
   * Set default subscribers
   */
  setDefaultSubscribers() {
    this.eventBus.subscribe(this, 'remove_component', this.removeComponent);
    this.eventBus.subscribe(this, 'build_components', this.buildComponents);
    this.eventBus.subscribe(this, 'build_component', this.buildComponent);
    this.eventBus.subscribe(this, 'build_extensions', this.buildUIExtensions);
    this.eventBus.subscribe(this, 'component_build_finished', this.onComponentBuildFinished);
  }
}
