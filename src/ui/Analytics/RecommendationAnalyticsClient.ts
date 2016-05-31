import {LiveAnalyticsClient} from './LiveAnalyticsClient';
import {AnalyticsEndpoint} from '../../rest/AnalyticsEndpoint';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Recommendation} from '../Recommendation/Recommendation';

export class RecommendationAnalyticsClient extends LiveAnalyticsClient {
  
  constructor(public endpoint: AnalyticsEndpoint,
    public rootElement: HTMLElement,
    public userId: string,
    public userDisplayName: string,
    public anonymous: boolean,
    public splitTestRunName: string,
    public splitTestRunVersion: string,
    public originLevel1: string,
    public sendToCloud: boolean,
    public bindings: IComponentBindings) {
    super(endpoint, rootElement, userId, userDisplayName, anonymous, splitTestRunName, splitTestRunVersion, originLevel1, sendToCloud);
  }
    
  protected getOriginLevel2(element: HTMLElement): string{
    var recommendation = <Recommendation>this.bindings.searchInterface;
    return recommendation.getId();
  }
}