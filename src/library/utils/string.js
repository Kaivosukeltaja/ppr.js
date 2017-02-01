import _ from 'lodash';
import $ from 'jquery';

export default {

  /**
   * Generate hash from string
   * @param {string} targetString target string
   * @returns {number}
   */
  generateHash(targetString) {
    let hash = 0;
    let i;
    let chr;
    let len;

    if (targetString.length === 0) {
      return hash;
    }

    for (i = 0, len = targetString.length; i < len; i += 1) {
      chr = targetString.charCodeAt(i);
      hash = ((hash << 32) - hash) + chr; // eslint-disable-line no-bitwise
      hash |= 0; // eslint-disable-line no-bitwise
    }

    return hash;
  },

  /**
   * Remove all html from string
   * @param {string} targetString
   * @returns {string}
   */
  getAsPlainText(targetString) {
    return $('<p>').html(targetString).text();
  },

  /**
   * Linkify hash tags in text
   * @param {string} text  target text
   * @param {string} media target social media (supported values: facebook, instagram, twitter)
   * @returns {string}
   */
  linkifyHashTags(text, media) {
    const mediaUrls = {
      twitter: 'https://twitter.com/hashtag/',
      facebook: 'https://www.facebook.com/hashtag/',
      instagram: 'https://www.instagram.com/explore/tags/',
    };

    const targetMedia = media.toLowerCase();

    // Media is unsupported
    if (typeof mediaUrls[targetMedia] === 'undefined') {
      return text;
    }

    const targetUrl = mediaUrls[targetMedia];

    const targetText = text.replace(/[#]+[A-Za-z0-9-_äöåÄÖÅ]+/g, (t) => {
      const tag = t.replace('#', '');
      const link = $('<a>')
        .attr('class', 'hashtag')
        .attr('href', targetUrl + tag)
        .attr('target', '_blank')
        .text(t);

      return link[0].outerHTML;
    });

    return targetText;
  },

  /**
   * Replace variables with parameters in string
   * @param {string} targetString target string that has variables
   * @param {Object} params       parameters to replace variables
   * @returns {string}
   */
  replaceVariablesWithParameters(targetString, params) {
    let stringValue = targetString;

    _.each(params, (value, key) => {
      stringValue = stringValue.replace(`:${key}`, value);
    });

    return stringValue;
  },
};
