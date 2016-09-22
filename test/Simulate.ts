import {IQuery} from '../src/rest/Query';
import {QueryBuilder} from '../src/ui/Base/QueryBuilder';
import {IQueryResults} from '../src/rest/QueryResults';
import {IEndpointError} from '../src/rest/EndpointError';
import {IQueryCorrection} from '../src/rest/QueryCorrection';
import {IGroupByResult} from '../src/rest/GroupByResult';
import {IMockEnvironment} from './MockEnvironment';
import {FakeResults} from './Fake';
import {$$} from '../src/utils/Dom';
import {QueryEvents} from '../src/events/QueryEvents';
import {INewQueryEventArgs, IBuildingQueryEventArgs, IDuringQueryEventArgs, IQueryErrorEventArgs, IPreprocessResultsEventArgs, INoResultsEventArgs, IQuerySuccessEventArgs} from '../src/events/QueryEvents';
import {Utils} from '../src/utils/Utils';
import {Defer} from '../src/misc/Defer';
import {IOmniboxData} from '../src/ui/Omnibox/OmniboxInterface';
import {OmniboxEvents} from '../src/events/OmniboxEvents';
import {IBreadcrumbItem, IPopulateBreadcrumbEventArgs, BreadcrumbEvents} from '../src/events/BreadcrumbEvents';
import {JQuery} from '../test/JQueryModule';

export interface ISimulateQueryData {
  query?: IQuery;
  queryBuilder?: QueryBuilder;
  searchAsYouType?: boolean;
  promise?: Promise<IQueryResults>;
  error?: IEndpointError;
  results?: IQueryResults;
  queryCorrections?: IQueryCorrection[];
  groupByResults?: IGroupByResult[];
  callbackDuringQuery?: () => void;
  callbackAfterNoResults?: () => void;
  callbackAfterQuery?: () => void;
  doNotFlushDefer?: boolean;
  deferSuccess?: boolean;
  cancel?: boolean;
}


export class Simulate {
  static isPhantomJs() {
    return navigator.userAgent.indexOf('PhantomJS') != -1;
  }

  static query(env: IMockEnvironment, options?: ISimulateQueryData): ISimulateQueryData {

    options = _.extend({}, {
      query: new QueryBuilder().build(),
      queryBuilder: new QueryBuilder(),
      searchAsYouType: false,
      promise: new Promise(() => {
      }),
      results: FakeResults.createFakeResults(),
      callbackDuringQuery: () => {
      },
      callbackAfterNoResults: () => {
      },
      callbackAfterQuery: () => {
      },
      deferSuccess: false,
      cancel: false
    }, options);

    if (options.queryCorrections) {
      options.results.queryCorrections = options.queryCorrections;
    }
    if (options.groupByResults) {
      options.results.groupByResults = options.groupByResults;
    }

    var newQueryEventArgs: INewQueryEventArgs = {
      searchAsYouType: options.searchAsYouType,
      cancel: options.cancel
    };
    $$(env.root).trigger(QueryEvents.newQuery, newQueryEventArgs);

    var buildingQueryEventArgs: IBuildingQueryEventArgs = {
      queryBuilder: options.queryBuilder,
      searchAsYouType: false,
      cancel: false
    };
    $$(env.root).trigger(QueryEvents.buildingQuery, buildingQueryEventArgs);
    $$(env.root).trigger(QueryEvents.doneBuildingQuery, buildingQueryEventArgs);

    var duringQueryEventArgs: IDuringQueryEventArgs = {
      query: options.query,
      queryBuilder: options.queryBuilder,
      promise: options.promise,
      searchAsYouType: options.searchAsYouType
    };
    $$(env.root).trigger(QueryEvents.duringQuery, duringQueryEventArgs);
    options.callbackDuringQuery();

    var success = () => {
      if (Utils.exists(options.error)) {
        var queryErrorEventArgs: IQueryErrorEventArgs = {
          queryBuilder: options.queryBuilder,
          query: options.query,
          endpoint: env.searchEndpoint,
          error: options.error,
          searchAsYouType: options.searchAsYouType
        };
        Promise.reject(options.promise).catch((e) => {
        });
        $$(env.root).trigger(QueryEvents.queryError, queryErrorEventArgs);
      } else {
        var preprocessResultsEventArgs: IPreprocessResultsEventArgs = {
          queryBuilder: options.queryBuilder,
          query: options.query,
          results: options.results,
          searchAsYouType: options.searchAsYouType
        };
        $$(env.root).trigger(QueryEvents.preprocessResults, preprocessResultsEventArgs);
        Promise.resolve(new Promise((resolve, reject) => {
          resolve(options.results);
        }));

        if (options.results.totalCount == 0) {
          var noResultsEventArgs: INoResultsEventArgs = {
            query: options.query,
            queryBuilder: options.queryBuilder,
            results: options.results,
            searchAsYouType: options.searchAsYouType,
            retryTheQuery: false
          };

          $$(env.root).trigger(QueryEvents.noResults, noResultsEventArgs);
          options.callbackAfterNoResults();
        }

        var querySuccessEventArgs: IQuerySuccessEventArgs = {
          query: options.query,
          queryBuilder: options.queryBuilder,
          results: options.results,
          searchAsYouType: options.searchAsYouType
        };
        $$(env.root).trigger(QueryEvents.querySuccess, querySuccessEventArgs);
        $$(env.root).trigger(QueryEvents.deferredQuerySuccess, querySuccessEventArgs);
      }

      if (!options.doNotFlushDefer) {
        Defer.flush();
      }

      options.callbackAfterQuery();
    };

    if (options.deferSuccess) {
      Defer.defer(success);
    } else {
      success();
    }

    return options;
  }

  static omnibox(env: IMockEnvironment, options?): IOmniboxData {
    let expression = {
      word: 'foo',
      regex: /foo/
    };

    var fakeOmniboxArgs = _.extend({}, {
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
    }, options);

    $$(env.root).trigger(OmniboxEvents.populateOmnibox, fakeOmniboxArgs);

    return fakeOmniboxArgs;
  }

  static breadcrumb(env: IMockEnvironment, options?): IBreadcrumbItem[] {
    let args = <IPopulateBreadcrumbEventArgs>{ breadcrumbs: [] };
    $$(env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
    return args.breadcrumbs;
  }

  static keyUp(element: HTMLElement, key: number, shiftKey?: boolean) {
    var event = new KeyboardEvent('keyup', { shiftKey: shiftKey });
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

  static addJQuery(): void {
    window['Coveo']['$'] = JQuery;
  }

  static removeJQuery(): void {
    window['Coveo']['$'] = null;
  }
}
