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
import * as _ from 'underscore';
import { SVGIcons } from '../../utils/SVGIcons';
import { IStringMap } from '../../rest/GenericParam';

/**
 * The `IFieldOption` interface declares a type for options that should contain a field to be used in a query.
 *
 * The only constraint this type has over a basic string is that it should start with the `@` character.
 */
export interface IFieldOption extends String {}

export interface IComponentOptionsLoadOption<T> {
  (element: HTMLElement, name: string, option: IComponentOptionsOption<T>): T;
}

/**
 * The `IComponentOptionsPostProcessing<T>` interface describes a post process function that should allow a component
 * option to further modify its own value once all other options of that component have been built.
 */
export interface IComponentOptionsPostProcessing<T> {
  /**
   * Specifies a function that should allow a component option to further modify its own value once all other options
   * of that component have been built.
   * @param value The value originally specified for the option.
   * @param options The options of the component.
   */
  (value: T, options: any): T;
}

export interface IComponentOptionsOption<T> extends IComponentOptions<T> {
  type?: ComponentOptionsType;
  load?: IComponentOptionsLoadOption<T>;
}

/**
 * The `IComponentOptions` interface describes the available parameters when building any kind of component
 * option.
 */
export interface IComponentOptions<T> {
  /**
   * Specifies the value the option must take when no other value is explicitly specified.
   */
  defaultValue?: T;

  /**
   * Specifies a function that should return the value the option must take when no other value is explicitly specified.
   *
   * @param element The HTMLElement on which the current option is being parsed.
   * @return The default value of the option.
   */
  defaultFunction?: (element: HTMLElement) => T;

  /**
   * Specifies whether it is necessary to explicitly specify a value for the option in order for the component to
   * function properly.
   *
   * **Example:**
   *
   * > The [`field`]{@link Facet.options.field} option of the `Facet` component is required, since a facet cannot
   * > function properly without a field.
   */
  required?: boolean;

  /**
   * Specifies a function that should allow a component option to further modify its own value once all other options
   * of that component have been built.
   *
   * **Example:**
   *
   * > By default, the [`id`]{@link Facet.options.id} option of the `Facet` component uses a post processing function to
   * > set its value to that of the [`field`]{@link Facet.options.field} option.
   */
  postProcessing?: IComponentOptionsPostProcessing<T>;

  /**
   * Specifies a different markup name to use for an option, rather than the standard name (i.e., `data-` followed by
   * the hyphened name of the option).
   *
   * **Note:**
   *
   * > This should only be used for backward compatibility reasons.
   */
  attrName?: string;

  /**
   * Specifies an alias, or array of aliases, which can be used instead of the actual option name.
   *
   * **Note:**
   *
   * > This can be useful to modify an option name without introducing a breaking change.
   */
  alias?: string | string[];

  /**
   * Specifies a section name inside which the option should appear in the Coveo JavaScript Interface Editor.
   */
  section?: string;

  /**
   * Specifies the name of a boolean component option which must be `true` in order for this option to function
   * properly.
   *
   * **Note:**
   *
   * > This is mostly useful for the Coveo JavaScript Interface Editor.
   */
  depend?: string;
  priority?: number;

  /**
   * Specifies a message that labels the option as deprecated. This message appears in the console upon initialization
   * if the deprecated option is used in the page. Consequently, this message should explain as clearly as possible why
   * the option is deprecated, and what now replaces it.
   *
   * **Note:**
   *
   * > Deprecated options do not appear in the Coveo JavaScript Interface Editor.
   */
  deprecated?: string;

  /**
   * Specifies a function that should indicate whether the option value is valid.
   *
   * @param value The option value to validate.
   * @returns `true` if the option value is valid; `false` otherwise.
   */
  validator?: (value: T) => boolean;
}

export interface IComponentOptionsNumberOption extends IComponentOptionsOption<number>, IComponentOptionsNumberOptionArgs {}

/**
 * The `IComponentOptionsNumberOptionArgs` interface describes the available parameters when building a
 * [number option]{@link ComponentOptions.buildNumberOption).
 */
export interface IComponentOptionsNumberOptionArgs extends IComponentOptions<number> {
  /**
   * Specifies the exclusive minimum value the option can take.
   *
   * Configuring the option using a value strictly less than this minimum displays a warning message in the console and
   * automatically sets the option to its minimum value.
   */
  min?: number;

  /**
   * Specifies the exclusive maximum value the option can take.
   *
   * Configuring the option using a value strictly greater than this maximum displays a warning message in the console
   * and automatically sets the option to its maximum value.
   */
  max?: number;

  /**
   * Specifies whether the value of this option is a floating point number.
   */
  float?: boolean;
}

export interface IComponentOptionsListOption extends IComponentOptionsOption<string[]>, IComponentOptionsListOptionArgs {}

/**
 * The `IComponentOptionsListOptionArgs` interface describes the available parameters when building a
 * [list option]{@link ComponentOptions.buildListOption).
 */
export interface IComponentOptionsListOptionArgs extends IComponentOptions<string[]> {
  /**
   * Specifies the regular expression to use to separate the elements of the list option.
   *
   * Default value is a regular expression that inserts a comma character (`,`) between each word.
   */
  separator?: RegExp;

