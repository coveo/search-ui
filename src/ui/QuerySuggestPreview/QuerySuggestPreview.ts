import { ResultList } from '../ResultList/ResultList';
import { IResultListOptions } from '../ResultList/ResultListOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { ComponentOptions, OmniboxEvents, Initialization } from '../../Core';
import { IQuerySuggestSelection } from '../../events/OmniboxEvents';

export interface IQuerySuggestPreview extends IResultListOptions {
  numberOfPreviewResults?: number;
  width?: string;
}

/**
 * The QuerySuggestPreview component behaves exactly like the {@link ResultList} component (which it extends), except that
 * it renders itself beside the query suggest when hovering a result.
 *
 * ```html
 * <div class="CoveoQuerySuggestPreview">
 *   <script class="result-template" type="text/x-underscore">
 *     <div>
 *       <a class='CoveoResultLink'></a>
 *     </div>
 *   </script>
 * </div>
 * ```
 *
 */
export class QuerySuggestPreview extends ResultList implements IComponentBindings {
  static ID = 'QuerySuggestPreview';

  /**
   * Specifies a list a css class that should be ignored when the end user click result in the omnibox
   *
   * Any element that is specified here should normally be able to handle the standard click event.
   *
   * Any element that does not match this css class and that is clicked will trigger a redirection by the OmniboxResultList.
   */
  static elementsToIgnore = [];

  static doExport = () => {
    exportGlobally({
      QuerySuggestPreview: QuerySuggestPreview
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IQuerySuggestPreview = {
    /**
     * The maximum number of query results to render in the preview.
     *
     * **Minimum and default value:** `0`
     */
    numberOfPreviewResults: ComponentOptions.buildNumberOption({ defaultValue: 0, min: 0 })
  };

  /**
   * Creates a new QuerySuggestPreview component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the QuerySuggestPreview component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IQuerySuggestPreview, public bindings?: IComponentBindings) {
    super(element, options, bindings, QuerySuggestPreview.ID);

    //Have to do this for now or or break the search interface
    //Will fix in JSUI-2508 where i will use my template
    this.element.style.display = 'none';

    this.options = ComponentOptions.initComponentOptions(element, QuerySuggestPreview, options);

    this.bind.onRootElement(OmniboxEvents.querySuggestGetFocus, (args: IQuerySuggestSelection) => this.querySuggestGetFocus(args));
  }

  private get shouldShowPreviewResults() {
    return this.options.numberOfPreviewResults > 0;
  }

  private querySuggestGetFocus(args: IQuerySuggestSelection) {
    if (!this.shouldShowPreviewResults) {
      return;
    }
    this.executeQueryHover(args.suggestion);
  }

  private executeQueryHover(suggestion: string) {
    const previousQueryOptions = this.queryController.getLastQuery();
    previousQueryOptions.q = suggestion;
    previousQueryOptions.numberOfResults = this.options.numberOfPreviewResults;
    //TODO: I will need to execute a query, with the result,
    //      build a container and display the result  next to the querySuggest
  }
}

Initialization.registerAutoCreateComponent(QuerySuggestPreview);
