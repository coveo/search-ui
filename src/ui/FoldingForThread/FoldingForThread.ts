import { Folding, IFoldingOptions } from '../Folding/Folding';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';

/**
 * The `FoldingForThread` component inherits from the [`Folding`]{@link Folding} component. It offers the
 * same configuration options.
 *
 * Folding conversations and threads requires different processing. When you need to fold all child items (including
 * their attachments) on the same level under a common ancestor item, use this component rather than the `Folding`
 * component.
 *
 * This component works well with Chatter and Lithium.
 *
 * **Note:**
 * > There can only be one `FoldingForThread` component per [`Tab`]{@link Tab} component.
 *
 * See [Folding Results](https://developers.coveo.com/x/7hUvAg).
 */
export class FoldingForThread extends Folding {
  static ID = 'FoldingForThread';

  static doExport = () => {
    exportGlobally({
      FoldingForThread: FoldingForThread
    });
  };

  /**
   * Creates a new `FoldingForThread` component
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `FoldingForThread` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IFoldingOptions, bindings?: IComponentBindings) {
    super(element, options, bindings);
    this.options.getMoreResults = (results: IQueryResult[]) => {
      return Folding.foldWithParent(results)[0].attachments;
    };

    this.options.getResult = (result: IQueryResult) => {
      var defaultResult = Folding.defaultGetResult(result);
      defaultResult.childResults = defaultResult.attachments;
      defaultResult.attachments = [];
      return defaultResult;
    };
  }
}

Initialization.registerAutoCreateComponent(FoldingForThread);
