import {Component} from '../Base/Component'
import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {IQueryResult} from '../../rest/QueryResult'
import {Assert} from '../../misc/Assert'
import {QueryUtils} from '../../utils/QueryUtils'
import {Initialization} from '../Base/Initialization'
import {Utils} from '../../utils/Utils'
import {FileTypes, IFileTypeInfo} from '../Misc/FileTypes'
import {Quickview} from '../Quickview/Quickview'
import {$$} from '../../utils/Dom'

export interface IIconOptions {
  value?: string;
  small?: boolean;
  withLabel?: boolean;
  labelValue?: string;
}

/**
 * An icon component is a Result template component which outputs the corresponding icon for a give filetype. It uses the
 * available icons in the framework, and if no suitable one are found, it fallback on a generic icon.
 */
export class Icon extends Component {
  static ID = 'Icon';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IIconOptions = {
    /**
     * Setting this value will tell the Icon component to output this value as it's css class, instead of the auto-selected one.<br/>
     * Default is `undefined`, and the framework will determine an icon from the result filetype.
     */
    value: ComponentOptions.buildIconOption(),
    /**
     * Setting this value to true will output the smaller version of the auto-generated icon.<br/>
     * Default is `false`.
     */
    small: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Setting this to true will force the caption/label to appear.<br/>
     * Setting this to false will force the caption/label to never appear.<br/>
     * Default value is `undefined`, and the framework will determine if a label needs to be displayed.
     */
    withLabel: ComponentOptions.buildBooleanOption(),
    /**
     * Setting this option allow to set the label that should be displayed.<br/>
     * Default value is `undefined`, and the framework will determine the label that will be displayed.
     */
    labelValue: ComponentOptions.buildLocalizedStringOption()
  };

  static fields = [
    'objecttype',
    'filetype',
  ];

  /**
   * Create a new Icon component
   * @param element
   * @param options
   * @param bindings
   * @param result
   */
  constructor(public element: HTMLElement, public options?: IIconOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, Icon.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Icon, options);
    this.result = this.result || this.resolveResult();
    Assert.exists(this.result);

    var possibleInternalQuickview = $$(this.element).find('.' + Component.computeCssClassNameForType(Quickview.ID));
    if (!Utils.isNullOrUndefined(possibleInternalQuickview) && QueryUtils.hasHTMLVersion(this.result)) {
      $$(this.element).addClass('coveo-with-quickview');
      $$(this.element).on('click', () => {
        var qv: Quickview = <Quickview>Component.get(possibleInternalQuickview);
        qv.open();
      });
    }

    Icon.createIcon(this.result, this.options, element, bindings);
  }

  static createIcon(result: IQueryResult, options: IIconOptions = {}, element: HTMLElement = $$('div').el, bindings?: IComponentBindings) {
    var info = FileTypes.get(result);
    info = Icon.preprocessIconInfo(options, info);
    $$(element).addClass(info.icon);
    element.setAttribute('title', info.caption);
    if (options.small) {
      $$(element).addClass('coveo-small');
    }
    if (Icon.shouldDisplayLabel(options, bindings)) {
      element.appendChild($$('span', {
        className: 'coveo-icon-caption-overlay'
      }, info.caption).el);
      $$(element).addClass('coveo-icon-with-caption-overlay');
    }
    return element;
  }

  static shouldDisplayLabel(options: IIconOptions, bindings: IComponentBindings) {
    // Display only in new design.
    // If withLabel is explicitely set to false, the label will never display
    // If withLabel is explicitely set to true, the label will always display
    // If withLabel is set to default value (not a hard true or false), the label will display based on ./core/filetypes/**.json
    // with the property shouldDisplayLabel set on each file type/ objecttype
    // In this case, the generated css will take care of outputting the correct css to display : block
    return bindings && bindings.searchInterface.isNewDesign() && options.withLabel !== false;
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