  /**
   * Specifies the possible values the list option elements can take.
   */
  values?: any;
}

export interface IComponentOptionsCustomListOptionArgs<T> extends IComponentOptions<T> {
  separator?: RegExp;
  values?: any;
}

export interface IComponentOptionsChildHtmlElementOption
  extends IComponentOptionsOption<HTMLElement>,
    IComponentOptionsChildHtmlElementOptionArgs {}

export interface IComponentOptionsChildHtmlElementOptionArgs extends IComponentOptions<HTMLElement> {
  selectorAttr?: string;
  childSelector?: string;
}

export interface IComponentOptionsTemplateOption extends IComponentOptionsOption<Template>, IComponentOptionsTemplateOptionArgs {}

/**
 * The `IComponentOptionsTemplateOptionArgs` interface describes the available parameters when building a
 * [template option]{@link ComponentOptions.buildTemplateOption}.
 */
export interface IComponentOptionsTemplateOptionArgs extends IComponentOptions<Template> {
  /**
   * Specifies the CSS selector the template must match. The first matching element in the page is used as the template
   * option value, if this element is a valid template.
   *
   * If specified, this parameter takes precedence over [`idAttr`]{@link IComponentOptionsTemplateOptionArgs.idAttr}.
   */
  selectorAttr?: string;

  /**
   * Specifies the CSS selector the templates must match. The list of all matching, valid elements in the page is used
   * as the template option value.
   *
   * Default value is `.`, followed by the hyphened name of the template option being configured (e.g.,
   * `.content-template`, `.result-template`, `.sub-result-template`, `.preview-template`, etc.).
   */
  childSelector?: string;

  /**
   * Specifies the HTML `id` attribute the template must match. The corresponding template must be registered in
   * the [`TemplateCache`]{@link TemplateCache} to be usable as the template option value.
   *
   * If specified, this parameter takes precedence over
   * [`childSelector`]{@link IComponentOptionsTemplateOptionArgs.childSelector}.
   */
  idAttr?: string;
}

export interface IComponentOptionsFieldOption extends IComponentOptionsOption<string>, IComponentOptionsFieldOptionArgs {}

/**
 * The `IComponentOptionsFieldOptionArgs` interface describes the available parameters when building a
 * [field option]{@link ComponentOptions.buildFieldOption}.
 */
export interface IComponentOptionsFieldOptionArgs extends IComponentOptions<string> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface IComponentOptionsFieldsOption extends IComponentOptionsOption<string[]>, IComponentOptionsFieldsOptionArgs {}

/**
 * The `IComponentOptionsFieldsOptionArgs` interface describes the available parameters when building a
 * [fields option]{@link ComponentOptions.buildFieldsOption}.
 */
export interface IComponentOptionsFieldsOptionArgs extends IComponentOptions<string[]> {
  groupByField?: boolean;
  includeInResults?: boolean;
  sortByField?: boolean;
  splitGroupByField?: boolean;
  match?: (field: IFieldDescription) => boolean;
}

export interface IComponentOptionsObjectOption extends IComponentOptionsOption<{ [key: string]: any }>, IComponentOptionsObjectOptionArgs {}
export interface IComponentOptionsObjectOptionArgs extends IComponentOptions<{ [key: string]: any }> {
  subOptions: { [key: string]: IComponentOptionsOption<any> };
}

