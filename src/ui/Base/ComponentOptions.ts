import {IFieldDescription} from '../../rest/FieldDescription';
import {Assert} from '../../misc/Assert';
import {Template} from '../Templates/Template';
import {$$} from '../../utils/Dom';
import {TemplateCache} from '../Templates/TemplateCache';
import {TemplateList} from '../Templates/TemplateList';
import {UnderscoreTemplate} from '../Templates/UnderscoreTemplate';
import {HtmlTemplate} from '../Templates/HtmlTemplate';
import {Utils} from '../../utils/Utils';
import {l} from '../../strings/Strings';

export interface IComponentOptionsLoadOption<T> {
  (element: HTMLElement, name: string, option: IComponentOptionsOption<T>): T
}

export interface IComponentOptionsPostProcessing<T> {
  (value: T, options: any): T
}

export interface IComponentOptionsOption<T> extends IComponentOptions<T> {
  type?: ComponentOptionsType;
  load?: IComponentOptionsLoadOption<T>;
}

export interface IComponentOptions<T> {
  defaultValue?: T;
  defaultFunction?: (element: HTMLElement) => T;
  required?: boolean;
  postProcessing?: IComponentOptionsPostProcessing<T>;
  attrName?: string;
  alias?: string;
  section?: string;
  depend?: string;
  priority?: number;
  deprecated?: string;
}

export interface IComponentOptionsNumberOption extends IComponentOptionsOption<number>, IComponentOptionsNumberOptionArgs {
}
export interface IComponentOptionsNumberOptionArgs extends IComponentOptions<number> {
  min?: number;
  max?: number;
  float?: boolean;
}

export interface IComponentOptionsListOption extends IComponentOptionsOption<string[]>, IComponentOptionsListOptionArgs {
}
export interface IComponentOptionsListOptionArgs extends IComponentOptions<string[]> {
  separator?: RegExp;
  values?: any;
}

export interface IComponentOptionsCustomListOptionArgs<T> extends IComponentOptions<T> {
  separator?: RegExp;
  values?: any;
}

export interface IComponentOptionsChildHtmlElementOption extends IComponentOptionsOption<HTMLElement>, IComponentOptionsChildHtmlElementOptionArgs {
}
export interface IComponentOptionsChildHtmlElementOptionArgs extends IComponentOptions<HTMLElement> {
  selectorAttr?: string;
  childSelector?: string;
}

export interface IComponentOptionsTemplateOption extends IComponentOptionsOption<Template>, IComponentOptionsTemplateOptionArgs {
}
export interface IComponentOptionsTemplateOptionArgs extends IComponentOptions<Template> {
  selectorAttr?: string;
  childSelector?: string;
  idAttr?: string;
}

export interface IComponentOptionsFieldOption extends IComponentOptionsOption<string>, IComponentOptionsFieldOptionArgs {
}
export interface IComponentOptionsFieldOptionArgs extends IComponentOptions<string> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface IComponentOptionsFieldsOption extends IComponentOptionsOption<string[]>, IComponentOptionsFieldsOptionArgs {
}
export interface IComponentOptionsFieldsOptionArgs extends IComponentOptions<string[]> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface IComponentOptionsObjectOption extends IComponentOptionsOption<{ [key: string]: any }>, IComponentOptionsObjectOptionArgs {
}
export interface IComponentOptionsObjectOptionArgs extends IComponentOptions<{ [key: string]: any }> {
  subOptions: { [key: string]: IComponentOptionsOption<any> };
}

export enum ComponentOptionsType {
  BOOLEAN,
  NUMBER,
  STRING,
  LOCALIZED_STRING,
  LIST,
  SELECTOR,
  CHILD_HTML_ELEMENT,
  TEMPLATE,
  FIELD,
  FIELDS,
  ICON,
  OBJECT,
  QUERY,
  HELPER,
  LONG_STRING,
  JSON,
  JAVASCRIPT,
  NONE
}

