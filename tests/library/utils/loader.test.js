var Loader = require('../../../src/library/utils/loader');

describe('ppr.library.utils.loader', function() {

  'use strict';

  it('should not support AMD', function() {
    chai.expect(Loader.hasAMDSupport()).to.be.false;
  });

  it('should support CommonJS', function() {
    chai.expect(Loader.hasCommonSupport()).to.be.true;
  });
});
