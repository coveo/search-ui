import { IAnalyticsActionCause, analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { AnalyticsUtils } from '../../src/utils/AnalyticsUtils';

export function AnalyticsUtilsTest() {
  describe('utilities methods', () => {
    it('can add new actionCause to actionCauseList', () => {
      const testActionCause: IAnalyticsActionCause = {
        name: 'testActionCause',
        type: 'test'
      };
      AnalyticsUtils.addActionCauseToList(testActionCause);
      expect(analyticsActionCauseList[testActionCause.name]).toBe(testActionCause);
    });
    it('can remove actionCause from actionCauseList', () => {
      analyticsActionCauseList['testActionCause'] = {
        name: 'testActionCause',
        type: 'test'
      };
      AnalyticsUtils.removeActionCauseFromList('testActionCause');
      expect(analyticsActionCauseList['testActionCause']).toBe(undefined);
    });
  });
}
