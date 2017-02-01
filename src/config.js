import _ from 'lodash';

let configList = {};

export default {

  /**
   * Get configuration by name
   * @param {string} name         name of configuration
   * @param {*}      defaultValue defaultValue to be used when configuration is not found
   * @returns {*} configuration value
   */
  get(name, defaultValue) {
    return _.result(configList, name, defaultValue);
  },

  /**
   * Get list of configurations
   * @returns {Object}
   */
  getAll() {
    return configList;
  },

  /**
   * Set configuration
   * @param {Object[]|string} configs list of configuration or name of single configuration
   * @param {*}               [value] single configuration value
   */
  set(configs, value) {
    let list = configs;

    if (typeof configs === 'string') {
      list = {};
      list[configs] = value;
    }

    _.each(list, (listValue, name) => {
      _.set(configList, name, listValue);
    });
  },

  /**
   * Reset configurations
   */
  reset() {
    configList = {};
  },
};
