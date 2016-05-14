import {IFieldDescription} from '../../rest/FieldDescription';
import {IComponentDefinition} from './Component';
import {Assert} from '../../misc/Assert';
import {Template} from '../Templates/Template';
import {$$} from '../../utils/Dom';
import {LazyTemplate} from '../Templates/LazyTemplate';
import {TemplateCache} from '../Templates/TemplateCache';
import {TemplateList} from '../Templates/TemplateList';
import {UnderscoreTemplate} from '../Templates/UnderscoreTemplate';
import {HtmlTemplate} from '../Templates/HtmlTemplate';
import {isNonEmptyString, isCoveoField, parseFloatIfNotUndefined, parseIntIfNotUndefined, parseBooleanIfNotUndefined} from '../../utils/Utils';
import _ = require('underscore');

export interface LoadOption<T> {
  (element: HTMLElement, name: string, option: Option<T>): T
}

export interface PostProcessing<T> {
  (value: T, options: any): T
}

export interface Option<T> extends OptionArgs<T> {
  type?: Type;
  load?: LoadOption<T>;
}

export interface OptionArgs<T> {
  defaultValue?: T;
  defaultFunction?: (element: HTMLElement) => T;
  required?: boolean;
  postProcessing?: PostProcessing<T>;
  attrName?: string;
  section?:string;
  depend?:string;
  priority?:number;
}

export interface NumberOption extends Option<number>, NumberOptionArgs {
}
export interface NumberOptionArgs extends OptionArgs<number> {
  min?: number;
  max?: number;
  float?: boolean;
}

export interface ListOption extends Option<string[]>, ListOptionArgs {
}
export interface ListOptionArgs extends OptionArgs<string[]> {
  separator?: RegExp;
  values?: any;
}

export interface ChildHtmlElementOption extends Option<HTMLElement>, ChildHtmlElementOptionArgs {
}
export interface ChildHtmlElementOptionArgs extends OptionArgs<HTMLElement> {
  selectorAttr?: string;
  childSelector?: string;
}

export interface TemplateOption extends Option<Template>, TemplateOptionArgs {
}
export interface TemplateOptionArgs extends OptionArgs<Template> {
  selectorAttr?: string;
  childSelector?: string;
  idAttr?: string;
  // CAREFULL WITH LAZY: This disable the option to use init option for this option
  lazy?: boolean;
}

export interface FieldOption extends Option<string>, FieldOptionArgs {
}
export interface FieldOptionArgs extends OptionArgs<string> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface FieldsOption extends Option<string[]>, FieldsOptionArgs {
}
export interface FieldsOptionArgs extends OptionArgs<string[]> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?:(field: IFieldDescription)=>boolean;
}

export interface ObjectOption extends Option<{ [key: string]: any }>, ObjectOptionArgs {
}
export interface ObjectOptionArgs extends OptionArgs<{ [key: string]: any }> {
  subOptions: { [key: string]: Option<any> };
}

