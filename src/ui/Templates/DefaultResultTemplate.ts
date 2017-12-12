import { Template, IInstantiateTemplateOptions, DefaultInstantiateTemplateOptions } from './Template';
import { UnderscoreTemplate } from './UnderscoreTemplate';
import { TemplateCache } from './TemplateCache';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { Initialization } from '../Base/Initialization';

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
    // For default result template, register everything since it's not possible to "scan" them before they are rendered.

    this.addFields(Initialization.getRegisteredFieldsForQuery());
  }

  instantiateToString(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): string {
    Assert.exists(object);
    let mergedOptions = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);
    object = _.extend({}, object, UnderscoreTemplate.templateHelpers);

    const templates = _.chain(TemplateCache.getDefaultTemplates())
      .map(name => TemplateCache.getTemplate(name))
      .value();

    // Put templates with conditions first
    const sortedTemplates = _.chain(templates)
      .sortBy(template => template.condition == null)
      .sortBy(template => template.fieldsToMatch == null)
      .value();

    for (let i = 0; i < sortedTemplates.length; i++) {
      const result = sortedTemplates[i].instantiateToString(object, mergedOptions);
      if (result != null) {
        return result;
      }
    }

    return this.getFallbackTemplate();
  }

  getFields() {
    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), name => TemplateCache.getTemplate(name));
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
