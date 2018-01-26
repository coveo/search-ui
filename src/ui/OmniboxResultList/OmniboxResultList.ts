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
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import OmniboxModuleDefintion = require('../Omnibox/Omnibox');
import { InitializationEvents } from '../../EventsModules';
import { logSearchBoxSubmitEvent } from '../Analytics/SharedAnalyticsCalls';
import { Logger } from '../../misc/Logger';

import 'styling/_OmniboxResultList';

export interface IOmniboxResultListOptions extends IResultListOptions {
  omniboxZIndex?: number;
  onSelect?: (result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs, event?: Event) => void;
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
   * Specifies a list a css class that should be ignored when the end user click result in the omnibox
   *
   * Any element that is specified here should normally be able to handle the standard click event.
   *
   * Any element that does not match this css class and that is clicked will trigger a redirection by the OmniboxResultList.
   */
  static elementsToIgnore = [
    'coveo-field-table-toggle-caption',
    'CoveoFollowItem',
    'CoveoPrintableUri',
    'CoveoQuickview',
    'CoveoResultLink',
    'CoveoResultRating',
    'CoveoResultTagging',
    'CoveoYouTubeThumbnail'
  ];

  static doExport = () => {
    exportGlobally({
      OmniboxResultList: OmniboxResultList
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IOmniboxResultListOptions = {
    layout: ComponentOptions.buildStringOption({
      defaultValue: 'list',
      postProcessing: optionSetByUser => {
        if (optionSetByUser != 'list') {
          const logger = new Logger(OmniboxResultList);
          logger.warn(`Cannot apply layout ${optionSetByUser} on the OmniboxResultListComponent`);
          logger.warn(`OmniboxResultList does not support any layout other than "list"`);
        }
        return 'list';
      }
    }),
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
    onSelect: ComponentOptions.buildCustomOption<
      (result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs) => void
    >(() => {
      return null;
    })
  };

  private lastOmniboxRequest: { omniboxObject: IPopulateOmniboxEventArgs; resolve: (...args: any[]) => void };

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

    const omniboxElement: HTMLElement = $$(this.root).find(`.${Component.computeCssClassNameForType('Omnibox')}`);
    if (omniboxElement) {
      this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => {
        const omnibox = <OmniboxModuleDefintion.Omnibox>Component.get(omniboxElement);
        const magicBox = omnibox.magicBox;
        magicBox.onsubmit = () => {
          logSearchBoxSubmitEvent(this.usageAnalytics);
          this.queryController.executeQuery();
        };
      });
    }
  }

  /**
   * Builds and returns an array of `HTMLElement` from the {@link IQueryResults} set received as an argument.
   * @param results The IQueryResults set to build an array of `HTMLElement` from.
   */
  public buildResults(results: IQueryResults): Promise<HTMLElement[]> {
    const builtResults: HTMLElement[] = [];
    const builtPromises = _.map(results.results, (result: IQueryResult) => {
      return this.buildResult(result).then((resultElement: HTMLElement) => {
        $$(resultElement).addClass('coveo-omnibox-selectable');
        resultElement['no-text-suggestion'] = true;

        $$(resultElement).on(['keyboardSelect', 'click'], (e: Event) => this.handleOmniboxElementSelection(e, resultElement, result));

        return this.autoCreateComponentsInsideResult(resultElement, result).initResult.then(() => {
          builtResults.push(resultElement);
          return resultElement;
        });
      });
    });

    return Promise.all(builtPromises).then(() => {
      return builtResults;
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
    $$(this.options.resultContainer).empty();
    if (this.lastOmniboxRequest) {
      if (this.options.headerTitle) {
        this.options.resultContainer.appendChild(
          $$(
            'div',
            { className: 'coveo-omnibox-result-list-header' },
            $$('span', { className: 'coveo-icon-omnibox-result-list' }).el,
            $$('span', { className: 'coveo-caption' }, l(this.options.headerTitle)).el
          ).el
        );
      }
      _.each(resultsElement, (resultElement: HTMLElement) => {
        this.options.resultContainer.appendChild(resultElement);
        this.triggerNewResultDisplayed(Component.getResult(resultElement), resultElement);
      });
      this.triggerNewResultsDisplayed();
      if ($$(this.options.resultContainer).findAll('.coveo-omnibox-selectable').length == 0) {
        this.lastOmniboxRequest.resolve({ element: null, zIndex: this.options.omniboxZIndex });
      } else {
        this.lastOmniboxRequest.resolve({ element: this.options.resultContainer, zIndex: this.options.omniboxZIndex });
      }
      return Promise.resolve(null);
    }
  }

  private setupOptions() {
    this.logger.info('Disabling infinite scroll for OmniboxResultList', this);
    this.options.enableInfiniteScroll = false;
    this.options.onSelect = this.options.onSelect || this.onRowSelection;
  }

  private handlePopulateOmnibox(args: IPopulateOmniboxEventArgs) {
    const promise = new Promise((resolve, reject) => {
      this.queryController.executeQuery({
        shouldRedirectStandaloneSearchbox: false,
        beforeExecuteQuery: () => this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {})
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

  private handleOmniboxElementSelection(e: Event, resultElement: HTMLElement, result: IQueryResult) {
    if (e && e.target && this.otherComponentShouldHandleSelection(e, resultElement)) {
      return;
    }

    if (this.lastOmniboxRequest) {
      this.options.onSelect.call(this, result, resultElement, this.lastOmniboxRequest.omniboxObject, e);
    }
  }

  private otherComponentShouldHandleSelection(e: Event, resultElement: HTMLElement) {
    // Other components can "trap" the click event, and instead trigger the "standard" component behaviour.
    // So, for example, if someones clicks the ResultLink directly, we want the result link code to execute to redirect to the result, and not the OmniboxResultList selection code.
    // Same for Quickview, YouTubeThumbnail, etc.
    let current = e.target as HTMLElement;
    let otherComponentWillHandleClick = false;

    while (current && current != resultElement) {
      otherComponentWillHandleClick =
        _.find(OmniboxResultList.elementsToIgnore, elementToIgnore => $$(current).hasClass(elementToIgnore)) != null;

      if (otherComponentWillHandleClick) {
        break;
      }

      current = current.parentElement;
    }
    return otherComponentWillHandleClick;
  }

  private onRowSelection(result: IQueryResult, resultElement: HTMLElement, omniboxObject: IPopulateOmniboxEventArgs, e: Event) {
    this.usageAnalytics.logClickEvent(
      analyticsActionCauseList.documentOpen,
      { author: Utils.getFieldValue(result, 'author') },
      result,
      this.root
    );
    window.location.href = result.clickUri;
  }
}

Initialization.registerAutoCreateComponent(OmniboxResultList);
