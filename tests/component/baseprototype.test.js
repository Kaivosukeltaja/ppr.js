var ComponentBasePrototype = require('../../src/component/baseprototype'),
  PageBasePrototype = require('../../src/page/baseprototype'),
  EventBusPrototype = require('../../src/library/eventbusprototype'),
  _ = require('lodash');

'use strict';

/**
 * Helper function to test multiple components
 * @param {Object} componentNode
 * @param {Object} component
 * @param {Object} page
 * @param {Object} eventBus
 */
var componentTester = function(componentId, componentNode, component, page, eventBus) {
  var params = {};

  describe('initialize', function() {

    beforeEach(function() {
      params = {
        id: componentId,
        node: componentNode.clone(),
        name: 'base_prototype',
        eventBus: eventBus,
        page: page
      };
    });

    it('should initialize with min amount of params', function() {

      params.node = componentNode;

      component.initialize(params);

      chai.assert.equal(component.id, params.id);
      chai.assert.equal(component.name, params.name);
      chai.assert.deepEqual(component.data, {});
      chai.expect(component.href).to.be.null;
    });

    it('should initialize with data', function() {

      var testData = {
        testProperty: true,
        testProperty2: false
      };

      params.node.attr(
        'data-component-data', JSON.stringify(testData)
      );

      component.reset();
      component.initialize(params);

      chai.assert.equal(component.id, params.id);
      chai.assert.equal(component.name, params.name);
      chai.assert.deepEqual(component.data, testData);
      chai.expect(component.href).to.be.null;
    });

    it('should initialize with href', function() {

      var componentHref = 'https://www.google.com';

      params.node.attr({
        'data-component-href': componentHref,
        'data-component-data': ''
      });

      component.reset();
      component.initialize(params);

      chai.assert.equal(component.id, params.id);
      chai.assert.equal(component.name, params.name);
      chai.assert.deepEqual(component.data, {});
      chai.assert.equal(component.href, componentHref);
    });

    it('should not have any required modules', function() {
      chai.expect(component.getRequiredModules()).to.have.length(0);
    });

    it('should be buildable', function(done) {

      component.isBuildable().then(function() {
        done();
      });
    });
  });

  describe('build', function() {

    before(function() {

      // Save reference to page
      page.components[component.id] = component;

      component.initialize(params);
    });

    it('should not be built', function() {
      chai.expect(component.isBuilt).to.be.false;
    });

    it('should build', function() {

      component.build();
      component.afterBuild();

      chai.expect(component.isBuilt).to.be.true;
    });
  });
};

describe('ppr.component.base_prototype', function() {

  describe('standalone component', function() {

    var pageNode, componentNode, component,
      page, eventBus;

    // Build nodes
    pageNode = $('<body>');
    componentNode = $('<div>').attr('data-component', '').appendTo(pageNode);

    component = new function() { return _.cloneDeep(ComponentBasePrototype); };
    page = new function() { return _.cloneDeep(PageBasePrototype); };

    eventBus = new EventBusPrototype;

    // Initialize page
    page.initialize({
      node: pageNode,
      name: 'base_prototype'
    });

    componentTester(_.uniqueId('Component_'), componentNode, component, page, eventBus);

    it('should allow adding messages', function() {
      component.setModuleMessages({ test_module: { MODULE_TEST_MESSAGE: 'module_test_message' }});

      chai.expect(_.keys(component.messages)).to.have.length(1);
    });

    describe('references', function() {

      it('should not have any child components', function() {
        chai.expect(component.getChildren()).to.have.length(0);
      });

      it('should not have parent component', function() {
        chai.expect(component.getParent()).to.be.null;
      });
    });
  });

  describe('component with references', function() {

    var pageNode, childComponentNode, childComponent, childComponentId,
      parentComponentNode, parentComponent, rootPage, eventBus, componentId,
      secondChildComponentNode, secondChildComponent, secondChildComponentId;

    // Build nodes
    pageNode = $('<div>');
    parentComponentNode = $('<div>').attr('data-component', '').appendTo(pageNode);
    childComponentNode = $('<div>').attr('data-component', '');
    secondChildComponentNode = $('<div>').attr('data-component', '');

    componentId = _.uniqueId('Component_');
    childComponentId = _.uniqueId('Component_');
    secondChildComponentId = _.uniqueId('Component_');

    parentComponent = new function() { return _.cloneDeep(ComponentBasePrototype); };
    childComponent = new function() { return _.cloneDeep(ComponentBasePrototype); };
    secondChildComponent = new function() { return _.cloneDeep(ComponentBasePrototype); };
    rootPage = new function() { return _.cloneDeep(PageBasePrototype); };
    eventBus = new EventBusPrototype;

    // Initialize page
    rootPage.initialize({
      node: pageNode,
      name: 'base_prototype'
    });

    componentTester(componentId, parentComponentNode, parentComponent, rootPage, eventBus);

    childComponent.initialize({ node: childComponentNode, id: childComponentId, name: 'base_prototype', eventBus: eventBus, page: rootPage });
    secondChildComponent.initialize({ node: secondChildComponentNode, id: secondChildComponentId, name: 'base_prototype', eventBus: eventBus, page: rootPage });

    describe('references', function() {

      before(function() {

        // Save references
        rootPage.components[childComponentId] = childComponent;
        rootPage.components[secondChildComponentId] = secondChildComponent;

        childComponent.node.appendTo(parentComponent.node);
        secondChildComponent.node.appendTo(childComponent.node);
      });


      it('should have one child component', function() {
        chai.expect(parentComponent.getChildren()).to.have.length(1);
        chai.assert.equal(_.first(parentComponent.getChildren()).id, childComponent.id);
      });

      it('should have parent component', function() {
        chai.expect(childComponent.getParent()).to.be.a('object');
        chai.assert.equal(childComponent.getParent().id, parentComponent.id);
      });
    })
  });
});
