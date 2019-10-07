import { Dom, $$ } from '../../src/utils/Dom';
import { ResultPreviewsGrid, IResultPreviewsGridOptions, SearchResultPreview } from '../../src/magicbox/ResultPreviewsGrid';
import { Assert } from '../../src/Core';

export function deferPromise<T = void>(ms?: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

export const TimeBetweenQueries = 25;

// HTML Properties
type HTMLProps = Partial<Element & { style: string }>;

export const ContainerWidth = 200;
export const ContainerElementProperties: HTMLProps = {
  style: `
    width: ${ContainerWidth}px;
    height: 200px;
    display: flex;
    flex-wrap: wrap;
  `
};

export const PreviewSize = 50;
export const PreviewMargin = 5;
export const PreviewElementProperties: HTMLProps = {
  className: 'common-class-name',
  style: `
    width: ${PreviewSize}px;
    height: ${PreviewSize}px;
    margin: ${PreviewMargin}px;
  `
};

// RootElement
export type RootElementType = Dom;

export const RootElementProperties = {
  id: 'resultPreviewsGridContainer' as Element['id'],
  style: `
    position: absolute;
  `
};

export function createRootElement(): RootElementType {
  return $$('div', RootElementProperties);
}

export async function createActiveRootElement<T extends Promise<void> | void>(livingContext: (root: RootElementType) => T): Promise<void> {
  Assert.isNull(document.getElementById(RootElementProperties.id));
  const root = createRootElement();
  document.body.appendChild(root.el);
  Assert.isNotNull(document.getElementById(RootElementProperties.id));
  const removeRoot = () => {
    Assert.isNotNull(document.getElementById(RootElementProperties.id));
    document.body.removeChild(root.el);
    Assert.isNull(document.getElementById(RootElementProperties.id));
  };
  const result = livingContext(root);
  if (result instanceof Promise) {
    await result;
  }
  removeRoot();
}

// ResultPreviewsGrid
export type ResultPreviewsGridType = {
  grid: ResultPreviewsGrid;
  root: Dom;
};

export function createGridWithDefaults(): ResultPreviewsGridType {
  const root = createRootElement();
  return {
    root,
    grid: new ResultPreviewsGrid(root.el, getDefaultGridOptions())
  };
}

export async function createActiveGridWithDefaults<T extends Promise<void> | void>(
  livingContext: (gridContext: ResultPreviewsGridType) => T
): Promise<void> {
  await createActiveRootElement(root =>
    livingContext({
      root,
      grid: new ResultPreviewsGrid(root.el, getDefaultGridOptions())
    })
  );
}
export type ResultPreviewsGridOptionsType = IResultPreviewsGridOptions;

export function getDefaultGridOptions(): ResultPreviewsGridOptionsType {
  return {};
}

// SingleSearchResultPreview
export type SingleSearchResultPreviewType = {
  originalPreview: SearchResultPreview;
  copiedPreview: SearchResultPreview;
};

export const SingleSearchResultPreviewId = 'test-element';

export function createSingleSearchResultPreview(): SingleSearchResultPreviewType {
  const originalPreview = {
    dom: $$('div', { className: 'test', id: SingleSearchResultPreviewId }).el,
    onSelect: jasmine.createSpy('onSelect')
  };
  return {
    originalPreview,
    copiedPreview: {
      ...originalPreview,
      dom: originalPreview.dom.cloneNode(true) as HTMLElement
    }
  };
}

// MultipleSearchResultPreviews
export type MultipleSearchResultPreviewsType = {
  originalPreviews: SearchResultPreview[];
  previewCopies: SearchResultPreview[];
  previewCopiesSlices: {
    addedFirst: SearchResultPreview[];
    addedSecond: SearchResultPreview[];
    addedThird: SearchResultPreview[];
  };
  previewCopiesInResolvedOrder: SearchResultPreview[];
};

export function createMultipleSearchResultPreviews(): MultipleSearchResultPreviewsType {
  const originalPreviews = [
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-1' }).el,
      onSelect: jasmine.createSpy('onSelect')
    },
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-2' }).el,
      onSelect: jasmine.createSpy('onSelect')
    },
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-3' }).el,
      onSelect: jasmine.createSpy('onSelect')
    },
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-4' }).el,
      onSelect: jasmine.createSpy('onSelect')
    },
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-5' }).el,
      onSelect: jasmine.createSpy('onSelect')
    }
  ];
  const previewCopies = originalPreviews.map(
    originalPreview =>
      <SearchResultPreview>{
        ...originalPreview,
        dom: originalPreview.dom.cloneNode(true) as HTMLElement
      }
  );
  const previewCopiesSlices = {
    addedFirst: previewCopies.slice(3, 5),
    addedSecond: previewCopies.slice(1, 3),
    addedThird: [previewCopies[0]]
  };
  const previewCopiesInResolvedOrder = [
    ...previewCopiesSlices.addedFirst,
    ...previewCopiesSlices.addedSecond,
    ...previewCopiesSlices.addedThird
  ];
  return {
    originalPreviews,
    previewCopies,
    previewCopiesSlices,
    previewCopiesInResolvedOrder
  };
}

