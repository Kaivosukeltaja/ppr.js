import chai from 'chai';
import DateUtils from 'ppr.library.utils.date';
import Config from 'ppr.config';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.date', () => {
  describe('getAsDate', () => {
    it('should parse string from format 1', () => {
      const realDate = new Date(2016, 2, 31, 14, 0, 0);

      chai.assert.equal(
        DateUtils.getAsDate('2016-03-31 14:00:00').getTime(),
        realDate.getTime(),
      );
    });

    it('should parse string from format 2', () => {
      const realDate = new Date(2016, 2, 31, 14, 0, 0);

      chai.assert.equal(
        DateUtils.getAsDate('31.03.2016 14:00:00').getTime(),
        realDate.getTime(),
      );

      chai.assert.equal(
        DateUtils.getAsDate('31.3.2016 14:00:00').getTime(),
        realDate.getTime(),
      );
    });

    it('should parse string from format 3', () => {
      const realDate = new Date(2016, 2, 31, 5, 0, 0);

      chai.assert.equal(
        DateUtils.getAsDate('31.03.2016 5:00:00').getTime(),
        realDate.getTime(),
      );

      chai.assert.equal(
        DateUtils.getAsDate('31.3.2016 5:00:00').getTime(),
        realDate.getTime(),
      );
    });

    it('should try to instantiate date object even if format is unknown', () => {
      chai.assert.equal(
        DateUtils.getAsDate('2016-03-31T05:00:00+00:00').getTime(),
        1459400400000,
      );
    });

    it('should return object if first argument is already object', () => {
      const targetDate = new Date();

      chai.assert.deepEqual(DateUtils.getAsDate(targetDate), targetDate);
    });

    it('should return object if first argument is number', () => {
      const targetDate = new Date();

      chai.assert.deepEqual(DateUtils.getAsDate(targetDate.getTime()), targetDate);
    });
  });

  describe('getDifference', () => {
    it('should return difference between 2 dates', () => {
      const dateString = '2016/06/01';
      const daysToRemove = 5;
      const secondsToRemove = 60 * 60 * 24 * daysToRemove;
      const fromDate = new Date(dateString);
      const toDate = new Date(dateString);

      // Subtract days
      toDate.setDate(toDate.getDate() - daysToRemove);

      chai.assert.equal(DateUtils.getDifference(toDate, fromDate), secondsToRemove);
    });

    it('should return difference between date and now', () => {
      const secondsToRemove = 50;
      const toDate = new Date();

      // Remove seconds
      toDate.setSeconds(toDate.getSeconds() - secondsToRemove);

      chai.assert.equal(DateUtils.getDifference(toDate), secondsToRemove);
    });
  });

  describe('getAsDifferenceString', () => {
    let dateTranslations;

    before(() => {
      dateTranslations = {
        sec_ago: ' seconds ago',
        min_ago: ' minutes ago',
        hour_ago: ' hours ago',
        day_ago: ' days ago',
      };

      Config.set({
        translations: {
          en: {
            date: dateTranslations,
          },
        },
      });
    });

    it('should return seconds ago', () => {
      const secondsToRemove = 40;
      const targetSeconds = DateUtils.getDifference(
        (new Date()).getTime() - (secondsToRemove * 1000),
      );

      chai.assert.equal(
        DateUtils.getAsDifferenceString(targetSeconds),
        secondsToRemove + dateTranslations.sec_ago,
      );
    });

    it('should return minutes ago', () => {
      const secondsToRemove = 125;
      const minutesToRemove = Math.floor(secondsToRemove / 60);
      const targetSeconds = DateUtils.getDifference(
        (new Date()).getTime() - (secondsToRemove * 1000),
      );

      chai.assert.equal(
        DateUtils.getAsDifferenceString(targetSeconds),
        minutesToRemove + dateTranslations.min_ago,
      );
    });

    it('should return hours ago', () => {
      const secondsToRemove = 5400;
      const hoursToRemove = Math.floor(secondsToRemove / 60 / 60);
      const targetSeconds = DateUtils.getDifference(
        (new Date()).getTime() - (secondsToRemove * 1000),
      );

      chai.assert.equal(
        DateUtils.getAsDifferenceString(targetSeconds),
        hoursToRemove + dateTranslations.hour_ago,
      );
    });

    it('should return days ago', () => {
      const secondsToRemove = 144000;
      const daysToRemove = Math.floor(secondsToRemove / 60 / 60 / 24);
      const targetSeconds = DateUtils.getDifference(
        (new Date()).getTime() - (secondsToRemove * 1000),
      );

      chai.assert.equal(
        DateUtils.getAsDifferenceString(targetSeconds),
        daysToRemove + dateTranslations.day_ago,
      );
    });
  });

  describe('formatDate', () => {
    it('should return date in finnish format', () => {
      const targetDate = new Date(2016, 2, 31, 14, 0, 0);

      chai.assert.equal(DateUtils.formatDate(targetDate), '31.3.2016 klo 14:00');
    });
  });
});
