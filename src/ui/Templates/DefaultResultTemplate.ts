import {Template} from './Template';
import {UnderscoreTemplate} from './UnderscoreTemplate';
import {TemplateCache} from './TemplateCache';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';


export class DefaultResultTemplate extends Template {

  constructor() {
    super();
  }

  instantiateToString(queryResult?: IQueryResult): string {
    Assert.exists(queryResult);
    queryResult = _.extend({}, queryResult, UnderscoreTemplate.templateHelpers);

    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), (name) => TemplateCache.getTemplate(name));

    // We want to put templates with conditions first
    defaultTemplates.sort((a, b) => {
      if (a.condition == null && b.condition != null) {
        return 1;
      } else if (a.condition != null && b.condition == null) {
        return -1;
      }
      return 0;
    });

    for (var i = 0; i < defaultTemplates.length; i++) {
      var result = defaultTemplates[i].instantiateToString(queryResult);
      if (result != null) {
        return result;
      }
    }

    return _.template('<div>' +
      '<div class="coveo-title"><a class="CoveoResultLink"><%= title?Coveo.TemplateHelpers.getHelper("highlight").call(title, titleHighlights):clickUri %></a></div>' +
      '<% if(excerpt){ %><div class="coveo-excerpt"><%= Coveo.TemplateHelpers.getHelper("highlight").call(excerpt, excerptHighlights) %></div><% } %>' +
      '<table class="CoveoFieldTable"><%= Coveo.TemplateHelpers.getHelper("highlight").call() %></table>' +
      '</div>')(queryResult);
  }

  instantiateToElement(queryResult?: IQueryResult): HTMLElement {
    var div = document.createElement('div');
    div.innerHTML = this.instantiateToString(queryResult);
    return div;
  }


  getFields() {
    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), (name) => TemplateCache.getTemplate(name));
    return _.flatten(_.map(defaultTemplates, (template: Template) => template.getFields()));
  }

  getType() {
    return 'DefaultResultTemplate'
  }
}
