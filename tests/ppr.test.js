var PPR = require('../src/ppr'),
  Config = require('../src/ppr.config'),
  $ = require('jquery');

'use strict';

describe('ppr', function() {

  describe('#build', function() {

    describe('#buildPage', function() {

      before(function() {
        PPR.build();
      });

      it('should save reference to active page instance', function() {
        chai.expect(PPR.page_instance).to.be.a('object');
      });
    });
  });

  describe('#setConfig', function() {

    it('should set configuration', function() {

      var expectedConfiguration = 'testing';

      PPR.setConfig({
        test: expectedConfiguration
      });

      chai.assert.equal(expectedConfiguration, Config.get('test'));
    });
  });

  describe('#loadConfig', function() {

    describe('success', function() {
      beforeEach(function() {
        sinon.stub($, 'ajax').yieldsTo('success', {
          testing: 'test'
        });
      });

      afterEach(function() {
        $.ajax.restore();
      });

      it('should load configuration', function(done) {
        PPR.loadConfig('config.json').then(function() {
          chai.assert.equal('test', Config.get('testing'));
          done();
        });
      });
    });

    describe('failure', function() {

      beforeEach(function() {
        sinon.stub($, 'ajax').yieldsTo('fail');
      });

      afterEach(function() {
        $.ajax.restore();
      });

      it('should load configuration', function(done) {
        PPR.loadConfig('config.json').fail(function(error) {
          chai.assert.equal(error, 'Load configuration failed');
          done();
        });
      })
    });
  });
});
