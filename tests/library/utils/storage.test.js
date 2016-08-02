var StorageUtils = require('../../../src/library/utils/storage');

describe('ppr.library.utils.storage', function() {

  'use strict';

  before(function() {
    window.localStorage.clear();
  });

  describe('#isSupported', function() {
    it('should be supported', function() {
      chai.expect(StorageUtils.isSupported()).to.be.true;
    });
  });

  describe('#set', function() {
    it('should store normal variable into local storage', function() {
      StorageUtils.set('test', 'testing');

      chai.assert.equal(window.localStorage.getItem('test'), 'testing');
    });

    it('should store json object', function() {
      var testObject = { test: true };

      StorageUtils.set('jsonObject', testObject);

      chai.assert.deepEqual(StorageUtils.get('jsonObject'), testObject);
    });
  });

  describe('#get', function() {
    it('should allow getting variable', function() {
      chai.assert.equal(window.localStorage.getItem('test'), StorageUtils.get('test'));
    });
  });

  it('should return null when not supported', function() {

    StorageUtils.configList.enabled = false;

    chai.assert.equal(StorageUtils.set('test', true), null);
    chai.assert.equal(StorageUtils.get('test'), null);

    StorageUtils.configList.enabled = true;
  });
});