export enum Type {
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

export function buildBooleanOption(optionArgs?: OptionArgs<boolean>): boolean {
  return buildOption<boolean>(Type.BOOLEAN, loadBooleanOption, optionArgs);
}

export function buildNumberOption(optionArgs?: NumberOptionArgs): number {
  return buildOption<number>(Type.NUMBER, loadNumberOption, optionArgs);
}

export function buildStringOption(optionArgs?: OptionArgs<string>): string {
  return buildOption<string>(Type.STRING, loadStringOption, optionArgs);
}


export function buildIconOption(optionArgs?: OptionArgs<string>): string {
  return buildOption<string>(Type.ICON, loadStringOption, optionArgs);
}

export function buildHelperOption(optionArgs?: OptionArgs<string>): string {
  return buildOption<string>(Type.HELPER, loadStringOption, optionArgs);
}

export function buildJsonOption(optionArgs?: OptionArgs<string>): string {
  return buildOption<string>(Type.JSON, loadStringOption, optionArgs);
}

export function buildLocalizedStringOption(optionArgs?: OptionArgs<string>): string {
  return buildOption<string>(Type.LOCALIZED_STRING, loadLocalizedStringOption, optionArgs);
}

export function buildFieldOption(optionArgs?: FieldOptionArgs): string {
  return buildOption<string>(Type.FIELD, loadFieldOption, optionArgs);
}

export function buildFieldsOption(optionArgs?: FieldsOptionArgs): string[] {
  return buildOption<string[]>(Type.FIELDS, loadFieldsOption, optionArgs);
}

export function buildListOption(optionArgs?: ListOptionArgs): string[] {
  return buildOption<string[]>(Type.LIST, loadListOption, optionArgs);
}

export function buildSelectorOption(optionArgs?: OptionArgs<HTMLElement>): HTMLElement {
  return buildOption<HTMLElement>(Type.SELECTOR, loadSelectorOption, optionArgs);
}

export function buildChildHtmlElementOption(optionArgs?: ChildHtmlElementOptionArgs): HTMLElement {
  return buildOption<HTMLElement>(Type.CHILD_HTML_ELEMENT, loadChildHtmlElementOption, optionArgs);
}

export function buildTemplateOption(optionArgs?: TemplateOptionArgs): Template {
  return buildOption<Template>(Type.TEMPLATE, loadTemplateOption, optionArgs);
}

export function buildCustomOption<T>(converter: (value: string) => T, optionArgs?: OptionArgs<T>): T {
  var loadOption: LoadOption<T> = (element: HTMLElement, name: string, option: Option<T>) => {
    var stringvalue = loadStringOption(element, name, option);
    return converter(stringvalue);
  }
  return buildOption<T>(Type.STRING, loadOption, optionArgs);
}

export function buildCustomListOption<T>(converter: (value: string[]) => T, optionArgs?: ListOptionArgs): T {
  var loadOption: LoadOption<T> = (element: HTMLElement, name: string, option: any) => {
    var stringvalue = loadListOption(element, name, option);
    return converter(stringvalue);
  }
  return buildOption<any>(Type.LIST, loadOption, optionArgs);
}

export function buildObjectOption(optionArgs?: ObjectOptionArgs): any {
  var loadOption: LoadOption<{ [key: string]: any }> = (element: HTMLElement, name: string, option: Option<any>) => {
    var keys = _.keys(optionArgs.subOptions);
    var scopedOptions: { [name: string]: Option<any> } = {};
    var scopedValues: { [name: string]: any } = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var scopedkey = mergeCamelCase(name, key);
      scopedOptions[scopedkey] = optionArgs.subOptions[key];
    }
    initOptions(element, scopedOptions, scopedValues);
    var resultValues: { [name: string]: any } = {};
    var resultFound = false;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var scopedkey = mergeCamelCase(name, key);
      if (scopedValues[scopedkey] != null) {
        resultValues[key] = scopedValues[scopedkey];
        resultFound = true;
      }
    }
    return resultFound ? resultValues : null;
  }
  return buildOption<{ [key: string]: any }>(Type.OBJECT, loadOption, optionArgs);
}

export function buildOption<T>(type: Type, load: LoadOption<T>, optionArg: OptionArgs<T> = {}): T {
  var option: Option<T> = <any>optionArg;
  option.type = type;
  option.load = load;
  return <any>option;
}

export function attrNameFromName(name: string, optionArgs?: OptionArgs<any>) {
  if (optionArgs && optionArgs.attrName) {
    return optionArgs.attrName;
  }
  return 'data-' + camelCaseToHyphen(name);
}

var camelCaseToHyphenRegex = /([A-Z])|\W+(\w)/g
export function camelCaseToHyphen(name: string) {
  return name.replace(camelCaseToHyphenRegex, "-$1$2").toLowerCase();
}

export function mergeCamelCase(parent: string, name: string) {
  return parent + name.substr(0, 1).toUpperCase() + name.substr(1)
}

export function initComponentOptions(element: HTMLElement, component: any, values?: any) {
  return initOptions(element, component.options, values);
}

