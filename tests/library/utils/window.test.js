var WindowUtils = require('../../../src/library/utils/window'),
  $ = require('jquery');

describe('ppr.library.utils.window', function() {

  'use strict';

  before(function() {

    // Set configurations
    WindowUtils.configList = {
      breakpoints: {
        xs: '< 400',
        s: '< 768',
        m: '> 767',
        notSupported: '= 600'
      },

      mobile_breakpoints: ['xs', 's']
    };
  });

  describe('#isBreakpoint', function() {

    it('should return true', function() {
      chai.expect(WindowUtils.isBreakpoint('m')).to.be.true;
    });

    it('should return false', function() {
      chai.expect(WindowUtils.isBreakpoint('l')).to.be.false;
    });
  });

  describe('#isMobile', function() {

    // PhantomJS default viewport width is 400
    if ($(window).innerWidth() === 400) {
      it('should return true', function() {
        chai.expect(WindowUtils.isMobile('m')).to.be.true;
      });
    }
  });

  describe('#matchBreakpoint', function() {

    it('should return false since breakpoint doenst exist', function() {
      chai.expect(WindowUtils.matchBreakpoint('xl')).to.be.false;
    });

    it('should return false since breakpoint doenst match', function() {
      chai.expect(WindowUtils.matchBreakpoint('m')).to.be.false;
    });

    it('should return false since operation is not supported', function() {
      chai.expect(WindowUtils.matchBreakpoint('notSupported')).to.be.false;
    });
  });

  describe('#transformations', function() {

    it('should return list of all transformations', function() {

      var transformation = 'translateX(-50%)';

      chai.assert.deepEqual(WindowUtils.transformations(transformation), {
        '-webkit-transform': transformation,
        '-moz-transform': transformation,
        '-ms-transform': transformation,
        '-o-transform': transformation,
        transform: transformation
      })
    });
  });

  describe('#whichTransitionEvent', function() {
    chai.expect(WindowUtils.whichTransitionEvent()).to.be.oneOf(['transitionend', 'oTransitionEnd', 'webkitTransitionEnd']);
  });
});
