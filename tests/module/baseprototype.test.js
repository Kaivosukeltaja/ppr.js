import _ from 'lodash';
import chai from 'chai';
import BasePrototype from 'ppr.module.baseprototype';
import EventBusPrototype from 'ppr.library.eventbusprototype';

/* eslint-disable no-unused-expressions */
describe('ppr.module.baseprototype', () => {
  const moduleConfiguration = {
    testProperty: true,
  };

  const eventBusInstance = new EventBusPrototype();
  const moduleInstance = BasePrototype;
  moduleInstance.initialize(moduleConfiguration, eventBusInstance);

  describe('#initialize', () => {
    it('should have instance of eventBus and given configuration', () => {
      chai.assert.deepEqual(moduleInstance.configList, moduleConfiguration);
      chai.expect(moduleInstance.eventBus).to.be.a('object');
    });
  });

  describe('#getMessages', () => {
    before(() => {
      moduleInstance.messages = {
        MODULE_MESSAGE_1: 'module_message_1',
      };
    });

    it('should return list of messages', () => {
      chai.expect(_.keys(moduleInstance.getMessages())).to.have.length(1);
    });
  });
});
