import {Template} from './Template';
import {TemplateCache} from './TemplateCache';
import {IQueryResult} from '../../rest/QueryResult';

export class DefaultRecommendationTemplate extends Template {

  instantiateToString(object?: IQueryResult): string {
    var template = TemplateCache.getDefaultTemplate('Recommendation');
    return template.instantiateToString(object);
  }

  instantiateToElement(object?: IQueryResult): HTMLElement {
    var div = document.createElement('div');
    div.innerHTML = this.instantiateToString(object);
    return div;
  }
}
