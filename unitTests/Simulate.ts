import { IQuery } from '../src/rest/Query';
import { QueryBuilder } from '../src/ui/Base/QueryBuilder';
import { IQueryResults } from '../src/rest/QueryResults';
import { IEndpointError } from '../src/rest/EndpointError';
import { IQueryCorrection } from '../src/rest/QueryCorrection';
import { IGroupByResult } from '../src/rest/GroupByResult';
import { IMockEnvironment, mockComponent } from './MockEnvironment';
import { FakeResults } from './Fake';
import { $$, Dom } from '../src/utils/Dom';
import { IFetchMoreSuccessEventArgs, QueryEvents } from '../src/events/QueryEvents';
import {
  INewQueryEventArgs,
  IBuildingQueryEventArgs,
  IDuringQueryEventArgs,
  IQueryErrorEventArgs,
  IPreprocessResultsEventArgs,
  INoResultsEventArgs,
  IQuerySuccessEventArgs
} from '../src/events/QueryEvents';
import { Utils } from '../src/utils/Utils';
import { Defer } from '../src/misc/Defer';
import { IOmniboxData } from '../src/ui/Omnibox/OmniboxInterface';
import { IBuildingQuerySuggestArgs, IQuerySuggestSuccessArgs, OmniboxEvents } from '../src/events/OmniboxEvents';
import { IBreadcrumbItem, IPopulateBreadcrumbEventArgs, BreadcrumbEvents } from '../src/events/BreadcrumbEvents';
import { JQuery } from './JQueryModule';
import _ = require('underscore');
import ModalBox = Coveo.ModalBox.ModalBox;
import { NoopComponent } from '../src/ui/NoopComponent/NoopComponent';
import { Component } from '../src/ui/Base/Component';
import { QueryError } from '../src/rest/QueryError';
import { InitializationEvents } from '../src/Core';
import { IQuerySuggestCompletion } from '../src/rest/QuerySuggest';
import { IQueryResult } from '../src/rest/QueryResult';

export interface ISimulateIndexData {
  results: IQueryResult[];
}

export interface ISimulateQueryData {
  query?: IQuery;
  queryBuilder: QueryBuilder;
  searchAsYouType: boolean;
  promise?: Promise<IQueryResults>;
  error?: IEndpointError;
  results?: IQueryResults;
  queryCorrections?: IQueryCorrection[];
  groupByResults?: IGroupByResult[];
  callbackDuringQuery: () => void;
  callbackAfterNoResults: () => void;
  callbackAfterQuery: () => void;
  doNotFlushDefer?: boolean;
  deferSuccess: boolean;
  cancel: boolean;
  origin: Component;
  numberOfResults?: number;
  simulatedIndex: ISimulateIndexData;
}

Object.defineProperty(navigator, 'doNotTrack', {
  get: function () {
    return Simulate.doNoTrack;
  }
});

export class Simulate {
  public static doNoTrack = undefined;

  static isPhantomJs() {
    return navigator.userAgent.indexOf('PhantomJS') != -1;
  }

  static isChromeHeadless() {
    return navigator.userAgent.indexOf('HeadlessChrome') != -1;
  }

  static queryError(env: IMockEnvironment, options?: Partial<ISimulateQueryData>): ISimulateQueryData {
    const opt = {
      ...options,
      ...{
        error: new QueryError({
          statusCode: 500,
          data: {
            message: 'oh',
            type: 'no!'
          }
        })
      }
    };

    return Simulate.query(env, opt);
  }

  static noResults(env: IMockEnvironment, options?: Partial<ISimulateQueryData>): ISimulateQueryData {
    const opt = {
      ...options,
      results: FakeResults.createFakeResults(0)
    };
    return Simulate.query(env, opt);
  }

