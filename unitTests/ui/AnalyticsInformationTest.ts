import { AnalyticsInformation } from '../../src/ui/Analytics/AnalyticsInformation';
import { buildHistoryStore } from '../../src/utils/HistoryStore';

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

    describe('without cookies', () => {
      it("doesn't have a visitorId", () => {
        expect(analyticsInformation.visitorId).toBeNull();
      });

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

    describe('with cookies', () => {
      const visitorId = 'def';
      const clientId = 'abc';
      beforeEach(() => {
        localStorage.setItem('visitorId', visitorId);
        localStorage.setItem('clientId', clientId);
      });

      it('has a visitorId', () => {
        expect(analyticsInformation.visitorId).toEqual(visitorId);
      });

      it('has a clientId', () => {
        expect(analyticsInformation.clientId).toEqual(clientId);
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
