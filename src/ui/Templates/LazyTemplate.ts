import {Template} from './Template';
import {IComponentOptionsTemplateOption} from '../Base/ComponentOptions';

export class LazyTemplate extends Template {
  private template: Template;

  constructor(private element: HTMLElement, private attrName: string, private option: IComponentOptionsTemplateOption) {
    super();
  }

  instantiateToString(object?: any, checkCondition = true): string {
    if (this.template === undefined) {
      this.template = this.option.load(this.element, this.attrName, _.extend({}, this.option, { lazy: false }));
      if (this.template == null) {
        if (this.option.defaultValue != null) {
          this.template = this.option.defaultValue;
        } else if (this.option.defaultFunction != null) {
          this.template = this.option.defaultFunction(this.element);
        }
      }
    }
    if (this.template != null) {
      return this.template.instantiateToString(object, checkCondition);
    }
    return null;
  }

  getType() {
    return 'LazyTemplate'
  }
}