  static query(env: IMockEnvironment, partialOptions?: Partial<ISimulateQueryData>): ISimulateQueryData {
    const options = this.fillSimulatedQueryData(env, partialOptions || {}, 0);

    var newQueryEventArgs: INewQueryEventArgs = {
      searchAsYouType: options.searchAsYouType,
      cancel: options.cancel,
      origin: options.origin,
      shouldRedirectStandaloneSearchbox: true
    };
    $$(env.root).trigger(QueryEvents.newQuery, newQueryEventArgs);

    const queryBuilder = options.queryBuilder;
    var buildingQueryEventArgs: IBuildingQueryEventArgs = {
      queryBuilder,
      searchAsYouType: false,
      cancel: false
    };
    $$(env.root).trigger(QueryEvents.buildingQuery, buildingQueryEventArgs);
    $$(env.root).trigger(QueryEvents.doneBuildingQuery, buildingQueryEventArgs);

    if (newQueryEventArgs.cancel || buildingQueryEventArgs.cancel) {
      return options;
    }

    const query = options.query || queryBuilder.build();
    let results: IQueryResults | null;
    if (!Utils.exists(options.error)) {
      results = options.results || this.getSimulatedResults(query, options.simulatedIndex);
      if (options.queryCorrections) {
        results.queryCorrections = options.queryCorrections;
      }
      if (options.groupByResults) {
        results.groupByResults = options.groupByResults;
      }
    }

    var success = () => {
      this.updateLastQueryAndResults(env, query, results);
      if (!results) {
        var queryErrorEventArgs: IQueryErrorEventArgs = {
          queryBuilder,
          query,
          endpoint: env.searchEndpoint,
          error: options.error!,
          searchAsYouType: options.searchAsYouType
        };
        Promise.reject(options.promise).catch(e => {});
        $$(env.root).trigger(QueryEvents.queryError, queryErrorEventArgs);
        return results!;
      }
      var preprocessResultsEventArgs: IPreprocessResultsEventArgs = {
        queryBuilder,
        query,
        results: results,
        searchAsYouType: options.searchAsYouType
      };
      $$(env.root).trigger(QueryEvents.preprocessResults, preprocessResultsEventArgs);

      var noResultsEventArgs: INoResultsEventArgs = {
        query,
        queryBuilder,
        results: results,
        searchAsYouType: options.searchAsYouType,
        retryTheQuery: false
      };
      if (results!.totalCount == 0 || results.results.length == 0) {
        $$(env.root).trigger(QueryEvents.noResults, noResultsEventArgs);
        options.callbackAfterNoResults();
      }

      if (noResultsEventArgs.retryTheQuery) {
        // do nothing, as this could cause test to loop endlessly if they do not handle the query being retried.
      } else {
        var querySuccessEventArgs: IQuerySuccessEventArgs = {
          query,
          queryBuilder,
          results,
          searchAsYouType: options.searchAsYouType
        };
        $$(env.root).trigger(QueryEvents.querySuccess, querySuccessEventArgs);
        $$(env.root).trigger(QueryEvents.deferredQuerySuccess, querySuccessEventArgs);
      }

      if (!options.doNotFlushDefer) {
        Defer.flush();
      }

      options.callbackAfterQuery();
      return results;
    };

    const actualPromise = new Promise<IQueryResults>(resolve => {
      const promise = options.promise || actualPromise;
      const duringQueryEventArgs: IDuringQueryEventArgs = {
        query,
        queryBuilder,
        promise,
        searchAsYouType: options.searchAsYouType
      };
      $$(env.root).trigger(QueryEvents.duringQuery, duringQueryEventArgs);
      options.callbackDuringQuery();
      if (options.deferSuccess) {
        Defer.defer(() => resolve(success()));
      } else {
        resolve(success());
      }
    });
    const promise = options.promise || actualPromise;

    return { ...options, queryBuilder, query, results: results!, promise };
  }

  static fetchMore(env: IMockEnvironment, partialOptions?: Partial<ISimulateQueryData>): ISimulateQueryData {
    const options = this.fillSimulatedQueryData(env, partialOptions || {}, 'next');
    const queryBuilder = options.queryBuilder;
    const query = options.query || queryBuilder.build();
    const results = options.results || this.getSimulatedResults(query, options.simulatedIndex);
    const actualPromise = new Promise<IQueryResults>(resolve => {
      const promise = options.promise || actualPromise;
      const duringQueryEventArgs: IDuringQueryEventArgs = {
        query,
        queryBuilder,
        promise,
        searchAsYouType: options.searchAsYouType
      };
      $$(env.root).trigger(QueryEvents.duringFetchMoreQuery, duringQueryEventArgs);
      const preprocessResultsEventArgs: IPreprocessResultsEventArgs = {
        queryBuilder,
        query,
        results,
        searchAsYouType: options.searchAsYouType
      };
      $$(env.root).trigger(QueryEvents.preprocessResults, preprocessResultsEventArgs);
      const fetchMoreSuccessEventArgs: IFetchMoreSuccessEventArgs = {
        query,
        queryBuilder,
        results,
        searchAsYouType: options.searchAsYouType
      };
      this.updateLastQueryAndResults(env, query, results);
      $$(env.root).trigger(QueryEvents.fetchMoreSuccess, fetchMoreSuccessEventArgs);
      resolve(results);
    });
    const promise = options.promise || actualPromise;
    return {
      ...options,
      queryBuilder,
      query,
      results,
      promise
    };
  }

