import { IFieldDescription } from '../../rest/FieldDescription';
import { Assert } from '../../misc/Assert';
import { Logger } from '../../misc/Logger';
import { Template } from '../Templates/Template';
import { $$ } from '../../utils/Dom';
import { TemplateCache } from '../Templates/TemplateCache';
import { TemplateList } from '../Templates/TemplateList';
import { UnderscoreTemplate } from '../Templates/UnderscoreTemplate';
import { HtmlTemplate } from '../Templates/HtmlTemplate';
import { Utils } from '../../utils/Utils';
import { l } from '../../strings/Strings';
import _ = require('underscore');

/**
 * Declare a type for options that should contain a field to be used in a query.
 *
 * The only constraint this type has over a basic string is that it should start with "@".
 */
export interface IFieldOption extends String { };

export interface IComponentOptionsLoadOption<T> {
  (element: HTMLElement, name: string, option: IComponentOptionsOption<T>): T;
}

/**
 * Specify a postProcess function that allows an option to further modify itself once all other options have loaded.
 */
export interface IComponentOptionsPostProcessing<T> {
  /**
   * Specify a postProcess function that allows an option to further modify itself once all other options have loaded.
   * @param value
   * @param options
   */
  (value: T, options: any): T;
}

export interface IComponentOptionsOption<T> extends IComponentOptions<T> {
  type?: ComponentOptionsType;
  load?: IComponentOptionsLoadOption<T>;
}

/**
 * This represent the possible parameters that can be used to configure an option
 */
export interface IComponentOptions<T> {
  /**
   * Specify the default value that should be given to the option if it is not specified.
   */
  defaultValue?: T;
  /**
   * Specify a function which should return the default value that should be given to the option if it is not specified.
   *
   * @param element The HTMLElement on which the current option is being parsed.
   */
  defaultFunction?: (element: HTMLElement) => T;
  /**
   * Specify if the option is "required" so that the component can do it's job properly.
   *
   * For example, the {@link Facet.options.field} is required, as a facet with no field cannot function.
   */
  required?: boolean;
  /**
   * Specify a function which can be used to further modify the value for a given option after all other options have been loaded.
   *
   * For example, the {@link Facet.options.id} will use this to set the default ID with the same value as the {@link Facet.options.field}.
   */
  postProcessing?: IComponentOptionsPostProcessing<T>;
  /**
   * Allow to specify a different markup name for an option than the default value.
   *
   * Using this is extremely rare, and should be used only for legacy reasons.
   */
  attrName?: string;
  /**
   * Allow to specify an alias for an option name.
   *
   * This can be useful to modify the name of an option without introducing a breaking change.
   */
  alias?: string;
  /**
   * Specify a section name inside which the option should appear in the interface editor.
   */
  section?: string;
  /**
   * Specify that an option depend on another option being enabled.
   *
   * Mostly useful for the interface editor.
   */
  depend?: string;
  priority?: number;
  /**
   * Specify that an option is deprecated.
   *
   * This string will be displayed in the console on initialization.
   *
   * The message should be as clear as possible as to why this option is deprecated, and how it can be replaced.
   *
   * This also mean that the option will not appear in the interface editor.
   */
  deprecated?: string;
  /**
   * Specify a function which can be used to verify the validity of the option.
   *
   * The function should return true if the option is valid, false otherwise.
   * @param value
   */
  validator?: (value: T) => boolean;
}

export interface IComponentOptionsNumberOption extends IComponentOptionsOption<number>, IComponentOptionsNumberOptionArgs {
}

/**
 * This represent the possible parameters that can be used to configure a number option.
 */
export interface IComponentOptionsNumberOptionArgs extends IComponentOptions<number> {
  /**
   * The minimum value that can be set for this number.
   */
  min?: number;
  /**
   * The maximum value that can be set for this number.
   */
  max?: number;
  /**
   * Specify if the value is a floating point number.
   */
  float?: boolean;
}

