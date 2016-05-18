
module Coveo {
  export interface TextOptions {
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

  export class Text extends Component {
    static ID = 'Text';

    static options: TextOptions = {
      value: ComponentOptions.buildLocalizedStringOption(),
      size: ComponentOptions.buildStringOption(),
      style: ComponentOptions.buildStringOption(),
      weight: ComponentOptions.buildStringOption(),
      textAlign: ComponentOptions.buildStringOption(),
      marginTop: ComponentOptions.buildStringOption(),
      marginBottom: ComponentOptions.buildStringOption(),
      marginLeft: ComponentOptions.buildStringOption(),
      marginRight: ComponentOptions.buildStringOption(),
      paddingTop: ComponentOptions.buildStringOption(),
      paddingBottom: ComponentOptions.buildStringOption(),
      paddingLeft: ComponentOptions.buildStringOption(),
      paddingRight: ComponentOptions.buildStringOption()
    };

    constructor(public element: HTMLElement,
      public options?: TextOptions,
      bindings?: IComponentBindings) {
      super(element, Text.ID, bindings);
      this.options = ComponentOptions.initComponentOptions(element, Text, options);
      $(this.element).text(this.options.value);
      $(this.element).css("font-size", this.options.size);
      $(this.element).css("font-style", this.options.style);
      $(this.element).css("font-weight", this.options.weight);
      $(this.element).css("text-align", this.options.textAlign);
      $(this.element).css("margin-top", this.options.marginTop);
      $(this.element).css("margin-bottom", this.options.marginBottom);
      $(this.element).css("margin-right", this.options.marginRight);
      $(this.element).css("margin-left", this.options.marginLeft);
      $(this.element).css("padding-top", this.options.paddingTop);
      $(this.element).css("padding-bottom", this.options.paddingBottom);
      $(this.element).css("padding-left", this.options.paddingLeft);
      $(this.element).css("padding-right", this.options.paddingRight);
    }
  }

  Initialization.registerAutoCreateComponent(Text);
}
