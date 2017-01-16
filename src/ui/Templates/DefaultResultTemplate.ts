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

    const templates = _.chain(TemplateCache.getDefaultTemplates())
      .map(name => TemplateCache.getTemplate(name))
      .filter(template => template.layout === options.layout)
      .sortBy(template => template.condition == null) // Put templates with conditions first
      .value();

    for (let i = 0; i < templates.length; i++) {
      var result = templates[i].instantiateToString(queryResult, undefined, options);
      if (result != null) {
        return result;
      }
    }

    // TODO: add fallback templates for other layouts ?
    return _.template('<div>' +
      '<div class="coveo-title"><a class="CoveoResultLink"><%= title?Coveo.TemplateHelpers.getHelper("highlight").call(title, titleHighlights):clickUri %></a></div>' +
      '<% if(excerpt){ %><div class="coveo-excerpt"><%= Coveo.TemplateHelpers.getHelper("highlight").call(excerpt, excerptHighlights) %></div><% } %>' +
      '<table class="CoveoFieldTable"><%= Coveo.TemplateHelpers.getHelper("highlight").call() %></table>' +
      '</div>')(queryResult);
  }

  getFields() {
    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), (name) => TemplateCache.getTemplate(name));
    return _.flatten(_.map(defaultTemplates, (template: Template) => template.getFields()));
  }

  getType() {
    return 'DefaultResultTemplate';
  }
}
