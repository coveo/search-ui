/// <reference path="../Facet/FacetHeader.ts" />
/// <reference path="../../controllers/FacetSliderQueryController.ts" />

import { ISliderOptions, Slider, IEndSlideEventArgs, IDuringSlideEventArgs, ISliderGraphData } from '../Misc/Slider';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption, IComponentOptionsObjectOptionArgs } from '../Base/ComponentOptions';
import { FacetHeader } from '../Facet/FacetHeader';
import { l } from '../../strings/Strings';
import { InitializationEvents } from '../../events/InitializationEvents';
import { FacetSliderQueryController } from '../../controllers/FacetSliderQueryController';
import { QueryEvents, IQuerySuccessEventArgs, IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs, IBreadcrumbItem } from '../../events/BreadcrumbEvents';
import { IAttributeChangedEventArg, Model } from '../../models/Model';
import { $$ } from '../../utils/Dom';
import {
  analyticsActionCauseList,
  IAnalyticsFacetMeta,
  IAnalyticsFacetSliderChangeMeta,
  IAnalyticsFacetGraphSelectedMeta
} from '../Analytics/AnalyticsActionListMeta';
import { QueryStateModel } from '../../models/QueryStateModel';
import { SliderEvents, IGraphValueSelectedArgs } from '../../events/SliderEvents';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { ResponsiveComponentsUtils } from '../ResponsiveComponents/ResponsiveComponentsUtils';
import { Initialization } from '../Base/Initialization';
import { SearchAlertsEvents, ISearchAlertsPopulateMessageEventArgs } from '../../events/SearchAlertEvents';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { ResponsiveFacetSlider } from '../ResponsiveComponents/ResponsiveFacetSlider';

