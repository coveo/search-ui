import { IAnalyticsActionCause, analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { AnalyticsUtils, IClientInformationProvider } from '../../src/utils/AnalyticsUtils';
import { buildHistoryStore } from '../../src/utils/HistoryStore';

type Writable<T> = { -readonly [P in keyof T]: T[P] };

type HistoryStore = ReturnType<typeof buildHistoryStore>;

export function AnalyticsUtilsTest() {
  function replaceInstance(newInstance: AnalyticsUtils) {
    AnalyticsUtils['currentInstance'] = newInstance;
  }

  describe('AnalyticsUtils', () => {
    let historyStore: HistoryStore;
    function addHistoryElement(name: string, value: string) {
      historyStore.addElement({
        time: new Date().toTimeString(),
        internalTime: Date.now(),
        name,
        value
      });
    }

    beforeEach(() => {
      replaceInstance(null);
      historyStore = buildHistoryStore();
      historyStore.clear();
    });

    it('is a singleton', () => {
      const firstInstance = AnalyticsUtils.instance;
      expect(firstInstance).not.toBeNull();
      replaceInstance(null);
      const secondInstance = AnalyticsUtils.instance;
      expect(secondInstance).not.toBe(firstInstance);
      replaceInstance(firstInstance);
      expect(AnalyticsUtils.instance).toEqual(firstInstance);
    });

    describe('without a client information provider', () => {
      it("doesn't have a visitorId", () => {
        expect(AnalyticsUtils.instance.visitorId).toBeNull();
      });

      it("doesn't have a clientId", () => {
        expect(AnalyticsUtils.instance.clientId).toBeNull();
      });

      it('has a location', () => {
        expect(AnalyticsUtils.instance.location).toEqual(document.location.href);
      });

      it('has a referrer', () => {
        expect(AnalyticsUtils.instance.referrer).toEqual(document.referrer);
      });
    });

    describe('with a client information provider', () => {
      const clientId = 'abc';
      const visitorId = 'def';
      let provider: Writable<IClientInformationProvider>;
      beforeEach(() => {
        provider = {
          clientId,
          visitorId,
          disabled: false
        };
        AnalyticsUtils.instance.setClientInformationProvider(provider);
      });

      it('has a visitorId', () => {
        expect(AnalyticsUtils.instance.visitorId).toEqual(visitorId);
      });

      it('has a clientId', () => {
        expect(AnalyticsUtils.instance.clientId).toEqual(clientId);
      });

      it('has a location', () => {
        expect(AnalyticsUtils.instance.location).toEqual(document.location.href);
      });

      it('has a referrer', () => {
        expect(AnalyticsUtils.instance.referrer).toEqual(document.referrer);
      });

      describe('when the client information provider is disabled', () => {
        beforeEach(() => {
          provider.disabled = true;
        });

        it("doesn't have a visitorId", () => {
          expect(AnalyticsUtils.instance.visitorId).toBeNull();
        });

        it("doesn't have a clientId", () => {
          expect(AnalyticsUtils.instance.clientId).toBeNull();
        });

        it('has a location', () => {
          expect(AnalyticsUtils.instance.location).toEqual(document.location.href);
        });

        it('has a referrer', () => {
          expect(AnalyticsUtils.instance.referrer).toEqual(document.referrer);
        });
      });
    });

    describe('without a PageView event', () => {
      beforeEach(() => {
        addHistoryElement('PageVieww', 'abc');
      });

      it("doesn't have a pageId", () => {
        expect(AnalyticsUtils.instance.pageId).toBeNull();
      });
    });

    describe('with a PageView event', () => {
      const pageId = 'ghi';
      beforeEach(() => {
        addHistoryElement('PageView', pageId);
      });

      it('has a pageId', () => {
        expect(AnalyticsUtils.instance.pageId).toEqual(pageId);
      });
    });

    describe('utilities methods', () => {
      it('can add new actionCause to actionCauseList', () => {
        const testActionCause: IAnalyticsActionCause = {
          name: 'testActionCause',
          type: 'test'
        };
        AnalyticsUtils.instance.addActionCauseToList(testActionCause);
        expect(analyticsActionCauseList[testActionCause.name]).toBe(testActionCause);
      });

      it('can remove actionCause from actionCauseList', () => {
        analyticsActionCauseList['testActionCause'] = {
          name: 'testActionCause',
          type: 'test'
        };
        AnalyticsUtils.instance.removeActionCauseFromList('testActionCause');
        expect(analyticsActionCauseList['testActionCause']).toBe(undefined);
      });
    });
  });
}
