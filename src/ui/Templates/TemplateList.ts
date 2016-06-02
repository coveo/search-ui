import {Template} from './Template';
import {DefaultResultTemplate} from './DefaultResultTemplate';

export class TemplateList extends Template {

  constructor(private templates: Template[]) {
    super();
  }

  instantiateToString(object?: any, checkCondition?: boolean): string {
    for (var i = 0; i < this.templates.length; i++) {
      var result = this.templates[i].instantiateToString(object, checkCondition);
      if (result != null) {
        return result;
      }
    }
    return new DefaultResultTemplate().instantiateToString(object);
  }

  instantiateToElement(object?: any, checkCondition = true): HTMLElement {
    for (var i = 0; i < this.templates.length; i++) {
      var element = this.templates[i].instantiateToElement(object, checkCondition);
      if (element != null) {
        return element;
      }
    }

    return new DefaultResultTemplate().instantiateToElement(object)
  }

  getFields() {
    return _.reduce(this.templates, (fields: string[], template: Template) => fields.concat(template.getFields()), []);
  }

  getType() {
    return 'TemplateList'
  }
}
