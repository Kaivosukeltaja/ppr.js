import PPR from 'ppr';
import Config from 'ppr.config';
import $ from 'jquery';
import chai from 'chai';
import sinon from 'sinon';

describe('ppr', () => {
  describe('#build', () => {
    describe('#buildPage', () => {
      before(() => {
        PPR.build();
      });

      it('should save reference to active page instance', () => {
        chai.expect(PPR.page_instance).to.be.a('object');
      });
    });
  });

  describe('#setConfig', () => {
    it('should set configuration', () => {
      const expectedConfiguration = 'testing';

      PPR.setConfig({
        test: expectedConfiguration,
      });

      chai.assert.equal(expectedConfiguration, Config.get('test'));
    });
  });

  describe('#loadConfig', () => {
    describe('success', () => {
      beforeEach(() => {
        sinon.stub($, 'ajax').yieldsTo('success', {
          testing: 'test',
        });
      });

      afterEach(() => {
        $.ajax.restore();
      });

      it('should load configuration', (done) => {
        PPR.loadConfig('config.json').then(() => {
          chai.assert.equal('test', Config.get('testing'));
          done();
        });
      });
    });

    describe('failure', () => {
      beforeEach(() => {
        sinon.stub($, 'ajax').yieldsTo('fail');
      });

      afterEach(() => {
        $.ajax.restore();
      });

      it('should load configuration', (done) => {
        PPR.loadConfig('config.json').fail((error) => {
          chai.assert.equal(error, 'Load configuration failed');
          done();
        });
      });
    });
  });
});
