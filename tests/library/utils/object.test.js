'use strict';

var ObjectUtils = require('../../../src/library/utils/object');

describe('ppr.library.utils.object', function() {

  describe('json convertation', function() {

    it('should convert valid string into object', function() {
      var targetObject = {
        firstObject: {
          firstProperty: true,
          secondProperty: false
        },
        secondObject: {
          firstProperty: 'string'
        }
      };

      chai.assert.deepEqual(ObjectUtils.parseJSON('{"firstObject":{"firstProperty":true,"secondProperty":false},"secondObject":{"firstProperty":"string"}}'), targetObject);
    });

    it('should return empty object in case of failure', function() {
      chai.assert.deepEqual(ObjectUtils.parseJSON('{"firstObject":{"firstProperty":true,"secondProperty":false},"secondObject":{"firstProperty":string}}'), {});
    });

    it('should return given object if first argument is object', function() {

      var targetObject = { test: true };

      chai.assert.deepEqual(ObjectUtils.parseJSON(targetObject), targetObject);
    });

    it('should return object in string format', function() {

      var targetObject = {
        firstObject: {
          firstProperty: true,
          secondProperty: false
        },
        secondObject: {
          firstProperty: 'string'
        }
      };

      chai.assert.equal(ObjectUtils.stringify(targetObject), '{"firstObject":{"firstProperty":true,"secondProperty":false},"secondObject":{"firstProperty":"string"}}');
    });

    it('should return same string if first argument is string', function() {

      var targetString = '{"test": true}';

      chai.assert.equal(ObjectUtils.stringify(targetString), targetString);
    });
  });
});
