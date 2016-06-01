/// <reference path="Test.ts" />
module Coveo {

  export interface SimulateQueryData {
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
    static query(env: Mock.MockEnvironment, options?: SimulateQueryData): SimulateQueryData {

      options = _.extend({}, {
        query: new QueryBuilder().build(),
        queryBuilder: new QueryBuilder(),
        searchAsYouType: false,
        promise: new Promise(()=> {
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
          }
          Promise.reject(options.promise).catch((e)=> {});
          $$(env.root).trigger(QueryEvents.queryError, queryErrorEventArgs);
        } else {
          var preprocessResultsEventArgs: IPreprocessResultsEventArgs = {
            queryBuilder: options.queryBuilder,
            query: options.query,
            results: options.results,
            searchAsYouType: options.searchAsYouType
          };
          $$(env.root).trigger(QueryEvents.preprocessResults, preprocessResultsEventArgs);
          Promise.resolve(new Promise((resolve, reject)=> {
            resolve(options.results);
          }))

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
      }

      if (options.deferSuccess) {
        Defer.defer(success);
      } else {
        success();
      }

      return options;
    }

    static omnibox(env: Mock.MockEnvironment, options?): IOmniboxData {
      let expression = {
        word: 'foo',
        regex: /foo/
      }

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
      }, options)

      $$(env.root).trigger(OmniboxEvents.populateOmnibox, fakeOmniboxArgs);

      return fakeOmniboxArgs;
    }

    static keyDown(element: HTMLElement, key: number, shiftKey?: boolean) {
      var event = new jQuery.Event("keydown");
      event.which = key;
      event.keyCode = key;
      if (shiftKey) {
        event.shiftKey = true;
      }

      $(element).trigger(event);
      Defer.flush();
    }

    static keyUp(element: HTMLElement, key: number, shiftKey?: boolean) {
      var event = new jQuery.Event("keyup");
      event.which = key;
      event.keyCode = key;
      if (shiftKey) {
        event.shiftKey = true;
      }
      $(element).trigger(event);
      Defer.flush();
    }

    static mouseDown(element: HTMLElement) {
      var event = new jQuery.Event("mousedown");
      $(element).trigger(event);
    }

    static mouseUp(element: HTMLElement) {
      var event = new jQuery.Event("mouseup");
      $(element).trigger(event);
    }

    static mouseMove(element: HTMLElement, position?: {}) {
      var event = new jQuery.Event("mousemove");
      $(element).trigger(event);
    }

    static touchStart(element: HTMLElement, position: { clientX: number; clientY: number }) {
      var event = eval('jQuery.Event("touchstart")');
      event = Simulate.touchEventWithPosition(event, position);
      $(element).trigger(event);
    }

    static touchEnd(element: HTMLElement) {
      var event = eval('jQuery.Event("touchend")');
      $(element).trigger(event);
    }

    static touchMove(element: HTMLElement, position: { clientX: number; clientY: number }) {
      var event = eval('jQuery.Event("touchmove")');
      event = Simulate.touchEventWithPosition(event, position);
      $(element).trigger(event);
    }

    static touchEventWithPosition(event, position: { clientX: number; clientY: number; }) {
      event["originalEvent"] = {};
      event["originalEvent"]["touches"] = [];
      event["originalEvent"]["touches"][0] = {};
      event["originalEvent"]["touches"][0]["clientX"] = position.clientX;
      event["originalEvent"]["touches"][0]["clientY"] = position.clientY;
      return event;
    }

    static enterKey(element: HTMLElement) {
      Simulate.keyUp(element, 13);
    }

    static changeInputValue(input: HTMLInputElement, value: string) {
      $(input).val(value);
      $(input).change();
      Defer.flush();
    }

    static changeCheckboxValue(checkbox: HTMLInputElement, value: boolean) {
      $(checkbox).prop('checked', value);
      $(checkbox).change();
      Defer.flush();
    }

    static setCursorPosition(input: HTMLInputElement, position: number) {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(position, position);
      } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', position);
        range.moveStart('character', position);
        range.select();
      } else if (typeof input.selectionStart != 'undefined') {
        input.selectionStart = position;
        input.selectionEnd = position;
        input.focus();
      }
      Defer.flush();
    }
  }
}
