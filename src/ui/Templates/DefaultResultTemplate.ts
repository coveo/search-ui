import {
  Template, IInstantiateTemplateOptions,
  DefaultInstantiateTemplateOptions,
  ITemplateMetaFields,
  TemplateRole
} from './Template';
import { UnderscoreTemplate } from './UnderscoreTemplate';
import { TemplateCache } from './TemplateCache';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

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

  instantiateToString(object: IQueryResult | ITemplateMetaFields, instantiateOptions: IInstantiateTemplateOptions = {}): string {
    Assert.exists(object);
    let mergedOptions = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);
    object = _.extend({}, object, UnderscoreTemplate.templateHelpers);


    const templates = _.chain(TemplateCache.getDefaultTemplates())
      .map(name => TemplateCache.getTemplate(name))
      .value();

    if (instantiateOptions.role != null) {
      const roledTemplate = _.find(templates, t => t.role === instantiateOptions.role);
      if (roledTemplate) {
        return roledTemplate.instantiateToString(object, mergedOptions);
      } else {
        return this.getFallbackTemplateForRole(instantiateOptions.role);
      }
    }

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

  getFallbackTemplateForRole(role: TemplateRole): string {
    switch (role) {
      case 'table-header':
        return 'Table header <div class="CoveoText" data-value="patate"></div>';
      case 'table-footer':
        return 'Table footer';
      default:
        return '';
    }
  }

}