  static querySuggest(env: IMockEnvironment, query: string, completions: string[] = []) {
    const buildingQuerySuggestArgs: IBuildingQuerySuggestArgs = { payload: { q: query } };
    $$(env.root).trigger(OmniboxEvents.buildingQuerySuggest, buildingQuerySuggestArgs);

    const querySuggestSuccessArgs: IQuerySuggestSuccessArgs = {
      completions: completions.map<IQuerySuggestCompletion>(completion => ({
        expression: completion,
        highlighted: query,
        executableConfidence: 1,
        score: 1
      }))
    };
    $$(env.root).trigger(OmniboxEvents.querySuggestSuccess, querySuggestSuccessArgs);

    return { buildingQuerySuggestArgs, querySuggestSuccessArgs };
  }

  static initialization(env: IMockEnvironment) {
    $$(env.root).trigger(InitializationEvents.beforeInitialization);
    $$(env.root).trigger(InitializationEvents.afterComponentsInitialization);
    $$(env.root).trigger(InitializationEvents.restoreHistoryState);
    $$(env.root).trigger(InitializationEvents.afterInitialization);
  }

  static modalBoxModule(): ModalBox {
    let content: HTMLElement;
    let closeButton: Dom;
    const container = $$(
      'div',
      { className: 'coveo-wrapper coveo-modal-container' },
      (content = $$(
        'div',
        { className: 'coveo-modal-content' },
        $$(
          'header',
          { className: 'coveo-modal-header' },
          (closeButton = $$('div', { className: 'coveo-quickview-close-button coveo-small-close' })),
          $$('h1')
        ).el
      ).el)
    ).el;
    spyOn(closeButton.el, 'focus');
    const backdrop = $$('div', { className: 'coveo-modal-backdrop' }).el;
    let modalBox = <any>{};
    let currentValidation: () => boolean = null;
    modalBox.close = jasmine.createSpy('close').and.callFake(() => currentValidation && currentValidation());
    modalBox.open = jasmine.createSpy('open').and.callFake((_, { validation }) => {
      currentValidation = validation;
      return {
        modalBox: container,
        wrapper: content,
        overlay: backdrop,
        content,
        close: modalBox.close
      };
    });
    return modalBox;
  }

  static analyticsStoreModule(actionsHistory = []) {
    return {
      addElement: (query: IQuery) => {},
      getHistory: () => {
        return actionsHistory;
      },
      setHistory: (history: any[]) => {},
      clear: () => {},
      getMostRecentElement: () => {
        return null;
      }
    };
  }

  static populateOmnibox(env: IMockEnvironment, options?): IOmniboxData {
    let expression = {
      word: 'foo',
      regex: /foo/
    };

    var fakeOmniboxArgs = _.extend(
      {},
      {
        rows: [],
        completeQueryExpression: expression,
        allQueryExpression: expression,
        currentQueryExpression: expression,
        cursorPosition: 3,
        clear: jasmine.createSpy('clear'),
        clearCurrentExpression: jasmine.createSpy('clearCurrent'),
        replace: jasmine.createSpy('replace'),
        replaceCurrentExpression: jasmine.createSpy('replaceCurrentExpression'),
        insertAt: jasmine.createSpy('insertAt'),
        closeOmnibox: jasmine.createSpy('closeOmnibox')
      },
      options
    );

    $$(env.root).trigger(OmniboxEvents.populateOmnibox, fakeOmniboxArgs);

    return fakeOmniboxArgs;
  }

