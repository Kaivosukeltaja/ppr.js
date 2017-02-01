import _ from 'lodash';
import $ from 'jquery';
import chai from 'chai';
import assert from 'assert';
import { getComponentNode, getComponentInstance } from 'ppr.tests.helper.component';
import { getPageInstance, buildPageInstance } from 'ppr.tests.helper.page';

/* eslint-disable no-unused-expressions */

describe('ppr.component.baseprototype', () => {
  describe('component without data', () => {
    const pageNode = $('<div>');
    const pageInstance = getPageInstance(pageNode);

    buildPageInstance(pageInstance);

    const componentNode = getComponentNode(pageInstance);
    const componentInstance = getComponentInstance(pageInstance, componentNode);

    it('should be initialized correctly', () => {
      chai.expect(componentInstance.id).to.be.not.null;
      assert.equal(componentInstance.name, 'baseprototype');
      chai.expect(componentInstance.page).to.be.a('object');
      chai.expect(componentInstance.eventBus).to.be.a('object');
    });

    it('should be buildable', (done) => {
      componentInstance.isBuildable().then(() => {
        done();
      });
    });

    it('should allow adding messages', () => {
      componentInstance.setModuleMessages({ test_module: { MODULE_TEST_MESSAGE: 'module_test_message' } });

      chai.expect(_.keys(componentInstance.messages)).to.have.length(1);
    });
  });

  describe('component with data', () => {
    const pageNode = $('<div>');
    const pageInstance = getPageInstance(pageNode);

    buildPageInstance(pageInstance);

    const componentNode = getComponentNode(pageInstance, true);
    const componentInstance = getComponentInstance(pageInstance, componentNode);

    it('should be initialized correctly', () => {
      chai.expect(componentInstance.data).has.property('test');
      assert.equal(componentInstance.data.test, 'testing');
    });
  });

  describe('standalone component', () => {
    const pageNode = $('<div>');
    const pageInstance = getPageInstance(pageNode);

    buildPageInstance(pageInstance);

    const componentNode = getComponentNode(pageInstance);
    const componentInstance = getComponentInstance(pageInstance, componentNode);

    describe('references', () => {
      it('should not have any child components', () => {
        chai.expect(componentInstance.getChildren()).to.have.length(0);
      });

      it('should not have parent component', () => {
        chai.expect(componentInstance.getParent()).to.be.null;
      });
    });
  });

  describe('component with parent component', () => {
    const pageNode = $('<div>');
    const pageInstance = getPageInstance(pageNode);

    buildPageInstance(pageInstance);

    const parentComponentNode = getComponentNode(pageInstance);
    const parentComponentInstance = getComponentInstance(
      pageInstance, parentComponentNode,
    );

    const childComponentNode = getComponentNode(parentComponentInstance);
    const childComponentInstance = getComponentInstance(
      pageInstance, childComponentNode,
    );

    const secondChildComponentNode = getComponentNode(childComponentNode);
    const secondChildComponentInstance = getComponentInstance(
      childComponentInstance, secondChildComponentNode,
    );

    describe('references', () => {
      before(() => {
        pageInstance.components[parentComponentInstance.id] = parentComponentInstance;
        pageInstance.components[childComponentInstance.id] = childComponentInstance;
        pageInstance.components[secondChildComponentInstance.id] = secondChildComponentInstance;
      });

      it('should have one child component', () => {
        chai.expect(parentComponentInstance.getChildren()).to.have.length(1);

        chai.assert.equal(
          _.first(parentComponentInstance.getChildren()).id,
          childComponentInstance.id,
        );
      });

      it('should have parent component', () => {
        chai.expect(childComponentInstance.getParent()).to.be.a('object');
        chai.assert.equal(childComponentInstance.getParent().id, parentComponentInstance.id);
      });
    });
  });
});

export default {

};
