declare const Coveo;

export const getRoot = () => {
  return document.querySelector('.CoveoSearchInterface');
};

export const getSearchSection = () => {
  return document.body.querySelector('.coveo-search-section');
};

export const getResultsColumn = () => {
  return document.body.querySelector('.coveo-results-column');
};

export const getFacetColumn = () => {
  return document.body.querySelector('.coveo-facet-column');
};

export const afterQuerySuccess = async () => {
  await Coveo.init(getRoot());
  return new Promise(resolve => {
    Coveo.$$(getRoot()).on('querySuccess', () => {
      resolve();
    });
  });
};

export const afterDeferredQuerySuccess = async () => {
  await Coveo.init(getRoot());
  return new Promise(resolve => {
    Coveo.$$(getRoot()).on('deferredQuerySuccess', () => {
      resolve();
    });
  });
};
