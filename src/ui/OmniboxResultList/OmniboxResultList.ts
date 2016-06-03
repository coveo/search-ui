import {Component} from '../Base/Component'
import {$$} from '../../utils/Dom';
import {l} from '../../strings/Strings';
import {IResultListOptions, ResultList} from '../ResultList/ResultList';
import {IQueryResult} from '../../rest/QueryResult';
import {IPopulateOmniboxEventArgs, OmniboxEvents} from '../../events/OmniboxEvents';
import {ComponentOptions} from '../Base/ComponentOptions';
import {SuggestionForOmnibox} from '../Misc/SuggestionForOmnibox';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {analyticsActionCauseList, IAnalyticsNoMeta} from '../Analytics/AnalyticsActionListMeta';
import {Assert} from '../../misc/Assert';
import {Utils} from '../../utils/Utils';
import {Initialization} from '../Base/Initialization';
import {IQueryResults} from '../../rest/QueryResults';
import {IOmniboxDataRow} from '../Omnibox/OmniboxInterface';

export interface IOmniboxResultListOptions extends IResultListOptions {
  omniboxZIndex?: number;
  onSelect?: (result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs) => void;
  headerTitle?: string;
  queryOverride?: string;
}

export class OmniboxResultList extends ResultList {
  static ID = 'OmniboxResultList';
  static options: IOmniboxResultListOptions = {
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 51, min: 16 }),
    headerTitle: ComponentOptions.buildStringOption(),
    queryOverride: ComponentOptions.buildStringOption()
  }

  private lastOmniboxRequest: { omniboxObject: IPopulateOmniboxEventArgs; resolve: (...args: any[]) => void; };
  private suggestionForOmnibox: SuggestionForOmnibox;

  constructor(public element: HTMLElement, public options?: IOmniboxResultListOptions, public bindings?: IComponentBindings) {
    super(element, options, bindings, OmniboxResultList.ID);
    this.options = ComponentOptions.initComponentOptions(element, OmniboxResultList, options);
    this.setupOptions();
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args))
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleQueryOverride(args));
  }

  /**
   * Build and return an array of HTMLElement with the given result set.
   * @param results
   */
  public buildResults(results: IQueryResults): HTMLElement[] {
    return _.map(results.results, (result: IQueryResult) => {
      let resultElement = this.buildResult(result);
      $$(resultElement).addClass('coveo-omnibox-selectable');
      $$(resultElement).on('keyboardSelect', () => {
        this.options.onSelect.call(this, result, resultElement, this.lastOmniboxRequest.omniboxObject);
      });
      this.autoCreateComponentsInsideResult(resultElement, result);
      return resultElement;
    });
  }

  public renderResults(resultsElement: HTMLElement[], append = false) {
    if (this.lastOmniboxRequest) {
      let content = $$('div').el;
      content.appendChild($$('div', { className: 'coveo-omnibox-result-list-header' },
        $$('span', { className: 'coveo-icon-omnibox-result-list' }).el,
        $$('span', { className: 'coveo-caption' }, (this.options.headerTitle || l('SuggestedResults'))).el
      ).el)
      _.each(resultsElement, (resultElement: HTMLElement) => {
        content.appendChild(resultElement);
        this.triggerNewResultDisplayed(Component.getResult(resultElement), resultElement);
      });
      this.triggerNewResultsDisplayed();
      this.lastOmniboxRequest.resolve({ element: content, zIndex: this.options.omniboxZIndex });
    }
  }

  private setupOptions() {
    this.logger.info('Disabling infinite scroll for OmniboxResultList', this);
    this.options.enableInfiniteScroll = false;
    this.options.onSelect = this.options.onSelect || this.onRowSelection;
  }

  private handlePopulateOmnibox(args: IPopulateOmniboxEventArgs) {
    let promise = new Promise((resolve, reject) => {
      this.queryController.executeQuery({
        beforeExecuteQuery: () => this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {}),
        searchAsYouType: true
      });
      this.lastOmniboxRequest = { omniboxObject: args, resolve: resolve };
    })
    args.rows.push({
      deferred: promise
    });
  }

  private handleQueryOverride(args: IBuildingQueryEventArgs) {
    Assert.exists(args);
    if (Utils.isNonEmptyString(this.options.queryOverride)) {
      args.queryBuilder.constantExpression.add(this.options.queryOverride);
    }
  }

  private onRowSelection(result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs) {
    this.usageAnalytics.logClickEvent(analyticsActionCauseList.documentOpen, { author: result.raw.author }, result, this.root);
    window.location.href = result.clickUri;
  }
}
Initialization.registerAutoCreateComponent(OmniboxResultList);