export interface IComponentJsonObjectOption<T> extends IComponentOptions<T> {}

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
  static buildStringOption(optionArgs?: IComponentOptions<string>): string {
    return ComponentOptions.buildOption<string>(ComponentOptionsType.STRING, ComponentOptions.loadStringOption, optionArgs);
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
  static buildLocalizedStringOption(optionArgs?: IComponentOptions<string>): string {
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

  /**
   * Builds a template option.
   *
   * The option accepts a CSS selector matching a valid template. This selector can either be a class, or an ID
   * selector.
   *
   * When building a template option using an ID selector, the matching template must be registered in the
   * [`TemplateCache`]{@link TemplateCache}, however.
   *
   * **Markup Examples:**
   *
   * > `data-foo-id="#bar"`
   *
   * > `data-foo-selector=".bar"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {Template} The resulting option value.
   */
  static buildTemplateOption(optionArgs?: IComponentOptionsTemplateOptionArgs): Template {
    return ComponentOptions.buildOption<Template>(ComponentOptionsType.TEMPLATE, ComponentOptions.loadTemplateOption, optionArgs);
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
      const keys = _.keys(optionArgs.subOptions);
      const scopedOptions: {
        [name: string]: IComponentOptionsOption<any>;
      } = {};
      const scopedValues: {
        [name: string]: any;
      } = {};
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const scopedkey = ComponentOptions.mergeCamelCase(name, key);
        scopedOptions[scopedkey] = optionArgs.subOptions[key];
      }
      ComponentOptions.initOptions(element, scopedOptions, scopedValues);
      const resultValues: {
        [name: string]: any;
      } = {};
      let resultFound = false;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
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
    values?: any,
    componentID?: any
  ) {
    const logger = new Logger(this);
    if (values == null) {
      values = {};
    }
    const names: string[] = _.keys(options);
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const optionDefinition = options[name];
      let value: any;
      const loadFromAttribute = optionDefinition.load;

      if (loadFromAttribute != null) {
        value = loadFromAttribute(element, name, optionDefinition);
        if (value && optionDefinition.deprecated) {
          logger.warn(componentID + '.' + name + ': ' + optionDefinition.deprecated);
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
          const isValid = optionDefinition.validator(value);
          if (!isValid) {
            logger.warn(`${componentID} .${name} has invalid value: ${value}`);
            if (optionDefinition.required) {
              logger.error(`${componentID} .${name} is required and has an invalid value: ${value}. ***THIS COMPONENT WILL NOT WORK***`);
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
      if (values[name] == undefined && optionDefinition.required) {
        logger.warn(
          `Option "${name}" is *REQUIRED* on the component "${componentID}". The component or the search page might *NOT WORK PROPERLY*.`,
          element
        );
      }
    }

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const optionDefinition = options[name];
      if (optionDefinition.postProcessing) {
        values[name] = optionDefinition.postProcessing(values[name], values);
      }
    }
    return values;
  }

  static loadStringOption(element: HTMLElement, name: string, option: IComponentOptions<any>): string {
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

  static loadFieldsOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string[] {
    const fieldsAttr = ComponentOptions.loadStringOption(element, name, option);
    if (fieldsAttr == null) {
      return null;
    }
    const fields = fieldsAttr.split(fieldsSeperator);
    _.each(fields, (field: string) => {
      Assert.check(Utils.isCoveoField(field), field + ' is not a valid field');
    });
    return fields;
  }

  static loadLocalizedStringOption(element: HTMLElement, name: string, option: IComponentOptionsOption<any>): string {
    const attributeValue = ComponentOptions.loadStringOption(element, name, option);
    const locale: string = String['locale'] || String['defaultLocale'];
    if (locale != null && attributeValue != null) {
      const localeParts = locale.toLowerCase().split('-');
      const locales = _.map(localeParts, (part, i) => localeParts.slice(0, i + 1).join('-'));
      const localizers = attributeValue.match(localizer);
      if (localizers != null) {
        for (let i = 0; i < localizers.length; i++) {
          const groups = localizer.exec(localizers[i]);
          if (groups != null) {
            const lang = groups[1].toLowerCase();
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
    const attributeValue = ComponentOptions.loadStringOption(element, name, option);
    if (attributeValue == null) {
      return null;
    }
    let numberValue = option.float === true ? Utils.parseFloatIfNotUndefined(attributeValue) : Utils.parseIntIfNotUndefined(attributeValue);
    if (option.min != null && option.min > numberValue) {
      new Logger(element).info(
        `Value for option ${name} is less than the possible minimum (Value is ${numberValue}, minimum is ${option.min}). It has been forced to its minimum value.`,
        option
      );
      numberValue = option.min;
    }
    if (option.max != null && option.max < numberValue) {
      new Logger(element).info(
        `Value for option ${name} is higher than the possible maximum (Value is ${numberValue}, maximum is ${option.max}). It has been forced to its maximum value.`,
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

  static loadTemplateOption(
    element: HTMLElement,
    name: string,
    option: IComponentOptionsTemplateOption,
    doc: Document = document
  ): Template {
    let template: Template;

    // Attribute: template selector
    const selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
    const selector = element.getAttribute(selectorAttr) || ComponentOptions.getAttributeFromAlias(element, option);
    if (selector != null) {
      const templateElement = <HTMLElement>doc.querySelector(selector);
      if (templateElement != null) {
        template = ComponentOptions.createResultTemplateFromElement(templateElement);
      }
    }
    // Attribute: template id
    if (template == null) {
      const idAttr = option.idAttr || ComponentOptions.attrNameFromName(name, option) + '-id';
      const id = element.getAttribute(idAttr) || ComponentOptions.getAttributeFromAlias(element, option);
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
    const foundElements = ComponentOptions.loadChildrenHtmlElementFromSelector(element, selector);
    if (foundElements.length > 0) {
      return new TemplateList(_.compact(_.map(foundElements, element => ComponentOptions.createResultTemplateFromElement(element))));
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
    if (_.isArray(option.alias)) {
      let attributeFound;
      _.each(option.alias, alias => {
        const attributeFoundWithThisAlias = element.getAttribute(ComponentOptions.attrNameFromName(alias));
        if (attributeFoundWithThisAlias) {
          attributeFound = attributeFoundWithThisAlias;
        }
      });
      return attributeFound;
    } else {
      return element.getAttribute(ComponentOptions.attrNameFromName(<string>option.alias));
    }
  }

  static createResultTemplateFromElement(element: HTMLElement): Template {
    Assert.exists(element);
    const type = element.getAttribute('type');
    const mimeTypes =
      'You must specify the type of template. Valid values are:' +
      ' ' +
      UnderscoreTemplate.mimeTypes.toString() +
      ' ' +
      HtmlTemplate.mimeTypes.toString();
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
