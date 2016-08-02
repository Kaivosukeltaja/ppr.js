var BasePrototype = require('../../src/module/baseprototype'),
  EventBusPrototype = require('../../src/library/eventbusprototype'),
  $ = require('jquery'),
  _ = require('lodash');

describe('ppr.module.baseprototype', function() {

  'use strict';

  var moduleInstance,
    eventBusInstance;

  before(function() {
    moduleInstance = new function() {
      return $.extend(true, {}, BasePrototype, {});
    };

    eventBusInstance = new EventBusPrototype();
  });

  describe('#initialize', function() {

    var configuration = {
      testProperty: true
    };

    it('should initialize correctly', function() {
      chai.expect(moduleInstance.initialize(configuration, eventBusInstance)).to.be.true;
    });

    it('should have instance of eventBus and given configuration', function() {
      chai.assert.deepEqual(moduleInstance.configList, configuration);
      chai.expect(moduleInstance.eventBus).to.be.a('object');
    });

    it('should not initialize again', function() {
      chai.expect(moduleInstance.initialize()).to.be.false;
    });
  });

  describe('#getMessages', function() {

    before(function() {
      moduleInstance.messages = {
        MODULE_MESSAGE_1: 'module_message_1'
      };
    });

    it('should return list of messages', function() {
      chai.expect(_.keys(moduleInstance.getMessages())).to.have.length(1);
    });
  });
});
