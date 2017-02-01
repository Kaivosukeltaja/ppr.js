import _ from 'lodash';

export default {
  query: {},

  /**
   * Get query parameter
   * @param {string} name         name of query parameter
   * @param {*}      defaultValue default value of parameter
   * @param {string} sourceUrl    target source url
   * @return {string}
   */
  getQueryParam(name, defaultValue = null, sourceUrl) {
    const parameters = this.getQueryParams(sourceUrl);

    if (Object.prototype.hasOwnProperty.call(parameters, name)) {
      return parameters[name];
    }

    return defaultValue;
  },

  /**
   * Get list of all query parameters
   * @return {Object}
   */
  getQueryParams(sourceUrl = window.location.href) {
    const result = {};
    const searchIndex = sourceUrl.indexOf('?');

    // Already resolved
    if (Object.prototype.hasOwnProperty.call(this.query, sourceUrl)) {
      return this.query[sourceUrl];
    }

    // No parameters found
    if (searchIndex === -1) {
      return result;
    }

    const queryString = sourceUrl.substring(searchIndex + 1);
    const queryVariables = queryString.split('&');

    _.each(queryVariables, (parameterString) => {
      const parameter = parameterString.split('=');

      result[parameter[0]] = parameter[1];
    });

    this.query[sourceUrl] = result;

    return result;
  },
};
