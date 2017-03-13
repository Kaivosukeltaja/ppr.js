import chai from 'chai';
import _ from 'lodash';
import RequestUtils from 'ppr.library.utils.request';

const queryParameterTester = (url, params) => {
  it('#getQueryParam', () => {
    _.each(params, (value, key) => {
      chai.assert.strictEqual(RequestUtils.getQueryParam(key, null, url), value);
    });
  });

  it('#getQueryParams', () => {
    chai.assert.deepEqual(RequestUtils.getQueryParams(url), params);
  });
};

const testCases = [
  {
    url: 'https://www.google.fi',
    params: {},
  },
  {
    url: 'https://www.google.fi/?test=parameter&blaa=blaa',
    params: {
      test: 'parameter',
      blaa: 'blaa',
    },
  },
  {
    url: 'https://www.google.fi/?country=Spain#group-1',
    params: {
      country: 'Spain',
    },
  },
];

describe('ppr.library.utils.request', () => {
  describe('testCases', () => {
    _.each(testCases, (testCase) => {
      queryParameterTester(testCase.url, testCase.params);
    });
  });

  describe('defaultValue', () => {
    const defaultValue = 'defaultValue';

    chai.assert.strictEqual(RequestUtils.getQueryParam('wrongParameter', defaultValue, 'https://www.google.fi'), defaultValue);
  });
});
