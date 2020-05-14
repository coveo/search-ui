import { contains, each, isArray, keys, map } from 'underscore';
import { Assert } from '../../misc/Assert';
import { Logger } from '../../misc/Logger';
import { IStringMap } from '../../rest/GenericParam';
import { $$, Dom } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { Template } from '../Templates/Template';
import { ComponentOptionLoader } from './ComponentOptionsLoader';
import { ComponentOptionsMerger } from './ComponentOptionsMerger';
import { ComponentOptionsPostProcessor } from './ComponentOptionsPostProcessor';
import { ComponentOptionsValidator } from './ComponentOptionsValidator';
import {
  ComponentOptionsType,
  IComponentJsonObjectOption,
  IComponentLocalizedStringOptionArgs,
  IComponentOptions,
  IComponentOptionsChildHtmlElementOption,
  IComponentOptionsChildHtmlElementOptionArgs,
  IComponentOptionsCustomListOptionArgs,
  IComponentOptionsFieldOptionArgs,
  IComponentOptionsFieldsOptionArgs,
  IComponentOptionsListOption,
  IComponentOptionsListOptionArgs,
  IComponentOptionsLoadOption,
  IComponentOptionsNumberOption,
  IComponentOptionsNumberOptionArgs,
  IComponentOptionsObjectOptionArgs,
  IComponentOptionsOption,
  IFieldConditionOption,
  IFieldOption,
  IQueryExpression
} from './IComponentOptions';
import { IComponentOptionsTemplateOptionArgs, TemplateComponentOptions } from './TemplateComponentOptions';

const camelCaseToHyphenRegex = /([A-Z])|\W+(\w)/g;
const fieldsSeperator = /\s*,\s*/;
const localizer = /([a-zA-Z\-]+)\s*:\s*(([^,]|,\s*(?!([a-zA-Z\-]+)\s*:))+)/g;

/**
 * The `ComponentOptions` static class contains methods allowing the Coveo JavaScript Search Framework to initialize
 * component options.
 *
 * Typically, each [`Component`]{@link Component} that exposes a set of options contains a static `options` property.
 *
 * This property "builds" each option using the `ComponentOptions` method corresponding to its type (e.g.,
 * [`buildBooleanOption`]{@link ComponentOptions.buildBooleanOption},
 * [`buildFieldOption`]{@link ComponentOptions.buildFieldOption},
 * [`buildStringOption`]{@link ComponentOptions.buildStringOption}, etc.)
 */
export class ComponentOptions {
  static buildTemplateOption(optionArgs?: IComponentOptionsTemplateOptionArgs): Template {
    return TemplateComponentOptions.buildTemplateOption(optionArgs);
  }

  /**
   * Builds a boolean option.
   *
   * **Markup Examples:**
   *
   * > `data-foo="true"`
   *
   * > `data-foo="false"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {boolean} The resulting option value.
   */
  static buildBooleanOption(optionArgs?: IComponentOptions<boolean>): boolean {
    return ComponentOptions.buildOption<boolean>(ComponentOptionsType.BOOLEAN, ComponentOptions.loadBooleanOption, optionArgs);
  }

  /**
   * Builds a number option.
   *
   * A number option can be an integer or a float in the markup.
   *
   * **Note:**
   *
   * > To build a float option, you need to set the `float` property in the [`IComponentOptionsNumberOptionArgs`]{@link IComponentOptionsNumberOptionArgs} to `true`.
   *
   * **Markup Examples:**
   *
   * > `data-foo="3"`
   *
   * > `data-foo="1.5"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {number} The resulting option value.
   */
  static buildNumberOption(optionArgs?: IComponentOptionsNumberOptionArgs): number {
    return ComponentOptions.buildOption<number>(ComponentOptionsType.NUMBER, ComponentOptions.loadNumberOption, optionArgs);
  }