const camelCaseToHyphenRegex = /([A-Z])|\W+(\w)/g;
const fieldsSeperator = /\s*,\s*/;
const localizer = /([a-zA-Z\-]+)\s*:\s*(([^,]|,\s*(?!([a-zA-Z\-]+)\s*:))+)/g;

export class ComponentOptions {
  static buildBooleanOption(optionArgs?: IComponentOptions<boolean>): boolean {
    return ComponentOptions.buildOption<boolean>(ComponentOptionsType.BOOLEAN, ComponentOptions.loadBooleanOption, optionArgs);
  }

  static buildNumberOption(optionArgs?: IComponentOptionsNumberOptionArgs): number {
    return ComponentOptions.buildOption<number>(ComponentOptionsType.NUMBER, ComponentOptions.loadNumberOption, optionArgs);
  }

  static buildStringOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.STRING, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildIconOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.ICON, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildHelperOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.HELPER, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildJsonOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.JSON, ComponentOptions.loadStringOption, optionArgs);
  }

  static buildLocalizedStringOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.LOCALIZED_STRING, ComponentOptions.loadLocalizedStringOption, optionArgs);
  }

  static buildFieldOption(optionArgs?: IComponentOptionsFieldOptionArgs): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.FIELD, ComponentOptions.loadFieldOption, optionArgs);
  }

  static buildFieldsOption(optionArgs?: IComponentOptionsFieldsOptionArgs): string[] {
    return ComponentOptions.buildOption<string[]>(ComponentOptionsType.FIELDS, ComponentOptions.loadFieldsOption, optionArgs);
  }

  static buildListOption(optionArgs?: IComponentOptionsListOptionArgs): string[] {
    return ComponentOptions.buildOption<string[]>(ComponentOptionsType.LIST, ComponentOptions.loadListOption, optionArgs);
  }

  static buildSelectorOption(optionArgs?: IComponentOptions<HTMLElement>): HTMLElement {
    return ComponentOptions.buildOption<HTMLElement>(ComponentOptionsType.SELECTOR, ComponentOptions.loadSelectorOption, optionArgs);
  }

  static buildChildHtmlElementOption(optionArgs?: IComponentOptionsChildHtmlElementOptionArgs): HTMLElement {
    return ComponentOptions.buildOption<HTMLElement>(ComponentOptionsType.CHILD_HTML_ELEMENT, ComponentOptions.loadChildHtmlElementOption, optionArgs);
  }

  static buildTemplateOption(optionArgs?: IComponentOptionsTemplateOptionArgs): Template {
    return ComponentOptions.buildOption<Template>(ComponentOptionsType.TEMPLATE, ComponentOptions.loadTemplateOption, optionArgs);
  }

  static buildCustomOption<T>(converter: (value: string) => T, optionArgs?: IComponentOptions<T>): T {
    let loadOption: IComponentOptionsLoadOption<T> = (element: HTMLElement, name: string, option: IComponentOptionsOption<T>) => {
      let stringvalue = ComponentOptions.loadStringOption(element, name, option);
      if (!Utils.isNullOrEmptyString(stringvalue)) {
        return converter(stringvalue);
      }
    };
    return ComponentOptions.buildOption<T>(ComponentOptionsType.STRING, loadOption, optionArgs);
  }

  static buildCustomListOption<T>(converter: (value: string[]) => T, optionArgs?: IComponentOptionsCustomListOptionArgs<T>): T {
    let loadOption: IComponentOptionsLoadOption<T> = (element: HTMLElement, name: string, option: any) => {
      let stringvalue = ComponentOptions.loadListOption(element, name, option);
      return converter(stringvalue);
    };
    return ComponentOptions.buildOption<any>(ComponentOptionsType.LIST, loadOption, optionArgs);
  }

  static buildObjectOption(optionArgs?: IComponentOptionsObjectOptionArgs): any {
    let loadOption: IComponentOptionsLoadOption<{
      [key: string]: any
    }> = (element: HTMLElement, name: string, option: IComponentOptionsOption<any>) => {
      let keys = _.keys(optionArgs.subOptions);
      let scopedOptions: {
        [name: string]: IComponentOptionsOption<any>
      } = {};
      let scopedValues: {
        [name: string]: any
      } = {};
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let scopedkey = ComponentOptions.mergeCamelCase(name, key);
        scopedOptions[scopedkey] = optionArgs.subOptions[key];
      }
      ComponentOptions.initOptions(element, scopedOptions, scopedValues);
      let resultValues: {
        [name: string]: any
      } = {};
      let resultFound = false;
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let scopedkey = ComponentOptions.mergeCamelCase(name, key);
        if (scopedValues[scopedkey] != null) {
          resultValues[key] = scopedValues[scopedkey];
          resultFound = true;
        }
      }
      return resultFound ? resultValues : null;
    }
    return ComponentOptions.buildOption<{
      [key: string]: any
    }>(ComponentOptionsType.OBJECT, loadOption, optionArgs);
  }

  static buildOption<T>(type: ComponentOptionsType, load: IComponentOptionsLoadOption<T>, optionArg: IComponentOptions<T> = {}): T {
    let option: IComponentOptionsOption<T> = <any>optionArg;
    option.type = type;
    option.load = load;
    return <any>option;
  }

  static attrNameFromName(name: string, optionArgs?: IComponentOptions<any>) {
    if (optionArgs && optionArgs.attrName) {
      return optionArgs.attrName;
    }
    if (name) {
      return 'data-' + ComponentOptions.camelCaseToHyphen(name);
    }
    return name;
  }

  static camelCaseToHyphen(name: string) {
    return name.replace(camelCaseToHyphenRegex, '-$1$2').toLowerCase();
  }

  static mergeCamelCase(parent: string, name: string) {
    return parent + name.substr(0, 1).toUpperCase() + name.substr(1)
  }

  static initComponentOptions(element: HTMLElement, component: any, values?: any) {
    return ComponentOptions.initOptions(element, component.options, values, component.ID);
  }

  static initOptions(element: HTMLElement, options: {
    [name: string]: IComponentOptionsOption<any>
  }, values?: any, componentID?: any) {
    if (values == null) {
      values = {};
    }
    let names: string[] = _.keys(options);
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      let optionDefinition = options[name];
      let value: any;
      let loadFromAttribute = optionDefinition.load;

      if (loadFromAttribute != null) {
        value = loadFromAttribute(element, name, optionDefinition);
        if (value && optionDefinition.deprecated) {
          console.log(componentID + '.' + name + ' : ' + optionDefinition.deprecated);
        }
      }

      if (Utils.isNullOrUndefined(value) && values[name] != undefined) {
        value = values[name];
      }

      if (value == null && values[name] == undefined) {
        if (optionDefinition.defaultValue != null) {
          if (optionDefinition.type == ComponentOptionsType.LIST) {
            value = _.extend([], optionDefinition.defaultValue);
          } else if (optionDefinition.type == ComponentOptionsType.OBJECT) {
            value = _.extend({}, optionDefinition.defaultValue);
          } else {
            value = optionDefinition.defaultValue;
          }
        } else if (optionDefinition.defaultFunction != null) {
          value = optionDefinition.defaultFunction(element);
        }
      }
      if (value != null) {
        if (optionDefinition.type == ComponentOptionsType.OBJECT && values[name] != null) {
          values[name] = _.extend(values[name], value);
        } else if (optionDefinition.type == ComponentOptionsType.LOCALIZED_STRING) {
          values[name] = l(value);
        } else {
          values[name] = value;
        }
      }
      if (value == null && values[name] == undefined && optionDefinition.required) {
        throw new Error(componentID + '.' + name + ' is required');
      }
    }
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      let optionDefinition = options[name];
      if (optionDefinition.postProcessing) {
        values[name] = optionDefinition.postProcessing(values[name], values);
      }
    }
    return values;
  }

  static loadStringOption(element: HTMLElement, name: string, option: IComponentOptions<any>): string {
    return element.getAttribute(ComponentOptions.attrNameFromName(name, option)) || ComponentOptions.getAttributeFromAlias(element, option);
  }

  static loadFieldOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string {
    let field = ComponentOptions.loadStringOption(element, name, option);
    Assert.check(!Utils.isNonEmptyString(field) || Utils.isCoveoField(field), field + ' is not a valid field');
    return field;
  }

  static loadFieldsOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string[] {
    let fieldsAttr = ComponentOptions.loadStringOption(element, name, option);
    if (fieldsAttr == null) {
      return null;
    }
    let fields = fieldsAttr.split(fieldsSeperator);
    _.each(fields, (field: string) => {
      Assert.check(Utils.isCoveoField(field), field + ' is not a valid field');
    });
    return fields;
  }

  static loadLocalizedStringOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string {
    let attributeValue = ComponentOptions.loadStringOption(element, name, option);
    let locale: string = String['locale'] || String['defaultLocale'];
    if (locale != null && attributeValue != null) {
      let localeParts = locale.toLowerCase().split('-');
      let locales = _.map(localeParts, (part, i) => localeParts.slice(0, i + 1).join('-'));
      let localizers = attributeValue.match(localizer);
      if (localizers != null) {
        for (let i = 0; i < localizers.length; i++) {
          let groups = localizer.exec(localizers[i]);
          if (groups != null) {
            let lang = groups[1].toLowerCase();
            if (_.contains(locales, lang)) {
              return groups[2].replace(/^\s+|\s+$/g, '');
            }
          }
        }
      }
      return attributeValue != null ? attributeValue.toLocaleString() : null;
    }
    return attributeValue;
  }

  static loadNumberOption(element: HTMLElement, name: string, option: IComponentOptionsNumberOption): number {
    let attributeValue = ComponentOptions.loadStringOption(element, name, option);
    if (attributeValue == null) {
      return null;
    }
    let numberValue = option.float === true ? Utils.parseFloatIfNotUndefined(attributeValue) : Utils.parseIntIfNotUndefined(attributeValue);
    if (option.min != null && option.min > numberValue) {
      numberValue = option.min;
    }
    if (option.max != null && option.max < numberValue) {
      numberValue = option.max;
    }
    return numberValue;
  }

  static loadBooleanOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): boolean {
    return Utils.parseBooleanIfNotUndefined(ComponentOptions.loadStringOption(element, name, option));
  }

  static loadListOption(element: HTMLElement, name: string, option: IComponentOptionsListOption): string[] {
    let separator = option.separator || /\s*,\s*/;
    let attributeValue = ComponentOptions.loadStringOption(element, name, option);
    return Utils.isNonEmptyString(attributeValue) ? attributeValue.split(separator) : null;
  }

  static loadEnumOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>, _enum: any): number {
    let enumAsString = ComponentOptions.loadStringOption(element, name, option);
    return enumAsString != null ? _enum[enumAsString] : null;
  }

  static loadSelectorOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>, doc: Document = document): HTMLElement {
    let attributeValue = ComponentOptions.loadStringOption(element, name, option)
    return Utils.isNonEmptyString(attributeValue) ? <HTMLElement>doc.querySelector(attributeValue) : null;
  }

  static loadChildHtmlElementOption(element: HTMLElement, name: string, option: IComponentOptionsChildHtmlElementOption, doc: Document = document): HTMLElement {
    let htmlElement: HTMLElement;
    // Attribute: selector
    let selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
    let selector = element.getAttribute(selectorAttr) || ComponentOptions.getAttributeFromAlias(element, option);
    if (selector != null) {
      htmlElement = <HTMLElement>doc.body.querySelector(selector);
    }
    // Child
    if (htmlElement == null) {
      let childSelector = option.childSelector;
      if (childSelector == null) {
        childSelector = '.' + name;
      }
      htmlElement = ComponentOptions.loadChildHtmlElementFromSelector(element, childSelector);
    }
    return htmlElement;
  }

  static loadChildHtmlElementFromSelector(element: HTMLElement, selector: string): HTMLElement {
    Assert.isNonEmptyString(selector);
    if ($$(element).is(selector)) {
      return element;
    }
    return <HTMLElement>$$(element).find(selector);
  }

  static loadChildrenHtmlElementFromSelector(element: HTMLElement, selector: string): HTMLElement[] {
    Assert.isNonEmptyString(selector);
    return $$(element).findAll(selector);
  }

  static loadTemplateOption(element: HTMLElement, name: string, option: IComponentOptionsTemplateOption, doc: Document = document): Template {

    let template: Template;

    // Attribute: template selector
    let selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
    let selector = element.getAttribute(selectorAttr) || ComponentOptions.getAttributeFromAlias(element, option);
    if (selector != null) {
      let templateElement = <HTMLElement>doc.querySelector(selector);
      if (templateElement != null) {
        template = ComponentOptions.createResultTemplateFromElement(templateElement);
      }
    }
    // Attribute: template id
    if (template == null) {
      let idAttr = option.idAttr || ComponentOptions.attrNameFromName(name, option) + '-id';
      let id = element.getAttribute(idAttr) || ComponentOptions.getAttributeFromAlias(element, option);
      if (id != null) {
        template = ComponentOptions.loadResultTemplateFromId(id);
      }
    }
    // Child
    if (template == null) {
      let childSelector = option.childSelector;
      if (childSelector == null) {
        childSelector = '.' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
      template = ComponentOptions.loadChildrenResultTemplateFromSelector(element, childSelector);
    }
    return template;
  }

  static loadResultTemplateFromId(templateId: string): Template {
    return Utils.isNonEmptyString(templateId) ? TemplateCache.getTemplate(templateId) : null;
  }

  static loadChildrenResultTemplateFromSelector(element: HTMLElement, selector: string): Template {
    let foundElements = ComponentOptions.loadChildrenHtmlElementFromSelector(element, selector);
    if (foundElements.length > 0) {
      return new TemplateList(_.compact(_.map(foundElements, (element) => ComponentOptions.createResultTemplateFromElement(element))));
    }
    return null;
  }

  static findParentScrolling(element: HTMLElement, doc: Document = document): HTMLElement {
    while (<Node>element != doc && element != null) {
      if (ComponentOptions.isElementScrollable(element)) {
        if (element.tagName.toLowerCase() !== 'body') {
          return element;
        }
        return <any>window;
      }
      element = element.parentElement;
    }
    return <any>window;
  }

  static isElementScrollable(element: HTMLElement) {
    return $$(element).css('overflow-y') == 'scroll' || element.style.overflowY == 'scroll';
  }

  static getAttributeFromAlias(element: HTMLElement, option: IComponentOptions<any>) {
    if (option.alias) {
      return element.getAttribute(ComponentOptions.attrNameFromName(option.alias));
    }
  }

  static createResultTemplateFromElement(element: HTMLElement): Template {
    Assert.exists(element);
    let type = element.getAttribute('type');
    let mimeTypes = 'You must specify the type of template. Valid values are :' +
      ' ' + UnderscoreTemplate.mimeTypes.toString() +
      ' ' + HtmlTemplate.mimeTypes.toString()
    Assert.check(Utils.isNonEmptyString(type), mimeTypes);

    if (_.indexOf(UnderscoreTemplate.mimeTypes, type) != -1) {
      return UnderscoreTemplate.create(element);
    } else if (_.indexOf(HtmlTemplate.mimeTypes, type) != -1) {
      return new HtmlTemplate(element);
    } else {
      Assert.fail('Cannot guess template type from attribute: ' + type + '. Valid values are ' + mimeTypes);
      return undefined;
    }
  }
}
