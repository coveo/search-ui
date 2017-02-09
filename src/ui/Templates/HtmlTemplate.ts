import { Template } from './Template';
import { Assert } from '../../misc/Assert';
import { TemplateFromAScriptTag, ITemplateFromStringProperties } from './TemplateFromAScriptTag';
import _ = require('underscore');

export class HtmlTemplate extends Template {

  public static mimeTypes = [
    'text/html',
    'text/HTML'
  ];

  private templateFromAScriptTag: TemplateFromAScriptTag;

  constructor(public element: HTMLElement) {
    super(() => element.innerHTML);
    this.templateFromAScriptTag = new TemplateFromAScriptTag(this, this.element);
  }

  toHtmlElement(): HTMLElement {
    let script = this.templateFromAScriptTag.toHtmlElement();
    script.setAttribute('type', _.first(HtmlTemplate.mimeTypes));
    return script;
  }

  getType() {
    return 'HtmlTemplate';
  }

  getFields(): string[] {
    return this.fields;
  }

  static create(element: HTMLElement): HtmlTemplate {
    Assert.exists(element);
    return new HtmlTemplate(element);
  }

  static fromString(template: string, properties: ITemplateFromStringProperties): HtmlTemplate {
    let script = TemplateFromAScriptTag.fromString(template, properties);
    script.setAttribute('type', HtmlTemplate.mimeTypes[0]);
    return new HtmlTemplate(script);
  }
}
