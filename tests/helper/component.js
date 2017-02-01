import _ from 'lodash';
import $ from 'jquery';
import ComponentBasePrototype from 'ppr.component.baseprototype';
import ComponentReloadablePrototype from 'ppr.component.reloadableprototype';

export const getComponentNode = (parentInstance, data = false, href = null) => {
  const properties = _.pickBy({
    'data-component-data': (data === true ? '{"test": "testing"}' : null),
    'data-component-href': (href !== null ? href : null),
  }, _.identity);

  return $('<div>').attr(Object.assign({}, {
    'data-component': '',
  }, properties)).appendTo(parentInstance.node);
};

export const getComponentInstance = (pageInstance, componentNode) => {
  const params = {
    page: pageInstance,
    eventBus: pageInstance.eventBus,
    name: 'baseprototype',
  };

  if (componentNode.attr('data-component-href')) {
    return new ComponentReloadablePrototype(componentNode, Object.assign({}, params, { name: 'reloadableprototype' }));
  }

  return new ComponentBasePrototype(componentNode, params);
};

export const buildComponentInstance = (componentInstance) => {
  componentInstance.build();
  componentInstance.afterBuild();
};
