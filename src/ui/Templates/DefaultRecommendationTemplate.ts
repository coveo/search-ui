import { Template } from './Template';
import { IQueryResult } from '../../rest/QueryResult';

export class DefaultRecommendationTemplate extends Template {
  instantiateToString(object?: IQueryResult): string {
    var template = `<div class="coveo-result-frame">
        <div class="coveo-result-row">
          <div class="coveo-result-cell" style="width:40px;text-align:center;vertical-align:middle;">
            <span class="CoveoIcon" data-small="true" data-with-label="false">
            </span>
          </div>
          <div class="coveo-result-cell" style="padding:0 0 3px 5px;vertical-align:middle">
            <div class="coveo-result-row">
              <div class="coveo-result-cell" style="font-size:10pt;">
                <a class="CoveoResultLink" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    return template;
  }

  instantiateToElement(object?: IQueryResult): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      var div = document.createElement('div');
      div.innerHTML = this.instantiateToString(object);
      resolve(div);
    });
  }
}
