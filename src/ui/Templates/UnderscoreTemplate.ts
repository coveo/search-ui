import {Template} from './Template';
import {ITemplateHelperFunction} from './TemplateHelpers';
import {Assert} from '../../misc/Assert';
import {ComponentOptions, IComponentOptionsFieldsOption} from '../Base/ComponentOptions';
import {Utils} from '../../utils/Utils';
import {ValidLayout} from '../ResultLayout/ResultLayout';
import {$$} from '../../utils/Dom';
import {DefaultResultTemplate} from './DefaultResultTemplate';
import {Logger} from '../../misc/Logger';

_.templateSettings = {
  evaluate: /(?:<%|{{)([\s\S]+?)(?:%>|}})/g,
  interpolate: /(?:<%|{{)=([\s\S]+?)(?:%>|}})/g,
  escape: /(?:<%|{{)-([\s\S]+?)(?:%>|}})/g
};

export class UnderscoreTemplate extends Template {
  private template: (data: any) => string;
  public static templateHelpers: { [templateName: string]: ITemplateHelperFunction; } = {};
  private fields: string[];

  public static mimeTypes = [
    'text/underscore',
    'text/underscore-template',
    'text/x-underscore',
    'text/x-underscore-template'
  ];

  constructor(public element: HTMLElement) {
    super();

    Assert.exists(element);
    var templateString = element.innerHTML;
    try {
      this.template = _.template(templateString);
    } catch (e) {
      new Logger(this).error('Cannot instantiate underscore template. Might be caused by strict Content-Security-Policy. Will fallback on a default template...', e);
    }

    let condition = element.getAttribute('data-condition');
    if (condition != null) {
      this.setConditionWithFallback(condition);
    }

    const layout = element.getAttribute('data-layout');
    if (layout) {
      this.layout = <ValidLayout>layout;
    }

    this.dataToString = (object) => {
      var extended = _.extend({}, object, UnderscoreTemplate.templateHelpers);
      if (this.template) {
        return this.template(extended);
      } else {
        return new DefaultResultTemplate().getFallbackTemplate();
      }

    };

    this.fields = Template.getFieldFromString(templateString + ' ' + condition);

    var additionalFields = ComponentOptions.loadFieldsOption(element, 'fields', <IComponentOptionsFieldsOption>{ includeInResults: true });
    if (additionalFields != null) {
      // remove the @
      this.fields = this.fields.concat(_.map(additionalFields, (field) => field.substr(1)));
    }
  }

  toHtmlElement(): HTMLElement {
    var script = $$('script');
    script.setAttribute('type', _.first(UnderscoreTemplate.mimeTypes));
    script.setAttribute('data-condition', $$(this.element).getAttribute('data-condition'));
    script.text(this.element.innerHTML);
    return script.el;
  }

  getType() {
    return 'UnderscoreTemplate';
  }

  static create(element: HTMLElement): UnderscoreTemplate {
    Assert.exists(element);
    return new UnderscoreTemplate(element);
  }

  static fromString(template: string, condition?: string, layout?: ValidLayout): UnderscoreTemplate {
    var script = document.createElement('script');
    script.text = template;
    if (condition != null) {
      script.setAttribute('data-condition', condition);
    }
    if (layout != null) {
      script.setAttribute('data-layout', layout);
    }
    script.setAttribute('type', UnderscoreTemplate.mimeTypes[0]);
    return new UnderscoreTemplate(script);
  }

  getFields() {
    return this.fields;
  }

  static registerTemplateHelper(helperName: string, helper: ITemplateHelperFunction) {
    UnderscoreTemplate.templateHelpers[helperName] = helper;
  }

  static isLibraryAvailable(): boolean {
    return Utils.exists(window['_']);
  }
}
