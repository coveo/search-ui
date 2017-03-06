import {
  Template, IInstantiateTemplateOptions,
  DefaultInstantiateTemplateOptions
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

  instantiateToString(queryResult: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): string {
    Assert.exists(queryResult);
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);
    queryResult = _.extend({}, queryResult, UnderscoreTemplate.templateHelpers);

    // Put templates with conditions first
    let templates = _.chain(TemplateCache.getDefaultTemplates())
      .map(name => TemplateCache.getTemplate(name))
      .sortBy(template => template.condition == null)
      .sortBy(template => template.fieldsToMatch == null)
      .value();

    // For the DefaultResultTemplate, we want to display card only in mobile
    // The default list template are not adapted to mobile.
    if (merged.responsiveComponents.isSmallScreenWidth()) {
      templates = _.filter(templates, (tmpl) => tmpl.layout == 'card');
      merged.currentLayout = 'card';
      this.layout = 'card';
    } else {
      this.layout = merged.currentLayout;
    }

    for (let i = 0; i < templates.length; i++) {
      var result = templates[i].instantiateToString(queryResult, merged);
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
