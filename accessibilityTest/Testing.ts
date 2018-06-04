/// <reference types="../bin/ts/CoveoJsSearch" />

import {
  $$,
  init,
  QueryEvents,
  IBuildingQueryEventArgs,
  ExpressionBuilder,
  InitializationEvents,
  get,
  SearchInterface
} from 'coveo-search-ui';

export const getRoot = () => {
  return document.querySelector('.CoveoSearchInterface') as HTMLElement;
};

export const getModal = () => {
  return document.querySelector('.coveo-modal-container') as HTMLElement;
};

export const getSearchSection = () => {
  return document.body.querySelector('.coveo-search-section') as HTMLElement;
};

export const getResultsColumn = () => {
  return document.body.querySelector('.coveo-results-column') as HTMLElement;
};

export const getFacetColumn = () => {
  return document.body.querySelector('.coveo-facet-column') as HTMLElement;
};

export const getResultList = () => {
  const resultListAlreadyExists = document.body.querySelector('.CoveoResultList') as HTMLElement;
  if (resultListAlreadyExists) {
    return resultListAlreadyExists as HTMLElement;
  }

  const newResultList = $$('div', {
    className: 'CoveoResultList'
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

export const inDesktopMode = () => {
  document.body.style.width = '1200px';
};

export const inMobileMode = () => {
  document.body.style.width = '500px';
};

export const resetMode = () => {
  document.body.style.width = '';
};

export const addFieldEqualFilter = (field: string, filter: string) => {
  const expression = new ExpressionBuilder();
  expression.addFieldExpression(field, '==', [filter]);
  return addQueryFilter(expression.build());
};

export const addQueryFilter = (filter: string) => {
  $$(getRoot()).on(QueryEvents.buildingQuery, (e, args: IBuildingQueryEventArgs) => {
    args.queryBuilder.advancedExpression.add(filter);
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
  const resolvesOnQuerySuccess = resolve => {
    $$(getRoot()).one('querySuccess', async () => {
      await afterDelay(0);
      resolve();
    });
  };

  if (!isInit()) {
    return new Promise(async resolve => {
      $$(getRoot()).on(InitializationEvents.afterInitialization, () => {
        resolvesOnQuerySuccess(resolve);
      });

      await init(getRoot());
    });
  }

  return new Promise(async resolve => {
    resolvesOnQuerySuccess(resolve);
  });
};

export const afterDeferredQuerySuccess = async () => {
  const resolvesOnQuerySuccess = resolve => {
    $$(getRoot()).one('deferredQuerySuccess', async () => {
      await afterDelay(0);
      resolve();
    });
  };

  if (!isInit()) {
    return new Promise(async resolve => {
      $$(getRoot()).on(InitializationEvents.afterInitialization, () => {
        resolvesOnQuerySuccess(resolve);
      });

      await init(getRoot());
    });
  }

  return new Promise(async resolve => {
    resolvesOnQuerySuccess(resolve);
  });
};

export const afterDelay = (delayMs: number) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), delayMs);
  });
};

export const isInit = () => {
  return get(getRoot(), SearchInterface) != null;
};
