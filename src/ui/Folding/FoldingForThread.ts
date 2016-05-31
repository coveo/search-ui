

module Coveo {

  /**
   * This component inherits from the {@link Folding} component.
   * Folding conversations and threads requires different processing.
   * When you need to fold children under a parent item, use this component.<br/>
   * <b>This component works well with Chatter and Lithium</b>
   */
  export class FoldingForThread extends Folding {
    static ID = 'FoldingForThread';

    /**
     * Create a new FoldingForThread component
     * @param element
     * @param options
     * @param bindings
     */
    constructor(public element: HTMLElement, public options: IFoldingOptions, bindings?: IComponentBindings) {
      super(element, options, bindings);
      this.options.getMoreResults = (results: IQueryResult[]) => {
        return Coveo.Folding.foldWithParent(results)[0].attachments;
      };

      this.options.getResult = (result: IQueryResult) => {
        var defaultResult = Folding.defaultGetResult(result);
        defaultResult.childResults = defaultResult.attachments;
        defaultResult.attachments = [];
        return defaultResult;
      };
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(FoldingForThread);
}
