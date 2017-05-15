/// <reference path="../Facet/FacetHeader.ts" />
/// <reference path="../../controllers/FacetSliderQueryController.ts" />

import { ISliderOptions, Slider, IEndSlideEventArgs, IDuringSlideEventArgs, ISliderGraphData } from '../Misc/Slider';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { FacetHeader } from '../Facet/FacetHeader';
import { l } from '../../strings/Strings';
import { InitializationEvents } from '../../events/InitializationEvents';
import { FacetSliderQueryController } from '../../controllers/FacetSliderQueryController';
import { QueryEvents, IQuerySuccessEventArgs, IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs, IBreadcrumbItem } from '../../events/BreadcrumbEvents';
import { IAttributeChangedEventArg, Model } from '../../models/Model';
import { $$ } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsFacetMeta, IAnalyticsFacetSliderChangeMeta, IAnalyticsFacetGraphSelectedMeta } from '../Analytics/AnalyticsActionListMeta';
import { QueryStateModel } from '../../models/QueryStateModel';
import { SliderEvents, IGraphValueSelectedArgs } from '../../events/SliderEvents';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { ResponsiveComponentsUtils } from '../ResponsiveComponents/ResponsiveComponentsUtils';
import { Initialization } from '../Base/Initialization';
import d3 = require('d3');
import { SearchAlertsEvents, ISearchAlertsPopulateMessageEventArgs } from '../../events/SearchAlertEvents';
import _ = require('underscore');

import { IGroupByResult } from '../../rest/GroupByResult';
export interface IFacetSliderOptions extends ISliderOptions {
  dateField?: boolean;
  queryOverride?: string;
  id?: string;
  field?: IFieldOption;
  title?: string;
  enableResponsiveMode?: boolean;
  responsiveBreakpoint?: number;
  dropdownHeaderLabel?: string;
}

/**
 * The FacetSlider component creates a facet containing a slider widget that allows the end user to filter results based
 * on a range of numerical values, rather than a "classic" multi-select {@link Facet} with a label and a count for each
 * value.
 *
 * Note that this component does not inherit from the Facet component, and thus does not offer the same configuration
 * options. Also, some of the FacetSlider options cannot be set as a HTML attributes on the component and must rather be
 * configured in the {@link init} call of the search interface.
 *
 * **Examples:**
 *
 * Specifying the FacetSlider configuration using a JSON inside the init call. Note that the JSON follows the
 * FacetSlider options:
 *
 * ```javascript
 * // You can call the init script using "pure" JavaScript:
 * Coveo.init(document.querySelector('#search'), {
 *    FacetSlider: {
 *      field: "@size",
 *      start: 1000,
 *      end: 5000,
 *      rangeSlider: true,
 *      graph: {
 *        steps: 10
 *      }
 *    }
 * })
 *
 * // Or you can call the init script using the jQuery extension:
 * $('#search').coveo('init', {
 *    FacetSlider: {
 *      field: "@size",
 *      start: 1000,
 *      end: 5000,
 *      rangeSlider: true,
 *      graph: {
 *        steps: 10
 *      }
 *    }
 * })
 * ```
 *
 * Specifying the same FacetSlider configuration by setting the corresponding HTML attributes directly in the markup:
 *
 * ```html
 * <div class='CoveoFacetSlider' data-field='@size' data-start='1000' data-end='5000' data-range-slider='true' data-graph-steps='10'></div>
 * ```
 */
export class FacetSlider extends Component {

