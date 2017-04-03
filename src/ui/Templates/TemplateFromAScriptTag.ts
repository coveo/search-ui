import { Template, IFieldsToMatch } from './Template';
import { Utils } from '../../utils/Utils';
import { TemplateConditionEvaluator } from './TemplateConditionEvaluator';
import { ComponentOptions, IComponentOptionsFieldsOption } from '../Base/ComponentOptions';
import { ValidLayout } from '../ResultLayout/ResultLayout';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export interface ITemplateFromStringProperties {
  condition?: string;
  layout?: ValidLayout;
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
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
      let parsedFieldsAttributes = this.parseFieldsAttributes();
      if (parsedFieldsAttributes && Utils.isNonEmptyArray(parsedFieldsAttributes)) {
        this.template.fieldsToMatch = parsedFieldsAttributes;
      }
    }

    this.template.layout = this.parseLayout();
    this.template.mobile = this.parseScreenSize('data-mobile');
    this.template.tablet = this.parseScreenSize('data-tablet');
    this.template.desktop = this.parseScreenSize('data-desktop');
    this.template.fields = TemplateConditionEvaluator.getFieldFromString(`${scriptTag.innerHTML} ${condition ? condition : ''}`);

    var additionalFields = ComponentOptions.loadFieldsOption(scriptTag, 'fields', <IComponentOptionsFieldsOption>{ includeInResults: true });
    if (additionalFields != null) {
      // remove the @
      this.template.fields = this.template.fields.concat(_.map(additionalFields, (field) => field.substr(1)));
    }
    this.template.fields = this.template.fields.concat(_.map(this.template.fieldsToMatch, (toMatch: IFieldsToMatch) => {
      return toMatch.field;
    }));
  }

  toHtmlElement(): HTMLElement {
    var script = $$('code');
    let condition = $$(this.scriptTag).getAttribute('data-condition');
    if (condition) {
      script.setAttribute('data-condition', condition);
    }
    script.setHtml(this.scriptTag.innerHTML);
    return script.el;
  }

  parseFieldsAttributes(): IFieldsToMatch[] {
    let dataSet = this.scriptTag.dataset;
    return _.chain(dataSet)
      .map((value, key: string) => {
        let match = key.match(/field([a-z0-9]*)/i);
        if (match) {
          let values;
          if (value != null && value != 'null' && value != '') {
            values = value.split(',');
          }
          return {
            field: match[1].toLowerCase(),
            values: values
          };
        } else {
          return undefined;
        }
      })
      .compact()
      .value();
  }

  parseScreenSize(attribute: string) {
    return Utils.parseBooleanIfNotUndefined(this.scriptTag.getAttribute(attribute));
  }

  parseLayout(): ValidLayout {
    const layout = this.scriptTag.getAttribute('data-layout');
    return <ValidLayout>layout;
  }

  static fromString(template: string, properties: ITemplateFromStringProperties = {}): HTMLElement {
    var script = document.createElement('code');
    script.innerHTML = template;
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
    }
    if (properties.tablet != null) {
      script.setAttribute('data-tablet', properties.tablet.toString());
    }
    if (properties.desktop != null) {
      script.setAttribute('data-desktop', properties.desktop.toString());
    }
    if (properties.fieldsToMatch != null) {
      _.each(properties.fieldsToMatch, (fieldToMatch: IFieldsToMatch) => {
        if (fieldToMatch.values) {
          script.setAttribute(`data-field-${fieldToMatch.field.toLowerCase()}`, fieldToMatch.values.join(','));
        } else {
          script.setAttribute(`data-field-${fieldToMatch.field.toLowerCase()}`, null);
        }

      });
    }
    return script;
  }
}
