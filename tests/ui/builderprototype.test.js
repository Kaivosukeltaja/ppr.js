var BuilderPrototype = require('../../src/ui/builderprototype'),
  $ = require('jquery');

describe('ppr.ui.builderprototype', function() {

  'use strict';

  var builderInstance,
    buildSpy = sinon.spy();

  before(function() {
    builderInstance = $.extend(true, {}, BuilderPrototype, {

      build: buildSpy
    });
  });

  describe('#shouldBuild', function() {

    it('should return true', function() {
      chai.expect(builderInstance.shouldBuild()).to.be.true;
    })
  });

  describe('#getDependencies', function() {

    it('should return empty list of dependencies', function() {
      chai.expect(builderInstance.getDependencies()).to.have.length(0);
    });
  });

  describe('#initialize', function() {

    it('should not build if shouldBuild returns false', function() {

      // Override with false
      builderInstance.shouldBuild = function() { return false; };

      chai.expect(builderInstance.initialize()).to.be.false;

      // Return to original state
      builderInstance.shouldBuild = function() { return true; };
    });

    it('should trigger build function', function() {

      builderInstance.initialize();

      chai.expect(buildSpy.called).to.be.true;
    });
  });
});
