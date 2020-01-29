import { Template } from '../Templates/Template';
import { IQueryResult } from '../../rest/QueryResult';

export class DefaultQuickviewTemplate extends Template {
  constructor() {
    super();
  }

  instantiateToString(queryResult?: IQueryResult): string {
    return '<div class="coveo-quick-view-full-height"><div class="CoveoQuickviewDocument"></div></div>';
  }
}
