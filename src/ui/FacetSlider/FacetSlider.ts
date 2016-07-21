/// <reference path="../Facet/FacetHeader.ts" />
/// <reference path="../../controllers/FacetSliderQueryController.ts" />

import {ISliderOptions, Slider, IEndSlideEventArgs, IDuringSlideEventArgs, ISliderGraphData} from '../Misc/Slider';
import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {ResponsiveFacets} from '../ResponsiveComponents/ResponsiveFacets';
import {FacetHeader} from '../Facet/FacetHeader';
import {l} from '../../strings/Strings';
import {InitializationEvents} from '../../events/InitializationEvents';
import {FeatureDetectionUtils} from '../../utils/FeatureDetectionUtils';
import {FacetSliderQueryController} from '../../controllers/FacetSliderQueryController';
import {QueryEvents, IQuerySuccessEventArgs, IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs} from '../../events/QueryEvents';
import {BreadcrumbEvents, IPopulateBreadcrumbEventArgs, IBreadcrumbItem} from '../../events/BreadcrumbEvents';
import {IAttributeChangedEventArg, Model} from '../../models/Model';
import {$$} from '../../utils/Dom';
import {analyticsActionCauseList, IAnalyticsFacetMeta, IAnalyticsFacetSliderChangeMeta, IAnalyticsFacetGraphSelectedMeta} from '../Analytics/AnalyticsActionListMeta';
import {QueryStateModel} from '../../models/QueryStateModel';
import {SliderEvents, IGraphValueSelectedArgs} from '../../events/SliderEvents';
import {Assert} from '../../misc/Assert';
import {Utils} from '../../utils/Utils';
import {Initialization} from '../Base/Initialization';

export interface IFacetSliderOptions extends ISliderOptions {
  dateField?: boolean;
  queryOverride?: string;
  id?: string;
  field?: string;
  title?: string;
}

/**
 * The FacetSlider component allows to create a facet that renders a slider widget to filter on a range of numerical values
 * rather than the classic multi-select facet with a label and a count for each values.<br/>
 * Note that this component does *NOT* inherit from a standard {@link Facet}, and thus does not offer all the same options.<br/>
 * If you want to have a graph on top of your FacetSlider, then you will need to manually include d3.js, or d3.min.js from the script files included in the package.
 */
export class FacetSlider extends Component {

