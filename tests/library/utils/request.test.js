var RequestUtils = require('../../../src/library/utils/request');

describe('ppr.library.utils.request', function() {

  'use strict';

  describe('#getQueryParam', function() {
    var testParameter = 'testParameter',
      testValue = 'testValue',
      testUrl = 'http://www.google.fi/?' + testParameter + '=' + testValue;

    it('should return query parameter', function() {
      chai.assert.strictEqual(RequestUtils.getQueryParam(testParameter, null, testUrl), testValue);
    });

    it('should return default parameter', function() {
      chai.assert.strictEqual(RequestUtils.getQueryParam('wrongParameter', testValue, testUrl), testValue);
    });
  });

  describe('#getQueryParams', function() {
    var testUrl,
      testParameters = {
        firstTest: 'firstTestingValue',
        secondTest: 'secondTestingValue'
      };

    testUrl = 'http://www.google.fi/?' + $.param(testParameters);

    it('should return list of query parameters', function() {
      chai.assert.deepEqual(RequestUtils.getQueryParams(testUrl), testParameters);
    });
  });


});
