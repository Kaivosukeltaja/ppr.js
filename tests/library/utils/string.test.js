import _ from 'lodash';
import $ from 'jquery';
import chai from 'chai';
import StringUtils from 'ppr.library.utils.string';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.string', () => {
  describe('#generateHash', () => {
    it('should calculate hash', () => {
      chai.expect(StringUtils.generateHash('https://www.google.fi')).to.be.a('number');
      chai.assert.equal(StringUtils.generateHash(''), 0);
    });
  });

  describe('#getAsPlainText', () => {
    it('should return html as plain text', () => {
      const expectedString = 'This is test string without HTML';
      const htmlString = `<p>${expectedString}</p>`;

      chai.assert.equal(StringUtils.getAsPlainText(htmlString), expectedString);
    });
  });

  describe('#linkifyHashTags', () => {
    const testString = 'This is test string! #test #string';
    const testElement = $('<span>');
    const mediaUrls = {
      twitter: 'https://twitter',
      instagram: 'https://www.instagram',
      facebook: 'https://www.facebook',
    };

    const mediaTester = (media) => {
      testElement.html(StringUtils.linkifyHashTags(testString, media));

      const links = testElement.find('a');
      chai.expect(links).to.have.length(2);

      const targetLink = links.first();
      chai.assert(_.startsWith(targetLink.attr('href'), mediaUrls[media]));
    };

    it('should contain link to twitter', () => {
      mediaTester('twitter');
    });

    it('should contain link to instagram', () => {
      mediaTester('instagram');
    });

    it('should contain link to facebook', () => {
      mediaTester('facebook');
    });

    it('should return same string', () => {
      chai.assert.strictEqual(StringUtils.linkifyHashTags(testString, 'wrongMedia'), testString);
    });
  });

  describe('#replaceWithVariables', () => {
    it('should replace variables with parameters', () => {
      const sourceString = 'Target id :id, successfully done in :seconds seconds';
      const resultString = 'Target id 254, successfully done in 64 seconds';

      chai.assert.equal(
        StringUtils.replaceVariablesWithParameters(sourceString, { id: 254, seconds: 64 }),
        resultString,
      );
    });
  });
});