  /**
   * Builds a string option.
   *
   * A string option can be any arbitrary string in the markup.
   *
   * **Markup Example:**
   *
   * > `data-foo="bar"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string} The resulting option value.
   */
  static buildStringOption<T extends string>(optionArgs?: IComponentOptions<T>): T {
    return ComponentOptions.buildOption<T>(ComponentOptionsType.STRING, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Builds an icon option.
   *
   * This takes an SVG icon name, validates it and returns the name of the icon.
   * **Markup Examples:**
   *
   * > `data-foo="search"`
   *
   * > `data-foo="facet-expand"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string} The resulting option value.
   */
  static buildIconOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.ICON, ComponentOptions.loadIconOption, optionArgs);
  }

  /**
   * Builds a color option.
   *
   * Normally, this simply builds a string that matches a CSS color.
   *
   * **Note:**
   *
   * > In the markup, this offers no advantage over using a plain string. This is mostly useful for the Coveo JavaScript
   * > Interface Editor.
   *
   * **Markup Examples:**
   *
   * > `data-foo="coveo-sprites-user"`
   *
   * > `data-foo="coveo-sprites-database"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string} The resulting option value.
   */
  static buildColorOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.COLOR, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Builds a helper option.
   *
   * Normally, this simply builds a string that matches the name of a template helper.
   *
   * **Note:**
   *
   * > In the markup, this offers no advantage over using a plain string. This is mostly useful for the Coveo JavaScript
   * > Interface Editor.
   *
   * **Markup Examples:**
   *
   * > `data-foo="date"`
   *
   * > `data-foo="dateTime"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string} The resulting option value.
   */
  static buildHelperOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.HELPER, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Tries to parse a stringified JSON option.
   *
   * If unsuccessful (because of invalid syntax), the JSON option is ignored altogether, and the console displays a warning message.
   *
   * **Markup Example:**
   *
   * > `data-foo='{"bar" : "baz"}'`
   *
   * **Note:**
   *
   * A JSON option can always be set as a property in the `init` call of the framework rather than as a `data-` property in the corresponding HTMLElement markup.
   *
   * **Initialization Example:**
   *
   * ```
   * Coveo.init(root, {
   *   Facet : {
   *     foo : {
   *       "bar" : "baz"
   *     }
   *   }
   * })
   * ```
   * @param optionArgs The arguments to apply when building the option.
   * @returns {T} The resulting option value.
   */
  static buildJsonOption<T extends IStringMap<any>>(optionArgs?: IComponentJsonObjectOption<T>): T {
    return ComponentOptions.buildOption(ComponentOptionsType.JSON, ComponentOptions.loadJsonObjectOption, optionArgs) as T;
  }

  /**
   * @deprecated Use buildJsonOption instead
   *
   * @deprecatedsince [2017 Javascript Search Framework Releases](https://docs.coveo.com/en/373/#december-2017-release-v236794)
   */
  static buildJsonObjectOption<T>(optionArgs?: IComponentJsonObjectOption<T>): T {
    return ComponentOptions.buildJsonOption(optionArgs);
  }

  /**
   * Builds a localized string option.
   *
   * A localized string option can be any arbitrary string.
   *
   * When parsing the value, the Coveo JavaScript Search Framework tries to load the localization for that string, if it
   * is available.
   *
   * If it is not available, it returns the non-localized value.
   *
   * This should be used for options that will be rendered directly to the end users.
   *
   * **Markup Example:**
   *
   * > `data-foo="bar"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string} The resulting option value.
   */
  static buildLocalizedStringOption(optionArgs?: IComponentLocalizedStringOptionArgs): string {
    return ComponentOptions.buildOption<string>(
      ComponentOptionsType.LOCALIZED_STRING,
      ComponentOptions.loadLocalizedStringOption,
      optionArgs
    );
  }

