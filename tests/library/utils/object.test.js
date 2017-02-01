import chai from 'chai';
import ObjectUtils from 'ppr.library.utils.object';

/* eslint-disable no-unused-expressions */
describe('ppr.library.utils.object', () => {
  describe('json convertation', () => {
    it('should convert valid string into object', () => {
      const targetObject = {
        firstObject: {
          firstProperty: true,
          secondProperty: false,
        },
        secondObject: {
          firstProperty: 'string',
        },
      };

      chai.assert.deepEqual(
        ObjectUtils.parseJSON('{"firstObject":{"firstProperty":true,"secondProperty":false},"secondObject":{"firstProperty":"string"}}'),
        targetObject,
      );
    });

    it('should return empty object in case of failure', () => {
      chai.assert.deepEqual(
        ObjectUtils.parseJSON('{"firstObject":{"firstProperty":true,"secondProperty":false},"secondObject":{"firstProperty":string}}'),
        {},
      );
    });

    it('should return given object if first argument is object', () => {
      const targetObject = { test: true };

      chai.assert.deepEqual(ObjectUtils.parseJSON(targetObject), targetObject);
    });

    it('should return object in string format', () => {
      const targetObject = {
        firstObject: {
          firstProperty: true,
          secondProperty: false,
        },
        secondObject: {
          firstProperty: 'string',
        },
      };

      chai.assert.equal(
        ObjectUtils.stringify(targetObject),
        '{"firstObject":{"firstProperty":true,"secondProperty":false},"secondObject":{"firstProperty":"string"}}',
      );
    });

    it('should return same string if first argument is string', () => {
      const targetString = '{"test": true}';

      chai.assert.equal(ObjectUtils.stringify(targetString), targetString);
    });
  });
});
