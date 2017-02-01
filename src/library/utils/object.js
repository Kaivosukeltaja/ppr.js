export default {

  /**
   * Convert data to JSON string
   * @param {Object|Object[]} data
   * @return {string}
   */
  stringify(data) {
    let result;

    // Already resolved
    if (typeof data === 'string') {
      return data;
    }

    try {
      result = JSON.stringify(data);
    } catch (e) {
      result = '';
    }

    return result;
  },

  /**
   * Parse JSON string to object
   * @param {string} targetString
   * @return {Object|Object[]}
   */
  parseJSON(targetString) {
    let result;

    // Already resolved
    if (typeof targetString === 'object') {
      return targetString;
    }

    try {
      result = JSON.parse(targetString);
    } catch (e) {
      result = {};
    }

    return result;
  },
};