export function initOptions(element: HTMLElement, options: { [name: string]: Option<any> }, values?: any) {
  if (values == null) {
    values = {};
  }
  var names: string[] = _.keys(options);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var optionDefinition = options[name];
    var attrName = optionDefinition.attrName = optionDefinition.attrName || attrNameFromName(name, optionDefinition);
    var value: any;
    var loadFromAttribute = optionDefinition.load;
    if (values[name] != undefined) {
      value = values[name];
    } else if (loadFromAttribute != null) {
      value = loadFromAttribute(element, name, optionDefinition);
    }
    if (value == null && values[name] == undefined) {
      if (optionDefinition.defaultValue != null) {
        if (optionDefinition.type == Type.LIST) {
          value = _.extend([], optionDefinition.defaultValue);
        } else if (optionDefinition.type == Type.OBJECT) {
          value = _.extend({}, optionDefinition.defaultValue);
        } else {
          value = optionDefinition.defaultValue;
        }
      } else if (optionDefinition.defaultFunction != null) {
        value = optionDefinition.defaultFunction(element);
      }
    }
    if (value != null) {
      if (optionDefinition.type == Type.OBJECT && values[name] != null) {
        values[name] = _.extend(values[name], value);
      } else {
        values[name] = value;
      }
    }
  }
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var optionDefinition = options[name];
    if (optionDefinition.postProcessing) {
      values[name] = optionDefinition.postProcessing(values[name], values);
    }
  }
  return values;
}

export function loadStringOption(element: HTMLElement, name: string, option: Option<any>): string {
  return element.getAttribute(attrNameFromName(name, option));
}

export function loadFieldOption(element: HTMLElement, name: string, option: Option<any>): string {
  var field = loadStringOption(element, name, option);
  Assert.check(!isNonEmptyString(field) || isCoveoField(field), field + ' is not a valid field');
  return field;
}

var fieldsSeperator = /\s*,\s*/;

export function loadFieldsOption(element: HTMLElement, name: string, option: Option<any>): string[] {
  var fieldsAttr = loadStringOption(element, name, option);
  if (fieldsAttr == null) {
    return null;
  }
  var fields = fieldsAttr.split(fieldsSeperator);
  _.each(fields, (field: string)=> {
    Assert.check(isCoveoField(field), field + ' is not a valid field');
  });
  return fields;
}

