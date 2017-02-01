import PageBasePrototype from 'ppr.page.baseprototype';
import EventBusPrototype from 'ppr.library.eventbusprototype';

export const getPageInstance = pageNode => (
  new PageBasePrototype(pageNode, { eventBus: new EventBusPrototype() })
);

export const buildPageInstance = (pageInstance) => {
  pageInstance.build();
  pageInstance.afterBuild();
};
