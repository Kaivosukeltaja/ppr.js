var ppr = require('../src/ppr'),
  Config = require('../src/ppr.config'),
  $ = require('jquery');

'use strict';

describe('ppr', function() {

  describe('ppr.setConfig', function() {

    it('should set configuration', function() {

      var expectedConfiguration = 'testing';

      ppr.setConfig({
        test: expectedConfiguration
      });

      chai.assert.equal(expectedConfiguration, Config.get('test'));
    });
  });

  describe('ppr.loadConfig', function() {

    beforeEach(function() {
      sinon.stub($, 'ajax').yieldsTo('success', {
        testing: 'test'
      });
    });

    afterEach(function() {
      $.ajax.restore();
    });

    it('should load configuration', function(done) {
      ppr.loadConfig('config.json').then(function() {
        chai.assert.equal('test', Config.get('testing'));
        done();
      });
    });
  });
});
