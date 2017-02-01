import chai from 'chai';
import Loader from 'ppr.library.utils.loader';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.loader', () => {
  it('should not support AMD', () => {
    chai.expect(Loader.hasAMDSupport()).to.be.false;
  });

  it('should support CommonJS', () => {
    //chai.expect(Loader.hasCommonSupport()).to.be.true;
  });
});
