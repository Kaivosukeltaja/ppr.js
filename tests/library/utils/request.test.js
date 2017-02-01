import chai from 'chai';
import $ from 'jquery';
import RequestUtils from 'ppr.library.utils.request';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.request', () => {
  describe('#getQueryParam', () => {
    const testParameter = 'testParameter';
    const testValue = 'testValue';
    const testUrl = `http://www.google.fi/?${testParameter}=${testValue}`;

    it('should return query parameter', () => {
      chai.assert.strictEqual(RequestUtils.getQueryParam(testParameter, null, testUrl), testValue);
    });

    it('should return default parameter', () => {
      chai.assert.strictEqual(RequestUtils.getQueryParam('wrongParameter', testValue, testUrl), testValue);
    });
  });

  describe('#getQueryParams', () => {
    const testParameters = {
      firstTest: 'firstTestingValue',
      secondTest: 'secondTestingValue',
    };

    const testUrl = `http://www.google.fi/?${$.param(testParameters)}`;

    it('should return list of query parameters', () => {
      chai.assert.deepEqual(RequestUtils.getQueryParams(testUrl), testParameters);
    });
  });
});
