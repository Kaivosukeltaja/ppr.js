var PageBasePrototype = require('../../src/page/baseprototype'),
  ReloadablePrototype = require('../../src/component/reloadableprototype'),
  $ = require('jquery'),
  _ = require('lodash');

describe('ppr.component.reloadableprototype', function() {

  'use strict';

  var pageNode = $('<div>'),
    componentNode = $('<div>').attr('data-component', '').attr('data-component-href', '/test.html').appendTo(pageNode),
    pageInstance,
    componentInstance;

  before(function() {
    pageInstance = new function() {
      return _.cloneDeep(PageBasePrototype);
    };

    pageInstance.initialize({
      node: pageNode,
      name: 'base_prototype'
    });

    pageInstance.build();
    pageInstance.afterBuild();

    componentInstance = new function() {
      return new _.cloneDeep(ReloadablePrototype)
    };

    componentInstance.initialize({
      name: 'base_prototype',
      node: componentNode,
      eventBus: pageInstance.eventBus,
      page: pageInstance,
      id: _.uniqueId('ReloadableComponent_')
    });

    componentInstance.build();
    componentInstance.afterBuild();

    pageInstance.components[componentInstance.id] = pageInstance;
  });

  describe('#reload', function() {

    before(function() {
      sinon.stub($, 'get').returns($.Deferred().resolve('<div class="reloadedComponent" data-component></div>').promise());
    });

    after(function() {
      $.get.restore();
    });

    it('should reload component html', function(done) {

      componentInstance.eventBus.subscribe(null, 'component_build_finished', function(componentId) {

        if (componentId === componentInstance.id) {
          chai.expect(pageInstance.getComponent(componentId).node.hasClass('reloadedComponent')).to.be.true;
          done();
        }
      });

      componentInstance.reload();
    });


  });

  describe('#onReloadStarted', function() {

  });

  describe('#onReloadReady', function() {

  });
});