  static breadcrumb(env: IMockEnvironment, options?): IBreadcrumbItem[] {
    let args = <IPopulateBreadcrumbEventArgs>{ breadcrumbs: [] };
    $$(env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
    return args.breadcrumbs;
  }

  static clearBreadcrumb(env: IMockEnvironment) {
    $$(env.root).trigger(BreadcrumbEvents.clearBreadcrumb);
  }

  static keyUp(element: HTMLElement, key: number, shiftKey?: boolean) {
    return Simulate.keyEvent(element, key, 'keyup', shiftKey);
  }

  static keyDown(element: HTMLElement, key: number, shiftKey?: boolean) {
    return Simulate.keyEvent(element, key, 'keydown', shiftKey);
  }

  static keyEvent(element: HTMLElement, key: number, eventName: string, shiftKey?: boolean) {
    const event = new KeyboardEvent(eventName, { shiftKey: shiftKey });
    Object.defineProperty(event, 'keyCode', {
      get: () => {
        return key;
      }
    });
    Object.defineProperty(event, 'which', {
      get: () => {
        return key;
      }
    });
    element.dispatchEvent(event);
    Defer.flush();
  }

  static addJQuery(): any {
    window['Coveo']['$'] = JQuery;
    return JQuery;
  }

  static removeJQuery(): void {
    window['Coveo']['$'] = null;
  }

  private static getDefaultQueryBuilder(
    env: IMockEnvironment,
    partialData: Partial<ISimulateQueryData>,
    firstResult: number | 'next'
  ): QueryBuilder {
    const queryBuilder = new QueryBuilder();
    if (!Utils.isNullOrUndefined(partialData.numberOfResults)) {
      queryBuilder.numberOfResults = partialData.numberOfResults!;
    }
    if (typeof firstResult === 'number') {
      queryBuilder.firstResult = firstResult;
    } else {
      const { lastQuery, lastResults } = this.getLastQueryAndResults(env);
      queryBuilder.firstResult = (lastQuery ? lastQuery.firstResult || 0 : 0) + (lastResults ? lastResults.results.length : 0);
    }
    return queryBuilder;
  }

  private static getDefaultSimulatedIndex(partialData: Partial<ISimulateQueryData>, query: IQuery): ISimulateIndexData {
    if (!partialData.results) {
      return { results: FakeResults.createFakeResults(query.numberOfResults).results };
    }
    return { results: partialData.results.results };
  }

  private static fillSimulatedQueryData(
    env: IMockEnvironment,
    partialData: Partial<ISimulateQueryData>,
    fallbackFirstResult: number | 'next'
  ): ISimulateQueryData {
    const queryBuilder = partialData.queryBuilder || this.getDefaultQueryBuilder(env, partialData, fallbackFirstResult);
    const simulatedIndex: ISimulateIndexData =
      partialData.simulatedIndex || this.getDefaultSimulatedIndex(partialData, partialData.query || queryBuilder.build());
    return {
      ..._.extend(
        {},
        {
          searchAsYouType: false,
          callbackDuringQuery: () => {},
          callbackAfterNoResults: () => {},
          callbackAfterQuery: () => {},
          deferSuccess: false,
          cancel: false,
          origin: mockComponent<NoopComponent>(NoopComponent, NoopComponent.ID)
        },
        partialData
      ),
      queryBuilder,
      simulatedIndex
    };
  }

  private static getSimulatedResults(query: IQuery, simulatedIndex: ISimulateIndexData) {
    const firstResult = Utils.isNullOrUndefined(query.firstResult) ? 0 : query.firstResult!;
    const numberOfResults = Utils.isNullOrUndefined(query.numberOfResults) ? 10 : query.numberOfResults!;
    return {
      ...FakeResults.createFakeResults(0, { totalCount: simulatedIndex.results.length }),
      results: simulatedIndex.results.slice(firstResult, firstResult + numberOfResults)
    };
  }

  private static getLastQueryAndResults(env: IMockEnvironment) {
    const getLastQuerySpy = this.getLastQuerySpy(env);
    const getLastResultsSpy = this.getLastResultsSpy(env);
    if (!getLastQuerySpy || !getLastResultsSpy) {
      throw "The query controller was expected to be a mock, but it wasn't.";
    }
    const lastQuery = getLastQuerySpy() as IQuery;
    const lastResults = getLastResultsSpy() as IQueryResults;
    return { lastQuery, lastResults };
  }

  private static updateLastQueryAndResults(env: IMockEnvironment, query: IQuery, results: IQueryResults | null) {
    const getLastQuerySpy = this.getLastQuerySpy(env);
    const getLastResultsSpy = this.getLastResultsSpy(env);
    getLastQuerySpy && getLastQuerySpy.and.returnValue(query);
    getLastResultsSpy && getLastResultsSpy.and.returnValue(results);
  }

  private static getLastQuerySpy(env: IMockEnvironment) {
    if (!jasmine.isSpy(env.queryController.getLastQuery)) {
      return null;
    }
    return env.queryController.getLastQuery as jasmine.Spy;
  }

  private static getLastResultsSpy(env: IMockEnvironment) {
    if (!jasmine.isSpy(env.queryController.getLastResults)) {
      return null;
    }
    return env.queryController.getLastResults as jasmine.Spy;
  }
}
