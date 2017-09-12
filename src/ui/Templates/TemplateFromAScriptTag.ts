import { Template, IFieldsToMatch, TemplateRole } from './Template';
import { Utils } from '../../utils/Utils';
import { TemplateConditionEvaluator } from './TemplateConditionEvaluator';
import { ComponentOptions, IComponentOptionsFieldsOption } from '../Base/ComponentOptions';
import { ValidLayout } from '../ResultLayout/ResultLayout';
import { $$, Dom } from '../../utils/Dom';
import * as _ from 'underscore';
import { Initialization } from '../Base/Initialization';

export interface ITemplateFromStringProperties {
  condition?: string;
  layout?: ValidLayout;
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  fieldsToMatch?: IFieldsToMatch[];
  role?: TemplateRole;
}

export class TemplateFromAScriptTag {
  constructor(public template: Template, public scriptTag: HTMLElement) {
    let condition = scriptTag.getAttribute('data-condition');
    if (condition != null) {
      // Allows to add quotes in data-condition on the templates
      condition = condition.toString().replace(/&quot;/g, '"');
      template.setConditionWithFallback(condition);
    } else {
      const parsedFieldsAttributes = this.parseFieldsAttributes();
      if (parsedFieldsAttributes && Utils.isNonEmptyArray(parsedFieldsAttributes)) {
        this.template.fieldsToMatch = parsedFieldsAttributes;
      }
    }

    this.template.layout = this.parseLayout();
    this.template.mobile = this.parseScreenSize('data-mobile');
    this.template.tablet = this.parseScreenSize('data-tablet');
    this.template.desktop = this.parseScreenSize('data-desktop');
    this.template.fields = TemplateConditionEvaluator.getFieldFromString(`${scriptTag.innerHTML} ${condition ? condition : ''}`);

    this.template.role = <TemplateRole>scriptTag.getAttribute('data-role');

    this.template.addFields(TemplateConditionEvaluator.getFieldFromString(scriptTag.innerHTML + ' ' + condition) || []);

    // Additional fields that might be specified directly on the script element
    const additionalFields = ComponentOptions.loadFieldsOption(scriptTag, 'fields', <IComponentOptionsFieldsOption>{
      includeInResults: true
    });
    if (additionalFields != null) {
      // remove the @
      this.template.addFields(_.map(additionalFields, field => field.substr(1)));
    }

    // Additional fields that might be used to conditionally load the template when it's going to be rendered.
    this.template.addFields(
      _.map(this.template.fieldsToMatch, (toMatch: IFieldsToMatch) => {
        return toMatch.field;
      })
    );

    // Scan components in this template
    // return the fields needed for the content of this template
    const neededFieldsForComponents = _.chain(this.template.getComponentsInside(scriptTag.innerHTML))
      .map((component: string) => {
        return Initialization.getRegisteredFieldsComponentForQuery(component);
      })
      .flatten()
      .value();

    this.template.addFields(neededFieldsForComponents);
  }

  toHtmlElement(container?: Dom): HTMLElement {
    if (!container) {
      container = $$('code');
    }
    const condition = $$(this.scriptTag).getAttribute('data-condition');
    if (condition) {
      container.setAttribute('data-condition', condition);
    }
    container.setHtml(this.scriptTag.innerHTML);
    return container.el;
  }

  parseFieldsAttributes(): IFieldsToMatch[] {
    const dataSet = this.scriptTag.dataset;
    return _.chain(dataSet)
      .map((value, key: string) => {
        const match = key.match(/field([a-z0-9]*)/i);
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

  static fromString(
    template: string,
    properties: ITemplateFromStringProperties = {},
    container = document.createElement('code')
  ): HTMLElement {
    container.innerHTML = template;
    if (properties.condition != null) {
      container.setAttribute('data-condition', properties.condition);
    }
    if (properties.layout != null) {
      container.setAttribute('data-layout', properties.layout);
    } else {
      container.setAttribute('data-layout', 'list');
    }
    if (properties.mobile != null) {
      container.setAttribute('data-mobile', properties.mobile.toString());
    }
    if (properties.tablet != null) {
      container.setAttribute('data-tablet', properties.tablet.toString());
    }
    if (properties.desktop != null) {
      container.setAttribute('data-desktop', properties.desktop.toString());
    }
    if (properties.fieldsToMatch != null) {
      _.each(properties.fieldsToMatch, (fieldToMatch: IFieldsToMatch) => {
        if (fieldToMatch.values) {
          container.setAttribute(`data-field-${fieldToMatch.field.toLowerCase()}`, fieldToMatch.values.join(','));
        } else {
          container.setAttribute(`data-field-${fieldToMatch.field.toLowerCase()}`, null);
        }
      });
    }
    if (properties.role != null) {
      container.setAttribute('data-role', properties.role);
    }
    return container;
  }
}
