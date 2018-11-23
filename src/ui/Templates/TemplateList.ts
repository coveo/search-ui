import { Template, IInstantiateTemplateOptions, DefaultInstantiateTemplateOptions } from './Template';
import { DefaultResultTemplate } from './DefaultResultTemplate';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import * as _ from 'underscore';

export class TemplateList extends Template {
  constructor(public templates: Template[]) {
    super();
    Assert.exists(templates);
  }

  instantiateToString(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): string {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);

    const filteredTemplates = _.reject(this.templates, t => t.role != null);
    for (var i = 0; i < filteredTemplates.length; i++) {
      var result = filteredTemplates[i].instantiateToString(object, merged);
      if (result != null) {
        return result;
      }
    }
    return this.getFallbackTemplate().instantiateToString(object, instantiateOptions);
  }

  instantiateToElement(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): Promise<HTMLElement> {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);

    const filteredTemplates = _.reject(this.templates, t => t.role != null);
    for (var i = 0; i < filteredTemplates.length; i++) {
      var promiseOfHTMLElement = filteredTemplates[i].instantiateToElement(object, merged);
      if (promiseOfHTMLElement != null) {
        return promiseOfHTMLElement;
      }
    }
    return this.getFallbackTemplate().instantiateToElement(object, merged);
  }

  getFields() {
    return _.reduce(this.templates, (fields: string[], template: Template) => fields.concat(template.getFields()), []);
  }

  getType() {
    return 'TemplateList';
  }

  protected getFallbackTemplate(): Template {
    return new DefaultResultTemplate();
  }
}
