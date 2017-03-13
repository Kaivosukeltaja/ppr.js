import $ from 'jquery';
import chai from 'chai';
import sinon from 'sinon';
import { getComponentNode, getComponentInstance, buildComponentInstance } from 'ppr.tests.helper.component';
import { getPageInstance, buildPageInstance } from 'ppr.tests.helper.page';

/* eslint-disable no-unused-expressions */
describe('ppr.component.reloadableprototype', () => {
  const pageNode = $('<div>');
  const pageInstance = getPageInstance(pageNode);

  buildPageInstance(pageInstance);

  const componentNode = getComponentNode(pageInstance, false, '/test.html');
  const componentInstance = getComponentInstance(pageInstance, componentNode);

  buildComponentInstance(componentInstance);

  describe('#reload', () => {
    before(() => {
      sinon.stub($, 'get').returns($.Deferred().resolve('<div class="reloadedComponent" data-component data-component-data=\'{"test": "testing"}\'></div>').promise());
    });

    after(() => {
      $.get.restore();
    });

    it('should reload component html', (done) => {
      componentInstance.eventBus.subscribe(null, 'component_build_finished', (componentId) => {
        if (componentId === componentInstance.id) {
          chai.expect(pageInstance.getComponent(componentId).node.hasClass('reloadedComponent')).to.be.true;
          chai.expect(componentInstance.data.test).to.equal('testing');
          done();
        }
      });

      componentInstance.reload();
    });
  });
});
