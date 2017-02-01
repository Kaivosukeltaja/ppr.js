export default class BasePrototype {

  /**
   * Initialize module
   * @param {Object} configs  list of configurations
   * @param {Object} eventBus global event bus instance
   */
  static initialize(configs, eventBus) {
    this.eventBus = eventBus;
    this.configList = Object.assign({}, {}, configs);
    this.messages = {};
  }

  /**
   * Build module
   * @returns {Boolean}
   */
  static build() { // eslint-disable-line
    return true;
  }

  /**
   * Get list of messages
   */
  static getMessages() {
    return this.messages;
  }
}
