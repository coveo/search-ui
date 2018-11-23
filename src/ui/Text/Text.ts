import { ComponentOptions } from '../Base/ComponentOptions';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_Text';

export interface ITextOptions {
  value?: string;
  size?: string;
  style?: string;
  color?: string;
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
 * The Text component embeds itself in a result template to output a simple text value.
 *
 * The only purpose of this component is to make it possible to easily add different text values to result templates
 * when using the Coveo JavaScript Search Interface Editor (see
 * [JavaScript Search Interface Editor](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=230)).
 *
 * If you are not designing a search interface using the Coveo JavaScript Search Interface Editor, using this component
 * is unnecessary.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class Text extends Component {
  static ID = 'Text';

  static doExport = () => {
    exportGlobally({
      Text: Text
    });
  };

  /**
   * @componentOptions
   */
  static options: ITextOptions = {
    /**
     * Specifies the localized string value that the component should render.
     */
    value: ComponentOptions.buildLocalizedStringOption(),

    /**
     * Specifies the size of the text (set as the `font-size` CSS property).
     */
    size: ComponentOptions.buildStringOption(),

    /**
     * Specifies the style of the text (set as the `font-style` CSS property).
     */
    style: ComponentOptions.buildStringOption(),

    /**
     * Specifies the color of the text (set as the `color` CSS property).
     */
    color: ComponentOptions.buildStringOption(),

    /**
     * Specifies the weight of the text (set as the `font-weight` CSS property).
     */
    weight: ComponentOptions.buildStringOption(),

    /**
     * Specifies the alignment of the text (set as the `text-align` CSS property).
     */
    textAlign: ComponentOptions.buildStringOption(),

    /**
     * Specifies the top margin of the text (set as the `margin-top` CSS property).
     */
    marginTop: ComponentOptions.buildStringOption(),

    /**
     * Specifies the bottom margin of the text (set as the `margin-bottom` CSS property).
     */
    marginBottom: ComponentOptions.buildStringOption(),

    /**
     * Specifies the left margin of the text (set as the `margin-left` CSS property).
     */
    marginLeft: ComponentOptions.buildStringOption(),

    /**
     * Specifies the right margin of the text (set as the `margin-right` CSS property).
     */
    marginRight: ComponentOptions.buildStringOption(),

    /**
     * Specifies the top padding of the text (set as the `padding-top` CSS property).
     */
    paddingTop: ComponentOptions.buildStringOption(),

    /**
     * Specifies the bottom padding of the text (set as the `padding-bottom` CSS property).
     */
    paddingBottom: ComponentOptions.buildStringOption(),

    /**
     * Specifies the left padding of the text (set as the `padding-left` CSS property).
     */
    paddingLeft: ComponentOptions.buildStringOption(),

    /**
     * Specifies the right padding of the text (set as the `padding-right` CSS property).
     */
    paddingRight: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new Text component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Text component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ITextOptions, bindings?: IComponentBindings) {
    super(element, Text.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Text, options);
    $$(this.element).text(this.options.value);
    this.element.style.fontSize = this.options.size;
    this.element.style.fontStyle = this.options.style;
    this.element.style.color = this.options.color;
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
