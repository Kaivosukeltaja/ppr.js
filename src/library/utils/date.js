(function(root, factory) {

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('ppr.library.utils.date', ['ppr.translation'], factory);
  }

  // Node, CommonJS
  else if (typeof exports === 'object') {
    module.exports = factory(require('../../ppr.translation'));
  }

  // Browser globals
  else {
    root.ppr.library.utils.date = factory(root.ppr.translation);
  }
})(this, function(Translation) {

  'use strict';

  return {
    /**
     * Get string as date object
     * @param {string|number} dateString
     * @returns {Object} date object
     */
    getAsDate: function(dateString) {

      // Already resolved
      if (typeof dateString === 'object') {
        return dateString;
      }

      // Already a number
      if (typeof dateString === 'number') {
        return new Date(dateString);
      }

      var match;

      // Format: 2016-03-31 13:00:00
      if (match = dateString.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/, 'g')) {
        return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
      }

      // Format: 31.03.2016 13:00:00
      // Format: 31.3.2016 5:00:00
      if (match = dateString.match(/^([0-9]{2}).([0-9]{1,2}).([0-9]{4}) ([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/, 'g')) {
        return new Date(match[3], match[2] - 1, match[1], match[4], match[5], match[6]);
      }

      return new Date(dateString);
    },

    /**
     * Calculate difference between 2 dates
     * @param {Object|string} toDate
     * @param {Object|string} [fromDate]
     * @returns {number}
     */
    getDifference: function(toDate, fromDate) {

      // Default value is current datetime
      if (typeof fromDate === 'undefined') {
        fromDate = new Date();
      }

      toDate = this.getAsDate(toDate);
      fromDate = this.getAsDate(fromDate);

      // Return in seconds
      return (fromDate.getTime() - toDate.getTime()) / 1000;
    },

    /**
     * Get time as difference string
     * @param {number} time in milliseconds
     * @returns {string}
     */
    getAsDifferenceString: function(time) {

      // Show in seconds
      if (time < 60) {
        return Math.floor(time) + Translation.translate('date.sec_ago');
      }

      // Show in minutes
      else if (time < 60 * 60) {
        return Math.floor(time / 60) + Translation.translate('date.min_ago');
      }

      // Show in hours
      else if (time < 60 * 60 * 24) {
        return Math.floor(time / 60 / 60) + Translation.translate('date.hour_ago');
      }

      return Math.floor(time / 60 / 60 / 24) + Translation.translate('date.day_ago');
    },

    /**
     * Get date as string in format dd.MM.yyyy HH:mm
     * @param {Object} date object
     * @returns {string} dateString
     */
    formatDate: function(date) {
      var yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(), // getMonth() is zero-based
        dd  = date.getDate().toString(),
        hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

      return dd + '.' + mm + '.' + yyyy + ' klo ' + hh + ':' + min;
    }
  };
});
