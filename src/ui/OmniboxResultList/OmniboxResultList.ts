import { Component } from '../Base/Component';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { IResultListOptions, ResultList } from '../ResultList/ResultList';
import { IQueryResult } from '../../rest/QueryResult';
import { IPopulateOmniboxEventArgs, OmniboxEvents } from '../../events/OmniboxEvents';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { Initialization } from '../Base/Initialization';
import { IQueryResults } from '../../rest/QueryResults';
import _ = require('underscore');

export interface IOmniboxResultListOptions extends IResultListOptions {
  omniboxZIndex?: number;
  onSelect?: (result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs) => void;
  headerTitle?: string;
  queryOverride?: string;
}

/**
 * The OmniboxResultList component behaves exactly like the {@link ResultList} component (which it extends), except that
 * it renders itself inside the {@link Omnibox} component.
 *
 * This component can provide a kind of search-as-you-type functionality, allowing you to easily render complex Result
 * Templates inside the Omnibox component.
 *
 * **Example:**
 *
 * ```html
 * <div class="CoveoOmniboxResultList">
 *   <script class="result-template" type="text/x-underscore">
 *     <div>
 *       <a class='CoveoResultLink'></a>
 *     </div>
 *   </script>
 * </div>
 * ```
 */
export class OmniboxResultList extends ResultList implements IComponentBindings {
  static ID = 'OmniboxResultList';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IOmniboxResultListOptions = {

    /**
     * Specifies the z-index at which to render the ResultList inside the Omnibox.
     *
     * Default value is `51`. Minimum value is `16` ({@link Facet} components are at `50` by default)
     */
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 51, min: 16 }),

    /**
     * Specifies the title to use for this section.
     *
     * Default value is the localized string for `Suggested Results`.
     */
    headerTitle: ComponentOptions.buildStringOption(),

    /**
     * Specifies the override to use on the query sent to the OmniboxResultList component.
     *
     * Default value is `undefined`, which means no default override is specified.
     */
    queryOverride: ComponentOptions.buildStringOption(),

    /**
     * Specifies the function to execute when the user selects a result suggestion.
     *
     * The default function opens the corresponding result URI in the browser.
     *
     * It is only possible to specify a value for this option in the {@link init} call of your search interface. You
     * cannot set it directly as an HTML attribute.
     *
     * **Example:**
     *
     * ```javascript
     * // You can call the init script using "pure" JavaScript:
     * Coveo.init(document.querySelector('#search'), {
     *    OmniboxResultList : {
     *        //Close the omnibox, change the selected HTMLElement background color and alert the result title.
     *        onSelect : function(result, resultElement, omniBoxObject) {
     *            omniBoxObject.close();
     *            resultElement.css('background-color', 'red');
     *            alert(result.title);
     *        }
     *     }
     * })
     *
     * // Or you can call the init script using the jQuery extension:
     * $("#search").coveo("init", {
     *    OmniboxResultList : {
     *        //Close the Omnibox, change the selected HTMLElement background color and alert the result title.
     *        onSelect : function(result, resultElement, omniBoxObject) {
     *            omniBoxObject.close();
     *            resultElement.css('background-color', 'red');
     *            alert(result.title);
     *        }
     *     }
     * })
     * ```
     */
    onSelect: ComponentOptions.buildCustomOption<(result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs) => void>(() => {
      return null;
    })
  };

  private lastOmniboxRequest: { omniboxObject: IPopulateOmniboxEventArgs; resolve: (...args: any[]) => void; };

  /**
   * Creates a new OmniboxResultList component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the OmniboxResultList component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IOmniboxResultListOptions, public bindings?: IComponentBindings) {
    super(element, options, bindings, OmniboxResultList.ID);
    this.options = ComponentOptions.initComponentOptions(element, OmniboxResultList, options);
    this.setupOptions();
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleQueryOverride(args));
  }

  /**
   * Builds and returns an array of `HTMLElement` from the {@link IQueryResults} set received as an argument.
   * @param results The IQueryResults set to build an array of `HTMLElement` from.
   */
  public buildResults(results: IQueryResults): HTMLElement[] {
    return _.map(results.results, (result: IQueryResult) => {
      let resultElement = $$(this.buildResult(result));
      resultElement.addClass(['coveo-omnibox-selectable', 'coveo-omnibox-result-list-element']);
      resultElement.on('keyboardSelect', () => {
        this.options.onSelect.call(this, result, resultElement.el, this.lastOmniboxRequest.omniboxObject);
      });
      this.autoCreateComponentsInsideResult(resultElement.el, result);
      return resultElement.el;
    });
  }

  /**
   * Creates a result container and appends each element from the received `HTMLElement` array to it. For each element
   * it appends to the result container, this method triggers a `newResultDisplayed` event. Once all elements have been
   * appended to the result container, the method triggers a `newResultsDisplayed` event.
   * @param resultsElement The array of `HTMLElement` to render.
   * @param append
   */
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
    this.usageAnalytics.logClickEvent(analyticsActionCauseList.documentOpen, { author: Utils.getFieldValue(result, 'author') }, result, this.root);
    window.location.href = result.clickUri;
  }
}
Initialization.registerAutoCreateComponent(OmniboxResultList);