export interface IComponentOptionsListOption extends IComponentOptionsOption<string[]>, IComponentOptionsListOptionArgs {
}

/**
 * The represent the possible parameters that can be used to configure a list option.
 */
export interface IComponentOptionsListOptionArgs extends IComponentOptions<string[]> {
  /**
   * The separator that should be used for this list. By default, it will be `,`.
   */
  separator?: RegExp;
  /**
   * The possible list of values for this option.
   */
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

/**
 * This represent the possible parameters that can be used to configure a field option.
 */
export interface IComponentOptionsFieldOptionArgs extends IComponentOptions<string> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface IComponentOptionsFieldsOption extends IComponentOptionsOption<string[]>, IComponentOptionsFieldsOptionArgs {
}

/**
 * This represent the possible parameters that can be used to configure a list of fields option.
 */
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
  COLOR,
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

/**
 * This static class is used to initialize component options.
 *
 * Typically, each {@link Component} that exposes a set of options will contains a static `options` property,
 *
 * This property will "build" the options based on their type.
 */
export class ComponentOptions {
  /**
   * Build a boolean option.
   *
   * A boolean option can be "true" or "false" in the markup.
   *
   * `data-foo="true"` or `data-foo="false"`.
   * @param optionArgs
   * @returns {boolean}
   */
  static buildBooleanOption(optionArgs?: IComponentOptions<boolean>): boolean {
    return ComponentOptions.buildOption<boolean>(ComponentOptionsType.BOOLEAN, ComponentOptions.loadBooleanOption, optionArgs);
  }

  /**
   * Build a number option.
   *
   * A number option can be an integer or a float in the markup.
   *
   * `data-foo="1"` or `data-foo="1.5"`.
   */
  static buildNumberOption(optionArgs?: IComponentOptionsNumberOptionArgs): number {
    return ComponentOptions.buildOption<number>(ComponentOptionsType.NUMBER, ComponentOptions.loadNumberOption, optionArgs);
  }

