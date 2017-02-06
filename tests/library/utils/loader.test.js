import chai from 'chai';
import $ from 'jquery';
import Loader from 'ppr.library.utils.loader';
import ComponentBasePrototype from 'ppr.component.baseprototype';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.loader', () => {
  it('should not support AMD', () => {
    chai.expect(Loader.hasAMDSupport()).to.be.false;
  });

  it('should load dependency', (done) => {
    Loader.load(['ppr.component.baseprototype'], (BasePrototype) => {
      chai.expect(new BasePrototype($('<div>'))).to.be.instanceof(ComponentBasePrototype);
      done();
    });
  });
});
