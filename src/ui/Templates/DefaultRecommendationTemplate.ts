import {Template} from './Template';
import {TemplateCache} from './TemplateCache';
import {IQueryResult} from '../../rest/QueryResult';

export class DefaultRecommendationTemplate extends Template {

  instantiateToString(object?: IQueryResult): string {
    var template =
      `<div class="coveo-result-frame">
        <div class="coveo-result-row" style="align-items: center">
          <div class="coveo-result-cell" style="flex-basis:40px;text-align:center;">
            <span class="CoveoIcon" data-small="true">
            </span>
          </div>
          <div class="coveo-result-cell" style="padding:0 0 3px 5px;font-size:10pt; flex-shrink: 1; min-width: 0">
            <a class="CoveoResultLink" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            </a>
          </div>
        </div>
      </div>`;
    return template;
  }

  instantiateToElement(object?: IQueryResult): HTMLElement {
    var div = document.createElement('div');
    div.innerHTML = this.instantiateToString(object);
    return div;
  }
}
