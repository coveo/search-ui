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

export class QuerySuggestPreview extends ResultList implements IComponentBindings {
  static ID = 'QuerySuggestPreview';

  static elementsToIgnore = [];

  static doExport = () => {
    exportGlobally({
      QuerySuggestPreview: QuerySuggestPreview
    });
  };

  static options: IQuerySuggestPreview = {
    numberOfPreviewResults: ComponentOptions.buildNumberOption({ defaultValue: 0, min: 0 })
  };

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
