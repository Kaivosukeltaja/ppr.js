import _ from 'lodash';
import Config from 'ppr.config';
import StringUtils from 'ppr.library.utils.string';

const Translation = {

  isInitialized: false,

  language: undefined,
  translationList: undefined,

  /**
   * Initialize translation wrapper
   */
  initialize() {
    this.language = Config.get('language', 'en');
    this.translationList = Config.get('translations', {});
  },

  /**
   * Get list of available translations
   */
  getAll() {
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
  getLanguage(language) {
    return typeof language !== 'undefined' ? language : this.language;
  },

  /**
   * Helper method to get language prefixed key
   * @param {string} language target language
   * @param {string} key      target translation key
   * @returns {string}
   */
  getPrefixedKey(language, key) {
    return `${language}.${key}`;
  },

  /**
   * Translate given key into string
   * @param {string} key         target translation key
   * @param {Object} [variables] list of key-value pairs
   * @param {string} [language]  target language
   */
  translate(key, variables, language) {
    if (!this.isInitialized) {
      this.initialize();
    }

    const prefixedKey = this.getPrefixedKey(this.getLanguage(language), key);
    let translation = _.result(this.translationList, prefixedKey, key);

    // Has variables
    if (typeof variables !== 'undefined') {
      translation = StringUtils.replaceVariablesWithParameters(translation, variables);
    }

    return translation;
  },
};

export default {

  /**
   * @inheritdoc
   */
  getAll() {
    return Translation.getAll();
  },

  /**
   * @inheritdoc
   */
  translate(key, variables, language) {
    return Translation.translate(key, variables, language);
  },
};
