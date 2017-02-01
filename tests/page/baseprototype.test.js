import $ from 'jquery';
import chai from 'chai';
import sinon from 'sinon';
import BasePrototype from 'ppr.page.baseprototype';

/* eslint-disable no-unused-expressions */
describe('ppr.page.baseprototype', () => {
  let pageInstance;

  before(() => {
    pageInstance = new BasePrototype($('body'));
  });

  describe('#initialize', () => {
    it('should initialize correctly', () => {
      const pageName = 'testPage';
      const parameters = {
        name: 'testPage',
      };

      const targetNode = $('<div>').attr('data-page-data', '{"test": true}');
      const targetPage = new BasePrototype(targetNode, parameters);

      chai.assert.equal(targetPage.name, pageName);
      chai.expect(targetPage.data).to.have.property('test', true);
    });
  });

  describe('#build', () => {
    it('should return true', () => {
      chai.expect(pageInstance.build()).to.be.true;
    });
  });

  describe('#afterBuild', () => {
    const buildComponentSpy = sinon.spy();

    before(() => {
      pageInstance.afterBuild();

      pageInstance.eventBus.subscribe(null, 'build_component', buildComponentSpy);
    });

    describe('#buildComponents', () => {
      it('should not build components since there is none', () => {
        chai.expect(buildComponentSpy.called).to.be.false;
      });

      describe('normal component', () => {
        let componentNode;

        before(() => {
          componentNode = $('<div>')
            .attr('data-component', '')
            .appendTo(pageInstance.node);
        });

        it('should trigger build component once', () => {
          pageInstance.buildComponents(pageInstance.node);

          chai.expect(buildComponentSpy.called).to.be.true;

          const componentInstance = pageInstance.getComponent(componentNode.attr('data-component-id'));

          chai.expect(componentInstance).to.be.a('object');
          chai.assert.equal(componentInstance.name, 'base_prototype');
        });

        it('should remove component', () => {
          const componentId = componentNode.attr('data-component-id');
          pageInstance.removeComponent(componentId);
          chai.expect(pageInstance.components[componentId]).to.be.undefined;

          // Try removing again to check that it doens't do anything
          pageInstance.removeComponent([componentId]);
          chai.expect(pageInstance.components[componentId]).to.be.undefined;
        });
      });

      describe('reloadable component', () => {
        it('should use reloadableprototype if href is present', () => {
          const componentNode = $('<div>')
            .attr('data-component', '')
            .attr('data-component-href', 'https://www.google.com')
            .appendTo(pageInstance.node);

          pageInstance.buildComponent(componentNode);

          const componentInstance = pageInstance.getComponent(componentNode.attr('data-component-id'));

          chai.expect(componentInstance).to.be.a('object');
          chai.assert.equal(componentInstance.name, 'reloadable_prototype');
        });
      });

      describe('component not found', () => {
        it('should not build component if not found', () => {
          const componentNode = $('<div>')
            .attr('data-component', 'testComponent')
            .appendTo(pageInstance.node);

          pageInstance.buildComponent(componentNode);

          chai.expect(componentNode.attr('data-component-id')).to.be.undefined;
        });
      });
    });
  });
});