  /**
   * Builds a field option.
   *
   * A field option validates whether the field has a valid name. This means that the string must start with the `@`
   * character.
   *
   * **Markup Example:**
   *
   * > `data-foo="@bar"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string} The resulting option value.
   */
  static buildFieldOption(optionArgs?: IComponentOptionsFieldOptionArgs): IFieldOption {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.FIELD, ComponentOptions.loadFieldOption, optionArgs);
  }

  /**
   * Builds an array of fields option.
   *
   * As with all options that expect an array, you should use commas to delimit the different values.
   *
   * **Markup Example:**
   *
   * > `data-foo="@bar,@baz"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string[]} The resulting option value.
   */
  static buildFieldsOption(optionArgs?: IComponentOptionsFieldsOptionArgs): IFieldOption[] {
    return ComponentOptions.buildOption<string[]>(ComponentOptionsType.FIELDS, ComponentOptions.loadFieldsOption, optionArgs);
  }

  /**
   * Builds a query expression option.
   *
   * The query expression option should follow the [Coveo Cloud Query Syntax Reference](https://docs.coveo.com/en/1552/).
   *
   * **Markup Example:**
   *
   * > `data-foo="@bar==baz"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {IQueryExpression} The resulting option value.
   */
  static buildQueryExpressionOption(optionArgs?: IComponentOptions<string>): IQueryExpression {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.QUERY_EXPRESSION, ComponentOptions.loadStringOption, optionArgs);
  }

  /**
   * Builds an array of strings option.
   *
   * As with all options that expect an array, you should use commas to delimit the different values.
   *
   * **Markup Example:**
   *
   * > `data-foo="bar,baz"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {string[]} The resulting option value.
   */
  static buildListOption<T>(optionArgs?: IComponentOptionsListOptionArgs): T[] | string[] {
    return ComponentOptions.buildOption<string[]>(ComponentOptionsType.LIST, ComponentOptions.loadListOption, optionArgs);
  }

  /**
   * Builds an option that allow to select an HTMLElement.
   *
   * The option accepts a CSS selector matching the required HTMLElement. This selector can either be a class, or an ID
   * selector.
   *
   * **Markup Examples:**
   *
   * > `data-foo-selector=".bar"`
   *
   * > `data-foo-selector="#bar"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {HTMLElement} The resulting option value.
   */
  static buildSelectorOption(optionArgs?: IComponentOptions<HTMLElement>): HTMLElement {
    return ComponentOptions.buildOption<HTMLElement>(ComponentOptionsType.SELECTOR, ComponentOptions.loadSelectorOption, optionArgs);
  }

  static buildChildHtmlElementOption(optionArgs?: IComponentOptionsChildHtmlElementOptionArgs): HTMLElement {
    return ComponentOptions.buildOption<HTMLElement>(
      ComponentOptionsType.CHILD_HTML_ELEMENT,
      ComponentOptions.loadChildHtmlElementOption,
      optionArgs
    );
  }

  static buildCustomOption<T>(converter: (value: string) => T, optionArgs?: IComponentOptions<T>): T {
    const loadOption: IComponentOptionsLoadOption<T> = (element: HTMLElement, name: string, option: IComponentOptionsOption<T>) => {
      const stringvalue = ComponentOptions.loadStringOption(element, name, option);
      if (!Utils.isNullOrEmptyString(stringvalue)) {
        return converter(stringvalue);
      }
    };
    return ComponentOptions.buildOption<T>(ComponentOptionsType.STRING, loadOption, optionArgs);
  }

  static buildCustomListOption<T>(converter: (value: string[]) => T, optionArgs?: IComponentOptionsCustomListOptionArgs<T>): T {
    const loadOption: IComponentOptionsLoadOption<T> = (element: HTMLElement, name: string, option: any) => {
      const stringvalue = ComponentOptions.loadListOption(element, name, option);
      return converter(stringvalue);
    };
    return ComponentOptions.buildOption<any>(ComponentOptionsType.LIST, loadOption, optionArgs);
  }

  static buildObjectOption(optionArgs?: IComponentOptionsObjectOptionArgs): any {
    const loadOption: IComponentOptionsLoadOption<{
      [key: string]: any;
    }> = (element: HTMLElement, name: string, option: IComponentOptionsOption<any>) => {
      const extractedKeys = keys(optionArgs.subOptions);
      const scopedOptions: {
        [name: string]: IComponentOptionsOption<any>;
      } = {};
      const scopedValues: {
        [name: string]: any;
      } = {};
      for (let i = 0; i < extractedKeys.length; i++) {
        const key = extractedKeys[i];
        const scopedkey = ComponentOptions.mergeCamelCase(name, key);
        scopedOptions[scopedkey] = optionArgs.subOptions[key];
      }
      ComponentOptions.initOptions(element, scopedOptions, scopedValues, '');
      const resultValues: {
        [name: string]: any;
      } = {};
      let resultFound = false;
      for (let i = 0; i < extractedKeys.length; i++) {
        const key = extractedKeys[i];
        const scopedkey = ComponentOptions.mergeCamelCase(name, key);
        if (scopedValues[scopedkey] != null) {
          resultValues[key] = scopedValues[scopedkey];
          resultFound = true;
        }
      }
      return resultFound ? resultValues : null;
    };
    return ComponentOptions.buildOption<{
      [key: string]: any;
    }>(ComponentOptionsType.OBJECT, loadOption, optionArgs);
  }

  /**
   * Builds a field condition option.
   *
   * A field condition option defines a field-based condition that must be dynamically evaluated against,
   * and satisfied by a query result item in order to initialize a result template component.
   *
   * **Markup Example:**
   *
   * ```html
   * data-condition-field-author="Alice Smith, Bob Jones"
   * data-condition-field-not-filetype="pdf"`
   * ```
   *
   * @returns {string} The resulting option value.
   */
  static buildFieldConditionOption(): IFieldConditionOption[] {
    return ComponentOptions.buildOption<IFieldConditionOption[]>(ComponentOptionsType.FIELD, ComponentOptions.loadFieldConditionOption);
  }

  static buildOption<T>(type: ComponentOptionsType, load: IComponentOptionsLoadOption<T>, optionArg: IComponentOptions<T> = {}): T {
    const option: IComponentOptionsOption<T> = <any>optionArg;
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
   * Loads and parses the options of the current element.
   *
   * Each component calls this method in its constructor.
   *
   * @param element The element whose markup options the method should load and parse.
   * @param component The class of the component whose options the method should load and parse (e.g., `Searchbox`,
   * `Facet`, etc.)
   * @param values The additional options which the method should merge with the specified markup option values.
   */
  static initComponentOptions(element: HTMLElement, component: any, values?: any) {
    return ComponentOptions.initOptions(element, component.options, values, component.ID);
  }

  static initOptions(
    element: HTMLElement,
    options: {
      [name: string]: IComponentOptionsOption<any>;
    },
    values: any = {},
    componentID: string
  ) {
    if (Utils.isNullOrUndefined(values)) {
      values = {};
    }

    each(options, (optionDefinition, name) => {
      const value = new ComponentOptionLoader(element, values, name, optionDefinition).load();
      new ComponentOptionsMerger(optionDefinition, { value, name }, values).merge();
      new ComponentOptionsValidator(optionDefinition, { componentID, name, value }, values).validate();
    });

    new ComponentOptionsPostProcessor(options, values, componentID).postProcess();
    return values;
  }

  static tryLoadFromAttribute(element: HTMLElement, name: string, optionDefinition: IComponentOptionsOption<any>) {
    const loadFromAttribute = optionDefinition.load;
    if (!loadFromAttribute) {
      return null;
    }

    return loadFromAttribute(element, name, optionDefinition);
  }

  static loadStringOption<T extends string>(element: HTMLElement, name: string, option: IComponentOptions<any>): T {
    return element.getAttribute(ComponentOptions.attrNameFromName(name, option)) || ComponentOptions.getAttributeFromAlias(element, option);
  }

  static loadIconOption(element: HTMLElement, name: string, option: IComponentOptions<any>): string {
    let svgIconName = ComponentOptions.loadStringOption(element, name, option);
    if (svgIconName == null) {
      return null;
    }

    // Old card templates icons used these values as the icon option. These names have changed since we moved to SVG.
    // This avoids breaking old default templates that people may still have after moving to 2.0.
    svgIconName = svgIconName.replace('coveo-sprites-replies', 'replies');
    svgIconName = svgIconName.replace('coveo-sprites-main-search-active', 'search');

    if (Utils.isNullOrUndefined(SVGIcons.icons[svgIconName])) {
      new Logger(element).warn(`Icon with name ${svgIconName} not found.`);
      return null;
    }

    svgIconName = Utils.toCamelCase(svgIconName);
    return svgIconName;
  }

  static loadFieldOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string {
    const field = ComponentOptions.loadStringOption(element, name, option);
    Assert.check(!Utils.isNonEmptyString(field) || Utils.isCoveoField(field), field + ' is not a valid field');
    return field;
  }

  static loadFieldConditionOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): IFieldConditionOption[] {
    var attrs = Dom.nodeListToArray(element.attributes).filter(attribute =>
      Utils.stringStartsWith(attribute.nodeName, 'data-condition-field-')
    );

    return attrs.length != 0
      ? attrs.map(attribute => ({
          field: attribute.nodeName.replace('data-condition-field-not-', '').replace('data-condition-field-', ''),
          values: Utils.isNonEmptyString(attribute.nodeValue) ? attribute.nodeValue.split(/\s*,\s*/) : null,
          reverseCondition: attribute.nodeName.indexOf('data-condition-field-not-') == 0
        }))
      : undefined;
  }

  static loadFieldsOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string[] {
    const fieldsAttr = ComponentOptions.loadStringOption(element, name, option);
    if (fieldsAttr == null) {
      return null;
    }
    const fields = fieldsAttr.split(fieldsSeperator);
    each(fields, (field: string) => {
      Assert.check(Utils.isCoveoField(field), field + ' is not a valid field');
    });
    return fields;
  }

  static loadLocalizedStringOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string {
    const attributeValue = ComponentOptions.loadStringOption(element, name, option);
    const locale: string = String['locale'] || String['defaultLocale'];
    if (locale != null && attributeValue != null) {
      const localeParts = locale.toLowerCase().split('-');
      const locales = map(localeParts, (part, i) => localeParts.slice(0, i + 1).join('-'));
      const localizers = attributeValue.match(localizer);
      if (localizers != null) {
        for (let i = 0; i < localizers.length; i++) {
          const groups = localizer.exec(localizers[i]);
          if (groups != null) {
            const lang = groups[1].toLowerCase();
            if (contains(locales, lang)) {
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
    const attributeValue = ComponentOptions.loadStringOption(element, name, option);
    if (attributeValue == null) {
      return null;
    }
    let numberValue = option.float === true ? Utils.parseFloatIfNotUndefined(attributeValue) : Utils.parseIntIfNotUndefined(attributeValue);
    if (option.min != null && option.min > numberValue) {
      new Logger(element).info(
        `Value for option ${name} is less than the possible minimum (Value is ${numberValue}, minimum is ${
          option.min
        }). It has been forced to its minimum value.`,
        option
      );
      numberValue = option.min;
    }
    if (option.max != null && option.max < numberValue) {
      new Logger(element).info(
        `Value for option ${name} is higher than the possible maximum (Value is ${numberValue}, maximum is ${
          option.max
        }). It has been forced to its maximum value.`,
        option
      );
      numberValue = option.max;
    }
    return numberValue;
  }

  static loadBooleanOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): boolean {
    return Utils.parseBooleanIfNotUndefined(ComponentOptions.loadStringOption(element, name, option));
  }

  static loadListOption(element: HTMLElement, name: string, option: IComponentOptionsListOption): string[] {
    const separator = option.separator || /\s*,\s*/;
    const attributeValue = ComponentOptions.loadStringOption(element, name, option);
    return Utils.isNonEmptyString(attributeValue) ? attributeValue.split(separator) : null;
  }

  static loadEnumOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>, _enum: any): number {
    const enumAsString = ComponentOptions.loadStringOption(element, name, option);
    return enumAsString != null ? _enum[enumAsString] : null;
  }

  static loadJsonObjectOption<T>(element: HTMLElement, name: string, option: IComponentOptions<any>): T {
    const jsonAsString = ComponentOptions.loadStringOption(element, name, option);
    if (jsonAsString == null) {
      return null;
    }
    try {
      return JSON.parse(jsonAsString) as T;
    } catch (exception) {
      new Logger(element).info(
        `Value for option ${name} is not a valid JSON string (Value is ${jsonAsString}). It has been disabled.`,
        exception
      );
      return null;
    }
  }

  static loadSelectorOption(
    element: HTMLElement,
    name: string,
    option: IComponentOptionsOption<any>,
    doc: Document = document
  ): HTMLElement {
    const attributeValue = ComponentOptions.loadStringOption(element, name, option);
    return Utils.isNonEmptyString(attributeValue) ? <HTMLElement>doc.querySelector(attributeValue) : null;
  }

  static loadChildHtmlElementOption(
    element: HTMLElement,
    name: string,
    option: IComponentOptionsChildHtmlElementOption,
    doc: Document = document
  ): HTMLElement {
    let htmlElement: HTMLElement;
    // Attribute: selector
    const selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
    const selector = element.getAttribute(selectorAttr) || ComponentOptions.getAttributeFromAlias(element, option);
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

  static findParentScrolling(element: HTMLElement, doc: Document = document): HTMLElement {
    element = this.findParentScrollLockable(element, doc);
    return element instanceof HTMLBodyElement || !ComponentOptions.isElementScrollable(element) ? <any>window : element;
  }

  static findParentScrollLockable(element: HTMLElement, doc: Document = document): HTMLElement {
    if (!element) {
      element = doc.body;
    }
    if (ComponentOptions.isElementScrollable(element) || element instanceof HTMLBodyElement || !element.parentElement) {
      return element;
    }
    return ComponentOptions.findParentScrollLockable(element.parentElement, doc);
  }

  static isElementScrollable(element: HTMLElement) {
    const overflowProperty = $$(element).css('overflow-y');
    return overflowProperty == 'scroll' || overflowProperty == 'auto';
  }

  static getAttributeFromAlias(element: HTMLElement, option: IComponentOptions<any>) {
    if (isArray(option.alias)) {
      let attributeFound;
      each(option.alias, alias => {
        const attributeFoundWithThisAlias = element.getAttribute(ComponentOptions.attrNameFromName(alias));
        if (attributeFoundWithThisAlias) {
          attributeFound = attributeFoundWithThisAlias;
        }
      });
      return attributeFound;
    }
    if (option.alias) {
      return element.getAttribute(ComponentOptions.attrNameFromName(option.alias));
    } else {
      return undefined;
    }
  }
}
