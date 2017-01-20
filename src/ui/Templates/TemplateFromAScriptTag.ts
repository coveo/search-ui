import {Template, IFieldsToMatch} from './Template';
import {Utils} from '../../utils/Utils';
import {TemplateConditionEvaluator} from './TemplateConditionEvaluator';
import {ComponentOptions, IComponentOptionsFieldsOption} from '../Base/ComponentOptions';
import {ValidLayout} from '../ResultLayout/ResultLayout';
import {$$} from '../../utils/Dom';


export interface ITemplateFromStringProperties {
  condition?: string;
  layout?: ValidLayout
  mobile?: boolean;
  fieldsToMatch?: IFieldsToMatch[];
}

export class TemplateFromAScriptTag {
  constructor(public template: Template, public scriptTag: HTMLElement) {
    let condition = scriptTag.getAttribute('data-condition');
    if (condition != null) {
      // Allows to add quotes in data-condition on the templates
      condition = condition.toString().replace(/&quot;/g, '"');
      template.setConditionWithFallback(condition);
    } else {
      let parsedFieldsAttributes = this.parseFieldsAttributes(scriptTag);
      if (parsedFieldsAttributes && Utils.isNonEmptyArray(parsedFieldsAttributes)) {
        this.template.fieldsToMatch = parsedFieldsAttributes;
      }
    }

    this.template.layout = this.parseLayout(scriptTag);
    this.template.mobile = this.parseIsMobile(scriptTag);
    this.template.fields = TemplateConditionEvaluator.getFieldFromString(scriptTag.innerHTML + ' ' + condition);

    var additionalFields = ComponentOptions.loadFieldsOption(scriptTag, 'fields', <IComponentOptionsFieldsOption>{includeInResults: true});
    if (additionalFields != null) {
      // remove the @
      this.template.fields = this.template.fields.concat(_.map(additionalFields, (field) => field.substr(1)));
    }
  }

  toHtmlElement(): HTMLElement {
    var script = $$('script');
    script.setAttribute('data-condition', $$(this.scriptTag).getAttribute('data-condition'));
    script.text(this.scriptTag.innerHTML);
    return script.el;
  }

  parseFieldsAttributes(element: HTMLElement): IFieldsToMatch[] {
    let dataSet = element.dataset;
    return _.chain(dataSet)
            .map((value, key: string)=> {
              let match = key.match(/field([a-z0-9]*)/i);
              if (match) {
                return {
                  field: match[1].toLowerCase(),
                  values: value.split(',')
                }
              } else {
                return undefined
              }
            })
            .compact()
            .value();
  }

  parseIsMobile(element: HTMLElement): boolean {
    return Utils.parseBooleanIfNotUndefined(element.getAttribute('data-mobile'));
  }

  parseLayout(element: HTMLElement): ValidLayout {
    const layout = element.getAttribute('data-layout');
    return <ValidLayout>layout;
  }

  static fromString(template: string, properties: ITemplateFromStringProperties): HTMLElement {
    var script = document.createElement('script');
    script.text = template;
    if (properties.condition != null) {
      script.setAttribute('data-condition', properties.condition);
    }
    if (properties.layout != null) {
      script.setAttribute('data-layout', properties.layout);
    } else {
      script.setAttribute('data-layout', 'list');
    }
    if (properties.mobile != null) {
      script.setAttribute('data-mobile', properties.mobile.toString());
    } else {
      script.setAttribute('data-mobile', 'false');
    }
    if (properties.fieldsToMatch != null) {
      _.each(properties.fieldsToMatch, (fieldToMatch: IFieldsToMatch)=> {
        script.setAttribute(`data-field-${fieldToMatch.field.toLowerCase()}`, fieldToMatch.values.join(','));
      });
    }
    return script;
  }
}
