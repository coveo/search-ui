import {Component} from '../Base/Component';
import {$$} from '../../utils/Dom';
import {l} from '../../strings/Strings';
import {IResultListOptions, ResultList} from '../ResultList/ResultList';
import {IQueryResult} from '../../rest/QueryResult';
import {IPopulateOmniboxEventArgs, OmniboxEvents} from '../../events/OmniboxEvents';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {analyticsActionCauseList, IAnalyticsNoMeta} from '../Analytics/AnalyticsActionListMeta';
import {Assert} from '../../misc/Assert';
import {Utils} from '../../utils/Utils';
import {Initialization} from '../Base/Initialization';
import {IQueryResults} from '../../rest/QueryResults';

export interface IOmniboxResultListOptions extends IResultListOptions {
  omniboxZIndex?: number;
  onSelect?: (result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs) => void;
  headerTitle?: string;
  queryOverride?: string;
}

/**
 * This component is exactly like a normal ResultList Component, except that it will render itself inside the Omnibox Component.
 * This will provide a kind of search as you type functionnality, allowing you to easily render complex Result Templates inside the Omnibox Component.
 *
 * # Example
 * ```
 *     <div class="CoveoOmniboxResultList">
 *         <script class="result-template" type="text/x-underscore">
 *             <div>
 *                 <a class='CoveoResultLink'></a>
 *             </div>
 *         </script>
 *     </div>
 * ```
 */
export class OmniboxResultList extends ResultList {
  static ID = 'OmniboxResultList';
  /**
   * The options for the component
   * @componentOptions
   */
  static options: IOmniboxResultListOptions = {
    /**
     * Specifies the index at which the result list should render itself inside the Omnibox
     *
     * The default value is 51 (Facets are at 50 by default).
     */
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 51, min: 16 }),
    /**
     * Specifies the title that you want for this section.
     *
     * By default this will be Suggested Results.
     */
    headerTitle: ComponentOptions.buildStringOption(),
    /**
     * Specifies the override you want to use on the query sent to the OmniboxResultList component.
     *
     * By default, there's no override applied.
     */
    queryOverride: ComponentOptions.buildStringOption(),
    /**
     * Specifies the function you wish to execute when a result suggestion is selected.
     *
     * By default, it will open the corresponding result uri in your browser.
     *
     * ```javascript
     * Coveo.init(document.querySelector('#search'), {
     *    OmniboxResultList : {
     *        //Close the omnibox, change the selected HTMLElement background color and alert the result title.
     *        onSelect:   function(result, resultElement, omniBoxObject) {
     *            omniBoxObject.close();
     *            resultElement.css('background-color', 'red');
     *            alert(result.title);
     *        }
     *     }
     * })
     *
     * // OR using the jquery extension
     *
     * $("#search").coveo("init", {
     *    OmniboxResultList : {
     *        //Close the omnibox, change the selected HTMLElement background color and alert the result title.
     *        onSelect:   function(result, resultElement, omniBoxObject) {
     *            omniBoxObject.close();
     *            resultElement.css('background-color', 'red');
     *            alert(result.title);
     *        }
     *     }
     * })
     * ```
     */
    onSelect: ComponentOptions.buildCustomOption<Function>(()=>{
    })
  };

  private lastOmniboxRequest: { omniboxObject: IPopulateOmniboxEventArgs; resolve: (...args: any[]) => void; };

  constructor(public element: HTMLElement, public options?: IOmniboxResultListOptions, public bindings?: IComponentBindings) {
    super(element, options, bindings, OmniboxResultList.ID);
    this.options = ComponentOptions.initComponentOptions(element, OmniboxResultList, options);
    this.setupOptions();
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
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
      ).el);
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
    });
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