import 'styling/_FacetSlider';
import { IGroupByResult } from '../../rest/GroupByResult';
import { Defer } from '../../MiscModules';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

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
 * The `FacetSlider` component creates a facet which contains a slider widget that allows the end user to filter results
 * based on a range of numerical values (e.g., a date range, a price range, etc.).
 *
 * **Note:**
 * > This component does **not** inherit from the [`Facet`]{@link Facet} component. Consequently, it does not offer the
 * > same configuration options. Moreover, some of the `FacetSlider` options (see
 * > [`getSteps`]{@link FacetSlider.options.getSteps} and [`valueCaption`]{@link FacetSlider.options.valueCaption})
 * > cannot be configured as `data-` attributes in the markup. If you wish to configure those options, you must either
 * > do so in the [`init`]{@link init} call of your search interface (see
 * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
 * > or before the `init` call, using the `options` top-level function (see
 * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
 * @notSupportedIn salesforcefree
 */
export class FacetSlider extends Component {
  /**
   * The component options
   * @componentOptions
   */
  static options: IFacetSliderOptions = {
    /**
     * Specifies the title to display on top of the `FacetSlider`.
     *
     * Default value is the localized string for `NoTitle`.
     */
    title: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('NoTitle'), section: 'CommonOptions' }),

    /**
     * Specifies whether the [`field`]{@link FacetSlider.options.field} for which you are requesting a range is a date
     * field. This allows the `FacetSlider` to correctly build the outgoing [GroupByRequest]{@link IGroupByRequest} and
     * render itself properly.
     *
     * Default value is `false`.
     */
    dateField: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'CommonOptions' }),

    /**
     * Specifies the index field whose values the `FacetSlider` should use.
     *
     * The field must be configured correctly as a Facet field in the index (see
     * [Adding Fields to a Source](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=137)).
     *
     * Specifying a value for this option is required for the `FacetSlider` component to work.
     */
    field: ComponentOptions.buildFieldOption({ groupByField: true, required: true, section: 'CommonOptions' }),

    /**
     * Specifies a unique identifier for the `FacetSlider`. Among other things, this identifier serves the purpose of
     * saving the facet state in the URL hash.
     *
     * If you have two facets with the same field in the same page, you should specify a unique `id` value for at least
     * one of those two facets. This `id` must be unique in the page.
     *
     * Default value is the [`field`]{@link FacetSlider.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: IFacetSliderOptions) => value || <string>options.field
    }),

    /**
     * Specifies the format to use when displaying date values.
     *
     * See also the [`dateField`]{@link FacetSlider.options.dateField} option.
     *
     * Default value is `MMM dd, yyyy`.
     */
    dateFormat: ComponentOptions.buildStringOption({ section: 'Display' }),

    /**
     * Specifies a query to filter automatic minimum and maximum values for the slider range.
     *
     * This is especially useful in the case of date ranges since the index may contain values which are not set, and
     * thus return values from the year 1400 (the earliest date from the boost C++ library).
     *
     * **Example:**
     *
     * The query override in the following markup filters out any `@date` value anterior to January 1st 2000.
     * ```html
     * <div class="CoveoFacetSlider" data-field="@date" data-date-field="true" data-query-override="@date>2000/01/01"></div>
     * ```
     */
    queryOverride: ComponentOptions.buildStringOption({ section: 'Filtering' }),

    /**
     * Specifies the starting boundary of the slider.
     *
     * Date values are rounded to the nearest year when you set the [`dateField`]{@link FacetSlider.options.dateField}
     * option to `true`.
     *
     * Default value is the lowest available field value in the index.
     */
    start: ComponentOptions.buildStringOption({ section: 'Filtering' }),

    /**
     * Specifies the ending boundary of the slider.
     *
     * Date values are rounded to the nearest year when you set the [`dateField`]{@link FacetSlider.options.dateField}
     * option to `true`.
     *
     * Default value is the highest available field value in the index.
     */
    end: ComponentOptions.buildStringOption({ section: 'Filtering' }),

    /**
     * Specifies whether to exclude the outer bounds of the slider in the generated query when they are not active.
     *
     * Default value is `false`.
     */
    excludeOuterBounds: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),

    /**
     * Specifies the number of decimal places to round the displayed numerical values to.
     *
     * Default (and minimum) value is `0`.
     */
    rounded: ComponentOptions.buildNumberOption({ min: 0, section: 'Filtering' }),

    /**
     * Specifies the number of steps to split the slider into.
     *
     * For example, if your range is [ 0 , 100 ] and you specify `10` steps, then the end user can move the slider only
     * to the values [ 0, 10, 20, 30 ... , 100 ].
     *
     * For performance reasons, the maximum value for this option is `100`
     *
     * Default value is `undefined`, and the slider allows up to 100 steps. Minimum value is `2`.
     */
    steps: ComponentOptions.buildNumberOption({ min: 2 }),

    /**
     * Specifies whether you want a slider with two buttons instead of a slider with a single button.
     *
     * By default, only one button appears in the slider.
     */
    rangeSlider: ComponentOptions.buildBooleanOption(),

    /**
     * Specifies the caption options to use when displaying the field values.
     *
     * Available options are:
     * - enable (`data-display-as-value-enable`): boolean; specifies whether to display the caption as a value. Default
     * value is `true`.
     * - unitSign (`data-display-as-value-unit-sign`): string; specifies the unit sign for this value (e.g., `$`).
     * Default value is `undefined`.
     * - separator (`data-display-as-value-separator`): string; specifies the character(s) to use as a separator in the
     * caption. Default value is `"-"`.
     */
    displayAsValue: ComponentOptions.buildObjectOption(<IComponentOptionsObjectOptionArgs>{
      subOptions: {
        enable: ComponentOptions.buildBooleanOption({ defaultValue: true }),
        unitSign: ComponentOptions.buildStringOption(),
        separator: ComponentOptions.buildStringOption({ defaultValue: '-' })
      },
      section: 'Display'
    }),

    /**
     * Specifies the percentage caption options to use when displaying the field values.
     *
     * Available options are:
     * - enable (`data-display-as-percent-enable`): boolean; specifies whether to display the caption as a percentage.
     * Default value is `false`.
     * separator (`data-display-as-percent-separator`): string; specifies the character(s) to use as a separator in the
     * caption. Default value is `"-"`.
     */
    displayAsPercent: ComponentOptions.buildObjectOption(<IComponentOptionsObjectOptionArgs>{
      subOptions: {
        enable: ComponentOptions.buildBooleanOption({ defaultValue: false }),
        separator: ComponentOptions.buildStringOption({ defaultValue: '-' })
      },
      section: 'Display'
    }),

    /**
     * Specifies whether to display a small graph on top of the slider.
     *
     * Available options are:
     * - steps (`data-graph-steps`): number; specifies the number of steps/columns to display in your graph. Default
     * value is `10`. Minimum value is `2`.
     */
    graph: ComponentOptions.buildObjectOption(<IComponentOptionsObjectOptionArgs>{
      subOptions: {
        steps: ComponentOptions.buildNumberOption({ min: 2 }),
        animationDuration: ComponentOptions.buildNumberOption({ min: 0 }),
        margin: ComponentOptions.buildObjectOption(<IComponentOptionsObjectOptionArgs>{
          subOptions: {
            top: ComponentOptions.buildNumberOption({ min: 0 }),
            bottom: ComponentOptions.buildNumberOption({ min: 0 }),
            left: ComponentOptions.buildNumberOption({ min: 0 }),
            right: ComponentOptions.buildNumberOption({ min: 0 })
          }
        })
      },
      section: 'Graph'
    }),

    /**
     * Specifies a function to generate the `FacetSlider` steps (see the [`steps`]{@link FacetSlider.options.steps}
     * option). This function receives the `FacetSlider` boundaries (see the [`start`]{@link FacetSlider.options.start}
     * and [`end`]{@link FacetSlider.options.end} options), and must return an array of numbers (the steps).
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     *
     * **Example:**
     * ```javascript
     *
     * var myGetStepsFunction = function(start, end) {
     *   var result = [];
     *   for (i = start; i < end; i += 2) {
     *     result.push(i);
     *   }
     *   return result;
     * }
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *    FacetSlider: {
     *      getSteps: myGetStepsFunction
     *    }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector("#search"), {
     * //   FacetSlider : {
     * //     valueCaption : myGetStepsFunction
     * //   }
     * // });
     * ```
     */
    getSteps: ComponentOptions.buildCustomOption<(start: number, end: number) => number[]>(() => {
      return null;
    }),

    /**
     * Specifies a function to generate the value caption for the `FacetSlider`. This function receives the current
     * slider values (number[]), and must return the caption (string).
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     *
     * **Example:**
     * ```javascript
     *
     * var myValueCaptionFunction = function(values) {
     *   return "From " + values[0] + " to " + values[1];
     * }
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *   FacetSlider: {
     *     valueCaption: myValueCaptionFunction
     *   }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector("#search"), {
     * //   FacetSlider : {
     * //     valueCaption : myValueCaptionFunction
     * //   }
     * // });
     * ```
     */
    valueCaption: ComponentOptions.buildCustomOption<(values: number[]) => string>(() => {
      return null;
    }),

    /**
     * Specifies whether to enable *responsive mode* for facets. Setting this options to `false` on any
     * [`Facet`]{@link Facet} or [`FacetSlider`]{@link FacetSlider} in a search interface disables responsive mode for
     * all other facets in the search interface.
     *
     * Responsive mode displays all facets under a single dropdown button whenever the width of the HTML element which
     * the search interface is bound to reaches or falls behind a certain threshold (see
     * {@link SearchInterface.responsiveComponents}).
     *
     * See also the `FacetSlider` [`dropdownHeaderLabel`]{@link FacetSlider.options.dropdownHeaderLabel} option.
     *
     * Default value is `true`.
     */
    enableResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'ResponsiveOptions' }),

    /**
     * Specifies the label of the button which the end user can click to display the facets when in responsive mode. If
     * this option is configured more than once, the button uses the first occurrence of the option as its label.
     *
     * Default value is "Filters".
     */
    dropdownHeaderLabel: ComponentOptions.buildLocalizedStringOption({ section: 'ResponsiveOptions' })
  };

  static ID = 'FacetSlider';

  static doExport = () => {
    exportGlobally({
      FacetSlider: FacetSlider,
      Slider: Slider
    });
  };

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
   * Creates a new `FacetSlider` component. Binds multiple query events as well.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `FacetSlider` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param slider
   */
  constructor(public element: HTMLElement, public options: IFacetSliderOptions, bindings?: IComponentBindings, private slider?: Slider) {
    super(element, FacetSlider.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, FacetSlider, options);

    ResponsiveFacetSlider.init(this.root, this, this.options);

    if (this.options.excludeOuterBounds == null) {
      this.options.excludeOuterBounds = false;
    }

    if (this.options.start) {
      this.options.start = this.options.dateField
        ? <any>new Date(this.options.start.replace(/-/g, '/')).getTime()
        : <any>Number(this.options.start);
    }

    if (this.options.end) {
      this.options.end = this.options.dateField
        ? <any>new Date(this.options.end.replace(/-/g, '/')).getTime()
        : <any>Number(this.options.end);
    }

    this.facetQueryController = new FacetSliderQueryController(this);
    this.initQueryStateEvents();
    this.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());
    this.bind.onRootElement(QueryEvents.noResults, () => this.handleNoresults());
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
      this.handlePopulateBreadcrumb(args)
    );
    this.bind.onRootElement(SearchAlertsEvents.searchAlertsPopulateMessage, (args: ISearchAlertsPopulateMessageEventArgs) =>
      this.handlePopulateSearchAlerts(args)
    );
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
      facetSlider: this
    });
    this.element.appendChild(this.facetHeader.build());
  }

  public disable() {
    super.disable();
    $$(this.element).addClass('coveo-disabled-empty');
  }

  /**
   * Resets the `FacetSlider` (meaning that you need to set the range value as inactive).
   */
  public reset() {
    if (this.slider) {
      this.slider.initializeState();
      this.updateQueryState();
      this.updateAppearanceDependingOnState();
    }
  }

  /**
   * Gets the current selection in the slider.
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
   * Indicates whether the `FacetSlider` is active. An active `FacetSlider` outputs an expression in the query when a
   * search is performed.
   * @returns {boolean} `true` if the FacetSlider is active; `false` otherwise.
   */
  public isActive(): boolean {
    return (
      !isNaN(this.startOfSlider) &&
      !isNaN(this.endOfSlider) &&
      !isNaN(this.initialStartOfSlider) &&
      !isNaN(this.initialEndOfSlider) &&
      (this.startOfSlider != this.initialStartOfSlider || this.endOfSlider != this.initialEndOfSlider)
    );
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
    // return false;
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
    const populateBreadcrumb = () => {
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
    const elem = $$('div', {
      className: 'coveo-facet-slider-breadcrumb'
    }).el;

    const title = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-title'
    });
    title.text(this.options.title + ': ');
    elem.appendChild(title.el);

    const values = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-values'
    });
    elem.appendChild(values.el);

    const value = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-value'
    });
    const caption = $$('span', {
      clasName: 'coveo-facet-slider-breadcrumb-caption'
    });
    caption.text(this.slider.getCaption());
    value.append(caption.el);
    values.el.appendChild(value.el);

    const clear = $$(
      'span',
      {
        className: 'coveo-facet-slider-breadcrumb-clear'
      },
      SVGIcons.icons.checkboxHookExclusionMore
    );
    SVGDom.addClassToSVGInContainer(clear.el, 'coveo-facet-slider-clear-svg');

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
    const eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + this.rangeQueryStateAttribute);
    this.bind.onRootElement(eventName, (args: IAttributeChangedEventArg) => {
      this.slider ? this.handleRangeQueryStateChanged(args) : this.setRangeStateSliderStillNotCreated(args);
    });
  }

  private setRangeStateSliderStillNotCreated(args: IAttributeChangedEventArg) {
    this.rangeFromUrlState = this.copyValues(args.value);
  }

  private buildSlider() {
    const sliderContainer = $$('div', {
      className: 'coveo-slider-container'
    }).el;

    if (this.hasAGraph()) {
      $$(sliderContainer).addClass('coveo-with-graph');
    }
    const sliderDiv = $$('div').el;

    this.slider = this.slider
      ? this.slider
      : new Slider(sliderDiv, _.extend({}, this.options, { dateField: this.options.dateField }), this.root);
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
    const boundary = this.getSliderBoundaryForQuery();
    if (boundary != undefined) {
      this.facetQueryController.prepareForNewQuery();
      const expression = this.facetQueryController.computeOurFilterExpression(boundary);
      if (Utils.isNonEmptyString(expression)) {
        this.logger.trace('Putting filter in query', expression);
        data.queryBuilder.advancedExpression.add(expression);
      }
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    const queryBuilder = data.queryBuilder;
    this.facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
  }

  private handleDeferredQuerySuccess(data: IQuerySuccessEventArgs) {
    this.ensureDom();
    this.setupSliderIfNeeded(data);
    const groupByResults = data.results.groupByResults[this.facetQueryController.lastGroupByRequestIndex];
    this.isEmpty = this.isFacetEmpty(groupByResults, data);
    this.updateAppearanceDependingOnState();
    if (this.hasAGraph() && !this.isEmpty) {
      this.renderToSliderGraph(data);
    }
  }

  private handleEndSlide(args: IEndSlideEventArgs) {
    const values = args.slider.getValues();
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
    const values = args.slider.getValues();
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
    const copyOfValues = this.copyValues(values);
    const start = values[0] + 0.0;
    const end = values[1] + 0.0;
    const model: number[] = this.queryStateModel.get(this.rangeQueryStateAttribute);
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
    const copyOfValues = [];
    copyOfValues[0] = Number(values[0]) + 0.0;
    copyOfValues[1] = Number(values[1]) + 0.0;
    return copyOfValues;
  }

  private renderToSliderGraph(data: IQuerySuccessEventArgs) {
    const rawGroupByResults = data.results.groupByResults[this.facetQueryController.graphGroupByQueriesIndex];
    let graphData: ISliderGraphData[];
    let totalGraphResults = 0;
    if (rawGroupByResults) {
      graphData = _.map(rawGroupByResults.values, value => {
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
        const y = value.numberOfResults;
        return {
          start: start,
          y: y,
          end: end,
          isDate: this.options.dateField
        };
      });
    }
    if (totalGraphResults == 0) {
      // Special corner case for "simple slider facet" : Do not only handle the group by results,
      // but also look for the complete result set when determining if we should show the facet.
      // This allows simple slider facet to still show with query function fields
      if (this.isSimpleSliderConfig()) {
        this.isEmpty = data.results.results.length == 0;
      } else {
        this.isEmpty = true;
      }
      this.updateAppearanceDependingOnState();
    } else if (graphData != undefined && !this.isDropdownHidden()) {
      // This is deferred since it might be called on initialization with a placehoder over the facet during load time
      // We need to wait that the animation is gone so that the width/height calculation done by the graph are okay.
      Defer.defer(() => this.slider.drawGraph(graphData));
    } else if (graphData != undefined && this.isDropdownHidden()) {
      this.delayedGraphData = graphData;
    }
  }

  private isDropdownHidden() {
    const facetDropdown = this.root.querySelector('.coveo-facet-column');
    if (facetDropdown) {
      return $$(<HTMLElement>facetDropdown).css('display') == 'none';
    }
    if ($$(this.root).hasClass('CoveoRecommendation')) {
      const recommendationDropdown = $$(this.root).parents('.coveo-recommendation-column')[0] || this.root;
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
      const boundary = this.generateBoundaryFromSlider();
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
    const startFromState = this.queryStateModel.get(this.rangeQueryStateAttribute)[0];
    if (startFromState != undefined) {
      start = startFromState;
    }
    const endFromState = this.queryStateModel.get(this.rangeQueryStateAttribute)[1];
    if (endFromState != undefined) {
      end = endFromState;
    }
    if (
      start != this.queryStateModel.getDefault(this.rangeQueryStateAttribute)[0] ||
      end != this.queryStateModel.getDefault(this.rangeQueryStateAttribute)[1]
    ) {
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
      const isInError = this.verifySetup();
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
      this.logger.warn(
        'Cannnot initialize slider with those values : start: ' + this.initialStartOfSlider + ' end: ' + this.initialEndOfSlider
      );
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
    const stateValues = this.rangeFromUrlState || this.queryStateModel.get(this.rangeQueryStateAttribute);
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
    const groupByResults = data.results.groupByResults[this.facetQueryController.groupByRequestForFullRange];
    if (groupByResults && groupByResults.values.length > 0 && groupByResults.values[0].numberOfResults != 0) {
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
      if (this.options.dateField && isNaN(value)) {
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
    return (
      groupByResults == null ||
      groupByResults.values[0] == null ||
      groupByResults.values[0].numberOfResults == 0 ||
      data.results.results.length == 0
    );
  }
}

Initialization.registerAutoCreateComponent(FacetSlider);
