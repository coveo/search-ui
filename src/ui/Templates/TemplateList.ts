import { Template, IInstantiateTemplateOptions, DefaultInstantiateTemplateOptions, ITemplateMetaFields, TemplateRole } from './Template';
import { DefaultResultTemplate } from './DefaultResultTemplate';
import { IQueryResult } from '../../rest/QueryResult';
import _ = require('underscore');

export class TemplateList extends Template {

  constructor(public templates: Template[]) {
    super();
  }

  instantiateToString(object: IQueryResult | ITemplateMetaFields, instantiateOptions: IInstantiateTemplateOptions = {}): string {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);

    if (merged.role != null) {
      const roledTemplate = _.find(this.templates, t => t.role === merged.role);
      if (roledTemplate) {
        return roledTemplate.instantiateToString(object, merged);
      } else {
        return new DefaultResultTemplate().instantiateToString(object, merged);
      }
    }
    const filteredTemplates = _.reject(this.templates, t => t.role != null);
    for (var i = 0; i < filteredTemplates.length; i++) {
      var result = filteredTemplates[i].instantiateToString(object, merged);
      if (result != null) {
        return result;
      }
    }
    return new DefaultResultTemplate().instantiateToString(object, instantiateOptions);
  }

  instantiateToElement(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): HTMLElement {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);

    if (merged.role != null) {
      const roledTemplate = _.find(this.templates, t => t.role === merged.role);
      if (roledTemplate) {
        return roledTemplate.instantiateToElement(object, merged);
      } else {
        return new DefaultResultTemplate().instantiateToElement(object, merged);
      }
    }
    const filteredTemplates = _.reject(this.templates, t => t.role != null);
    for (var i = 0; i < filteredTemplates.length; i++) {
      var element = filteredTemplates[i].instantiateToElement(object, merged);
      if (element != null) {
        return element;
      }
    }
    return new DefaultResultTemplate().instantiateToElement(object, merged);
  }

  getFields() {
    return _.reduce(this.templates, (fields: string[], template: Template) => fields.concat(template.getFields()), []);
  }

  getType() {
    return 'TemplateList';
  }

  hasTemplateWithRole(role: TemplateRole) {
    return _.find(this.templates, t => t.role === role);
  }
}