export function createMultipleSearchResultPreviews2(): MultipleSearchResultPreviewsType {
  const originalPreviews = [
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-6' }).el,
      onSelect: jasmine.createSpy('onSelect')
    },
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-7' }).el,
      onSelect: jasmine.createSpy('onSelect')
    },
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-8' }).el,
      onSelect: jasmine.createSpy('onSelect')
    },
    {
      dom: $$('div', { ...PreviewElementProperties, id: 'test-element-9' }).el,
      onSelect: jasmine.createSpy('onSelect')
    }
  ];
  const previewCopies = originalPreviews.map(
    originalPreview =>
      <SearchResultPreview>{
        ...originalPreview,
        dom: originalPreview.dom.cloneNode(true) as HTMLElement
      }
  );
  const previewCopiesSlices = {
    addedFirst: [previewCopies[1]],
    addedSecond: previewCopies.slice(2, 4),
    addedThird: [previewCopies[0]]
  };
  const previewCopiesInResolvedOrder = [
    ...previewCopiesSlices.addedFirst,
    ...previewCopiesSlices.addedSecond,
    ...previewCopiesSlices.addedThird
  ];
  return {
    originalPreviews,
    previewCopies,
    previewCopiesSlices,
    previewCopiesInResolvedOrder
  };
}

// EmptySearchQuery
export type EmptySearchQueryType = {
  receivePromise: Promise<SearchResultPreview[]>;
};

export function createEmptySearchQuery(gridContext: ResultPreviewsGridType): EmptySearchQueryType {
  return {
    receivePromise: gridContext.grid.receiveSearchResultPreviews([])
  };
}

// SingleSearchQuery
export type SynchronousSingleSearchQueryType = {
  receivePromise: Promise<SearchResultPreview[]>;
};

export function createSynchronousSingleSearchQuery(
  gridContext: ResultPreviewsGridType,
  dataset: SingleSearchResultPreviewType
): SynchronousSingleSearchQueryType {
  return {
    receivePromise: gridContext.grid.receiveSearchResultPreviews([[dataset.copiedPreview]])
  };
}

export type AsynchronousSingleSearchQueryType = {
  receivePromise: Promise<SearchResultPreview[]>;
};

export function createAsynchronousSingleSearchQuery(
  gridContext: ResultPreviewsGridType,
  dataset: SingleSearchResultPreviewType
): AsynchronousSingleSearchQueryType {
  return {
    receivePromise: gridContext.grid.receiveSearchResultPreviews([deferPromise(TimeBetweenQueries, [dataset.copiedPreview])])
  };
}

// MultipleSearchQueries
export type SynchronousMultipleSearchQueriesType = {
  receivePromise: Promise<SearchResultPreview[]>;
};

export function createSynchronousMultipleSearchQueries(
  gridContext: ResultPreviewsGridType,
  dataset: MultipleSearchResultPreviewsType
): SynchronousMultipleSearchQueriesType {
  const { previewCopiesSlices } = dataset;
  return {
    receivePromise: gridContext.grid.receiveSearchResultPreviews([
      previewCopiesSlices.addedFirst,
      previewCopiesSlices.addedSecond,
      previewCopiesSlices.addedThird
    ])
  };
}

export type AsynchronousMultipleSearchQueriesType = {
  receivePromise: Promise<SearchResultPreview[]>;
  subPromises: {
    resolvedFirst: SearchResultPreview[];
    resolvedSecond: Promise<SearchResultPreview[]>;
    resolvedThird: Promise<SearchResultPreview[]>;
  };
};

export function createAsynchronousMultipleSearchQueries(
  gridContext: ResultPreviewsGridType,
  dataset: MultipleSearchResultPreviewsType
): AsynchronousMultipleSearchQueriesType {
  const { previewCopiesSlices } = dataset;
  const subPromises = {
    resolvedFirst: previewCopiesSlices.addedFirst,
    resolvedSecond: deferPromise(TimeBetweenQueries, previewCopiesSlices.addedSecond),
    resolvedThird: deferPromise(TimeBetweenQueries * 2, previewCopiesSlices.addedThird)
  };
  const receivePromise = gridContext.grid.receiveSearchResultPreviews([
    subPromises.resolvedThird,
    subPromises.resolvedFirst,
    subPromises.resolvedSecond
  ]);
  return {
    subPromises,
    receivePromise
  };
}
