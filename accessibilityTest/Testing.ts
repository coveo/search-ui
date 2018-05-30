/// <reference types="../bin/ts/CoveoJsSearch" />

export const getRoot = () => {
  return document.querySelector('.CoveoSearchInterface') as HTMLElement;
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

export const afterQuerySuccess = async () => {
  await Coveo.init(getRoot());
  return new Promise(resolve => {
    Coveo.$$(getRoot()).one('querySuccess', () => {
      resolve();
    });
  });
};

export const afterDeferredQuerySuccess = async () => {
  await Coveo.init(getRoot());
  return new Promise(resolve => {
    Coveo.$$(getRoot()).one('deferredQuerySuccess', () => {
      resolve();
    });
  });
};
