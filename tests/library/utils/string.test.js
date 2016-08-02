var StringUtils = require('../../../src/library/utils/string'),
  _ = require('lodash');

describe('ppr.library.utils.string', function() {

  'use strict';

  describe('#generateHash', function() {

    it('should calculate hash', function() {
      chai.expect(StringUtils.generateHash('https://www.google.fi')).to.be.a('number');
      chai.assert.equal(StringUtils.generateHash(''), 0);
    });
  });

  describe('#getAsPlainText', function() {

    it('should return html as plain text', function() {

      var expectedString = 'This is test string without HTML',
        htmlString = '<p>' + expectedString +'</p>';

      chai.assert.equal(StringUtils.getAsPlainText(htmlString), expectedString);
    });
  });

  describe('#linkifyHashTags', function() {
    var testString = 'This is test string! #test #string',
      testElement = $('<span>'),
      mediaUrls = {
        twitter: 'https://twitter',
        instagram: 'https://www.instagram',
        facebook: 'https://www.facebook'
      },
      mediaTester;

    mediaTester = function (media) {
      testElement.html(StringUtils.linkifyHashTags(testString, media));

      var links = testElement.find('a'),
        targetLink;

      chai.expect(links).to.have.length(2);

      targetLink = links.first();
      chai.assert(_.startsWith(targetLink.attr('href'), mediaUrls[media]));
    };

    it('should contain link to twitter', function () {
      mediaTester('twitter');
    });

    it('should contain link to instagram', function () {
      mediaTester('instagram');
    });

    it('should contain link to facebook', function () {
      mediaTester('facebook');
    });

    it('should return same string', function () {
      chai.assert.strictEqual(StringUtils.linkifyHashTags(testString, 'wrongMedia'), testString);
    });
  });

  describe('#replaceWithVariables', function() {
    it('should replace variables with parameters', function () {
      var sourceString = 'Target id :id, successfully done in :seconds seconds',
        resultString = 'Target id 254, successfully done in 64 seconds';

      chai.assert.equal(StringUtils.replaceVariablesWithParameters(sourceString, {id: 254, seconds: 64}), resultString);
    });
  });
});
