import { AnalyticsInformation } from '../../src/ui/Analytics/AnalyticsInformation';
import { ScopedCookie } from '../../src/utils/CookieUtils';
import { buildHistoryStore } from '../../src/utils/HistoryStore';
import { MockCookie } from '../MockCookie';

type HistoryStore = ReturnType<typeof buildHistoryStore>;

export function AnalyticsInformationTest() {
  describe('AnalyticsInformation', () => {
    let historyStore: HistoryStore;
    function addHistoryElement(name: string, value: string) {
      historyStore.addElement({
        time: new Date().toTimeString(),
        internalTime: Date.now(),
        name,
        value
      });
    }

    let analyticsInformation: AnalyticsInformation;
    beforeEach(() => {
      analyticsInformation = new AnalyticsInformation();
      MockCookie.clear();
      localStorage.clear();
    });

    describe('without localstorage nor cookies', () => {
      it("doesn't have a clientId", () => {
        expect(analyticsInformation.clientId).toBeNull();
      });

      it('has a location', () => {
        expect(analyticsInformation.location).toEqual(document.location.href);
      });

      it('has a referrer', () => {
        expect(analyticsInformation.referrer).toEqual(document.referrer);
      });
    });

    describe('with cookies from coveo.analytics', () => {
      const cookieName = 'coveo_visitorId';
      const visitorId = 'def';

      beforeEach(() => {
        MockCookie.set(cookieName, visitorId);
      });

      it('has a clientId', () => {
        expect(analyticsInformation.clientId).toEqual(visitorId);
        4;
      });

      it('calling #clear removes the cookies', () => {
        analyticsInformation.clear();
        expect(MockCookie.get(cookieName)).toBeNull();
      });
    });

    it('retrieving lastPageId does not interact with the __coveo.analytics.history cookie', () => {
      // When HistoryStore interacts with cookies, browsers show a missing SameSite attribute warning.
      // To prevent this, the source code must initialize HistoryStore using a special helper.
      // The decoy value should remain intact after accessing lastPageId.

      const decoyValue = '__coveo.analytics.history=value';

      document.cookie = decoyValue;
      analyticsInformation.lastPageId;

      expect(document.cookie).toContain(decoyValue);
    });

    describe('with localstorage', () => {
      const visitorId = 'def';

      beforeEach(() => {
        localStorage.setItem('visitorId', visitorId);
      });

      it('has a clientId', () => {
        expect(analyticsInformation.clientId).toEqual(visitorId);
        4;
      });

      it('has a location', () => {
        expect(analyticsInformation.location).toEqual(document.location.href);
      });

      it('has a referrer', () => {
        expect(analyticsInformation.referrer).toEqual(document.referrer);
      });
    });

    describe('without a PageView event', () => {
      beforeEach(() => {
        historyStore = buildHistoryStore();
        addHistoryElement('PageVieww', 'abc');
      });

      it("doesn't have a pageId", () => {
        expect(analyticsInformation.lastPageId).toBeNull();
      });
    });

    describe('with a PageView event', () => {
      const pageId = 'ghi';
      beforeEach(() => {
        historyStore = buildHistoryStore();
        addHistoryElement('PageView', pageId);
      });

      it('has a pageId', () => {
        expect(analyticsInformation.lastPageId).toEqual(pageId);
      });
    });

    describe('when setting the clientId', () => {
      const testClientId = 'hello';
      beforeEach(() => {
        spyOn(ScopedCookie, 'set');
        new AnalyticsInformation().clientId = testClientId;
      });

      it('sets the cookie using the same utility as coveo.analytics', () => {
        expect(ScopedCookie.set).toHaveBeenCalledWith('visitorId', testClientId, 31556926000);
      });

      it('sets the cookie in the local storage', () => {
        expect(localStorage.getItem('visitorId')).toEqual(testClientId);
      });
    });
  });
}
