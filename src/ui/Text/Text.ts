
import {ComponentOptions} from '../Base/ComponentOptions';
import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Initialization} from '../Base/Initialization';
import {$$} from '../../utils/Dom';

export interface ITextOptions {
  value?: string;
  size?: string;
  style?: string;
  weight?: string;
  textAlign?: string;

  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;

  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

/**
 * This component only role is to be embedded in a result template and to output a simple text value.<br/>
 * Thus, the only purpose is to be able to easily add different text value with the interface editor.<br/>
 * If you are not designing a search using the interface editor, the usage of this component is not pertinent.
 */
export class Text extends Component {
  static ID = 'Text';

  /**
   * @componentOptions
   */
  static options: ITextOptions = {
    /**
     * The localized string value that the component should render
     */
    value: ComponentOptions.buildLocalizedStringOption(),
    /**
     * The size of the text (set as the font-size css property)
     */
    size: ComponentOptions.buildStringOption(),
    /**
     * The style of the text (set as the font-style css property)
     */
    style: ComponentOptions.buildStringOption(),
    /**
     * The weight of the text (set as the font-weight css property)
     */
    weight: ComponentOptions.buildStringOption(),
    /**
     * The alignment of the text (set as the text-align css property)
     */
    textAlign: ComponentOptions.buildStringOption(),
    /**
     * The margin top of the text (set as the margin-top css property)
     */
    marginTop: ComponentOptions.buildStringOption(),
    /**
     * The margin bottom of the text (set as the margin-bottom css property)
     */
    marginBottom: ComponentOptions.buildStringOption(),
    /**
     * The margin left of the text (set as the margin-left css property)
     */
    marginLeft: ComponentOptions.buildStringOption(),
    /**
     * The margin right of the text (set as the margin-right css property)
     */
    marginRight: ComponentOptions.buildStringOption(),
    /**
     * The padding top of the text (set as the padding-top css property)
     */
    paddingTop: ComponentOptions.buildStringOption(),
    /**
     * The padding bottom of the text (set as the padding-bottom css property)
     */
    paddingBottom: ComponentOptions.buildStringOption(),
    /**
     * The padding left of the text (set as the padding-left css property)
     */
    paddingLeft: ComponentOptions.buildStringOption(),
    /**
     * The padding right of the text (set as the padding-right css property)
     */
    paddingRight: ComponentOptions.buildStringOption()
  };

  constructor(public element: HTMLElement, public options?: ITextOptions, bindings?: IComponentBindings) {
    super(element, Text.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Text, options);
    $$(this.element).text(this.options.value);
    this.element.style.fontSize = this.options.size;
    this.element.style.fontStyle = this.options.style;
    this.element.style.fontWeight = this.options.weight;
    this.element.style.textAlign = this.options.textAlign;
    this.element.style.marginTop = this.options.marginTop;
    this.element.style.marginBottom = this.options.marginBottom;
    this.element.style.marginRight = this.options.marginRight;
    this.element.style.marginLeft = this.options.marginLeft;
    this.element.style.paddingTop = this.options.paddingTop;
    this.element.style.paddingBottom = this.options.paddingBottom;
    this.element.style.paddingLeft = this.options.paddingLeft;
    this.element.style.paddingRight = this.options.paddingRight;
  }
}

Initialization.registerAutoCreateComponent(Text);
