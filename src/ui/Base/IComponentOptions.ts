import { IFieldDescription } from '../../rest/FieldDescription';

/**
 * The `IFieldOption` interface declares a type for options that should contain a field to be used in a query.
 *
 * The only constraint this type has over a basic string is that it should start with the `@` character.
 */
export interface IFieldOption extends String {}

/**
 * The `IFieldConditionOption` is a component option expressing a field-based condition that must be satisfied.
 */
export interface IFieldConditionOption {
  /**
   * The name of the field on which the condition is based (e.g., `author`).
   */
  field: string;

  /**
   * The field values allowed (or disallowed) by the condition (e.g., `["Alice Smith", "Bob Jones"]`).
   */
  values: string[];

  /**
   * Whether the condition should disallow the specified [`values`]{@link IFieldConditionOption} rather than allowing them.
   */
  reverseCondition?: boolean;
}

/**
 * The `IQueryExpression` type is a string type dedicated to query expressions.
 *
 * This type is used to build a specific option for query expressions.
 */
export type IQueryExpression = string;

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

/**
 * The `IComponentOptionsTemplateOptionArgs` interface describes the available parameters when building a
 * [template option]{@link ComponentOptions.buildTemplateOption}.
 */

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
/**
 * The `IComponentLocalizedStringOptionArgs` interface describes the available parameters when building a
 * [fields option]{@link ComponentOptions.buildLocalizedStringOption}.
 */
export interface IComponentLocalizedStringOptionArgs extends IComponentOptions<string> {
  localizedString?: () => string;
  /**
   * @deprecated Use `localizedString` instead. Using this option could cause localized string to appear incorrectly translated in the interface.
   */
  defaultValue?: string;
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
  NONE,
  QUERY_EXPRESSION
}