  /**
   * The component options
   * @componentOptions
   */
  static options: IFacetSliderOptions = {

    /**
     * Specifies the title to display on top of the FacetSlider component.
     *
     * Default value is the localized string for `"NoTitle"`.
     */
    title: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('NoTitle') }),

    /**
     * Specifies whether the field for which you are requesting a range is a date field. This allows the FacetSlider to
     * correctly build the outgoing [GroupByRequest]{@link IGroupByRequest} and render itself properly.
     *
     * Default value is `false`.
     */
    dateField: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the index field whose values the FacetSlider should use.
     *
     * This requires the given field to be configured correctly in the index as a Facet field (see
     * [Adding Fields to a Source](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=137)).
     *
     * Specifying a value for this option is required for the FacetSlider component to work.
     */
    field: ComponentOptions.buildFieldOption({ groupByField: true, required: true }),

    /**
     * Specifies a unique identifier for the FacetSlider. Among other things, this identifier serves the purpose of
     * saving the facet state in the URL hash.
     *
     * If you have two facets with the same field on the same page, you should specify a unique id value for at least
     * one of those two facets. This id must be unique in the page.
     *
     * Default value is the {@link FacetSlider.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: IFacetSliderOptions) => value || <string>options.field
    }),

    /**
     * Specifies the format to use to display values if they are dates.
     *
     * Default value is `"MMM dd, yyyy"`.
     */
    dateFormat: ComponentOptions.buildStringOption(),

    /**
     * Specifies the query to filter automatic minimum and maximum range of the slider.
     *
     * This is especially useful for date ranges where the index may contain values which are not set, and thus the
     * automatic range returns values from the year 1400 (earliest date from the boost C++ library).
     *
     * This option can be useful to do something like `queryOverride : @date>2000/01/01` or some arbitrary date which
     * will filter out unwanted values.
     */
    queryOverride: ComponentOptions.buildStringOption(),

    /**
     * Specifies the starting boundary of the slider.
     *
     * Date values are rounded to the nearest year when {@link FacetSlider.options.dateField} is `true`.
     *
     * Default value is the lowest available field value in the index.
     */
    start: ComponentOptions.buildStringOption(),

    /**
     * Specifies the ending boundary of the slider.
     *
     * Date values are rounded to the nearest year when {@link FacetSlider.options.dateField} is `true`.
     *
     * Default value is the highest available field value in the index.
     */
    end: ComponentOptions.buildStringOption(),

    /**
     * Specifies whether to exclude the outer bounds of the slider in the generated query when they are not active.
     *
     * Default value is `false`.
     */
    excludeOuterBounds: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the number of decimal places to round the displayed numerical values to.
     *
     * Default (and minimum) value is `0`.
     */
    rounded: ComponentOptions.buildNumberOption({ min: 0 }),

    /**
     * Specifies the number of steps to split the slider into.
     *
     * For example, if your range is [ 0 , 100 ] and you specify 10 steps, then the end user can move the slider only to
     * the values [ 0, 10, 20, 30 ... , 100 ].
     *
     * For performance reasons, the maximum value for option is 1
     *
     * Default value is `undefined`, and the slider allows all values. Minimum value is `2`.
     */
    steps: ComponentOptions.buildNumberOption({ min: 2 }),

    /**
     * Specifies whether you want a slider with two buttons instead of a slider with a single button.
     *
     * By default, only one button appears in the slider.
     */
    rangeSlider: ComponentOptions.buildBooleanOption(),

    /**
     * Specifies the caption options to use to display the field values.
     *
     * Available options are:
     * - enable (`data-display-as-value-enable`): boolean; specifies whether to display the caption as a value. Default
     * value is `true`.
     * - unitSign (`data-display-as-value-unit-sign`): string; specifies the unit sign for this value (e.g., `"$"`).
     * Default value is `undefined`.
     * - separator (`data-display-as-value-separator`): string; specifies the character(s) to use as a separator in the
     * caption. Default value is `"-"`.
     */
    displayAsValue: ComponentOptions.buildObjectOption({
      subOptions: {
        enable: ComponentOptions.buildBooleanOption({ defaultValue: true }),
        unitSign: ComponentOptions.buildStringOption(),
        separator: ComponentOptions.buildStringOption({ defaultValue: '-' })
      }
    }),

    /**
     * Specifies the percentage caption options to use to display the field values.
     *
     * Available options are:
     * - enable (`data-display-as-percent-enable`): boolean; specifies whether to display the caption as a percentage.
     * Default value is `false`.
     * separator (`data-display-as-percent-separator`): string; specifies the character(s) to use as a separator in the
     * caption. Default value is `"-"`.
     */
    displayAsPercent: ComponentOptions.buildObjectOption({
      subOptions: {
        enable: ComponentOptions.buildBooleanOption({ defaultValue: false }),
        separator: ComponentOptions.buildStringOption({ defaultValue: '-' })
      }
    }),

    /**
     * Specifies whether to display a small graph on top of the slider.
     *
     * Available options are:
     * - steps (`data-graph-steps`): number; specifies the number of steps/columns to display in your graph. Default
     * value is `10`. Minimum value is `2`.
     */
    graph: ComponentOptions.buildObjectOption({
      subOptions: {
        steps: ComponentOptions.buildNumberOption({ min: 2 }),
        animationDuration: ComponentOptions.buildNumberOption({ min: 0 }),
        margin: ComponentOptions.buildObjectOption({
          subOptions: {
            top: ComponentOptions.buildNumberOption({ min: 0 }),
            bottom: ComponentOptions.buildNumberOption({ min: 0 }),
            left: ComponentOptions.buildNumberOption({ min: 0 }),
            right: ComponentOptions.buildNumberOption({ min: 0 })
          }
        })
      }
    }),

    /**
     * Specifies a function to generate the steps for the FacetSlider (see {@link FacetSlider.options.steps}. This
     * function receives the FacetSlider boundaries (see {@link FacetSlider.options.start} and
     * {@link FacetSlider.options.end}) and must return an array of numbers (the steps).
     *
     * You can only set this option in the {@link init} call of your search interface. You cannot set it directly in the
     * markup as an HTML attribute.
     *
     * **Example:**
     *
     * ```javascript
     * // You can call the init script using "pure" JavaScript:
     * Coveo.init(document.querySelector('#search'), {
     *    FacetSlider: {
     *      field: "@size",
     *      getSteps: function(start, end) {
     *        return [0,2,4,6,8,10];
     *      }
     *    }
     * })
     *
     * // Or you can call the init script using the jQuery extension:
     * $('#search').coveo('init', {
     *    FacetSlider: {
     *        field: "@size",
     *        getSteps: function(start, end) {
     *            return [0,2,4,6,8,10];
     *        }
     *    }
     * })
     * ```
     */
    getSteps: ComponentOptions.buildCustomOption<(start: number, end: number) => number[]>(() => {
      return null;
    }),

    /**
     * Specifies a function to generate the caption for the FacetSlider. Receives the current slider values
     * (number[]) and must return the caption (string).
     *
     * You can only set this option in the {@link init} call of your search interface. You cannot set it directly in the
     * markup as an HTML attribute.
     *
     * **Example:**
     *
     * ```javascript
     * // You can call the init script using "pure" JavaScript:
     * Coveo.init(document.querySelector('#search'), {
     *    FacetSlider: {
     *      field: "@size",
     *      valueCaption: function(values) {
     *        return values[0] + " hello" + ", " + values[1] + " world";
     *      }
     *    }
     * })
     *
     * // Or you can call the init script using the jQuery extension:
     * $('#search').coveo('init', {
     *    FacetSlider: {
     *      field: "@size",
     *      valueCaption: function(values) {
     *        return values[0] + " hello" + ", " + values[1] + " world";
     *      }
     *    }
     * })
     * ```
     */
    valueCaption: ComponentOptions.buildCustomOption<(values: number[]) => string>(() => {
      return null;

    }),

    /**
     * Specifies whether to enable *responsive mode* for facets. Setting this options to `false` on any {@link Facet} or
     * {@link FacetSlider} in a search interface disables responsive mode for all other facets in the search interface.
     *
     * Responsive mode displays all facets under a single dropdown button whenever the width of the HTML element which
     * the search interface is bound to reaches or falls behind a certain threshold (see
     * {@link SearchInterface.responsiveComponents}).
     *
     * See also {@link FacetSlider.options.dropdownHeaderLabel}.
     *
     * Default value is `true`.
     */
    enableResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the label of the button that allows to show the facets when in responsive mode. If it is specified more than once, the
     * first occurence of the option will be used.
     * The default value is "Filters".
     */
    dropdownHeaderLabel: ComponentOptions.buildLocalizedStringOption()
  };

  static ID = 'FacetSlider';
  public static DEBOUNCED_RESIZE_DELAY = 250;

  public startOfSlider: number;
  public endOfSlider: number;
  public initialStartOfSlider: number;
  public initialEndOfSlider: number;
  public facetQueryController: FacetSliderQueryController;
  public facetHeader: FacetHeader;
  public onResize: EventListener;

  private rangeQueryStateAttribute: string;
  private isEmpty = false;
  private rangeFromUrlState: number[];
  private delayedGraphData: ISliderGraphData[];

  /**
   * Creates a new FacetSlider component. Binds multiple query events as well.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the FacetSlider component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param slider
   */
  constructor(public element: HTMLElement, public options: IFacetSliderOptions, bindings?: IComponentBindings, private slider?: Slider) {
    super(element, FacetSlider.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, FacetSlider, options);

    ResponsiveFacets.init(this.root, this, this.options);

    if (this.options.excludeOuterBounds == null) {
      this.options.excludeOuterBounds = false;
    }

    if (this.options.start) {
      this.options.start = this.options.dateField ? <any>new Date(this.options.start.replace(/-/g, '/')).getTime() : <any>Number(this.options.start);
    }

    if (this.options.end) {
      this.options.end = this.options.dateField ? <any>new Date(this.options.end.replace(/-/g, '/')).getTime() : <any>Number(this.options.end);
    }

    if (this.hasAGraph() && typeof d3 == 'undefined') {
      this.options.graph = undefined;
      this.logger.info('Cannot find the required dependencies d3.js. Cannot add graphic to your facet range', this);
    }

    this.facetQueryController = new FacetSliderQueryController(this);
    this.initQueryStateEvents();
    this.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());
    this.bind.onRootElement(QueryEvents.noResults, () => this.handleNoresults());
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
    this.bind.onRootElement(SearchAlertsEvents.searchAlertsPopulateMessage, (args: ISearchAlertsPopulateMessageEventArgs) => this.handlePopulateSearchAlerts(args));
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.reset());

    this.onResize = _.debounce(() => {
      if (ResponsiveComponentsUtils.shouldDrawFacetSlider($$(this.root)) && this.slider && !this.isEmpty) {
        this.slider.drawGraph();
      }
    }, FacetSlider.DEBOUNCED_RESIZE_DELAY);
    window.addEventListener('resize', this.onResize);
    // This is used inside SF integration
    this.bind.onRootElement('onPopupOpen', this.onResize);
    $$(this.root).on(InitializationEvents.nuke, this.handleNuke);
  }

  public createDom() {
    this.facetHeader = new FacetHeader({
      field: <string>this.options.field,
      facetElement: this.element,
      title: this.options.title,
      enableClearElement: true,
      enableCollapseElement: true,
      isNewDesign: this.getBindings().searchInterface.isNewDesign(),
      facetSlider: this
    });
    this.element.appendChild(this.facetHeader.build());
  }

  public disable() {
    super.disable();
    $$(this.element).addClass('coveo-disabled-empty');
  }

  /**
   * Resets the FacetSlider (meaning that you need to set the range value as inactive).
   */
  public reset() {
    if (this.slider) {
      this.slider.initializeState();
      this.updateQueryState();
      this.updateAppearanceDependingOnState();
    }
  }

  /**
   * Gets the current selection in the FacetSlider.
   *
   * **Note:**
   * > This method returns an array of number for selected date values. These numbers represent a number of milliseconds
   * > before or after January 1, 1970. Therefore, you can use these numbers to instantiate standard JavaScript Date
   * > objects.
   *
   * @returns {any} An array of number containing the first and last selected values, if possible. An array containing
   * two `undefined` values otherwise.
   */
  public getSelectedValues(): number[] {
    if (this.startOfSlider != undefined && this.endOfSlider != undefined) {
      return [this.startOfSlider, this.endOfSlider];
    } else {
      return [undefined, undefined];
    }
  }

  /**
   * Sets the selected values in the slider.
   *
   * **Note:**
   * > You must set date values with numbers representing a number of milliseconds before or after January 1, 1970. You
   * > can easily extract such numbers from standard JavaScript Date objects.
   *
   * @param values [start, end] An array containing the first and last values to select in the slider.
   */
  public setSelectedValues(values: number[]): void {
    this.setupSliderIfNeeded(undefined);
    this.startOfSlider = values[0];
    this.endOfSlider = values[1];
    this.slider.setValues([this.startOfSlider, this.endOfSlider]);
    this.updateAppearanceDependingOnState();
  }

  /**
   * Indicates whether the FacetSlider is active. An active FacetSlider outputs an expression in the query when a search
   * is performed.
   * @returns {boolean} `true` if the FacetSlider is active; `false` otherwise.
   */
  public isActive(): boolean {
    return !isNaN(this.startOfSlider)
      && !isNaN(this.endOfSlider)
      && !isNaN(this.initialStartOfSlider)
      && !isNaN(this.initialEndOfSlider)
      && (this.startOfSlider != this.initialStartOfSlider || this.endOfSlider != this.initialEndOfSlider);
  }

  public getSliderBoundaryForQuery(): number[] {
    let needToReturnABoundary = false;
    if (!this.slider) {
      needToReturnABoundary = true;
    } else if (this.slider && this.isActive()) {
      needToReturnABoundary = true;
    }
    if (needToReturnABoundary) {
      return this.generateBoundary();
    } else {
      return undefined;
    }
  }

  // There is delayed graph data if at the time the facet slider tried to draw, the facet was hidden in the
  // facet dropdown. This method will draw delayed graph data if it exists.
  public drawDelayedGraphData() {
    if (this.delayedGraphData != undefined && !this.isEmpty) {
      this.slider.drawGraph(this.delayedGraphData);
    }
  }

  public isSimpleSliderConfig() {
    return this.options.start != null && this.options.end != null;
  }

  public hasAGraph() {
    return this.options.graph != undefined;
  }

  private handleNoresults(): void {
    this.isEmpty = true;
    this.updateAppearanceDependingOnState();
  }

  private handleNewQuery(): void {
    this.isEmpty = false;
  }

  private handleRangeQueryStateChanged(args: IAttributeChangedEventArg): void {
    this.setupSliderIfNeeded(args);
    this.startOfSlider = args.value[0] == undefined ? this.startOfSlider : args.value[0];
    this.endOfSlider = args.value[1] == undefined ? this.endOfSlider : args.value[1];
    this.setSelectedValues([this.startOfSlider, this.endOfSlider]);
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs): void {
    let populateBreadcrumb = () => {
      if (this.isActive()) {
        args.breadcrumbs.push(<IBreadcrumbItem>{
          element: this.buildBreadcrumbFacetSlider()
        });
      }
    };
    if (this.slider) {
      populateBreadcrumb();
    } else {
      $$(this.root).one(QueryEvents.deferredQuerySuccess, () => {
        populateBreadcrumb();
        $$(this.root).trigger(BreadcrumbEvents.redrawBreadcrumb);
      });
    }
  }

  private handlePopulateSearchAlerts(args: ISearchAlertsPopulateMessageEventArgs) {
    if (this.isActive()) {
      args.text.push($$(this.buildBreadcrumbFacetSlider()).text());
    }
  }

  private buildBreadcrumbFacetSlider(): HTMLElement {
    let elem = $$('div', {
      className: 'coveo-facet-slider-breadcrumb'
    }).el;

    let title = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-title'
    });
    title.text(this.options.title + ': ');
    elem.appendChild(title.el);

    let values = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-values'
    });
    elem.appendChild(values.el);

    let value = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-value'
    });
    value.text(this.slider.getCaption());
    values.el.appendChild(value.el);

    let clear = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-clear'
    });
    value.el.appendChild(clear.el);

    value.on('click', () => {
      this.reset();
      this.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.facetClearAll, {
        facetId: this.options.id,
        facetTitle: this.options.title
      });
      this.queryController.executeQuery();
    });
    return elem;
  }

  private initSlider() {
    this.buildSlider();
    this.slider.initializeState([this.startOfSlider, this.endOfSlider]);
    this.updateAppearanceDependingOnState();
  }

  private initQueryStateEvents() {
    this.rangeQueryStateAttribute = QueryStateModel.getFacetId(this.options.id) + ':range';
    this.queryStateModel.registerNewAttribute(this.rangeQueryStateAttribute, [undefined, undefined]);
    let eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + this.rangeQueryStateAttribute);
    this.bind.onRootElement(eventName, (args: IAttributeChangedEventArg) => {
      this.slider ? this.handleRangeQueryStateChanged(args) : this.setRangeStateSliderStillNotCreated(args);
    });
  }

  private setRangeStateSliderStillNotCreated(args: IAttributeChangedEventArg) {
    this.rangeFromUrlState = this.copyValues(args.value);
  }

  private buildSlider() {
    let sliderContainer = $$('div', {
      className: 'coveo-facet-values coveo-slider-container'
    }).el;

    if (this.hasAGraph()) {
      $$(sliderContainer).addClass('coveo-with-graph');
    }
    let sliderDiv = $$('div').el;

    this.slider = this.slider ? this.slider : new Slider(sliderDiv, _.extend({}, this.options, { dateField: this.options.dateField }), this.root);
    $$(sliderDiv).on(SliderEvents.endSlide, (e: MouseEvent, args: IEndSlideEventArgs) => {
      this.handleEndSlide(args);
    });
    $$(sliderDiv).on(SliderEvents.duringSlide, (e: MouseEvent, args: IDuringSlideEventArgs) => {
      this.handleDuringSlide(args);
    });
    if (this.hasAGraph()) {
      $$(sliderDiv).on(SliderEvents.graphValueSelected, (e: MouseEvent, args: IGraphValueSelectedArgs) => {
        this.handleGraphValueSelected(args);
      });
    }
    sliderContainer.appendChild(sliderDiv);
    this.element.appendChild(sliderContainer);
    this.updateAppearanceDependingOnState();
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    let boundary = this.getSliderBoundaryForQuery();
    if (boundary != undefined) {
      this.facetQueryController.prepareForNewQuery();
      let expression = this.facetQueryController.computeOurFilterExpression(boundary);
      if (Utils.isNonEmptyString(expression)) {
        this.logger.trace('Putting filter in query', expression);
        data.queryBuilder.advancedExpression.add(expression);
      }
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    let queryBuilder = data.queryBuilder;
    this.facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
  }

  private handleDeferredQuerySuccess(data: IQuerySuccessEventArgs) {
    this.ensureDom();
    this.setupSliderIfNeeded(data);
    let groupByResults = data.results.groupByResults[this.facetQueryController.lastGroupByRequestIndex];
    this.isEmpty = this.isFacetEmpty(groupByResults, data);
    this.updateAppearanceDependingOnState();
    if (this.hasAGraph()) {
      this.renderToSliderGraph(data);
    }
  }

  private handleEndSlide(args: IEndSlideEventArgs) {
    let values = args.slider.getValues();
    this.startOfSlider = values[0];
    this.endOfSlider = values[1];
    if (this.updateQueryState(values)) {
      this.updateAppearanceDependingOnState();
      this.usageAnalytics.logSearchEvent<IAnalyticsFacetSliderChangeMeta>(analyticsActionCauseList.facetRangeSlider, {
        facetId: this.options.id,
        facetRangeStart: this.startOfSlider.toString(),
        facetRangeEnd: this.endOfSlider.toString()
      });
      this.queryController.executeQuery();
    }
  }

  private handleDuringSlide(args: IDuringSlideEventArgs) {
    let values = args.slider.getValues();
    this.startOfSlider = values[0];
    this.endOfSlider = values[1];
    this.slider.setValues([this.startOfSlider, this.endOfSlider]);
    this.updateAppearanceDependingOnState(true);
  }

  private handleGraphValueSelected(args: IGraphValueSelectedArgs) {
    if ((this.options.rangeSlider && this.startOfSlider != args.start) || this.endOfSlider != args.end) {
      if (this.options.rangeSlider) {
        this.startOfSlider = args.start;
      }
      this.endOfSlider = args.end;
      this.slider.setValues([this.startOfSlider, this.endOfSlider]);
      this.updateQueryState();
      this.usageAnalytics.logSearchEvent<IAnalyticsFacetGraphSelectedMeta>(analyticsActionCauseList.facetRangeGraph, {
        facetId: this.options.id,
        facetRangeStart: this.startOfSlider.toString(),
        facetRangeEnd: this.endOfSlider.toString()
      });
      this.queryController.executeQuery();
    }
  }

  private updateQueryState(values = this.slider.getValues(), silent = false) {
    let copyOfValues = this.copyValues(values);
    let start = values[0] + 0.0;
    let end = values[1] + 0.0;
    let model: number[] = this.queryStateModel.get(this.rangeQueryStateAttribute);
    if (model == null || copyOfValues[0] != model[0] || copyOfValues[1] != model[1]) {
      copyOfValues[0] = start;
      copyOfValues[1] = end;
      this.queryStateModel.set(this.rangeQueryStateAttribute, copyOfValues, { silent: silent });
      return true;
    }
    return false;
  }

  private copyValues(values: number[]) {
    // Creating a copy of the values prevents an unwanted automatic update of the state while sliding
    // That's the cleanest way I found to copy that array correctly
    let copyOfValues = [];
    copyOfValues[0] = Number(values[0]) + 0.0;
    copyOfValues[1] = Number(values[1]) + 0.0;
    return copyOfValues;
  }

  private renderToSliderGraph(data: IQuerySuccessEventArgs) {
    let rawGroupByResults = data.results.groupByResults[this.facetQueryController.graphGroupByQueriesIndex];
    let graphData: ISliderGraphData[];
    let totalGraphResults = 0;
    if (rawGroupByResults) {
      graphData = _.map(rawGroupByResults.values, (value) => {
        totalGraphResults += value.numberOfResults;
        let start: any = value.value.split('..')[0];
        let end: any = value.value.split('..')[1];
        if (!this.options.dateField) {
          start = Number(start);
          end = Number(end);
        } else {
          start = new Date(start.split('@')[0]).getTime();
          end = new Date(end.split('@')[0]).getTime();
        }
        let y = value.numberOfResults;
        return {
          start: start,
          y: y,
          end: end,
          isDate: this.options.dateField
        };
      });
    }
    if (totalGraphResults == 0) {
      this.isEmpty = true;
      this.updateAppearanceDependingOnState();
    } else if (graphData != undefined && !this.isDropdownHidden()) {
      this.slider.drawGraph(graphData);
    } else if (graphData != undefined && this.isDropdownHidden()) {
      this.delayedGraphData = graphData;
    }
  }

  private isDropdownHidden() {
    let facetDropdown = this.root.querySelector('.coveo-facet-column');
    if (facetDropdown) {
      return $$(<HTMLElement>facetDropdown).css('display') == 'none';
    }
    if ($$(this.root).hasClass('CoveoRecommendation')) {
      let recommendationDropdown = $$(this.root).parents('.coveo-recommendation-column')[0] || this.root;
      return $$(<HTMLElement>recommendationDropdown).css('display') == 'none';
    }

    return false;
  }

  private generateBoundary(): number[] {
    if (!this.slider) {
      // If the slider is not initialized, the only boundary we can get is from the state.
      return this.generateBoundaryFromState();
    } else {
      // Else, try to get one from the slider itself. If we cant, try to return one from the state.
      let boundary = this.generateBoundaryFromSlider();
      if (boundary[0] == undefined && boundary[1] == undefined) {
        return this.generateBoundaryFromState();
      } else {
        return boundary;
      }
    }
  }

  private generateBoundaryFromSlider() {
    let start, end;
    if (this.startOfSlider != undefined) {
      start = this.startOfSlider;
    }
    if (this.endOfSlider != undefined) {
      end = this.endOfSlider;
    }
    return [start, end];
  }

  private generateBoundaryFromState() {
    let start, end;
    let startFromState = this.queryStateModel.get(this.rangeQueryStateAttribute)[0];
    if (startFromState != undefined) {
      start = startFromState;
    }
    let endFromState = this.queryStateModel.get(this.rangeQueryStateAttribute)[1];
    if (endFromState != undefined) {
      end = endFromState;
    }
    if (start != this.queryStateModel.getDefault(this.rangeQueryStateAttribute)[0] || end != this.queryStateModel.getDefault(this.rangeQueryStateAttribute)[1]) {
      return [start, end];
    } else {
      return [undefined, undefined];
    }
  }

  private setupSliderIfNeeded(data: any) {
    this.ensureDom();
    if (Utils.isNullOrUndefined(this.slider)) {
      if (!this.alreadySetBoundary()) {
        this.trySetSliderBoundaryFromOptions();
      }
      if (!this.alreadySetBoundary() && data != undefined) {
        this.trySetSliderBoundaryFromQueryResult(data);
      }
      this.trySetSliderBoundaryFromState();
      this.setupSliderStateVariables();
      let isInError = this.verifySetup();
      if (isInError) {
        this.logger.warn('Unable to initialize slider with current values', this);
      } else {
        this.initSlider();
        this.updateQueryState();
      }
    }
  }

  private verifySetup() {
    let isInError = 0;
    isInError += this.initialStartOfSlider == undefined ? 1 : 0;
    isInError += isNaN(this.initialStartOfSlider) ? 1 : 0;
    isInError += this.initialEndOfSlider == undefined ? 1 : 0;
    isInError += isNaN(this.initialEndOfSlider) ? 1 : 0;
    return isInError;
  }

  private setupSliderStateVariables() {
    if (isNaN(this.initialStartOfSlider) || isNaN(this.initialEndOfSlider)) {
      this.logger.warn('Cannnot initialize slider with those values : start: ' + this.initialStartOfSlider + ' end: ' + this.initialEndOfSlider);
    } else {
      this.initialStartOfSlider = Number(this.initialStartOfSlider);
      this.initialEndOfSlider = Number(this.initialEndOfSlider);
      this.startOfSlider = this.startOfSlider != undefined ? Number(this.startOfSlider) : this.initialStartOfSlider;
      this.endOfSlider = this.endOfSlider != undefined ? Number(this.endOfSlider) : this.initialEndOfSlider;
      this.options.start = this.initialStartOfSlider;
      this.options.end = this.initialEndOfSlider;
      this.queryStateModel.setNewDefault(this.rangeQueryStateAttribute, [this.initialStartOfSlider, this.initialEndOfSlider]);
    }
  }

  private alreadySetBoundary() {
    return this.startOfSlider != undefined && this.endOfSlider != undefined;
  }

  private trySetSliderBoundaryFromOptions() {
    if (!Utils.isNullOrUndefined(this.options.start)) {
      this.setupInitialSliderStateStart(this.options.start);
    }
    if (!Utils.isNullOrUndefined(this.options.end)) {
      this.setupInitialSliderStateEnd(this.options.end);
    }
  }

  private trySetSliderBoundaryFromState() {
    let stateValues = this.rangeFromUrlState || this.queryStateModel.get(this.rangeQueryStateAttribute);
    if (stateValues && stateValues[0] != undefined && stateValues[1] != undefined) {
      stateValues[0] = Number(stateValues[0]);
      stateValues[1] = Number(stateValues[1]);
      this.setupInitialSliderStateStart(stateValues[0]);
      this.setupInitialSliderStateEnd(stateValues[1]);
      this.startOfSlider = stateValues[0];
      this.endOfSlider = stateValues[1];
    }
  }

  private trySetSliderBoundaryFromQueryResult(data: IQuerySuccessEventArgs) {
    let groupByResults = data.results.groupByResults[this.facetQueryController.lastGroupByRequestIndex];
    if (groupByResults && groupByResults.values.length > 0) {
      this.setupInitialSliderStateStart(groupByResults.values[0].value.split('..')[0]);
      this.setupInitialSliderStateEnd(groupByResults.values[groupByResults.values.length - 1].value.split('..')[1]);
    }
  }

  private setupInitialSliderStateStart(value: any) {
    if (this.initialStartOfSlider == undefined) {
      this.initialStartOfSlider = value;
      if (this.options.dateField && isNaN(value)) {
        this.initialStartOfSlider = new Date(value.replace('@', ' ')).getTime();
      }
    }
  }

  private setupInitialSliderStateEnd(value: any) {
    if (this.initialEndOfSlider == undefined) {
      this.initialEndOfSlider = value;
      if (this.options.dateField && isNaN((value))) {
        this.initialEndOfSlider = new Date(value.replace('@', ' ')).getTime();
      }
    }
  }

  private updateAppearanceDependingOnState(sliding = false) {
    if (this.isEmpty && !this.isActive() && !sliding) {
      $$(this.element).addClass('coveo-disabled-empty');
    } else {
      $$(this.element).removeClass('coveo-disabled-empty');
      $$(this.facetHeader.eraserElement).toggle(this.isActive());
    }
    if (!this.isActive() && !sliding) {
      $$(this.element).addClass('coveo-disabled');
    } else {
      $$(this.element).removeClass('coveo-disabled');
    }

    if (this.isActive() && this.slider) {
      this.slider.onMoving();
    }
  }

  private handleNuke() {
    window.removeEventListener('resize', this.onResize);
  }

  private isFacetEmpty(groupByResults: IGroupByResult, data: IQuerySuccessEventArgs) {
    return groupByResults == null || groupByResults.values[0] == null || groupByResults.values[0].numberOfResults == 0 || data.results.results.length == 0;
  }
}

Initialization.registerAutoCreateComponent(FacetSlider);
