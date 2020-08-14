import {
  $$,
  init,
  QueryEvents,
  IBuildingQueryEventArgs,
  ExpressionBuilder,
  InitializationEvents,
  get,
  SearchInterface,
  Settings,
  Component
} from 'coveo-search-ui';
import { isArray } from 'underscore';

export const getRoot = () => {
  return document.querySelector('.CoveoSearchInterface') as HTMLElement;
};

export const getModal = () => {
  return document.querySelector('.coveo-modal-container') as HTMLElement;
};

export const getSearchSection = () => {
  return document.body.querySelector('.coveo-search-section') as HTMLElement;
};

export const getSummarySection = () => {
  return document.body.querySelector('.coveo-summary-section') as HTMLElement;
};

export const getSortSection = () => {
  return document.body.querySelector('.coveo-sort-section') as HTMLElement;
};

export const getResultsColumn = () => {
  return document.body.querySelector('.coveo-results-column') as HTMLElement;
};

export const getFacetColumn = () => {
  return document.body.querySelector('.coveo-facet-column') as HTMLElement;
};

export const getTabSection = () => {
  return document.body.querySelector('.coveo-tab-section') as HTMLElement;
};

export const getResultList = () => {
  const resultListAlreadyExists = document.body.querySelector('.CoveoResultList') as HTMLElement;
  if (resultListAlreadyExists) {
    return resultListAlreadyExists as HTMLElement;
  }

  const newResultList = $$('div', {
    className: 'CoveoResultList',
    dataAutoSelectFieldsToInclude: 'true'
  });

  getResultsColumn().appendChild(newResultList.el);
  return newResultList.el;
};

export const getTemplate = () => {
  const resultList = getResultList();
  const alreadyExistingScript = $$(resultList).find('script');

  if (alreadyExistingScript) {
    return alreadyExistingScript as HTMLScriptElement;
  }

  const script = $$('script', {
    type: 'text/html',
    className: 'result-template'
  });

  resultList.appendChild(script.el);

  return script.el as HTMLScriptElement;
};

export const testResultElement = (element: HTMLElement) => {
  const tmpl = getTemplate();
  tmpl.textContent = element.outerHTML;
};

export const testSettingsElement = (element: HTMLElement) => {
  const settingsComponent = $$('div', { className: Component.computeCssClassName(Settings) });
  getResultsColumn().appendChild(settingsComponent.el);
  getResultsColumn().appendChild(element);
  return settingsComponent;
};

export const inDesktopMode = () => {
  document.body.style.width = '1200px';
};

export const inMobileMode = () => {
  document.body.style.width = '500px';
};

export const resetMode = () => {
  document.body.style.width = '';
};

export const addFieldEqualFilter = (field: string, filter: string | string[]) => {
  const expression = new ExpressionBuilder();
  expression.addFieldExpression(field, '==', isArray(filter) ? filter : [filter]);
  return addQueryFilter(expression.build());
};

export const addQueryFilter = (filter: string) => {
  $$(getRoot()).on(QueryEvents.buildingQuery, (e, args: IBuildingQueryEventArgs) => {
    args.queryBuilder.advancedExpression.add(filter);
  });
};

export const addBasicExpression = (filter: string) => {
  $$(getRoot()).on(QueryEvents.buildingQuery, (e, args: IBuildingQueryEventArgs) => {
    args.queryBuilder.expression.add(filter);
  });
};

export const afterInit = () => {
  if (!isInit()) {
    return new Promise(async resolve => {
      $$(getRoot()).on(InitializationEvents.afterInitialization, () => {
        resolve();
      });

      await init(getRoot());
    });
  }

  return Promise.resolve();
};

export const afterQuerySuccess = () => {
  return afterEvent('querySuccess');
};

export const afterQueryError = () => {
  return afterEvent('queryError');
};

export const afterDeferredQuerySuccess = async () => {
  return afterEvent('deferredQuerySuccess');
};

export const afterDelay = (delayMs: number) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), delayMs);
  });
};

export const isInit = () => {
  return get(getRoot(), SearchInterface) != null;
};

export const waitUntilSelectorIsPresent = <T extends Element = Element>(parentNode: HTMLElement, selector: string) => {
  const alreadyExistingElement = parentNode.querySelector<T>(selector);
  if (alreadyExistingElement) {
    return alreadyExistingElement;
  }
  return observeUntil(
    parentNode,
    {
      childList: true,
      subtree: true,
      attributes: true
    },
    () => parentNode.querySelector<T>(selector)
  );
};

export const observeUntil = <T>(element: Node, options: MutationObserverInit, callback: (records: MutationRecord[]) => T) => {
  return new Promise<T>(resolve => {
    const observer = new MutationObserver(records => {
      const result = callback(records);
      if (result) {
        observer.disconnect();
        resolve(result);
      }
    });
    observer.observe(element, options);
  });
};

const afterEvent = (event: string) => {
  const resolvesAfterEvent = resolve => {
    $$(getRoot()).one(event, async () => {
      await afterDelay(0);
      resolve();
    });
  };

  if (!isInit()) {
    return new Promise(async resolve => {
      $$(getRoot()).on(InitializationEvents.afterInitialization, () => {
        resolvesAfterEvent(resolve);
      });

      await init(getRoot());
    });
  }

  return new Promise(async resolve => {
    resolvesAfterEvent(resolve);
  });
};
