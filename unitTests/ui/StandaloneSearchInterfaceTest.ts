import * as Mock from '../MockEnvironment';
import { StandaloneSearchInterface, IStandaloneSearchInterfaceOptions } from '../../src/ui/SearchInterface/SearchInterface';
import { QueryEvents, $$, StandaloneSearchInterfaceEvents } from '../../src/Core';
import { INewQueryEventArgs } from '../../src/events/QueryEvents';
import { ExecutionPlan } from '../../src/rest/Plan';
import { FakeResults } from '../Fake';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function StandaloneSearchInterfaceTest() {
  describe('StandaloneSearchInterface', () => {
    let cmp: StandaloneSearchInterface;
    let options: IStandaloneSearchInterfaceOptions;
    let windoh = window;

    beforeEach(() => {
      windoh = Mock.mockWindow();
      options = {
        searchPageUri: 'https://connect.coveo.com/s/global-search/'
      };
      initializeComponent();
    });

    function initializeComponent() {
      cmp = new StandaloneSearchInterface(document.createElement('div'), options, {}, windoh);
    }

    it(`on a newQuery event
    should call handleRedirect`, () => {
      spyOn(cmp, 'handleRedirect');
      $$(cmp.root).trigger(QueryEvents.newQuery);
      expect(cmp.handleRedirect).toHaveBeenCalledTimes(1);
    });

    describe('calling handleRedirect', () => {
      let newQueryArgs: INewQueryEventArgs;

      beforeEach(() => {
        newQueryArgs = {
          cancel: false,
          searchAsYouType: false,
          shouldRedirectStandaloneSearchbox: true
        };
      });

      function handleRedirect() {
        cmp.handleRedirect(new Event(''), newQueryArgs);
      }

      it(`when shouldRedirectStandaloneSearchbox is false
      should not trigger the StandaloneSearchInterfaceEvents.beforeRedirect event`, () => {
        const spy = jasmine.createSpy('spy');
        $$(cmp.root).on(StandaloneSearchInterfaceEvents.beforeRedirect, spy);
        newQueryArgs.shouldRedirectStandaloneSearchbox = false;

        handleRedirect();

        expect(spy).not.toHaveBeenCalledTimes(1);
      });

      describe(`when shouldRedirectStandaloneSearchbox is true (default)`, () => {
        it(`should trigger the StandaloneSearchInterfaceEvents.beforeRedirect event`, () => {
          spyOn(cmp.queryController, 'fetchQueryExecutionPlan');
          const spy = jasmine.createSpy('spy');
          $$(cmp.root).on(StandaloneSearchInterfaceEvents.beforeRedirect, spy);

          handleRedirect();

          expect(spy).toHaveBeenCalledWith(
            jasmine.objectContaining({}),
            jasmine.objectContaining({
              searchPageUri: options.searchPageUri,
              cancel: false
            })
          );
        });

        it(`calls fetchQueryExecutionPlan`, () => {
          spyOn(cmp.queryController, 'fetchQueryExecutionPlan');

          handleRedirect();

          expect(cmp.queryController.fetchQueryExecutionPlan).toHaveBeenCalledTimes(1);
        });

        it(`when fetchQueryExecutionPlan returns an execution plan with a redirectionURL
        should call redirectToURL`, async done => {
          const plan = new ExecutionPlan(FakeResults.createFakePlanResponse());
          const promise = Promise.resolve(plan);
          spyOn(cmp.queryController, 'fetchQueryExecutionPlan').and.returnValue(promise);
          spyOn(cmp, 'redirectToURL');

          handleRedirect();
          await promise;

          expect(cmp.redirectToURL).toHaveBeenCalledWith(plan.redirectionURL);
          done();
        });

        it(`when fetchQueryExecutionPlan returns an execution plan without a redirectionURL
        should call redirectToSearchPage`, async done => {
          const planResponse = FakeResults.createFakePlanResponse();
          planResponse.preprocessingOutput.triggers = [];
          const plan = new ExecutionPlan(planResponse);
          const promise = Promise.resolve(plan);
          spyOn(cmp.queryController, 'fetchQueryExecutionPlan').and.returnValue(promise);
          spyOn(cmp, 'redirectToSearchPage');

          handleRedirect();
          await promise;

          expect(cmp.redirectToSearchPage).toHaveBeenCalledWith(options.searchPageUri);
          done();
        });

        it(`when fetchQueryExecutionPlan returns no execution plan
        should call redirectToSearchPage`, async done => {
          const promise = Promise.resolve(null);
          spyOn(cmp.queryController, 'fetchQueryExecutionPlan').and.returnValue(promise);
          spyOn(cmp, 'redirectToSearchPage');

          handleRedirect();
          await promise;

          expect(cmp.redirectToSearchPage).toHaveBeenCalledWith(options.searchPageUri);
          done();
        });
      });
    });

    describe('calling redirectToURL', () => {
      const redirectionURL = 'https://www.coveo.com/fr/solutions/commerce';

      it('should modify the window location', () => {
        expect(windoh.location.href).not.toContain(redirectionURL);
        cmp.redirectToURL(redirectionURL);

        expect(windoh.location.href).toContain(redirectionURL);
      });

      it('should call the right analytics event', () => {
        spyOn(cmp.usageAnalytics, 'logCustomEvent');
        spyOn(cmp.queryStateModel, 'get').and.returnValue('query');
        cmp.redirectToURL(redirectionURL);

        expect(cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.triggerRedirect,
          {
            redirectedTo: redirectionURL,
            query: 'query'
          },
          cmp.element
        );
      });
    });

    describe('calling redirectToSearchPage with a complex search page uri', () => {
      it('should merge the url fragments with the state', done => {
        expect(windoh.location.href).not.toContain('key=value');
        expect(windoh.location.href).not.toContain('t=MyTab');

        const spy = jasmine.createSpy('foo');
        spy.and.returnValue({
          key: 'value'
        });

        cmp.queryStateModel.getAttributes = spy;
        cmp.redirectToSearchPage('/mypage#t=MyTab');

        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          expect(windoh.location.href).toContain('#t=MyTab&key=value');
          done();
        }, 0);
      });

      it('should merge the url query string correctly', done => {
        expect(windoh.location.href).not.toContain('debug=true');

        const spy = jasmine.createSpy('foo');
        spy.and.returnValue({
          key: 'value'
        });

        cmp.queryStateModel.getAttributes = spy;
        cmp.redirectToSearchPage('/mypage?debug=true');

        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          expect(windoh.location.href).toContain('?debug=true#key=value');
          done();
        }, 0);
      });

      it('should merge the fragment and query string parameter correctly', done => {
        expect(windoh.location.href).not.toContain('debug=true');

        let spy = jasmine.createSpy('foo');
        spy.and.returnValue({
          key: 'value'
        });

        cmp.queryStateModel.getAttributes = spy;
        cmp.redirectToSearchPage('/mypage?debug=true#t=MyTab');

        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          expect(windoh.location.href).toContain('?debug=true#t=MyTab&key=value');
          done();
        }, 0);
      });
    });

    describe('calling redirectToSearchPage with a standard search page uri', () => {
      const searchPageUri = 'foo';

      it('should redirect on new query', done => {
        expect(windoh.location.href).not.toContain('foo');
        cmp.redirectToSearchPage('foo');
        setTimeout(() => {
          expect(windoh.location.href).toContain('foo');
          done();
        }, 0);
      });

      it('should set the state in the new location', done => {
        expect(windoh.location.href).not.toContain('key=value');
        let spy = jasmine.createSpy('foo');
        spy.and.returnValue({
          key: 'value'
        });
        cmp.queryStateModel.getAttributes = spy;
        cmp.redirectToSearchPage(searchPageUri);
        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          expect(windoh.location.href).toContain('key=value');
          done();
        }, 0);
      });

      it('should get the meta from the analytics client', done => {
        cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { foo: 'bar' });
        cmp.redirectToSearchPage(searchPageUri);
        setTimeout(() => {
          expect(windoh.location.href).toContain('firstQueryMeta={"foo":"bar"}');
          done();
        }, 0);
      });

      it('should get the cause from the analytics client', done => {
        cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.omniboxAnalytics, { foo: 'bar' });
        cmp.redirectToSearchPage(searchPageUri);
        setTimeout(() => {
          expect(windoh.location.href).toContain('firstQueryCause=omniboxAnalytics');
          done();
        }, 0);
      });

      it('should transform search box submit to search from link', done => {
        // for legacy reason, searchbox submit were always logged a search from link in an external search box.
        cmp.usageAnalytics.logSearchEvent(analyticsActionCauseList.searchboxSubmit, { foo: 'bar' });
        cmp.redirectToSearchPage(searchPageUri);
        setTimeout(() => {
          expect(windoh.location.href).toContain('firstQueryCause=searchFromLink');
          done();
        }, 0);
      });
    });

    describe(`when the StandaloneSearchInterface is using localstorage for history, when calling redirectToSearchPage`, () => {
      beforeEach(() => {
        options.enableHistory = true;
        options.useLocalStorageForHistory = true;
        initializeComponent();
      });

      it('does not include the state in the url hash', done => {
        let spy = jasmine.createSpy('foo');
        spy.and.returnValue({ key: 'value' });
        cmp.queryStateModel.getAttributes = spy;
        cmp.redirectToSearchPage(options.searchPageUri);

        setTimeout(() => {
          expect(windoh.location.href).not.toContain('key=value');
          done();
        }, 0);
      });

      it('includes the #firstQueryCause and #firstQueryMeta when a search event is logged', done => {
        const cause = analyticsActionCauseList.omniboxAnalytics;
        const metadata = { foo: 'bar' };

        cmp.usageAnalytics.logSearchEvent(cause, metadata);
        cmp.redirectToSearchPage(options.searchPageUri);

        setTimeout(() => {
          const href = windoh.location.href;
          expect(href).toContain(`firstQueryCause=${cause.name}`);
          expect(href).toContain(`firstQueryMeta=${JSON.stringify(metadata)}`);
          done();
        }, 0);
      });
    });
  });
}
