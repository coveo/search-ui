
module Coveo {

  export class Excerpt extends Component {
    static ID = 'Excerpt';

    constructor(public element: HTMLElement,
                public options?: any,
                public bindings?: IComponentBindings,
                public result?: IQueryResult) {
      super(element, Excerpt.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, Excerpt, options);
      this.result = this.result || this.resolveResult();
      Assert.exists(this.result);
      this.element.innerHTML = HighlightUtils.highlightString(this.result.excerpt, this.result.excerptHighlights, null, 'coveo-highlight');
    }
  }
  Initialization.registerAutoCreateComponent(Excerpt);
}