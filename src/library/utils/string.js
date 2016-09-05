(function(root, factory) {

  // AMD
  // istanbul ignore next
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.string', ['lodash', 'jquery'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(
      require('lodash'),
      require('jquery')
    );
  }

  // Browser globals
  // istanbul ignore next
  else {
    root.ppr.library.utils.string = factory(root.vendor._, root.vendor.$);
  }
})(this, function(_, $) {

  'use strict';

  return {

    /**
     * Generate hash from string
     * @param {string} targetString target string
     * @returns {number}
     */
    generateHash: function(targetString) {
      var hash = 0, i, chr, len;

      if (targetString.length === 0) {
        return hash;
      }

      for (i = 0, len = targetString.length; i < len; i++) {
        chr   = targetString.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
      }

      return hash;
    },

    /**
     * Remove all html from string
     * @param {string} targetString
     * @returns {string}
     */
    getAsPlainText: function(targetString) {

      return $('<p>').html(targetString).text();
    },

    /**
     * Linkify hash tags in text
     * @param {string} text  target text
     * @param {string} media target social media (supported values: facebook, instagram, twitter)
     * @returns {string}
     */
    linkifyHashTags: function(text, media) {
      var targetUrl, mediaUrls;

      mediaUrls = {
        twitter: 'https://twitter.com/hashtag/',
        facebook: 'https://www.facebook.com/hashtag/',
        instagram: 'https://www.instagram.com/explore/tags/'
      };

      media = media.toLowerCase();

      // Media is unsupported
      if (typeof mediaUrls[media] === 'undefined') {
        return text;
      }

      targetUrl = mediaUrls[media];

      text = text.replace(/[#]+[A-Za-z0-9-_äöåÄÖÅ]+/g, function(t) {
        var tag, link;

        tag = t.replace('#', '');

        link = $('<a>').
          attr('class', 'hashtag').
          attr('href', targetUrl + tag).
          attr('target', '_blank').
          text(t);

        return link[0].outerHTML;
      });

      return text;
    },

    /**
     * Replace variables with parameters in string
     * @param {string} targetString target string that has variables
     * @param {Object} params       parameters to replace variables
     * @returns {string}
     */
    replaceVariablesWithParameters: function(targetString, params) {

      _.each(params, function(value, key) {
        targetString = targetString.replace(':' + key, value);
      });

      return targetString;
    }
  };
});