var localizer = /([a-zA-Z\-]+)\s*:\s*(([^,]|,\s*(?!([a-zA-Z\-]+)\s*:))+)/g;
export function loadLocalizedStringOption(element: HTMLElement, name: string, option: Option<any>): string {
  var attributeValue = loadStringOption(element, name, option);
  var locale: string = String['locale'] || String['defaultLocale'];
  if (locale != null && attributeValue != null) {
    var localeParts = locale.toLowerCase().split("-");
    var locales = _.map(localeParts, (part, i) => localeParts.slice(0, i + 1).join("-"));
    var localizers = attributeValue.match(localizer);
    if (localizers != null) {
      for (var i = 0; i < localizers.length; i++) {
        var groups = localizer.exec(localizers[i]);
        if (groups != null) {
          var lang = groups[1].toLowerCase();
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

export function loadNumberOption(element: HTMLElement, name: string, option: NumberOption): number {
  var attributeValue = loadStringOption(element, name, option);
  if (attributeValue == null) {
    return null;
  }
  var numberValue = option.float === true ? parseFloatIfNotUndefined(attributeValue) : parseIntIfNotUndefined(attributeValue);
  if (option.min != null && option.min > numberValue) {
    numberValue = option.min;
  }
  if (option.max != null && option.max < numberValue) {
    numberValue = option.max;
  }
  return numberValue;
}

export function loadBooleanOption(element: HTMLElement, name: string, option: Option<any>): boolean {
  return parseBooleanIfNotUndefined(loadStringOption(element, name, option));
}

export function loadListOption(element: HTMLElement, name: string, option: ListOption): string[] {
  var separator = option.separator || /\s*,\s*/;
  var attributeValue = loadStringOption(element, name, option);
  return isNonEmptyString(attributeValue) ? attributeValue.split(separator) : null;
}

export function loadEnumOption(element: HTMLElement, name: string, option: Option<any>, _enum: any): number {
  var enumAsString = loadStringOption(element, name, option);
  return enumAsString != null ? _enum[enumAsString] : null;
}

export function loadSelectorOption(element: HTMLElement, name: string, option: Option<any>): HTMLElement {
  var attributeValue = loadStringOption(element, name, option)
  return isNonEmptyString(attributeValue) ? <HTMLElement>document.querySelector(attributeValue) : null;
}

export function loadChildHtmlElementOption(element: HTMLElement, name: string, option: ChildHtmlElementOption): HTMLElement {
  var htmlElement: HTMLElement;
  // Attribute: selector
  var selectorAttr = option.selectorAttr || attrNameFromName(name, option) + '-selector';
  var selector = element.getAttribute(selectorAttr);
  if (selector != null) {
    htmlElement = <HTMLElement>document.body.querySelector(selector);
  }
  // Child
  if (htmlElement == null) {
    var childSelector = option.childSelector;
    if (childSelector == null) {
      childSelector = '.' + name;
    }
    htmlElement = loadChildHtmlElementFromSelector(element, childSelector);
  }
  return htmlElement;
}

export function loadChildHtmlElementFromSelector(element: HTMLElement, selector: string): HTMLElement {
  Assert.isNonEmptyString(selector);
  if ($$(element).is(selector)) {
    return element;
  }
  return <HTMLElement>$$(element).find(selector);
}

export function loadChildrenHtmlElementFromSelector(element: HTMLElement, selector: string): HTMLElement[] {
  Assert.isNonEmptyString(selector);
  return $$(element).findAll(selector);
}

export function loadTemplateOption(element: HTMLElement, name: string, option: TemplateOption): Template {
  if (option.lazy) {
    return new LazyTemplate(element, name, option);
  }

  var template: Template;

  // Attribute: template selector
  var selectorAttr = option.selectorAttr || attrNameFromName(name, option) + '-selector';
  var selector = element.getAttribute(selectorAttr);
  if (selector != null) {
    var templateElement = <HTMLElement>document.querySelector(selector);
    if (templateElement != null) {
      template = createResultTemplateFromElement(templateElement);
    }
  }
  // Attribute: template id
  if (template == null) {
    var idAttr = option.idAttr || attrNameFromName(name, option) + '-id';
    var id = element.getAttribute(idAttr);
    if (id != null) {
      template = loadResultTemplateFromId(id);
    }
  }
  // Child
  if (template == null) {
    var childSelector = option.childSelector;
    if (childSelector == null) {
      childSelector = '.' + name.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
    template = loadChildrenResultTemplateFromSelector(element, childSelector);
  }
  return template;
}

export function loadResultTemplateFromId(templateId: string): Template {
  return isNonEmptyString(templateId) ? TemplateCache.getTemplate(templateId) : null;
}

export function loadChildrenResultTemplateFromSelector(element: HTMLElement, selector: string): Template {
  var foundElements = loadChildrenHtmlElementFromSelector(element, selector);
  if (foundElements.length > 0) {
    return new TemplateList(_.compact(_.map(foundElements, (element) => createResultTemplateFromElement(element))));
  }
  return null;
}


export function findParentScrolling(element: HTMLElement): HTMLElement {
  while (<Node>element != document && element != null) {
    if (isElementScrollable(element)) {
      if (element.tagName == 'body') {
        return element;
      }
      return <any>window;
    }
    element = element.parentElement;
  }
  return <any>window;
}

export function isElementScrollable(element: HTMLElement) {
  return $(element).css("overflow-y") == "scroll";
}

export function createResultTemplateFromElement(element: HTMLElement): Template {
  Assert.exists(element);
  var type = element.getAttribute('type');
  var mimeTypes = 'You must specify the type of template. Valid values are :' +
      ' ' + UnderscoreTemplate.mimeTypes.toString() +
      ' ' + HtmlTemplate.mimeTypes.toString()
  Assert.check(isNonEmptyString(type), mimeTypes);

  if (_.indexOf(UnderscoreTemplate.mimeTypes, type) != -1) {
    return UnderscoreTemplate.create(element);
  } else if (_.indexOf(HtmlTemplate.mimeTypes, type) != -1) {
    return new HtmlTemplate(element);
  } else {
    Assert.fail('Cannot guess template type from attribute: ' + type + '. Valid values are ' + mimeTypes);
    return undefined;
  }
}