  /**
   * The component options
   * @componentOptions
   */
  static options = {
    /**
     * The title on top of the facet component.<br/>
     * Default value is the localized string for 'No title'
     */
    title: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('NoTitle') }),
    /**
     * Specifies whether the field for which you are requesting a range is a date field.<br/>
     * This allow the facet to correctly build the outgoing group by request, as well as render it correctly.<br/>
     */
    dateField: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the index field whose values will be use in the facet.<br/>
     * This require the given field to be configured correctly in the index as a facet field.<br/>
     * This is a required option and cannot be omitted, otherwise the facet component will not work.
     */
    field: ComponentOptions.buildFieldOption({ groupByField: true, required: true }),
    /**
     * Specifies a unique identifier for a facet. This identifier will be used to save the facet state in the url hash, for example.<br/>
     * Optional, since the default will be the {@link FacetSlider.options.field} option.<br/>
     * If you have two facets with the same field on the same page, you should specify an id for at least one of those two facets.<br/>
     * That id need to be unique on the page.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: IFacetSliderOptions) => value || options.field
    }),
    /**
     * Specifies the format used to display values if they are date.<br/>
     * Default value is <code>MMM dd, yyyy</code>
     */
    dateFormat: ComponentOptions.buildStringOption(),
    /**
     * Specifies the query to filter automatic minimum and maximum range of the slider.<br/>
     * This is especially useful for date range, where the index may contain values which are not set, and thus the automatic range will return value from the year 1400 (min date from the boost c++ library)<br/>
     * Can be used to do something like queryOverride : @date>2000/01/01 or some arbitrary date which will filter out unwanted values
     */
    queryOverride: ComponentOptions.buildStringOption(),
    /**
     * Specifies the starting boundary of the slider.<br/>
     * Dates values are rounded on the year when the field used is a date type.<br/>
     * Optional: Takes the lowest value available in the index by default.
     */
    start: ComponentOptions.buildStringOption(),
    /**
     * Specifies the ending boundary of the slider.<br/>
     * Dates values are rounded on the year when the field used is a date type.<br/>
     * Optional: Takes the highest value available in the index by default.
     */
    end: ComponentOptions.buildStringOption(),
    /**
     * Specifies if you want to exclude the outer bounds of your slider in the generated query, when they are not active.<br/>
     * Default value is false
     */
    excludeOuterBounds: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies to how many decimal digit displayed numerical values are rounded.<br/>
     * Optional. By default, the number rounds to 0 decimal digits.
     */
    rounded: ComponentOptions.buildNumberOption({ min: 0 }),
    /**
     * Specifies the number of steps that you want in your slider.<br/>
     * For example, if your range is [ 0 , 100 ] and you specify 10 steps, then the end user is allowed to move the slider only to the values [ 0, 10, 20. 30 ... , 100 ].<br/>
     * Optional. By default the slider will allow all values.
     */
    steps: ComponentOptions.buildNumberOption({ min: 2 }),
    /**
     * Specifies whether you want a slider with two buttons, or only one.<br/>
     * Optional. By default only one button appears in the slider.
     */
    rangeSlider: ComponentOptions.buildBooleanOption(),
    /**
     * Specifies the caption that you want to display the field values.<br/>
     * Available options are :
     * <ul>
     *   <li>enable : (data-display-as-value-enable) <code>boolean</code> : Specifies wether the caption should be displayed as a value. Default is <code>true</code></li>
     *   <li>unitSign : (data-display-as-value-unit-sign) <code>string</code> : Specifies the unit sign for this value.</li>
     *   <li>separator : (data-display-as-value-separator) <code>string</code> : Specifies the character(s) to use as a separator in the caption. Default is -.</li>
     * </ul>
     */
    displayAsValue: ComponentOptions.buildObjectOption({
      subOptions: {
        enable: ComponentOptions.buildBooleanOption({ defaultValue: true }),
        unitSign: ComponentOptions.buildStringOption(),
        separator: ComponentOptions.buildStringOption({ defaultValue: '-' })
      }
    }),
    /**
     * Specifies the percentage caption that you want to display the field values.<br/>
     * Available options are :
     * <ul>
     *   <li>enable : (data-display-as-percent-enable) <code>boolean</code> : Specifies wether the caption should be displayed as a percentage. Default is <code>false</code></li>
     *   <li>separator : (data-display-as-percent-separator) <code>string</code> : Specifies the character(s) to use as a separator in the caption. Default is -.</li>
     * </ul>
     */
    displayAsPercent: ComponentOptions.buildObjectOption({
      subOptions: {
        enable: ComponentOptions.buildBooleanOption({ defaultValue: false }),
        separator: ComponentOptions.buildStringOption({ defaultValue: '-' })
      }
    }),
    /**
     * Specifies that you wish to display a small graph on top of the slider.<br/>
     * Available options are :
     * <ul>
     *   <li>steps: (data-graph-steps) <code>number</code> : Specifies the number of steps/columns to display in your graph. Default value is 10</li>
     * </ul>
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
    })
  };

  static ID = 'FacetSlider';
  public startOfSlider: number;
  public endOfSlider: number;
  public initialStartOfSlider: number;
  public initialEndOfSlider: number;
  public facetQueryController: FacetSliderQueryController;
  public facetHeader: FacetHeader;

  private slider: Slider;
  private rangeQueryStateAttribute: string;
  private isEmpty = false;
  private rangeFromUrlState: number[];
  private delayedGraphData: ISliderGraphData[];
  private onResize: EventListener;


  constructor(public element: HTMLElement, public options: IFacetSliderOptions, bindings?: IComponentBindings) {
    super(element, FacetSlider.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, FacetSlider, options);

    ResponsiveFacets.init(this.root, this);

    if (this.options.excludeOuterBounds == null) {
      this.options.excludeOuterBounds = false;
    }

    if (this.options.start) {
      this.options.start = this.options.dateField ? <any>new Date(this.options.start.replace(/-/g, '/')).getTime() : <any>Number(this.options.start);
    }

    if (this.options.end) {
      this.options.end = this.options.dateField ? <any>new Date(this.options.end.replace(/-/g, '/')).getTime() : <any>Number(this.options.end);
    }

    if (this.hasAGraph()) {
      if (!FeatureDetectionUtils.supportSVG()) {
        this.options.graph = undefined;
        this.logger.info('Your browser does not support SVG. Cannot add graphic to your facet range', this);
      }
      if (typeof d3 == 'undefined') {
        this.options.graph = undefined;
        this.logger.info('Cannot find the required dependencies d3.js. Cannot add graphic to your facet range', this);
      }
    }

    this.facetQueryController = new FacetSliderQueryController(this);
    this.initQueryStateEvents();
    this.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());
    this.bind.onRootElement(QueryEvents.noResults, () => this.handleNoresults());
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.reset())

    this.onResize = _.debounce(() => {
      if (!this.searchInterface.isSmallInterface()) {
        this.slider.drawGraph();
      }
    }, 250);
    window.addEventListener('resize', this.onResize);
    $$(this.root).on(InitializationEvents.nuke, this.handleNuke);
  }

  public createDom() {
    this.facetHeader = new FacetHeader({
      field: this.options.field,
      facetElement: this.element,
      title: this.options.title,
      enableClearElement: true,
      enableCollapseElement: true,
      isNewDesign: this.getBindings().searchInterface.isNewDesign(),
      facetSlider: this
    })
    this.element.appendChild(this.facetHeader.build());
  }

  /**
   * Reset the facet. This means set the range value as inactive.
   */
  public reset() {
    if (this.slider) {
      this.slider.initializeState();
      this.updateQueryState();
      this.updateAppearanceDependingOnState();
    }
  }

  /**
   * Return the current selection in the facet, as an array of number (eg : [start, end] ).<br/>
   * If it's not available, return [undefined, undefined]
   * @returns {any}
   */
  public getSelectedValues(): number[] {
    if (this.startOfSlider != undefined && this.endOfSlider != undefined) {
      return [this.startOfSlider, this.endOfSlider];
    } else {
      return [undefined, undefined];
    }
  }

  /**
   * Set the selected values in the slider.
   * @param values [start, end]
   */
  public setSelectedValues(values: number[]): void {
    this.setupSliderIfNeeded(undefined);
    this.startOfSlider = values[0];
    this.endOfSlider = values[1];
    this.slider.setValues([this.startOfSlider, this.endOfSlider]);
    this.updateAppearanceDependingOnState();
  }

  /**
   * Return true if the slider is "active" (will output an expression in the query when a search is performed)
   * @returns {boolean}
   */
  public isActive(): boolean {
    return !isNaN(this.startOfSlider)
      && !isNaN(this.endOfSlider)
      && !isNaN(this.initialStartOfSlider)
      && !isNaN(this.initialEndOfSlider)
      && (this.startOfSlider != this.initialStartOfSlider || this.endOfSlider != this.initialEndOfSlider)
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

  // There is delayed graph data if at the time the facet slider tried to draw the facet was hidden in the
  // facet dropdown. This method will draw delayed graph data if it exists.
  public drawDelayedGraphData() {
    if (this.delayedGraphData != undefined) {
      this.slider.drawGraph(this.delayedGraphData);
    }
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
    }
    if (this.slider) {
      populateBreadcrumb()
    } else {
      $$(this.root).one(QueryEvents.deferredQuerySuccess, () => {
        populateBreadcrumb();
        $$(this.root).trigger(BreadcrumbEvents.redrawBreadcrumb);
      })
    }
  }

  private buildBreadcrumbFacetSlider(): HTMLElement {
    let elem = $$('div', {
      className: 'coveo-facet-slider-breadcrumb'
    }).el;

    let title = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-title'
    });
    title.text(this.options.title + ':');
    elem.appendChild(title.el);

    let values = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-values'
    });
    elem.appendChild(values.el);

    let value = $$('span', {
      className: 'coveo-facet-slider-breadcrumb-value'
    })
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
    })
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
    })
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

    this.slider = new Slider(sliderDiv, _.extend({}, this.options, { dateField: this.options.dateField }), this.root);
    $$(sliderDiv).on(SliderEvents.endSlide, (e: MouseEvent, args: IEndSlideEventArgs) => {
      this.handleEndSlide(args);
    });
    $$(sliderDiv).on(SliderEvents.duringSlide, (e: MouseEvent, args: IDuringSlideEventArgs) => {
      this.handleDuringSlide(args);
    });
    if (this.hasAGraph()) {
      $$(sliderDiv).on(SliderEvents.graphValueSelected, (e: MouseEvent, args: IGraphValueSelectedArgs) => {
        this.handleGraphValueSelected(args);
      })
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
    if (groupByResults == undefined || groupByResults.values[0] == undefined) {
      this.isEmpty = true;
    }
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
    return copyOfValues
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
        }
      })
    }
    if (totalGraphResults == 0) {
      this.isEmpty = true;
      this.updateAppearanceDependingOnState();
    } else if (graphData != undefined && !this.isFacetDropdownHidden()) {
      this.slider.drawGraph(graphData);
    } else if (graphData != undefined && this.isFacetDropdownHidden()) {
      this.delayedGraphData = graphData;
    }
  }

  private isFacetDropdownHidden() {
    let facetDropdown = this.root.querySelector('.coveo-facet-column');
    if (facetDropdown) {
      return $$(<HTMLElement>facetDropdown).css('display') == 'none';
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
      this.logger.warn('Cannnot initialize slider with those values : start: ' + this.initialStartOfSlider + ' end: ' + this.initialEndOfSlider)
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
      this.setupInitialSliderStateEnd(this.options.end)
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

  private hasAGraph() {
    return this.options.graph != undefined;
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
  }

  private handleNuke() {
    window.removeEventListener('resize', this.onResize);
  }
}
Initialization.registerAutoCreateComponent(FacetSlider);
