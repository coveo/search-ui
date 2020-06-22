import { IAnalyticsActionCause, analyticsActionCauseList } from '../ui/Analytics/AnalyticsActionListMeta';

export class AnalyticsUtils {
  static addActionCauseToList(newActionCause: IAnalyticsActionCause) {
    if (newActionCause.name && newActionCause.type) {
      analyticsActionCauseList[newActionCause.name] = newActionCause;
    }
  }

  static removeActionCauseFromList(actionCauseToRemoveName: string) {
    delete analyticsActionCauseList[actionCauseToRemoveName];
  }
}