  /**
   * Build a string option.
   *
   * A string option can be any arbitrary string in the markup.
   *
   * `data-foo="bar"`.
   */
  static buildStringOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.STRING, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Build an icon option.
   *
   * Normally, this only means that it will build a string that matches a CSS class for an icon.
   *
   * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
   *
   * `data-foo="coveo-sprites-user"` or `data-foo="coveo-sprites-database"`.
   */
  static buildIconOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.ICON, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Build a color option.
   *
   * Normally, this only means that it will build a string that matches a CSS color.
   *
   * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
   *
   * `data-foo="coveo-sprites-user"` or `data-foo="coveo-sprites-database"`.
   */
  static buildColorOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.COLOR, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Build a helper option.
   *
   * Normally, this only means that it will build a string that matches the name of a template helper.
   *
   * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
   *
   * `data-foo="date"` or `data-foo="dateTime"`.
   */
  static buildHelperOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.HELPER, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Build a JSON option.
   *
   * Normally, this only means that it will build a stringified JSON.
   *
   * In the markup, this has no advantage over a plain string. This is mostly useful for the interface editor.
   *
   * `data-foo='{"bar" : "baz"}'`.
   */
  static buildJsonOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.JSON, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Build a localized string option.
   *
   * A localized string option can be any arbitrary string.
   *
   * The framework, when parsing the value, will try to load the localization for that word if it is available.
   *
   * If it is not available, it will return the non-localized option.
   *
   * This should be used for options that will be rendered directly to the end users.
   *
   * `data-foo="bar"`.
   */
  static buildLocalizedStringOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.LOCALIZED_STRING, ComponentOptions.loadLocalizedStringOption, optionArgs);
  }

  /**
   * Build a field option.
   *
   * A field option will validate that the field has a valid name. This means that the string has to start with @.
   *
   * `data-foo="@bar"`.
   */
  static buildFieldOption(optionArgs?: IComponentOptionsFieldOptionArgs): IFieldOption {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.FIELD, ComponentOptions.loadFieldOption, optionArgs);
  }

  /**
   * Build an array of field option.
   *
   * As with all options that expect an array, you should use commas to delimit the different values.
   *
   * `data-foo="@bar,@baz"`.
   */
  static buildFieldsOption(optionArgs?: IComponentOptionsFieldsOptionArgs): IFieldOption[] {
    return ComponentOptions.buildOption<string[]>(ComponentOptionsType.FIELDS, ComponentOptions.loadFieldsOption, optionArgs);
  }

  /**
   * Build an array of string option.
   *
   * As with all options that expect an array, you should use commas to delimit the different values.
   *
   * `data-foo="bar,baz"`.
   */
  static buildListOption<T>(optionArgs?: IComponentOptionsListOptionArgs): T[] | string[] {
    return ComponentOptions.buildOption<string[]>(ComponentOptionsType.LIST, ComponentOptions.loadListOption, optionArgs);
  }

  /**
   * Build an option that allow to select an HTMLElement.
   *
   * The option accept a CSS selector that will allow to find the required HTMLElement.
   *
   * It can be a class selector or an ID selector.
   *
   * `data-foo-selector=".bar" or data-foo-selector="#bar"`.
   */
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
    };
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
    return parent + name.substr(0, 1).toUpperCase() + name.substr(1);
  }

  /**
   * The main function that will load and parse the options for the current given element.
   *
   * Every component will call this function in their constructor.
   * @param element The element on which the options should be parsed
   * @param component The component class for which the options should be parsed. For example : Searchbox, Facet, etc.
   * @param values The optional options which should be merged with the options set in the markup.
   */
  static initComponentOptions(element: HTMLElement, component: any, values?: any) {
    return ComponentOptions.initOptions(element, component.options, values, component.ID);
  }

  static initOptions(element: HTMLElement, options: {
    [name: string]: IComponentOptionsOption<any>
  }, values?: any, componentID?: any) {
    let logger = new Logger(this);
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
          logger.warn(componentID + '.' + name + ' : ' + optionDefinition.deprecated);
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
        if (optionDefinition.validator) {
          let isValid = optionDefinition.validator(value);
          if (!isValid) {
            logger.warn(`${componentID} .${name} has invalid value :  ${value}`);
            if (optionDefinition.required) {
              logger.error(`${componentID} .${name} is required and has an invalid value : ${value}. ***THIS COMPONENT WILL NOT WORK***`);
            }
            delete values[name];
            continue;
          }
        }
        if (optionDefinition.type == ComponentOptionsType.OBJECT && values[name] != null) {
          values[name] = _.extend(values[name], value);
        } else if (optionDefinition.type == ComponentOptionsType.LOCALIZED_STRING) {
          values[name] = l(value);
        } else {
          values[name] = value;
        }
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
      new Logger(element).info(`Value for option ${name} is less than the possible minimum (Value is ${numberValue}, minimum is ${option.min}). It has been forced to it\'s minimum value.`, option);
      numberValue = option.min;
    }
    if (option.max != null && option.max < numberValue) {
      new Logger(element).info(`Value for option ${name} is higher than the possible maximum (Value is ${numberValue}, maximum is ${option.max}). It has been forced to it\'s maximum value.`, option);
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
    let attributeValue = ComponentOptions.loadStringOption(element, name, option);
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
      ' ' + HtmlTemplate.mimeTypes.toString();
    Assert.check(Utils.isNonEmptyString(type), mimeTypes);

    if (_.indexOf(UnderscoreTemplate.mimeTypes, type.toLowerCase()) != -1) {
      return UnderscoreTemplate.create(element);
    } else if (_.indexOf(HtmlTemplate.mimeTypes, type.toLowerCase()) != -1) {
      return new HtmlTemplate(element);
    } else {
      Assert.fail('Cannot guess template type from attribute: ' + type + '. Valid values are ' + mimeTypes);
      return undefined;
    }
  }
}
