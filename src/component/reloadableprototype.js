import $ from 'jquery';
import BasePrototype from 'ppr.component.baseprototype';

export default class ReloadablePrototype extends BasePrototype {

  constructor(node, params = {}) {
    super(node, params);

    this.href = null;

    // Set href
    if (this.node.attr('data-component-href')) {
      this.href = this.node.attr('data-component-href');
    }

    this.componentLoaderWrapper = null;
  }

  /**
   * @inheritdoc
   */
  afterBuild() {
    this.componentLoaderWrapper = this.node.find('.component-loader__wrapper');

    this.eventBus.subscribe(this, 'reload', this.reload, this.id);
    this.eventBus.subscribe(this, 'reload_started', this.onReloadStarted, this.id);
    this.eventBus.subscribe(this, 'reload_ready', this.onReloadReady, this.id);
    this.eventBus.subscribe(this, 'reload_components', this.reload);

    // Publish build finished
    this.eventBus.publish('component_build_finished', this.id);

    this.isBuilt = true;
  }

  /**
   * Function to be called when reload is started
   */
  onReloadStarted() {
    if (this.componentLoaderWrapper.length) {
      this.componentLoaderWrapper.addClass('component-loader__wrapper--active');
    }
  }

  /**
   * Function to be called when ajax is done
   */
  onReloadReady(node) {
    const wrappedNode = $('<div></div>').append(node);
    const targetNode = wrappedNode.find('[data-component]:first');

    this.reset();

    const childIds = this.node.find('[data-component-id]').map((index, element) => $(element).attr('data-component-id'));

    // Remove child components
    if (childIds.length > 0) {
      this.eventBus.publish('remove_component', childIds);
    }

    // Replace nodes
    this.node.replaceWith(targetNode);
    this.node = targetNode;

    // Add data
    this.setDataFromNode({});

    // Use existing id
    targetNode.attr('data-component-id', this.id);

    // Rebuild component
    this.eventBus.publish('build_component', targetNode);
  }

  /**
   * Reload component
   */
  reload() {
    this.eventBus.publishTo(this.id, 'reload_started');

    // Load component html
    $.get(this.href).done((html) => {
      this.eventBus.publishTo(this.id, 'reload_ready', $(html));
    });
  }
}
