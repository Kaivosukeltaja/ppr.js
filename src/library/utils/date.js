import Translation from 'ppr.translation';

export default {
  /**
   * Get string as date object
   * @param {string|number} dateString
   * @returns {Object} date object
   */
  getAsDate(dateString) {
    // Already resolved
    if (typeof dateString === 'object') {
      return dateString;
    }

    // Already a number
    if (typeof dateString === 'number') {
      return new Date(dateString);
    }

    let match = dateString.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/, 'g');

    // Format: 2016-03-31 13:00:00
    if (match !== null) {
      return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
    }

    match = dateString.match(/^([0-9]{2}).([0-9]{1,2}).([0-9]{4}) ([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/, 'g');

    // Format: 31.03.2016 13:00:00
    // Format: 31.3.2016 5:00:00
    if (match !== null) {
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
  getDifference(toDate, fromDate = new Date()) {
    const targetToDate = this.getAsDate(toDate);
    const targetFromDate = this.getAsDate(fromDate);

    // Return in seconds
    return (targetFromDate.getTime() - targetToDate.getTime()) / 1000;
  },

  /**
   * Get time as difference string
   * @param {number} time in milliseconds
   * @returns {string}
   */
  getAsDifferenceString(time) {
    if (time < 60) { // Show in seconds
      return Math.floor(time) + Translation.translate('date.sec_ago');
    } else if (time < 60 * 60) { // Show in minutes
      return Math.floor(time / 60) + Translation.translate('date.min_ago');
    } else if (time < 60 * 60 * 24) { // Show in hours
      return Math.floor(time / 60 / 60) + Translation.translate('date.hour_ago');
    }

    return Math.floor(time / 60 / 60 / 24) + Translation.translate('date.day_ago');
  },

  /**
   * Get date as string in format dd.MM.yyyy HH:mm
   * @param {Object} date object
   * @returns {string} dateString
   */
  formatDate(date) {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
    const dd = date.getDate().toString();
    const hh = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    return `${dd}.${mm}.${yyyy} klo ${hh}:${min}`;
  },
};
