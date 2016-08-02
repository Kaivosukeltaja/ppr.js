var BasePrototype = require('../../src/page/baseprototype'),
  $ = require('jquery');

describe('ppr.page.baseprototype', function() {

  'use strict';

  var pageInstance;

  before(function() {
    pageInstance = new function() {
      return _.cloneDeep(BasePrototype);
    };
  });

  describe('#initialize', function() {

    it('should initialize correctly', function() {
      var pageName = 'testPage',
        parameters;

      parameters = {
        name: 'testPage',
        node: $('<div>').attr('data-page-data', '{"test": true}')
      };

      chai.expect(pageInstance.initialize(parameters)).to.be.true;
      chai.assert.equal(pageInstance.name, pageName);
      chai.expect(pageInstance.data).to.have.property('test', true);
    });
  });

  describe('#build', function() {

    it('should return true', function() {
      chai.expect(pageInstance.build()).to.be.true;
    });
  });

  describe('#afterBuild', function() {

    var buildComponentSpy = sinon.spy();

    before(function() {
      pageInstance.afterBuild();

      pageInstance.eventBus.subscribe(null, 'build_component', buildComponentSpy);
    });

    describe('#buildComponents', function() {

      it('should not build components since there is none', function() {
        chai.expect(buildComponentSpy.called).to.be.false;
      });

      describe('normal component', function() {

        var componentNode;

        before(function() {
          componentNode = $('<div>')
            .attr('data-component', '')
            .appendTo(pageInstance.node);
        });

        it('should trigger build component once', function() {

          pageInstance.buildComponents(pageInstance.node);

          chai.expect(buildComponentSpy.called).to.be.true;

          var componentInstance = pageInstance.getComponent(componentNode.attr('data-component-id'));

          chai.expect(componentInstance).to.be.a('object');
          chai.assert.equal(componentInstance.name, 'base_prototype');
        });

        it('should remove component', function() {
          var componentId = componentNode.attr('data-component-id');
          pageInstance.removeComponent(componentId);
          chai.expect(pageInstance.components[componentId]).to.be.undefined;

          // Try removing again to check that it doens't do anything
          pageInstance.removeComponent([componentId]);
          chai.expect(pageInstance.components[componentId]).to.be.undefined;
        });
      });

      describe('reloadable component', function() {

        it('should use reloadableprototype if href is present', function() {
          var componentNode = $('<div>')
            .attr('data-component', '')
            .attr('data-component-href', 'https://www.google.com')
            .appendTo(pageInstance.node);

          pageInstance.buildComponent(componentNode);

          var componentInstance = pageInstance.getComponent(componentNode.attr('data-component-id'));

          chai.expect(componentInstance).to.be.a('object');
          chai.assert.equal(componentInstance.name, 'reloadable_prototype');
        });
      });
    });
  });
});
