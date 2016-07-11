var Config = require('../src/ppr.config'),
  _ = require('lodash');

'use strict';

describe('ppr.config', function() {

  var expectedConfiguration = {
    config1: 'Value 1',
    config2: true,
    config3: 15,
    config4: {
      config1: 'Value 1',
      config2: true,
      config3: 15
    }
  };

  before(function() {
    Config.reset();
    Config.set(expectedConfiguration);
  });

  it('should have configurations', function() {
    chai.expect(_.keys(Config.getAll())).to.have.length(4);
  });

  it('should allow setting single configuration', function() {
    Config.set('config5', 'disabled');

    chai.expect(_.keys(Config.getAll())).to.have.length(5);
  });

  it('should allow setting single configuration with dot notation', function() {
    Config.set('config6.config1', 'enabled');

    chai.expect(_.keys(Config.getAll())).to.have.length(6);
  });

  it('should allow getting single configuration', function() {
    chai.assert.equal(Config.get('config5'), 'disabled');
  });

  it('should allow getting configuration with default value', function() {
    chai.assert.equal(Config.get('config10', 'disabled'), 'disabled');
  });

  it('should allow getting single configuration with dot notation', function() {
    chai.assert.equal(Config.get('config6.config1'), 'enabled');
  });

  it('should allow resetting configuration', function() {
    Config.reset();
    chai.expect(_.keys(Config.getAll())).to.have.length(0);
    Config.set(expectedConfiguration);
  });

  it('should allow getting all configurations at once', function() {
    chai.assert.deepEqual(expectedConfiguration, Config.getAll());
  });
});
