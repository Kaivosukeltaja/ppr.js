var EventBusPrototype = require('../../src/library/eventbusprototype'),
  _ = require('lodash');

'use strict';

describe('ppr.library.eventbusprototype', function() {
  var EventBus,
    testEvent = sinon.spy(),
    testEventId,
    testEventScope;

  before(function() {
    EventBus = new EventBusPrototype;

    testEventScope = this;
  });

  it('should allow subscribing to events', function() {
    testEventId = EventBus.subscribe(testEventScope, 'my_event', function() {});
    chai.expect(_.keys(EventBus.getEventsByMessage('my_event'))).to.have.length(1);

    EventBus.subscribe(testEventScope, 'test_event', testEvent);
  });

  it('should allow unsubscribing event', function() {
    chai.expect(EventBus.unsubscribe(testEventId)).to.be.true;
    chai.expect(_.keys(EventBus.getEventsByMessage('my_event'))).to.have.length(0);
  })

  it('should publish event', function() {
    EventBus.publish('test_event', 'test');
    chai.expect(testEvent.called).to.be.true;
  });

  it('should return list of all events', function() {
    chai.expect(_.keys(EventBus.getEvents())).to.have.length(1);
  });
});
