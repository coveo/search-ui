import { PendingSearchAsYouTypeSearchEvent } from '../../src/ui/Analytics/PendingSearchAsYouTypeSearchEvent';
import { AnalyticsEndpoint } from '../../src/rest/AnalyticsEndpoint';
import { FakeResults } from '../Fake';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { QueryEvents } from '../../src/events/QueryEvents';
import { $$ } from '../../src/utils/Dom';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Defer } from '../../src/MiscModules';

export function PendingSearchAsYouTypeSearchEventTest() {
  describe('PendingSearchAsYouTypeSearchEvent', () => {
    let pendingEvent: PendingSearchAsYouTypeSearchEvent;
    let root: HTMLElement;
    let endpoint: AnalyticsEndpoint;
    let searchInterface: SearchInterface;

    beforeEach(() => {
      root = document.createElement('div');
      searchInterface = new SearchInterface(root);
      endpoint = new AnalyticsEndpoint({
        token: 'token',
        serviceUrl: 'serviceUrl',
        organization: 'organization'
      });
    });

    afterEach(() => {
      root = null;
      pendingEvent = null;
      endpoint = null;
    });

    it('should allow to modify cause', () => {
      pendingEvent = new PendingSearchAsYouTypeSearchEvent(root, endpoint, FakeResults.createFakeSearchEvent(), true);
      pendingEvent.modifyEventCause(analyticsActionCauseList.documentTag);
      expect(pendingEvent.getEventCause()).toBe(analyticsActionCauseList.documentTag.name);
    });

    it('should allow to modify custom data', () => {
      pendingEvent = new PendingSearchAsYouTypeSearchEvent(root, endpoint, FakeResults.createFakeSearchEvent(), true);
      pendingEvent.modifyCustomData('foo', 'bar');
      expect(pendingEvent.getEventMeta()).toEqual(jasmine.objectContaining({ foo: 'bar' }));
    });

    it('should keep the original value for "q" before sending the event', done => {
      endpoint['sendSearchEvents'] = jasmine.createSpy('sendSearchEvents');
      pendingEvent = new PendingSearchAsYouTypeSearchEvent(root, endpoint, FakeResults.createFakeSearchEvent(), true);

      const duringQueryPromise = Promise.resolve(FakeResults.createFakeResults());

      // Set initial value for search box
      searchInterface.queryStateModel.set('q', 'foo');

      // arm the pending search event
      var duringQueryEventArgs = {
        promise: duringQueryPromise,
        query: new QueryBuilder().build()
      };
      $$(root).trigger(QueryEvents.duringQuery, duringQueryEventArgs);

      // change the content of the "search box"
      searchInterface.queryStateModel.set('q', 'bar');

      // send the event
      pendingEvent.sendRightNow();

      setTimeout(() => {
        // check that the original query is preserved
        expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              queryText: 'foo'
            })
          ])
        );
        done();
      }, 100);

      Defer.flush();
    });
  });
}
