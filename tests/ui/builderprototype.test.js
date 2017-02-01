import sinon from 'sinon';
import chai from 'chai';
import BuilderPrototype from 'ppr.ui.builderprototype';

const buildSpy = sinon.spy();

class SecondBuilder extends BuilderPrototype {
  build() {
    return buildSpy();
  }
}

/* eslint-disable no-unused-expressions */
describe('ppr.ui.builderprototype', () => {
  const builderInstance = SecondBuilder;

  describe('#shouldBuild', () => {
    it('should return true', () => {
      chai.expect(builderInstance.shouldBuild()).to.be.true;
    });
  });

  describe('#getDependencies', () => {
    it('should return empty list of dependencies', () => {
      chai.expect(builderInstance.getDependencies()).to.have.length(0);
    });
  });

  describe('#initialize', () => {
    it('should not build if shouldBuild returns false', () => {
      builderInstance.shouldBuild = () => false;
      chai.expect(builderInstance.initialize()).to.be.false;

      builderInstance.shouldBuild = () => true;
    });

    it('should trigger build function', () => {
      builderInstance.initialize();
      chai.expect(buildSpy.called).to.be.true;
    });
  });
});
