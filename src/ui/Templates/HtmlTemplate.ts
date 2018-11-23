import { Template } from './Template';
import { Assert } from '../../misc/Assert';
import { TemplateFromAScriptTag, ITemplateFromStringProperties } from './TemplateFromAScriptTag';

export class HtmlTemplate extends Template {
  public static mimeTypes = ['text/html', 'text/HTML'];

  private templateFromAScriptTag: TemplateFromAScriptTag;

  constructor(public element: HTMLElement) {
    super(() => element.innerHTML);
    this.templateFromAScriptTag = new TemplateFromAScriptTag(this, this.element);
  }

  toHtmlElement(): HTMLElement {
    let script = this.templateFromAScriptTag.toHtmlElement();
    // We don't set the type attribute for 2 reasons:
    // 1) LockerService doesn't like when we set it.
    // 2) The HTML Template is the default one.

    return script;
  }

  getType() {
    return 'HtmlTemplate';
  }

  static create(element: HTMLElement): HtmlTemplate {
    Assert.exists(element);
    return new HtmlTemplate(element);
  }

  static fromString(template: string, properties: ITemplateFromStringProperties): HtmlTemplate {
    let script = TemplateFromAScriptTag.fromString(template, properties);

    // We don't set the type attribute for 2 reasons:
    // 1) LockerService doesn't like when we set it.
    // 2) The HTML Template is the default one.
    return new HtmlTemplate(script);
  }

  protected getTemplateInfo() {
    return this.element;
  }
}
