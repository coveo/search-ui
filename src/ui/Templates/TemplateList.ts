import { Template, IInstantiateTemplateOptions, DefaultInstantiateTemplateOptions } from './Template';
import { DefaultResultTemplate } from './DefaultResultTemplate';
import { IQueryResult } from '../../rest/QueryResult';
import _ = require('underscore');

export class TemplateList extends Template {

  constructor(public templates: Template[]) {
    super();
  }

  instantiateToString(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): string {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);

    for (var i = 0; i < this.templates.length; i++) {
      var result = this.templates[i].instantiateToString(object, merged);
      if (result != null) {
        return result;
      }
    }
    return new DefaultResultTemplate().instantiateToString(object, instantiateOptions);
  }

  instantiateToElement(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): HTMLElement {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateOptions);
    for (var i = 0; i < this.templates.length; i++) {
      var element = this.templates[i].instantiateToElement(object, merged);
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
}
