import {Template, ITemplateOptions} from './Template';
import {UnderscoreTemplate} from './UnderscoreTemplate';
import {TemplateCache} from './TemplateCache';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';

/*
 * This renders the appropriate result template, found in TemplateCache,
 * according to its condition.
 *
 * For example, a result with a filetype of `YoutubeVideo` will get rendered
 * with the `YoutubeVideo` template, because the latter is registered with a
 * `condition` of `raw.filetype == 'YoutubeVideo'`.
 */
export class DefaultResultTemplate extends Template {

  constructor() {
    super();
  }

  instantiateToString(queryResult?: IQueryResult, checkCondition = true, options?: ITemplateOptions): string {
    Assert.exists(queryResult);
    queryResult = _.extend({}, queryResult, UnderscoreTemplate.templateHelpers);

    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), name => TemplateCache.getTemplate(name));

    // We want to put templates with conditions first
    const sortedTemplates = _.sortBy(defaultTemplates, template => template.condition == null);

    for (let i = 0; i < sortedTemplates.length; i++) {
      var result = sortedTemplates[i].instantiateToString(queryResult, undefined, options);
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

  instantiateToElement(queryResult?: IQueryResult, checkCondition = true, options?: ITemplateOptions): HTMLElement {
    var div = document.createElement('div');
    div.innerHTML = this.instantiateToString(queryResult, checkCondition, options);
    return div;
  }


  getFields() {
    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), (name) => TemplateCache.getTemplate(name));
    return _.flatten(_.map(defaultTemplates, (template: Template) => template.getFields()));
  }

  getType() {
    return 'DefaultResultTemplate';
  }
}
