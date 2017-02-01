import $ from 'jquery';
import chai from 'chai';
import WindowUtils from 'ppr.library.utils.window';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.window', () => {
  before(() => {
    // Set configurations
    WindowUtils.configList = {
      breakpoints: {
        xs: '< 400',
        s: '< 768',
        m: '> 767',
        notSupported: '= 600',
      },

      mobile_breakpoints: ['xs', 's'],
    };
  });

  describe('#isBreakpoint', () => {
    it('should return true', () => {
      chai.expect(WindowUtils.isBreakpoint('m')).to.be.true;
    });

    it('should return false', () => {
      chai.expect(WindowUtils.isBreakpoint('l')).to.be.false;
    });
  });

  describe('#isMobile', () => {
    // PhantomJS default viewport width is 400
    if ($(window).innerWidth() === 400) {
      it('should return true', () => {
        chai.expect(WindowUtils.isMobile('m')).to.be.true;
      });
    }
  });

  describe('#matchBreakpoint', () => {
    it('should return false since breakpoint doenst exist', () => {
      chai.expect(WindowUtils.matchBreakpoint('xl')).to.be.false;
    });

    it('should return false since breakpoint doenst match', () => {
      chai.expect(WindowUtils.matchBreakpoint('m')).to.be.false;
    });

    it('should return false since operation is not supported', () => {
      chai.expect(WindowUtils.matchBreakpoint('notSupported')).to.be.false;
    });
  });

  describe('#transformations', () => {
    it('should return list of all transformations', () => {
      const transformation = 'translateX(-50%)';

      chai.assert.deepEqual(WindowUtils.transformations(transformation), {
        '-webkit-transform': transformation,
        '-moz-transform': transformation,
        '-ms-transform': transformation,
        '-o-transform': transformation,
        transform: transformation,
      });
    });
  });

  describe('#whichTransitionEvent', () => {
    chai.expect(WindowUtils.whichTransitionEvent()).to.be.oneOf(['transitionend', 'oTransitionEnd', 'webkitTransitionEnd']);
  });
});
