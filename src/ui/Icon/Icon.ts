import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { QueryUtils } from '../../utils/QueryUtils';
import { Initialization } from '../Base/Initialization';
import { Utils } from '../../utils/Utils';
import { FileTypes, IFileTypeInfo } from '../Misc/FileTypes';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';

/**
 * Available options for the {@link Icon} component.
 */
export interface IIconOptions {
  value?: string;
  small?: boolean;
  withLabel?: boolean;
  labelValue?: string;
}

/**
 * The Icon component outputs the corresponding icon for a given file type. The component searches for a suitable icon
 * from those available in the Coveo JavaScript Search Framework. If the component finds no suitable icon, it instead
 * outputs a generic icon.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class Icon extends Component {
  static ID = 'Icon';

  static doExport = () => {
    exportGlobally({
      Icon: Icon
    });
  };

  /**
   * The options for the Icon
   * @componentOptions
   */
  static options: IIconOptions = {
    /**
     * Specifies the value that the Icon component should output as its CSS class instead of the auto-selected value.
     *
     * Default value is `undefined`, which means that the Coveo JavaScript Search Framework outputs a suitable icon
     * depending on the result file type.
     */
    value: ComponentOptions.buildStringOption(),

    /**
     * Specifies whether the Icon component should output the smaller version of the icon instead of the regular one.
     *
     * Default value is `undefined`.
     */
    small: ComponentOptions.buildBooleanOption(),

    /**
     * Specifies whether the Icon component should force the output icon to display its caption/label.
     *
     * **Note:**
     *
     * > Due to limited screen real estate, setting this option to `true` has no effect on icons used inside Coveo for
     * > Salesforce Insight Panels.
     *
     * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines whether the icon
     * needs to display a caption/label depending on the result file type.
     */
    withLabel: ComponentOptions.buildBooleanOption(),

    /**
     * Specifies what text to display as the icon caption/label.
     *
     * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines what text the icon
     * needs to display depending on the result file type.
     */
    labelValue: ComponentOptions.buildLocalizedStringOption()
  };

  /**
   * Creates a new Icon component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Icon component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(public element: HTMLElement, public options?: IIconOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, Icon.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Icon, options);
    this.result = this.result || this.resolveResult();
    Assert.exists(this.result);

    var possibleInternalQuickview = $$(this.element).find('.' + Component.computeCssClassNameForType('Quickview'));
    if (!Utils.isNullOrUndefined(possibleInternalQuickview) && QueryUtils.hasHTMLVersion(this.result)) {
      $$(this.element).addClass('coveo-with-quickview');
      $$(this.element).on('click', () => {
        var qv = <any>Component.get(possibleInternalQuickview);
        qv.open();
      });
    }

    Icon.createIcon(this.result, this.options, element, bindings);
  }

  static createIcon(result: IQueryResult, options: IIconOptions = {}, element: HTMLElement = $$('div').el, bindings?: IComponentBindings) {
    var info = FileTypes.get(result);

    if (!bindings && result.searchInterface) {
      // try to resolve results bindings automatically
      bindings = result.searchInterface.getBindings();
    }
    info = Icon.preprocessIconInfo(options, info);
    $$(element).toggleClass('coveo-small', options.small === true);

    if (options.value != undefined) {
      if (options.small === true) {
        if (options.value.indexOf('-small') == -1) {
          info.icon += '-small';
        }
      }
      if (options.small === false) {
        if (options.value.indexOf('-small') != -1) {
          info.icon = info.icon.replace('-small', '');
        }
      }
    }
    $$(element).addClass(info.icon);
    element.setAttribute('title', info.caption);

    if (Icon.shouldDisplayLabel(options, bindings)) {
      element.appendChild(
        $$(
          'span',
          {
            className: 'coveo-icon-caption-overlay'
          },
          info.caption
        ).el
      );
      $$(element).addClass('coveo-icon-with-caption-overlay');
      $$(element).setAttribute('data-with-label', 'true');
    }
    return element;
  }

  static shouldDisplayLabel(options: IIconOptions, bindings: IComponentBindings) {
    // If withLabel is explicitely set to false, the label will never display
    // If withLabel is explicitely set to true, the label will always display
    // If withLabel is set to default value (not a hard true or false), the label will display based on ./core/filetypes/**.json
    // with the property shouldDisplayLabel set on each file type/ objecttype
    // In this case, the generated css will take care of outputting the correct css to display : block
    return options.withLabel !== false;
  }

  static preprocessIconInfo(options: IIconOptions, info: IFileTypeInfo) {
    if (options.labelValue != null) {
      info.caption = options.labelValue;
    }
    if (options.value != null) {
      info.icon = 'coveo-icon ' + options.value;
    }
    if (info.caption == null) {
      info.caption = '';
    }
    if (info.icon == null) {
      info.icon = 'coveo-icon coveo-sprites-custom';
    }
    return info;
  }
}
Initialization.registerAutoCreateComponent(Icon);
