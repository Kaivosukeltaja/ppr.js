import $ from 'jquery';
import _ from 'lodash';
import UniversalLoader from 'ppr.library.utils.loader';
import Config from 'ppr.config';

export default {

  /**
   * Build the library
   */
  build() {
    this.buildPage();
  },

  /**
   * Build page instance
   */
  buildPage() {
    const node = $('body');
    const params = {};
    const loaderParams = {};

    let namespace = 'ppr.page.baseprototype';
    let name = node.attr('data-page');

    // Custom instance required
    if (typeof name !== 'undefined' && name.length > 0) {
      namespace = `ppr.page.${_.replace(_.snakeCase(name.trim()), '_', '-')}`;
      loaderParams.custom = true;
    } else {
      name = 'base_prototype';
    }

    params.name = name;

    UniversalLoader.load(namespace, loaderParams, (PagePrototype) => {
      const instance = new PagePrototype(node, params);

      // Remember instance
      this.page_instance = instance;

      // Build
      instance.build();
      instance.afterBuild();
    });
  },

  /**
   * Load configuration asynchronously
   * @param {string} source url to load configuration
   * @returns {Object} promise
   */
  loadConfig(source) {
    const deferred = $.Deferred();

    $.ajax({
      dataType: 'json',
      url: source,

      success: (response) => {
        this.setConfig(response);
        deferred.resolve(response);
      },

      fail: () => {
        deferred.reject('Load configuration failed');
      },
    });

    return deferred.promise();
  },

  /**
   * Set configuration
   * @param {Object} configs list of configurations
   */
  setConfig(configs) {
    _.each(configs, (value, key) => {
      Config.set(key, value);
    });
  },
};
