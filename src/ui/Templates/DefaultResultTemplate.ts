import {Template, ITemplateOptions} from './Template';
import {UnderscoreTemplate} from './UnderscoreTemplate';
import {TemplateCache} from './TemplateCache';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';

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

    return this.getFallbackTemplate();
  }

  getFields() {
    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), (name) => TemplateCache.getTemplate(name));
    return _.flatten(_.map(defaultTemplates, (template: Template) => template.getFields()));
  }

  getType() {
    return 'DefaultResultTemplate';
  }

  getFallbackTemplate(): string {
    let titleContainer = $$('div', {
      className: 'coveo-title'
    });

    let resultLink = $$('a', {
      className: 'CoveoResultLink'
    });

    titleContainer.append(resultLink.el);

    let excerpt = $$('div', {
      className: 'CoveoExcerpt'
    });

    let resultContainer = $$('div');
    resultContainer.append(titleContainer.el);
    resultContainer.append(excerpt.el);
    return resultContainer.el.outerHTML;
  }
}
