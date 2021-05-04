import { AnalyticsInformation } from '../../src/ui/Analytics/AnalyticsInformation';
import { buildHistoryStore } from '../../src/utils/HistoryStore';
import { Cookie } from '../../src/utils/CookieUtils';

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
      historyStore = buildHistoryStore();
      historyStore.clear();
      analyticsInformation.clear();
    });

    describe('without localstorage', () => {
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

    describe('with legacy cookies, but without localstorage', () => {
      const visitorId = 'def';

      beforeEach(() => {
        Cookie.set('visitorId', visitorId);
      });

      it('calling #clear removes the cookies', () => {
        analyticsInformation.clear();
        expect(analyticsInformation.clientId).toBeNull();
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
        addHistoryElement('PageVieww', 'abc');
      });

      it("doesn't have a pageId", () => {
        expect(analyticsInformation.lastPageId).toBeNull();
      });
    });

    describe('with a PageView event', () => {
      const pageId = 'ghi';
      beforeEach(() => {
        addHistoryElement('PageView', pageId);
      });

      it('has a pageId', () => {
        expect(analyticsInformation.lastPageId).toEqual(pageId);
      });
    });
  });
}
