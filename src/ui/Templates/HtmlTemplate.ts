import {Template} from './Template';
import {ComponentOptions, IComponentOptionsFieldsOption} from '../Base/ComponentOptions';
import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';


export class HtmlTemplate extends Template {

  public static mimeTypes = [
    'text/html'
  ];

  private fields: string[];

  constructor(public element: HTMLElement) {
    super(() => {
      return element.innerHTML;
    });

    var condition = $$(element).getAttribute('data-condition')
    if (condition != null) {
      // Allows to add quotes in data-condition on the templates
      condition = condition.toString().replace(/&quot;/g, '"');
      this.condition = new Function('obj', 'with(obj||{}){return ' + condition + '}')
    }

    this.fields = Template.getFieldFromString(element.innerHTML + ' ' + condition);

    var additionalFields = ComponentOptions.loadFieldsOption(element, 'fields', <IComponentOptionsFieldsOption>{ includeInResults: true });
    if (additionalFields != null) {
      // remove the @
      this.fields = this.fields.concat(_.map(additionalFields, (field) => field.substr(1)));
    }
  }

  toHtmlElement(): HTMLElement {
    var script = $$('script');
    script.setAttribute('type', _.first(HtmlTemplate.mimeTypes));
    script.setAttribute('data-condition', $$(this.element).getAttribute('data-condition'));
    script.text(this.element.innerHTML);
    return script.el;
  }

  getType() {
    return 'HtmlTemplate'
  }

  getFields(): string[] {
    return this.fields;
  }

  static create(element: HTMLElement): HtmlTemplate {
    Assert.exists(element);
    return new HtmlTemplate(element);
  }

  static fromString(template: string, condition?: string): HtmlTemplate {
    var script = document.createElement('script');
    script.text = template;
    if (condition != null) {
      $$(script).setAttribute('data-condition', condition);
    }
    $$(script).setAttribute('type', HtmlTemplate.mimeTypes[0]);
    return new HtmlTemplate(script);
  }
}
