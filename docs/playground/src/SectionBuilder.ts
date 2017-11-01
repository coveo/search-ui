import { $$, Dom } from '../../../src/utils/Dom';
import { IStringMap } from '../../../src/rest/GenericParam';

export class SectionBuilder {
  constructor(public section = $$('div')) {}

  public withComponent(component: string, props: IStringMap<any> = {}, markupTag = 'div') {
    this.section.append($$(markupTag, { className: component, ...props }).el);
    return this;
  }

  public withDomElement(dom: Dom) {
    this.section.append(dom.el);
    return this;
  }

  public build() {
    return this.section;
  }
}
