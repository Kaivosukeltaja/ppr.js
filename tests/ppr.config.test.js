import _ from 'lodash';
import chai from 'chai';
import Config from 'ppr.config';

describe('ppr.config', () => {
  const expectedConfiguration = {
    config1: 'Value 1',
    config2: true,
    config3: 15,
    config4: {
      config1: 'Value 1',
      config2: true,
      config3: 15,
    },
  };

  before(() => {
    Config.reset();
    Config.set(expectedConfiguration);
  });

  it('should have configurations', () => {
    chai.expect(_.keys(Config.getAll())).to.have.length(4);
  });

  it('should allow setting single configuration', () => {
    Config.set('config5', 'disabled');

    chai.expect(_.keys(Config.getAll())).to.have.length(5);
  });

  it('should allow setting single configuration with dot notation', () => {
    Config.set('config6.config1', 'enabled');

    chai.expect(_.keys(Config.getAll())).to.have.length(6);
  });

  it('should allow getting single configuration', () => {
    chai.assert.equal(Config.get('config5'), 'disabled');
  });

  it('should allow getting configuration with default value', () => {
    chai.assert.equal(Config.get('config10', 'disabled'), 'disabled');
  });

  it('should allow getting single configuration with dot notation', () => {
    chai.assert.equal(Config.get('config6.config1'), 'enabled');
  });

  it('should allow resetting configuration', () => {
    Config.reset();
    chai.expect(_.keys(Config.getAll())).to.have.length(0);
    Config.set(expectedConfiguration);
  });

  it('should allow getting all configurations at once', () => {
    chai.assert.deepEqual(expectedConfiguration, Config.getAll());
  });
});
