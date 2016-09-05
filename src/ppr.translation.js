(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.translation', [
      'ppr.config',
      'ppr.library.utils.string',
      'lodash'
    ], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('./ppr.config'),
      require('./library/utils/string'),
      require('lodash')
    );
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.translation = factory(root.ppr.config, root.ppr.library.utils.string, root.vendor._);
  }
})(this, function(Config, StringUtils, _) {

  'use strict';

  var Translation;

  Translation = {

    isInitialized: false,

    language: undefined,
    translationList: undefined,

    /**
     * Initialize translation wrapper
     */
    initialize: function() {

      this.language = Config.get('language', 'en');
      this.translationList = Config.get('translations', {});
    },

    /**
     * Get list of available translations
     */
    getAll: function() {

      // Needs to be initialized
      if (!this.isInitialized) {
        this.initialize();
      }

      return this.translationList;
    },

    /**
     * Helper method to get default language if attribute is not given
     * @param {string} [language] target language
     * @returns {string}
     */
    getLanguage: function(language) {
      return typeof language !== 'undefined' ? language : this.language;
    },

    /**
     * Helper method to get language prefixed key
     * @param {string} language target language
     * @param {string} key      target translation key
     * @returns {string}
     */
    getPrefixedKey: function(language, key) {
      return language + '.' + key;
    },

    /**
     * Translate given key into string
     * @param {string} key         target translation key
     * @param {Object} [variables] list of key-value pairs
     * @param {string} [language]  target language
     */
    translate: function(key, variables, language) {

      // Needs to be initialized
      if (!this.isInitialized) {
        this.initialize();
      }

      var translation = _.result(
        this.translationList, this.getPrefixedKey(
          this.getLanguage(language), key), key);

      // Has variables
      if (typeof variables !== 'undefined') {
        translation = StringUtils.replaceVariablesWithParameters(translation, variables);
      }

      return translation;
    }
  };

  /**
   * Public API
   */
  return {

    /**
     * @inheritdoc
     */
    getAll: function() {
      return Translation.getAll();
    },

    /**
     * @inheritdoc
     */
    translate: function(key, variables, language) {
      return Translation.translate(key, variables, language);
    }
  };
});
