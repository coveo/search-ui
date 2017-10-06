import { Template, IInstantiateTemplateOptions } from '../Templates/Template';
import { IQueryResult } from '../../rest/QueryResult';
import { $$ } from '../../utils/Dom';
import * as Globalize from 'globalize';

export class DefaultMatrixResultPreviewTemplate extends Template {
  constructor(private computedField: string, private format: string) {
    super();
  }

  instantiateToString(object?: IQueryResult, instantiateOptions?: IInstantiateTemplateOptions): string {
    var preview =
      "<div class='coveo-result-frame'>" +
      "<div class='coveo-result-row'>" +
      "<div class='coveo-result-cell' style='width: 40px; padding-right:5px;vertical-align: middle'>" +
      "<a class='CoveoIcon' data-small='true'></a>" +
      '</div>' +
      "<div class='coveo-result-cell' style='font-size:13px;vertical-align: middle'>" +
      "<a class='CoveoResultLink'></a>" +
      '</div>' +
      "<div class='coveo-result-cell' style='width:80px; text-align:right; font-size:13px; padding-right: 5px;vertical-align: middle'>" +
      Globalize.format(parseInt(object.raw[this.computedField.slice(1)]), this.format) +
      '</div>' +
      '</div>' +
      '</div>';
    return preview;
  }

  instantiateToElement(object?: IQueryResult, instantiateOptions?: IInstantiateTemplateOptions): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      return $$('div', undefined, this.instantiateToString(object)).el;
    });
  }
}
