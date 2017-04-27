export interface IAnalyticsEvent {
  actionCause: string;
  actionType: string;
  username?: string;
  userDisplayName?: string;
  anonymous?: boolean;
  device: string;
  mobile: boolean;
  originLevel1: string;
  originLevel2: string;
  originLevel3?: string;
  originContext: string;
  language: string;
  responseTime: number;
  userAgent?: string;
  userGroups?: string;
  customData?: { [key: string]: any };
}
