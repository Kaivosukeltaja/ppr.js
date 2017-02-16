import chai from 'chai';
import StorageUtils from 'ppr.library.utils.storage';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.storage', () => {
  before(() => {
    window.localStorage.clear();
  });

  describe('#isSupported', () => {
    it('should be supported', () => {
      chai.expect(StorageUtils.isSupported()).to.be.true;
    });
  });

  describe('#set', () => {
    it('should store normal variable into local storage', () => {
      StorageUtils.set('test', 'testing');

      chai.assert.equal(window.localStorage.getItem('test'), 'testing');
    });

    it('should store json object', () => {
      const testObject = { test: true };

      StorageUtils.set('jsonObject', testObject);

      chai.assert.deepEqual(StorageUtils.get('jsonObject'), testObject);
    });
  });

  describe('#get', () => {
    it('should allow getting variable', () => {
      chai.assert.equal(window.localStorage.getItem('test'), StorageUtils.get('test'));
    });
  });

  it('should return false when not supported', () => {
    StorageUtils.configList.enabled = false;

    chai.assert.equal(StorageUtils.set('test', true), false);
    chai.assert.equal(StorageUtils.get('test'), null);

    StorageUtils.configList.enabled = true;
  });
});
