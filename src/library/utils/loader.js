import _ from 'lodash';
import Config from 'ppr.config';

export default {

  isInitialized: false,
  configList: {
    supportAMD: true,
    supportCommon: true,
  },

  /**
   * Check whether code supports AMD
   * @returns {Boolean}
   */
  hasAMDSupport() {
    return this.configList.supportAMD === true && typeof define === 'function' && define.amd;
  },

  /**
   * Initialize
   */
  initialize() {
    this.configList = _.extend(this.configList, Config.get('universal_loader', {}));

    // Mark as initialized
    this.isInitialized = true;
  },

  /**
   * Load dependency universally
   * @param {Object[]|string} namespaces names of dependencies
   * @param {function}        callback callback function
   * @returns {*}
   */
  load(namespaces, callback) {
    if (!this.isInitialized) {
      this.initialize();
    }

    let targetNamespaces = namespaces;

    if (typeof callback !== 'function') {
      throw new Error('Callback has to present');
    }

    // Turn single into array
    if (typeof targetNamespaces !== 'object') {
      targetNamespaces = [targetNamespaces];
    }

    const dependencies = [];

    // Use AMD
    if (this.hasAMDSupport()) {
      return require(targetNamespaces, callback); // eslint-disable-line
    }

    // Use globals
    _.each(targetNamespaces, (namespace) => {
      dependencies.push(_.get(window, _.camelCase(namespace)));
    });

    return callback(...dependencies);
  },
};
