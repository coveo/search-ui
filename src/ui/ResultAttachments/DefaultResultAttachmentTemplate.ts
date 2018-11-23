import { Template } from '../Templates/Template';
import { IQueryResult } from '../../rest/QueryResult';

export class DefaultResultAttachmentTemplate extends Template {
  constructor() {
    super();
  }

  instantiateToString(queryResult?: IQueryResult): string {
    return '<div><span class="CoveoIcon"></span> <a class="CoveoResultLink"></a> <span class="CoveoQuickview"></span></div>';
  }
}
