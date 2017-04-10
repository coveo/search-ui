import { Template, IInstantiateTemplateOptions, DefaultInstantiateTemplateOptions, TemplateRole } from './Template';
import { DefaultResultTemplate } from './DefaultResultTemplate';
import { IQueryResult } from '../../rest/QueryResult';
import _ = require('underscore');

export class TemplateList extends Template {

  constructor(public templates: Template[]) {
    super();
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

  instantiateToElement(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): HTMLElement {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);

    const filteredTemplates = _.reject(this.templates, t => t.role != null);
    for (var i = 0; i < filteredTemplates.length; i++) {
      var element = filteredTemplates[i].instantiateToElement(object, merged);
      if (element != null) {
        return element;
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
