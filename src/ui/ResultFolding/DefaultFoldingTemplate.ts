import { Template } from '../Templates/Template';
import { IQueryResult } from '../../rest/QueryResult';

export class DefaultFoldingTemplate extends Template {
  constructor() {
    super();
  }

  instantiateToString(queryResult?: IQueryResult): string {
    return '<div class="coveo-child-result"><span class="CoveoIcon" data-small="true"></span> <a class="CoveoResultLink"></a> <span class="CoveoQuickview"></span></div>';
  }

  getType() {
    return 'DefaultFoldingTemplate';
  }
}
