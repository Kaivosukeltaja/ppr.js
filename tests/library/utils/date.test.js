var DateUtils = require('../../../src/library/utils/date'),
  Config = require('../../../src/ppr.config');

'use strict';

describe('ppr.library.utils.date', function() {

  describe('getAsDate', function() {

    it('should parse string from format 1', function() {
      var realDate = new Date(2016, 2, 31, 14, 0, 0);

      chai.assert.equal(DateUtils.getAsDate('2016-03-31 14:00:00').getTime(), realDate.getTime());
    });

    it('should parse string from format 2', function() {
      var realDate = new Date(2016, 2, 31, 14, 0, 0);

      chai.assert.equal(DateUtils.getAsDate('31.03.2016 14:00:00').getTime(), realDate.getTime());
      chai.assert.equal(DateUtils.getAsDate('31.3.2016 14:00:00').getTime(), realDate.getTime());
    });

    it('should parse string from format 3', function() {
      var realDate = new Date(2016, 2, 31, 5, 0, 0);

      chai.assert.equal(DateUtils.getAsDate('31.03.2016 5:00:00').getTime(), realDate.getTime());
      chai.assert.equal(DateUtils.getAsDate('31.3.2016 5:00:00').getTime(), realDate.getTime());
    });

    it('should try to instantiate date object even if format is unknown', function() {
      chai.assert.equal(DateUtils.getAsDate('2016-03-31T05:00:00+00:00').getTime(), 1459400400000);
    });

    it('should return object if first argument is already object', function() {
      var targetDate = new Date();

      chai.assert.deepEqual(DateUtils.getAsDate(targetDate), targetDate);
    });

    it('should return object if first argument is number', function() {

      var targetDate = new Date();

      chai.assert.deepEqual(DateUtils.getAsDate(targetDate.getTime()), targetDate);
    });
  });

  describe('getDifference', function() {

    it('should return difference between 2 dates', function() {
      var daysToRemove = 5,
        secondsToRemove = 60 * 60 * 24 * daysToRemove,
        fromDate = new Date(),
        toDate = new Date();

      // Remove 5 days
      toDate.setDate(toDate.getDate() - daysToRemove);

      chai.assert.equal(DateUtils.getDifference(toDate, fromDate), secondsToRemove);
    });

    it('should return difference between date and now', function() {
      var daysToRemove = 20,
        secondsToRemove = 60 * 60 * 24 * daysToRemove,
        toDate = new Date();

      // Remove 5 days
      toDate.setDate(toDate.getDate() - daysToRemove);

      chai.assert.equal(DateUtils.getDifference(toDate), secondsToRemove);
    });
  });

  describe('getAsDifferenceString', function() {

    var dateTranslations;

    before(function() {

      dateTranslations = {
        sec_ago: ' seconds ago',
        min_ago: ' minutes ago',
        hour_ago: ' hours ago',
        day_ago: ' days ago'
      };

      Config.set({
        translations: {
          en: {
            date: dateTranslations
          }
        }
      });
    });

    it('should return seconds ago', function() {

      var secondsToRemove = 40,
        targetSeconds = DateUtils.getDifference((new Date()).getTime() - (secondsToRemove * 1000));

      chai.assert.equal(DateUtils.getAsDifferenceString(targetSeconds), secondsToRemove + dateTranslations.sec_ago);
    });

    it('should return minutes ago', function() {

      var secondsToRemove = 125,
        minutesToRemove = Math.floor(secondsToRemove / 60),
        targetSeconds = DateUtils.getDifference((new Date()).getTime() - (secondsToRemove * 1000));

      chai.assert.equal(DateUtils.getAsDifferenceString(targetSeconds), minutesToRemove + dateTranslations.min_ago);
    });

    it('should return hours ago', function() {

      var secondsToRemove = 5400,
        hoursToRemove = Math.floor(secondsToRemove / 60 / 60),
        targetSeconds = DateUtils.getDifference((new Date()).getTime() - (secondsToRemove * 1000));

      chai.assert.equal(DateUtils.getAsDifferenceString(targetSeconds), hoursToRemove + dateTranslations.hour_ago);
    });

    it('should return days ago', function() {

      var secondsToRemove = 144000,
        daysToRemove = Math.floor(secondsToRemove / 60 / 60 / 24),
        targetSeconds = DateUtils.getDifference((new Date()).getTime() - (secondsToRemove * 1000));

      chai.assert.equal(DateUtils.getAsDifferenceString(targetSeconds), daysToRemove + dateTranslations.day_ago);
    });
  });

  describe('formatDate', function() {

    it('should return date in finnish format', function() {

      var targetDate = new Date(2016, 2, 31, 14, 0, 0);

      chai.assert.equal(DateUtils.formatDate(targetDate), '31.3.2016 klo 14:00');
    });
  });
});
