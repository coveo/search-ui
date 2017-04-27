import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {IQueryResult} from '../../rest/QueryResult'
import {Initialization} from '../Base/Initialization'
import {FieldValue, IFieldValueOptions} from './FieldValue'
import {StringUtils} from '../../utils/StringUtils'
import {Assert} from '../../misc/Assert'
import {$$} from '../../utils/Dom'


export interface IBadgeOptions extends IFieldValueOptions {
  colors: IBadgeColors;
}

export interface IBadgeColors extends IBadgeColor {
  values?: { [value: string]: IBadgeColors };
}

export interface IBadgeColor {
  icon?: string;
  text?: string;
}

/**
 * This component is used to easily output a field value with customizable colors and an icon preceding it.<br/>
 * It extends {@link FieldValue}, so any options on that component can be used on Badge.<br/>
 * It is possible to configure the default colors, but also to set colors specific to
 * the current field value.
 */
export class Badge extends FieldValue {
  static ID = 'Badge';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IBadgeOptions = {
    /**
     * Specifies the colors for the badge.
     *
     * Colors are specified in a a JSON format like the following:
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
     * This format allows to customize both the icon and text colors for each
     * field value as well as the default value.
     *
     * Colors can be specified in HTML or hexadecimal code format.
     */
    colors: ComponentOptions.buildCustomOption<IBadgeColors>((value: string) => Badge.parseColors(value), { defaultValue: { values: {} } })
  };

  static parent = FieldValue;

  /**
   * Build a new Badge component
   * @param element
   * @param options
   * @param bindings
   * @param result
   */
  constructor(element: HTMLElement, public options?: IBadgeOptions, bindings?: IComponentBindings, result?: IQueryResult) {
    super(element, options = ComponentOptions.initComponentOptions(element, Badge, options), bindings, result, Badge.ID);
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
   * Parse the passed color string into a workable format.
   * See {@link Badge.options.colors} for more info on defining colors.
   * @param colorsOption The color string to parse
   */
  public static parseColors(colorsOption: string): IBadgeColors {
    if (colorsOption) {
      if (Badge.colorsRegex.test(colorsOption)) {
        let badgeColors: IBadgeColors = {
          values: {}
        };
        let colors: string[][] = StringUtils.match(colorsOption, Badge.colorRegex);
        _.each(colors, (color: string[]) => {
          let [fullColor, fieldValue, colorValue] = color;
          if (fieldValue != null) {
            badgeColors.values[fieldValue.replace(/\\(:|;)/g, '$1')] = {
              icon: colorValue
            }
          } else {
            badgeColors.icon = colorValue;
          }
        })
        return badgeColors
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
   * Get the icon and text color for the passed field value.<br/>
   * Returns an object with the `icon` and `text` keys,
   * representing their respective colors.
   * @param value The field value for which the colors are returned
   */
  public getColor(value: string = ''): IBadgeColor {
    var colorKey = _.find(_.keys(this.options.colors.values), (key: string) => value.toLowerCase() == key.toLowerCase());
    var color: IBadgeColor = colorKey ? this.options.colors.values[colorKey] : {};
    return {
      icon: color.icon || this.options.colors.icon,
      text: color.text || this.options.colors.text,
    };
  }

  /**
   * Render one string value with the appropriate colors and icon.<br/>
   * Returns an HTML `span` containing the rendered value
   * @param value The field value to render
   */
  public renderOneValue(value: string): HTMLElement {
    let valueDom = super.renderOneValue(value);
    $$(valueDom).addClass('coveo-value');

    let color = this.getColor(value);

    if (this.searchInterface.isNewDesign()) {
      var icon = $$('span', { className: 'coveo-badge-icon' }).el;
      if (color.icon != null) {
        icon.style.color = color.icon;
      }
    } else if (color.icon != null) {
      valueDom.style.background = color.icon;
    }

    let label = $$('span', { className: 'coveo-badge-label' }, valueDom.innerHTML).el;

    if (color.text != null) {
      label.style.color = color.text;
    }

    $$(valueDom).empty();

    if (this.searchInterface.isNewDesign()) {
      valueDom.appendChild(icon);
    }
    valueDom.appendChild(label);
    return valueDom;
  }
}

Initialization.registerAutoCreateComponent(Badge);
