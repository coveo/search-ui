import {PendingSearchAsYouTypeSearchEvent} from '../../src/ui/Analytics/PendingSearchAsYouTypeSearchEvent';
import {AnalyticsEndpoint} from '../../src/rest/AnalyticsEndpoint';
import {FakeResults} from '../Fake';
import {analyticsActionCauseList} from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function PendingSearchAsYouTypeSearchEventTest() {
  describe('PendingSearchAsYouTypeSearchEvent', () => {
    let pendingEvent: PendingSearchAsYouTypeSearchEvent;
    let root: HTMLElement;
    let endpoint: AnalyticsEndpoint;

    beforeEach(() => {
      root = document.createElement('div');
      endpoint = new AnalyticsEndpoint({
        token: 'token',
        serviceUrl: 'serviceUrl',
        organization: 'organization'
      })
    })

    afterEach(() => {
      root = null;
      pendingEvent = null;
      endpoint = null;
    })

    it('should allow to modify cause', () => {
      pendingEvent = new PendingSearchAsYouTypeSearchEvent(root, endpoint, FakeResults.createFakeSearchEvent(), true);
      pendingEvent.modifyEventCause(analyticsActionCauseList.documentTag);
      expect(pendingEvent.getEventCause()).toBe(analyticsActionCauseList.documentTag.name);
    })

    it('should allow to modify custom data', () => {
      pendingEvent = new PendingSearchAsYouTypeSearchEvent(root, endpoint, FakeResults.createFakeSearchEvent(), true);
      pendingEvent.modifyCustomData('foo', 'bar');
      expect(pendingEvent.getEventMeta()).toEqual(jasmine.objectContaining({ 'foo': 'bar' }));
    })
  })
}
