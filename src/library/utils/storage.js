import Config from 'ppr.config';

export default {

  configList: Object.assign({ enabled: true }, Config.get('storage', {})),

  /**
   * Check whether storage is enabled
   * @returns {Boolean}
   */
  isEnabled() {
    return this.configList.enabled === true && this.isSupported();
  },

  /**
   * Check whether storage is supported
   * @returns {Boolean}
   */
  isSupported() {
    return typeof window.localStorage !== 'undefined';
  },

  /**
   * Set item into storage
   * @param {string} key
   * @param {*}      value
   */
  set(key, value) {
    if (!this.isEnabled()) {
      return null;
    }

    let targetValue = value;

    // Convert object into string
    if (typeof targetValue === 'object') {
      try {
        targetValue = JSON.stringify(targetValue);
      } catch (e) {
        targetValue = '';
      }
    }

    window.localStorage.setItem(key, targetValue);
    return true;
  },

  /**
   * Get item from storage
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    if (!this.isEnabled()) {
      return null;
    }

    let value = window.localStorage.getItem(key);

    try {
      value = JSON.parse(value);
    } catch (e) {
      // Nothing
    }

    return value;
  },
};
