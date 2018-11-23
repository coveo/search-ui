import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { Initialization } from '../Base/Initialization';
import { FieldValue, IFieldValueOptions } from '../FieldValue/FieldValue';
import { StringUtils } from '../../utils/StringUtils';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

export interface IBadgeOptions extends IFieldValueOptions {
  colors: IBadgeColors;
}

/**
 * Badge Colors
 */
export interface IBadgeColors extends IBadgeColor {
  values?: { [value: string]: IBadgeColors };
}

export interface IBadgeColor {
  icon?: string;
  text?: string;
}

/**
 * The Badge component outputs a field value with customizable colors and an icon preceding it.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)). It
 * extends the {@link FieldValue} component. Therefore all FieldValue options are also available for a Badge component.
 */
export class Badge extends FieldValue implements IComponentBindings {
  static ID = 'Badge';

  static doExport = () => {
    exportGlobally({
      Badge: Badge
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IBadgeOptions = {
    /**
     * Specifies the colors for the Badge component.
     *
     * You must specify the colors in a JSON format similar to what follows:
     * ```json
     * {
     *   "values":{
     *     "foo":{
     *       "icon":"blue",
     *       "text":"#222"
     *     },
     *     "bar":{
     *       "icon":"green",
     *       "text":"lightgreen"
     *     }
     *   },
     *   "icon":"red",
     *   "text":"#9ab52b"
     * }
     * ```
     * This format allows you to customize both the icon and text colors for each field value as well as the default
     * values.
     *
     * Colors can be specified in HTML or hexadecimal format.
     */
    colors: ComponentOptions.buildCustomOption<IBadgeColors>((value: string) => Badge.parseColors(value), {
      defaultValue: { values: {} }
    }),
    textCaption: ComponentOptions.buildLocalizedStringOption()
  };

  static parent = FieldValue;

  /**
   * Creates a new Badge component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Badge component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(element: HTMLElement, public options: IBadgeOptions, bindings?: IComponentBindings, result?: IQueryResult) {
    super(element, ComponentOptions.initComponentOptions(element, Badge, options), bindings, result, Badge.ID);
    if (_.isString(this.options.colors)) {
      // to support the old string options
      this.options.colors = Badge.parseColors(<any>this.options.colors);
    }
    if (this.options.colors.values == null) {
      this.options.colors.values = {};
    }
  }

  // The following regexes are used to match the old color format:

  // This one matches a single color, e.g. either "red" or "foo: blue".
  // Its capture groups will be the following :
  // 0:( 1:() 2:(red)) or 0:( 1:(foo) 2:(blue))
  private static colorRegex = /(?:\s*((?:[^:;]|\\[;:])*)\s*:\s*)?(\w+|#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})/g;
  // This one matches all colors, separated by semicolons, e.g. "red; foo: blue; bar: green".
  // It wraps 'colorRegex' in other capture groups, such as the following:
  // 0:(red) 1:(foo: blue;) 2:(bar: green)
  private static colorsRegex = new RegExp('^(\\s*' + Badge.colorRegex.source + '\\s*;)*(\\s*' + Badge.colorRegex.source + ')?\\s*$');

  /**
   * Parses a {@link Badge.options.colors} option string into a workable JSON format.
   *
   * @param colorsOption The colors option string to parse. See {@link Badge.options.colors}.
   */
  public static parseColors(colorsOption: string): IBadgeColors {
    if (colorsOption) {
      if (Badge.colorsRegex.test(colorsOption)) {
        let badgeColors: IBadgeColors = {
          values: {}
        };
        let colors: string[][] = StringUtils.match(colorsOption, Badge.colorRegex);
        _.each(colors, (color: string[]) => {
          let [, fieldValue, colorValue] = color;
          if (fieldValue != null) {
            badgeColors.values[fieldValue.replace(/\\(:|;)/g, '$1')] = {
              icon: colorValue
            };
          } else {
            badgeColors.icon = colorValue;
          }
        });
        return badgeColors;
      }
      try {
        return JSON.parse(colorsOption);
      } catch (e) {
        Assert.fail(`Invalid colors for badge '${colorsOption}'`);
      }
    }
    return {};
  }

  /**
   * Gets the icon and text color of a field value.
   *
   * @param value The field value whose colors to return.
   * @returns {{icon: string, text: string}} An object with the `icon` and `text` keys.
   */
  public getColor(value: string = ''): IBadgeColor {
    var colorKey = _.find(_.keys(this.options.colors.values), (key: string) => value.toLowerCase() == key.toLowerCase());
    var color: IBadgeColor = colorKey ? this.options.colors.values[colorKey] : {};
    return {
      icon: color.icon || this.options.colors.icon,
      text: color.text || this.options.colors.text
    };
  }

  /**
   * Renders one string value with the appropriate colors and icon.
   *
   * @param value The field value to render.
   * @returns {HTMLElement} An HTML `<span>` tag containing the rendered value.
   */
  public renderOneValue(value: string): HTMLElement {
    let valueDom = super.renderOneValue(value);
    $$(valueDom).addClass('coveo-value');

    let color = this.getColor(value);

    var icon = $$('span', { className: 'coveo-badge-icon' }).el;
    if (color.icon != null) {
      icon.style.color = color.icon;
    }

    let label = $$('span', { className: 'coveo-badge-label' }, valueDom.innerHTML).el;

    if (color.text != null) {
      label.style.color = color.text;
    }

    $$(valueDom).empty();

    valueDom.appendChild(icon);
    valueDom.appendChild(label);
    return valueDom;
  }

  // Override the protected method from FieldValue class to ignore a potential textCaption on a Badge.
  protected prependTextCaptionToDom(): void {
    return;
  }
}

Badge.options = _.omit(Badge.options, 'textCaption');

Initialization.registerAutoCreateComponent(Badge);
