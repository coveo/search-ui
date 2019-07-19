import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { ComponentOptions, OmniboxEvents, Initialization, $$, Component } from '../../Core';
import { IQuerySuggestSelection } from '../../events/OmniboxEvents';
import { IQueryResults } from '../../rest/QueryResults';
import 'styling/_QuerySuggestPreview';

export interface IQuerySuggestPreview {
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
export class QuerySuggestPreview extends Component implements IComponentBindings {
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
    super(element, QuerySuggestPreview.ID, bindings);

    //Have to do this for now or or break the search interface
    //Will fix in JSUI-2508 where i will use my template
    //this.element.style.display = 'none';

    this.options = ComponentOptions.initComponentOptions(element, QuerySuggestPreview, options);

    this.bind.onRootElement(OmniboxEvents.querySuggestGetFocus, (args: IQuerySuggestSelection) => this.querySuggestGetFocus(args));
    //this.options.layout = 'card'
    //this.options.resultContainer = null
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
    //TODO: I will need to execute a query, with the result,
    //      build a container and display the result  next to the querySuggest
    previousQueryOptions.numberOfResults = this.options.numberOfPreviewResults;
    this.queryController
      .getEndpoint()
      .search(previousQueryOptions)
      .then(results => {
        if (!results) {
          return;
        }
        this.buildResultsPreview(results);
      });
  }

  private buildResultsPreview(results: IQueryResults): Promise<HTMLElement[]> {
    const previewContainer = $$(this.root).find('.coveo-preview-container');
    const container = $$('div', {}, $$('a', {}, 'test').el).el;
    //container.style.width = '150px'
    container.style.cssFloat = 'left';
    //previewContainer.appendChild(container)
    return;
  }
}

Initialization.registerAutoCreateComponent(QuerySuggestPreview);
