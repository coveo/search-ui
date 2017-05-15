/// <reference path="../../controllers/HierarchicalFacetQueryController.ts" />
/// <reference path="../../controllers/FacetQueryController.ts" />
/// <reference path="FacetSearch.ts" />
/// <reference path="FacetSettings.ts" />
/// <reference path="FacetSort.ts" />
/// <reference path="FacetHeader.ts" />
/// <reference path="BreadcrumbValueElement.ts" />
/// <reference path="ValueElementRenderer.ts" />
/// <reference path="FacetSearchParameters.ts" />
/// <reference path="../HierarchicalFacet/HierarchicalFacet.ts" />

import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { FacetValue, FacetValues } from './FacetValues';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { l } from '../../strings/Strings';
import { FacetQueryController } from '../../controllers/FacetQueryController';
import { FacetSearch } from './FacetSearch';
import { FacetSettings } from './FacetSettings';
import { FacetSort } from './FacetSort';
import { FacetValuesList } from './FacetValuesList';
import { FacetHeader } from './FacetHeader';
import { FacetUtils } from './FacetUtils';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryEvents, INewQueryEventArgs, IQuerySuccessEventArgs, IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { Assert } from '../../misc/Assert';
import { ISearchEndpoint } from '../../rest/SearchEndpointInterface';
import { $$ } from '../../utils/Dom';
import { IAnalyticsFacetMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { Utils } from '../../utils/Utils';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { BreadcrumbValueElement } from './BreadcrumbValueElement';
import { BreadcrumbValueList } from './BreadcrumbValuesList';
import { FacetValueElement } from './FacetValueElement';
import { FacetSearchValuesList } from './FacetSearchValuesList';
import { Defer } from '../../misc/Defer';
import { QueryStateModel, IQueryStateIncludedAttribute, IQueryStateExcludedAttribute } from '../../models/QueryStateModel';
import { MODEL_EVENTS, IAttributesChangedEventArg } from '../../models/Model';
import { OmniboxEvents, IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { OmniboxValueElement } from './OmniboxValueElement';
import { OmniboxValuesList } from './OmniboxValuesList';
import { IGroupByResult } from '../../rest/GroupByResult';
import { IGroupByValue } from '../../rest/GroupByValue';
import { ValueElementRenderer } from './ValueElementRenderer';
import { FacetSearchParameters } from './FacetSearchParameters';
import { IOmniboxDataRow } from '../Omnibox/OmniboxInterface';
import { Initialization } from '../Base/Initialization';
import { BreadcrumbEvents, IClearBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { IStringMap } from '../../rest/GenericParam';
import { FacetValuesOrder } from './FacetValuesOrder';
import { ValueElement } from './ValueElement';
import { SearchAlertsEvents, ISearchAlertsPopulateMessageEventArgs } from '../../events/SearchAlertEvents';
import _ = require('underscore');

export interface IFacetOptions {
  title?: string;
  field?: IFieldOption;
  isMultiValueField?: boolean;
  numberOfValues?: number;
  pageSize?: number;
  sortCriteria?: string;
  availableSorts?: string[];
  injectionDepth?: number;
  showIcon?: boolean;
  useAnd?: boolean;
  enableCollapse?: boolean;
  enableTogglingOperator?: boolean;
  enableMoreLess?: boolean;
  valueCaption?: any;
  lookupField?: IFieldOption;
  enableFacetSearch?: boolean;
  facetSearchDelay?: number;
  facetSearchIgnoreAccents?: boolean;
  numberOfValuesInFacetSearch?: number;
  includeInBreadcrumb?: boolean;
  includeInOmnibox?: boolean;
  numberOfValuesInOmnibox?: number;
  numberOfValuesInBreadcrumb?: number;
  id?: string;
  computedField?: IFieldOption;
  computedFieldOperation?: string;
  computedFieldFormat?: string;
  computedFieldCaption?: string;
  preservePosition?: boolean;
  scrollContainer?: HTMLElement;
  paddingContainer?: HTMLElement;
  customSort?: string[];
  enableSettings?: boolean;
  enableSettingsFacetState?: boolean;
  allowedValues?: string[];
  headerIcon?: string;
  valueIcon?: (facetValue: FacetValue) => string;
  additionalFilter?: string;
  dependsOn?: string;
  enableResponsiveMode?: boolean;
  responsiveBreakpoint?: number;
  dropdownHeaderLabel?: string;
}

/**
 * The Facet component displays a *facet* of the results for the current query. A facet consists of a list of values for
 * a given field occurring in the results, ordered using a configurable criteria.
 *
 * The list of values is obtained using an {@link IGroupByRequest} operation performed at the same time as the main
 * query.
 *
 * The Facet component allows the user to drill down inside results by restricting them to certain field values. It also
 * allows filtering out values from the Facet itself, and can provide a search box to look for specific values inside
 * larger sets.
 *
 * This is probably the most complex component in the Coveo JavaScript Search Framework and as such, it allows for many
 * different configuration options.
 *
 * See also {@link FacetRange} and {@link HierarchicalFacet} (which extend this component), and {@link FacetSlider}
 * (which does not properly extend this component, but is very similar).
 */
export class Facet extends Component {
  static ID = 'Facet';
  static omniboxIndex = 50;

  /**
   * The possible options for a facet
   * @componentOptions
   */
  static options: IFacetOptions = {

    /**
     * Specifies the title to display at the top of the Facet.
     *
     * Default value is the localized string for `"NoTitle"`.
     */
    title: ComponentOptions.buildLocalizedStringOption({
      defaultValue: l('NoTitle'),
      section: 'Identification',
      priority: 10
    }),

    /**
     * Specifies the index field whose values the Facet should use.
     *
     * This requires the given field to be configured correctly in the index as a Facet field (see
     * [Adding Fields to a Source](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=137)).
     *
     * Specifying a value for this option is required for the Facet component to work.
     */
    field: ComponentOptions.buildFieldOption({ required: true, groupByField: true, section: 'Identification' }),

    headerIcon: ComponentOptions.buildIconOption({ deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.' }),

    /**
     * Specifies a unique identifier for the Facet. Among other things, this identifier serves the purpose of saving the
     * facet state in the URL hash.
     *
     * If you have two facets with the same field on the same page, you should specify an id value for at least one of
     * those two facets. This id must be unique in the page.
     *
     * Default value is the {@link Facet.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value, options: IFacetOptions) => value || <string>options.field
    }),

    /**
     * Specifies whether the field is configured in the index as a multi-value field (semicolon separated values such as
     * `abc;def;ghi`).
     *
     * Default value is `false`.
     */
    isMultiValueField: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    lookupField: ComponentOptions.buildFieldOption({ deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.' }),

    /**
     * Specifies whether to display the Facet **Settings** menu.
     *
     * See also {@link Facet.options.enableSettingsFacetState}, {@link Facet.options.availableSorts} and
     * {@link Facet.options.enableCollapse}.
     *
     * Default value is `true`.
     */
    enableSettings: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'SettingsMenu', priority: 9 }),

    /**
     * If {@link Facet.options.enableSettings} is `true`, specifies whether the **Save state** menu option is available
     * in the Facet **Settings** menu.
     *
     * Default value is `false`.
     */
    enableSettingsFacetState: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableSettings' }),

    /**
     * If {@link Facet.options.enableSettings} is `true`, specifies the sort criteria options to display in the Facet
     * **Settings** menu.
     *
     * Possible values are:
     * - `"occurrences"`
     * - `"score"`
     * - `"alphaAscending"`
     * - `alphaDescending`
     * - `"computedfieldascending"`
     * - `"computedfielddescending"`
     * - `"custom"`
     *
     * Default value is `"occurrences,score,alphaAscending,alphaDescending"`.
     */
    availableSorts: ComponentOptions.buildListOption<'occurrences' | 'score' | 'alphaascending' | 'alphadescending' | 'computedfieldascending' | 'computedfielddescending' | 'chisquare' | 'nosort'>({
      defaultValue: ['occurrences', 'score', 'alphaAscending', 'alphaDescending'],
      values: ['Occurrences', 'Score', 'AlphaAscending', 'AlphaDescending', 'ComputedFieldAscending', 'ComputedFieldDescending', 'ChiSquare', 'NoSort'],
      depend: 'enableSettings'
    }),

    /**
     * Specifies the criteria to use to sort the Facet values.
     *
     * See {@link IGroupByRequest} for the list of possible values.
     *
     * Default value is the first sort criteria specified in the {@link Facet.options.availableSorts} option, or
     * `"occurrences"` if no sort criteria is specified.
     */
    sortCriteria: ComponentOptions.buildStringOption({ postProcessing: (value, options: IFacetOptions) => value || (options.availableSorts.length > 0 ? options.availableSorts[0] : 'occurrences') }),

    /**
     * Specifies a custom order by which to sort the Facet values.
     *
     * For example, you could use this to specify a logical order for support tickets, such as
     * `customSort : ["New","Opened","Feedback","Resolved","Feedback"]`
     */
    customSort: ComponentOptions.buildListOption<string>({ section: 'Identification' }),

    /**
     * Specifies the maximum number of field values to display by default in the Facet before the user
     * clicks **More**.
     *
     * Default value is `5`. Minimum value is `0`.
     */
    numberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'Identification' }),

    /**
     * Specifies the *injection depth* to use for the {@link IGroupByRequest} operation.
     *
     * The injection depth determines how many results to scan in the index to ensure that the facet lists all potential
     * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
     *
     * Default value is `1000`. Minimum value is `0`.
     */
    injectionDepth: ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 0 }),

    showIcon: ComponentOptions.buildBooleanOption({ defaultValue: false, deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.' }),

    /**
     * Specifies whether to use the `AND` operator in the resulting filter when multiple values are selected in the
     * Facet.
     *
     * Setting this option to `true` means that documents must have all of the selected values to match the resulting
     * query.
     *
     * Default value is `false`, which means that the filter uses the `OR` operator. Thus, by default, documents must
     * have at least one of the selected values to match the query.
     */
    useAnd: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to allow the user to toggle between the `OR` and `AND` modes in the Facet.
     *
     * Setting this option to `true` displays an icon in the top right corner of the Facet. The user can click this icon
     * to toggle between between the two modes.
     *
     * Default value is `false`.
     */
    enableTogglingOperator: ComponentOptions.buildBooleanOption({ defaultValue: false, alias: 'allowTogglingOperator' }),

    /**
     * Specifies whether to display a search box at the bottom of the Facet for searching among the available values.
     *
     * See also {@link Facet.options.facetSearchDelay}, {@link Facet.options.facetSearchIgnoreAccents},
     * {@link Facet.options.numberOfValuesInFacetSearch}.
     *
     * Default value is `true`.
     */
    enableFacetSearch: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'FacetSearch', priority: 8 }),

    /**
     * If {@link Facet.options.enableFacetSearch} is `true`, specifies the delay (in milliseconds) before sending a
     * search request to the server when the user starts typing in the Facet search box.
     *
     * Specifying a smaller value means results will arrive faster. However, chances of having to cancel many requests
     * sent to the server will increase as the user keeps on typing new characters.
     *
     * Default value is `100`. Minimum value is `0`.
     */
    facetSearchDelay: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0, depend: 'enableFacetSearch' }),

    /**
     * If {@link Facet.options.enableFacetSearch} is `true`, specifies whether to ignore accents in the Facet search
     * box.
     *
     * Default value is `false`.
     */
    facetSearchIgnoreAccents: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFacetSearch' }),

    /**
     * If {@link Facet.options.enableFacetSearch} is `true`, specifies the number of values to display in the Facet
     * search results popup.
     *
     * Default value is `15`. Minimum value is `1`.
     */
    numberOfValuesInFacetSearch: ComponentOptions.buildNumberOption({ defaultValue: 15, min: 1 }),

    /**
     * Specifies whether the Facet should push data to the {@link Breadcrumb} component.
     *
     * See also {@link Facet.options.numberOfValuesInBreadcrumb}.
     *
     * Default value is `true`.
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If {@link Facet.options.includeInBreadcrumb} is `true`, specifies the maximum number of values that the Facet
     * should display in the {@link Breadcrumb} before outputting a **See more** button.
     *
     * Default value is `5` on a desktop computer and `3` on a mobile device. Minimum value is `0`.
     */
    numberOfValuesInBreadcrumb: ComponentOptions.buildNumberOption({ defaultFunction: () => DeviceUtils.isMobileDevice() ? 3 : 5, min: 0, depend: 'includeInBreadcrumb' }),

    includeInOmnibox: ComponentOptions.buildBooleanOption({ defaultValue: false, deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.' }),

    numberOfValuesInOmnibox: ComponentOptions.buildNumberOption({ defaultFunction: () => DeviceUtils.isMobileDevice() ? 3 : 5, min: 0, depend: 'includeInOmnibox', deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.' }),

    /**
     * Specifies the name of a field on which to execute an aggregate operation for all distinct values of the Facet
     * field.
     *
     * The Facet displays the result of the operation along with the number of occurrences for each value.
     *
     * You can use this option to compute the sum of a field (like a money amount) for each listed Facet value.
     *
     * Works in conjunction with {@link Facet.options.computedFieldOperation},
     * {@link Facet.options.computedFieldFormat} and {@link Facet.options.computedFieldCaption}.
     */
    computedField: ComponentOptions.buildFieldOption({ section: 'ComputedField', priority: 7 }),

    /**
     * Specifies the type of aggregate operation to perform on the {@link Facet.options.computedField}.
     *
     * The possible values are:
     * - `"sum"` - Computes the sum of the computed field values.
     * - `"average"` - Computes the average of the computed field values.
     * - `"minimum"` - Finds the minimum value of the computed field values.
     * - `"maximum"` - Finds the maximum value of the computed field values.
     *
     * Default value is `"sum"`.
     */
    computedFieldOperation: ComponentOptions.buildStringOption({ defaultValue: 'sum', section: 'ComputedField' }),

    /**
     * Specifies how to format the values resulting from a {@link Facet.options.computedFieldOperation}.
     *
     * The Globalize library defines all available formats (see
     * [Globalize](https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-)).
     *
     * The most commonly used formats are:
     * - `"c0"` - Formats the value as a currency.
     * - `"n0"` - Formats the value as an integer.
     * - `"n2"` - Formats the value as a floating point with 2 decimal digits.
     *
     * Default value is `"c0"`.
     */
    computedFieldFormat: ComponentOptions.buildStringOption({ defaultValue: 'c0', section: 'ComputedField' }),

    /**
     * Specifies what the caption of the {@link Facet.options.computedField} should be in the settings menu for sorting.
     *
     * For example, setting this option to `"Money"` will display `"Money Ascending"` for computed field ascending.
     *
     * Default value is the localized string for `"ComputedField"`.
     */
    computedFieldCaption: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('ComputedField'), section: 'ComputedField' }),

    /**
     * Specifies whether the Facet should remain stable in its current position in the viewport while the mouse cursor
     * is over it.
     *
     * Whenever the value selection changes in a facet, the search interface automatically performs a query. This new
     * query might cause other elements in the page to resize themselves (typically, other facets above or below the
     * one the user is interacting with).
     *
     * This option is responsible for adding the `<div class='coveo-topSpace'>` and
     * `<div class='coveo-bottomSpace'>` around the Facet container. The Facet adjusts the scroll amount of the page to
     * ensure that it does not move relatively to the mouse when the results are updated.
     *
     * In some cases, the Facet also adds margins to the scrollContainer, if scrolling alone is not enough to
     * preserve position.
     *
     * See also {@link Facet.options.paddingContainer} and {@link Facet.options.scrollContainer}.
     *
     * Default value is `true`.
     */
    preservePosition: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies the parent container of the facets.
     *
     * Used by the {@link Facet.options.preservePosition}.
     *
     * Default value is `element.parentElement`.
     */
    paddingContainer: ComponentOptions.buildSelectorOption({ defaultFunction: (element) => element.parentElement }),

    /**
     * Specifies the HTML element (through a CSS selector) whose scroll amount the Facet should adjust to preserve its
     * position when results are updated.
     *
     * Used by {@link Facet.options.preservePosition}.
     *
     * Default value is `document.body`.
     */
    scrollContainer: ComponentOptions.buildSelectorOption({ defaultFunction: (element) => document.body }),

    /**
     * Specifies whether to enable the **More** and **Less** buttons in the Facet.
     *
     * See also {@link Facet.options.pageSize}.
     *
     * Default value is `true`.
     */
    enableMoreLess: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If {@link Facet.options.enableMoreLess} is `true`, specifies the number of additional results to fetch when
     * clicking on the **More** button in the Facet.
     *
     * Default value is `10`. Minimum value is `1`.
     */
    pageSize: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' }),

    /**
     * If {@link Facet.options.enableSettings} is `true`, specifies whether the **Collapse \ Expand** menu option is
     * available in the Facet **Settings** menu.
     *
     * Default value is `true`.
     */
    enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: true, depend: 'enableSettings' }),

    /**
     * Specifies an explicit list of {@link IGroupByRequest.allowedValues} in the {@link IGroupByRequest}.
     *
     * This will whitelist the Facet content to some specific values.
     *
     * Example: `["File", "People"]`.
     */
    allowedValues: ComponentOptions.buildListOption<string>(),

    /**
     * Specifies an additional query expression (query override) to add to each {@link IGroupByRequest} that this Facet
     * performs.
     *
     * Example: `@date>=2014/01/01`
     */
    additionalFilter: ComponentOptions.buildStringOption(),

    /**
     * Specifies whether this Facet only appears when a value is selected in its "parent" Facet.
     *
     * To specify the parent Facet, use its [id]{@link Facet.options.id}.
     *
     * Remember that by default, a Facet id is the same as its [field]{@link Facet.options.field}.
     *
     * **Examples:**
     *
     * First case: the "parent" Facet has no custom `id`:
     * ```html
     * <!-- "Parent" Facet: -->
     * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet'></div>
     *
     * <!-- The "dependent" Facet must refer to the default `id` of its "parent" Facet, which is the name of its field. -->
     * <div class='CoveoFacet' data-field='@myotherfield' data-title='My Dependent Facet' data-depends-on='@myfield'></div>
     * ```
     *
     * Second case: the "parent" Facet has a custom `id`:
     * ```html
     * <!-- "Parent" Facet: -->
     * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet' data-id='myParentCustomId'></div>
     *
     * <!-- The "dependent" Facet must refer to the custom `id` of its "parent" Facet, which is 'myParentCustomId'. -->
     * <div class='CoveoFacet' data-field='@myotherfield data-title='My Dependent Facet' data-depends-on='myParentCustomId'></div>
     * ```
     *
     * Default value is `undefined`
     */
    dependsOn: ComponentOptions.buildStringOption(),

    /**
     * Specifies a JSON object describing a mapping of Facet values to their desired captions.
     *
     * You can only set this option in the {@link init} call of your search interface. You cannot set it directly in the
     * markup as an HTML attribute.
     *
     * Example:
     * ```
     * // Using a Facet for file types
     * var myValueCaption = {  "txt": "Text files","html": "Web page", [ etc ... ]};
     *
     * // You can set the option in the 'init' call using 'pure' JavaScript:
     * Coveo.init(document.querySelector('#search'), {
     *    Facet : {
     *      valueCaption: myValueCaption
     *    }
     * })
     *
     * // Or  the jQuery extension
     * $("#search").coveo("init", {
     *    Facet: {
     *      valueCaption: myValueCaption
     *    }
     * })
     * ```
     */
    valueCaption: ComponentOptions.buildCustomOption<IStringMap<string>>(() => {
      return null;
    }),

    /**
     * Specifies whether to enable *responsive mode* for facets. Setting this options to `false` on any Facet or
     * {@link FacetSlider} in a search interface disables responsive mode for all other facets in the search interface.
     *
     * Responsive mode displays all facets under a single dropdown button whenever the width of the HTML element which
     * the search interface is bound to reaches or falls behind a certain threshold (see
     * {@link SearchInterface.responsiveComponents}).
     *
     * See also {@link Facet.options.dropdownHeaderLabel}.
     *
     * Default value is `true`.
     */
    enableResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    responsiveBreakpoint: ComponentOptions.buildNumberOption({ defaultValue: 800, deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.' }),

    /**
     * If {@link Facet.options.enableResponsiveMode} is `true` for all facets and
     * {@link FacetSlider.options.enableResponsiveMode} is also `true` for all sliders, specifies the label of the
     * dropdown button that allows to display the facets when in responsive mode.
     *
     * If more than one Facet or {@link FacetSlider} in the search interface specifies a value for this option, then the
     * framework uses the first occurrence of the option.
     *
     * Default value is `Filters`.
     */
    dropdownHeaderLabel: ComponentOptions.buildLocalizedStringOption()
  };

  public facetQueryController: FacetQueryController;
  public keepDisplayedValuesNextTime: boolean = false;
  public values = new FacetValues();
  public currentPage: number = 0;
  public numberOfValues: number;
  public firstQuery = true;
  public operatorAttributeId: string;

  /**
   * Renders and handles the Facet **Search** part of the component.
   */
  public facetSearch: FacetSearch;

  /**
   * Renders and handles the Facet **Settings** part of the component
   */
  public facetSettings: FacetSettings;
  public facetSort: FacetSort;
  public facetValuesList: FacetValuesList;
  public facetHeader: FacetHeader;

  protected omniboxZIndex;
  protected moreElement: HTMLElement;
  protected lessElement: HTMLElement;

  protected headerElement: HTMLElement;
  protected footerElement: HTMLElement;
  private canFetchMore: boolean = true;
  private nbAvailableValues: number;

  private showingWaitAnimation = false;
  private pinnedViewportPosition: number;
  private unpinnedViewportPosition: number;
  private pinnedTopSpace: HTMLElement;
  private pinnedBottomSpace: HTMLElement;

  private componentStateId: string;
  private includedAttributeId: string;
  private excludedAttributeId: string;
  private lookupValueAttributeId: string;
  private listenToQueryStateChange = true;

  private resize: (...args: any[]) => void;

  /**
   * Creates a new Facet component. Binds multiple query events as well.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Facet component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param facetClassId The ID to use for this facet (as Facet inherited from by other component
   * (e.g.: {@link FacetRange}). Default value is `Facet`.
   */
  constructor(public element: HTMLElement, public options: IFacetOptions, bindings?: IComponentBindings, facetClassId: string = Facet.ID) {
    super(element, facetClassId, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Facet, options);

    if (this.options.valueCaption != null) {
      this.options.availableSorts = _.filter(this.options.availableSorts, (sort: string) => !/^alpha.*$/.test(sort));
    }

    ResponsiveFacets.init(this.root, this, this.options);

    // Serves as a way to render facet in the omnibox in the order in which they are instantiated
    this.omniboxZIndex = Facet.omniboxIndex;
    Facet.omniboxIndex--;

    this.checkForComputedFieldAndSort();
    this.checkForValueCaptionType();
    this.checkForCustomSort();
    this.initFacetQueryController();
    this.initQueryEvents();
    this.initQueryStateEvents();
    this.initComponentStateEvents();
    this.initOmniboxEvents();
    this.initBreadCrumbEvents();
    this.initSearchAlertEvents();
    this.updateNumberOfValues();

    this.resize = () => {
      if (!this.disabled) {
        FacetUtils.clipCaptionsToAvoidOverflowingTheirContainer(this);
      }
    };
    window.addEventListener('resize', _.debounce(this.resize, 200));
    this.bind.onRootElement(InitializationEvents.nuke, () => this.handleNuke());

    this.bind.oneRootElement(QueryEvents.querySuccess, () => {
      this.firstQuery = false;
    });
  }

  public createDom() {
    this.initBottomAndTopSpacer();
    this.buildFacetContent();
    this.updateAppearanceDependingOnState();
    // After the facet has been created (and before the first query is applied)
    // Try to load a state from the setting, if it's available
    // Execute only _.once (only the first query, or the first time the user switch to a tab that contains a newly set of active facet)
    if (this.facetSettings && this.options.enableSettingsFacetState) {
      let loadOnce = <(args: INewQueryEventArgs) => any>_.once(() => {
        this.facetSettings.loadSavedState.apply(this.facetSettings);
      });
      this.bind.onRootElement(QueryEvents.newQuery, loadOnce);
    }
  }

  /**
   * Selects a single value.
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a {@link FacetValue} or a string (e.g., `selectValue('foobar')` or
   * `selectValue(new FacetValue('foobar'))`).
   */
  public selectValue(value: FacetValue): void;
  public selectValue(value: string): void;
  public selectValue(value: any): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Selecting facet value', this.facetValuesList.select(value));
    this.facetValueHasChanged();
  }

  /**
   * Selects multiple values.
   *
   * Does not trigger a query automatically.
   *
   * @param values Can be an array of {@link FacetValue} or a string array.
   */
  public selectMultipleValues(values: FacetValue[]): void;
  public selectMultipleValues(values: string[]): void;
  public selectMultipleValues(values: any[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values, (value) => {
      this.logger.info('Selecting facet value', this.facetValuesList.select(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Deselects a single value.
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a {@link FacetValue} or a string (e.g., `deselectValue('foobar')` or
   * `deselectValue(new FacetValue('foobar'))`).
   */
  public deselectValue(value: FacetValue): void;
  public deselectValue(value: string): void;
  public deselectValue(value: any): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Deselecting facet value', this.facetValuesList.unselect(value));
    this.facetValueHasChanged();
  }

  /**
   * Deselects multiple values.
   *
   * Does not trigger a query automatically.
   *
   * @param values Can be an array of {@link FacetValue} or a string array.
   */
  public deselectMultipleValues(values: FacetValue[]): void
  public deselectMultipleValues(values: string[]): void
  public deselectMultipleValues(values: any[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values, (value) => {
      this.logger.info('Deselecting facet value', this.facetValuesList.unselect(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Excludes a single value.
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a {@link FacetValue} or a string (e.g., `excludeValue('foobar')` or
   * `excludeValue(new FacetValue('foobar'))`).
   */
  public excludeValue(value: FacetValue): void;
  public excludeValue(value: string): void;
  public excludeValue(value: any): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Excluding facet value', this.facetValuesList.exclude(value));
    this.facetValueHasChanged();
  }

  /**
   * Excludes multiple values.
   *
   * Does not trigger a query automatically.
   *
   * @param values Can be an array of {@link FacetValue} or a string array.
   */
  public excludeMultipleValues(values: FacetValue[]): void;
  public excludeMultipleValues(values: string[]): void;
  public excludeMultipleValues(values: any[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values, (value) => {
      this.logger.info('Excluding facet value', this.facetValuesList.exclude(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Unexcludes a single value.
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a {@link FacetValue} or a string.
   */
  public unexcludeValue(value: FacetValue): void;
  public unexcludeValue(value: string): void;
  public unexcludeValue(value: any): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Unexcluding facet value', this.facetValuesList.unExclude(value));
    this.facetValueHasChanged();
  }

  /**
   * Unexcludes multiple values.
   *
   * Does not trigger a query automatically.
   *
   * @param values Can be an array of {@link FacetValue} or a string array.
   */
  public unexcludeMultipleValues(values: FacetValue[]): void;
  public unexcludeMultipleValues(values: string[]): void;
  public unexcludeMultipleValues(values: any[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values, (value) => {
      this.logger.info('Unexcluding facet value', this.facetValuesList.unExclude(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Toggles the selection state of a single value (selects the value if it is not already selected; un-selects the
   * value if it is already selected).
   *
   * Does not trigger a query automatically.
   * @param value Can be a {@link FacetValue} or a string.
   */
  public toggleSelectValue(value: FacetValue): void;
  public toggleSelectValue(value: string): void;
  public toggleSelectValue(value: any): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Toggle select facet value', this.facetValuesList.toggleSelect(value));
    this.facetValueHasChanged();
  }

  /**
   * Toggles the exclusion state of a single value (excludes the value if it is not already excluded; un-excludes the
   * value if it is already excluded).
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a {@link FacetValue} or a string.
   */
  public toggleExcludeValue(value: FacetValue): void;
  public toggleExcludeValue(value: string): void;
  public toggleExcludeValue(value: any): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Toggle exclude facet value', this.facetValuesList.toggleExclude(value));
    this.facetValueHasChanged();
  }

  /**
   * Returns the currently displayed values as a string array.
   *
   * @returns {any[]} The currently displayed values.
   */
  public getDisplayedValues(): string[] {
    return _.pluck(this.getDisplayedFacetValues(), 'value');
  }

  /**
   * Returns the currently displayed values as an array of {@link FacetValue}.
   *
   * @returns {T[]} The currently displayed values.
   */
  public getDisplayedFacetValues(): FacetValue[] {
    this.ensureDom();
    let displayed = this.facetValuesList.getAllCurrentlyDisplayed();
    return _.map(displayed, (value: ValueElement) => {
      return value.facetValue;
    });
  }

  /**
   * Returns the currently selected values as an array of string.
   * @returns {string[]} The currently selected values.
   */
  public getSelectedValues(): string[] {
    this.ensureDom();
    return _.map(this.values.getSelected(), (value: FacetValue) => value.value);
  }

  /**
   * Returns the currently excluded values as an array of string.
   * @returns {string[]} The currently excluded values.
   */
  public getExcludedValues(): string[] {
    this.ensureDom();
    return _.map(this.values.getExcluded(), (value: FacetValue) => value.value);
  }

  /**
   * Resets the Facet by un-selecting all values, une-xcluding all values, and redrawing the Facet.
   */
  public reset(): void {
    this.ensureDom();
    this.values.reset();
    this.rebuildValueElements();
    this.updateAppearanceDependingOnState();
    this.updateQueryStateModel();
  }

  /**
   * Switches the Facet to `AND` mode.
   *
   * See {@link Facet.options.useAnd} and {@link Facet.options.enableTogglingOperator}.
   */
  public switchToAnd(): void {
    this.ensureDom();
    this.logger.info('Switching to AND');
    this.facetHeader.switchToAnd();
  }

  /**
   * Switches the Facet to `OR` mode.
   *
   * See {@link Facet.options.useAnd} and {@link Facet.options.enableTogglingOperator}.
   */
  public switchToOr(): void {
    this.ensureDom();
    this.logger.info('Switching to OR');
    this.facetHeader.switchToOr();
  }

  /**
   * Returns the endpoint for the Facet.
   * @returns {ISearchEndpoint} The endpoint for the Facet.
   */
  public getEndpoint(): ISearchEndpoint {
    return this.queryController.getEndpoint();
  }

  /**
   * Changes the sort parameter for the Facet.
   *
   * See {@link Facet.options.availableSorts} for the list of possible values.
   *
   * Also triggers a new query.
   *
   * @param criteria The new sort parameter for the Facet.
   */
  public updateSort(criteria: string): void {
    this.ensureDom();
    if (this.options.sortCriteria != criteria) {
      this.options.sortCriteria = criteria;
      this.triggerNewQuery();
    }
  }

  public unfadeInactiveValuesInMainList(): void {
    $$(this.element).removeClass('coveo-facet-fade');
  }

  public fadeInactiveValuesInMainList(delay: number): void {
    $$(this.element).addClass('coveo-facet-fade');
  }

  /**
   * Shows a waiting animation in the Facet header (a spinner).
   */
  public showWaitingAnimation() {
    this.ensureDom();
    if (!this.showingWaitAnimation) {
      // in old design : icon before the facet title needs to be hidden to show animation
      // new design : no need to hide this icon since it's not there
      if (!this.searchInterface.isNewDesign()) {
        $$(this.headerElement).find('.coveo-icon').style.display = 'none';
        $$(this.headerElement).find('.coveo-facet-header-wait-animation').style.display = '';
      } else {
        $$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'visible';
      }
      this.showingWaitAnimation = true;
    }
  }

  /**
   * Hides the waiting animation in the Facet header.
   */
  public hideWaitingAnimation(): void {
    this.ensureDom();
    if (this.showingWaitAnimation) {
      $$(this.headerElement).find('.coveo-icon').style.display = '';
      if (!this.searchInterface.isNewDesign()) {
        $$(this.headerElement).find('.coveo-facet-header-wait-animation').style.display = 'none';
      } else {
        $$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'hidden';
      }
      this.showingWaitAnimation = false;
    }
  }

  public processFacetSearchAllResultsSelected(facetValues: FacetValue[]): void {
    let valuesForAnalytics = [];
    _.each(facetValues, (facetValue) => {
      this.ensureFacetValueIsInList(facetValue);
      valuesForAnalytics.push(facetValue.value);
    });
    // Calculate the correct number of values from the current selected/excluded values (those will stay no matter what next rendering)
    // add the new one that will be selected (and are not already selected in the facet)
    // The minimum number of values is the number of values set in the option
    let valuesThatStays = this.values.getSelected().concat(this.values.getExcluded());
    this.numberOfValues = valuesThatStays.length + _.difference(valuesThatStays, facetValues).length;
    this.numberOfValues = Math.max(this.numberOfValues, this.options.numberOfValues);
    // Then, we set current page as the last "full" page (math.floor)
    // This is so there is no additional values displayed requested to fill the current page
    // Also, when the user hit more, it will request the current page and fill it with more values
    this.currentPage = Math.floor((this.numberOfValues - this.options.numberOfValues) / this.options.pageSize);

    this.updateQueryStateModel();
    this.triggerNewQuery(() => this.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.facetSelectAll, {
      facetId: this.options.id,
      facetTitle: this.options.title
    }));
  }

  public pinFacetPosition() {
    if (this.options.preservePosition) {
      this.pinnedViewportPosition = this.element.getBoundingClientRect().top;
    }
  }

  /**
   * Returns the configured caption for the given {@link FacetValue}.
   *
   * @param facetValue The FacetValue whose caption the method should return.
   */
  public getValueCaption(facetValue: IIndexFieldValue): string;
  public getValueCaption(facetValue: FacetValue): string;
  public getValueCaption(facetValue: any): string {
    Assert.exists(facetValue);
    let lookupValue = facetValue.lookupValue || facetValue.value;
    let ret = lookupValue;
    ret = FacetUtils.tryToGetTranslatedCaption(<string>this.options.field, lookupValue);

    if (Utils.exists(this.options.valueCaption)) {
      if (typeof this.options.valueCaption == 'object') {
        ret = this.options.valueCaption[lookupValue] || ret;
      }
      if (typeof this.options.valueCaption == 'function') {
        this.values.get(lookupValue);
        ret = this.options.valueCaption.call(this, this.facetValuesList.get(lookupValue).facetValue);
      }
    }
    return ret;
  }

  /**
   * Shows the next page of results in the Facet.
   *
   * Triggers a query if needed, or displays the already available values.
   */
  public showMore() {
    this.currentPage++;
    this.updateNumberOfValues();
    if (this.nbAvailableValues >= this.numberOfValues || !this.canFetchMore) {
      this.rebuildValueElements();
    } else {
      this.triggerMoreQuery();
    }
  }

  /**
   * Shows less elements in the Facet (up to the original number of values).
   *
   * See {@link Facet.options.numberOfValues}.
   */
  public showLess() {
    $$(this.lessElement).removeClass('coveo-active');
    this.currentPage = 0;
    this.updateNumberOfValues();
    $$(this.moreElement).addClass('coveo-active');
    this.values.sortValuesDependingOnStatus(this.numberOfValues);
    this.rebuildValueElements();
  }

  /**
   * Collapses the Facet.
   */
  public collapse() {
    this.ensureDom();
    if (this.facetHeader) {
      this.facetHeader.collapseFacet();
    }
  }

  /**
   * Expands the facet.
   */
  public expand() {
    this.ensureDom();
    if (this.facetHeader) {
      this.facetHeader.expandFacet();
    }
  }

  public triggerNewQuery(beforeExecuteQuery?: () => void) {
    if (!beforeExecuteQuery) {
      this.queryController.executeQuery({ ignoreWarningSearchEvent: true });
    } else {
      this.queryController.executeQuery({ beforeExecuteQuery: beforeExecuteQuery });
    }
    this.showWaitingAnimation();
  }

  protected handleDeferredQuerySuccess(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    this.unfadeInactiveValuesInMainList();
    this.hideWaitingAnimation();
    this.updateVisibilityBasedOnDependsOn();
    let groupByResult = data.results.groupByResults[this.facetQueryController.lastGroupByRequestIndex];
    this.facetQueryController.lastGroupByResult = groupByResult;
    if (!groupByResult) {
      this.keepDisplayedValuesNextTime = false;
    }
    this.processNewGroupByResults(groupByResult);
  }

  protected handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);

    if (this.values.hasSelectedOrExcludedValues()) {
      let element = new BreadcrumbValueList(this, this.values.getSelected().concat(this.values.getExcluded()), BreadcrumbValueElement).build();
      args.breadcrumbs.push({
        element: element
      });
    }
  }

  protected handlePopulateSearchAlerts(args: ISearchAlertsPopulateMessageEventArgs) {
    if (this.values.hasSelectedOrExcludedValues()) {
      let excludedValues = this.values.getExcluded();
      let selectedValues = this.values.getSelected();

      if (!_.isEmpty(excludedValues)) {
        args.text.push({
          value: new BreadcrumbValueList(this, excludedValues, BreadcrumbValueElement).buildAsString(),
          lineThrough: true
        });
      }

      if (!_.isEmpty(selectedValues)) {
        args.text.push({
          value: new BreadcrumbValueList(this, selectedValues, BreadcrumbValueElement).buildAsString(),
          lineThrough: false
        });
      }
    }
  }

  protected initFacetQueryController() {
    this.facetQueryController = new FacetQueryController(this);
  }

  protected initFacetValuesList() {
    this.facetValuesList = new FacetValuesList(this, FacetValueElement);
    this.element.appendChild(this.facetValuesList.build());
  }

  protected initFacetSearch() {
    this.facetSearch = new FacetSearch(this, FacetSearchValuesList, this.root);
    this.element.appendChild(this.facetSearch.build());
  }

  protected facetValueHasChanged() {
    this.updateQueryStateModel();
    this.rebuildValueElements();
    Defer.defer(() => {
      this.updateAppearanceDependingOnState();
    });
  }

  protected updateAppearanceDependingOnState() {
    $$(this.element).toggleClass('coveo-active', this.values.hasSelectedOrExcludedValues());
    $$(this.element).toggleClass('coveo-facet-empty', !this.isAnyValueCurrentlyDisplayed());
    if (this.searchInterface.isNewDesign()) {
      $$(this.facetHeader.eraserElement).toggleClass('coveo-facet-header-eraser-visible', this.values.hasSelectedOrExcludedValues());
    } else {
      $$(this.facetHeader.eraserElement).toggle(this.values.hasSelectedOrExcludedValues());
    }

  }

  protected initQueryEvents() {
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.handleDuringQuery());
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
  }

  protected initQueryStateEvents() {
    this.includedAttributeId = QueryStateModel.getFacetId(this.options.id);
    this.excludedAttributeId = QueryStateModel.getFacetId(this.options.id, false);
    this.operatorAttributeId = QueryStateModel.getFacetOperator(this.options.id);
    this.lookupValueAttributeId = QueryStateModel.getFacetLookupValue(this.options.id);

    this.queryStateModel.registerNewAttribute(this.includedAttributeId, []);
    this.queryStateModel.registerNewAttribute(this.excludedAttributeId, []);
    this.queryStateModel.registerNewAttribute(this.operatorAttributeId, '');
    this.queryStateModel.registerNewAttribute(this.lookupValueAttributeId, {});

    this.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, (args: IAttributesChangedEventArg) => this.handleQueryStateChanged(args));
  }

  protected initComponentStateEvents() {
    this.componentStateId = QueryStateModel.getFacetId(this.options.id);
    this.componentStateModel.registerComponent(this.componentStateId, this);
  }

  protected initOmniboxEvents() {
    if (this.options.includeInOmnibox) {
      this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
    }
  }

  protected initBreadCrumbEvents() {
    if (this.options.includeInBreadcrumb) {
      this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
      this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, (args: IClearBreadcrumbEventArgs) => this.handleClearBreadcrumb());
    }
  }

  protected initSearchAlertEvents() {
    this.bind.onRootElement(SearchAlertsEvents.searchAlertsPopulateMessage, (args: ISearchAlertsPopulateMessageEventArgs) => this.handlePopulateSearchAlerts(args));
  }

  protected handleOmniboxWithStaticValue(eventArg: IPopulateOmniboxEventArgs) {
    let regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');
    let match = _.first(_.filter(this.getDisplayedValues(), (displayedValue: string) => {
      let value = this.getValueCaption(this.facetValuesList.get(displayedValue).facetValue);
      return regex.test(value);
    }), this.options.numberOfValuesInOmnibox);
    let facetValues = _.map(match, (gotAMatch: string) => {
      return this.facetValuesList.get(gotAMatch).facetValue;
    });
    let element = new OmniboxValuesList(this, facetValues, eventArg, OmniboxValueElement).build();
    eventArg.rows.push({
      element: element,
      zIndex: this.omniboxZIndex
    });
  }

  protected processNewGroupByResults(groupByResult: IGroupByResult) {
    this.logger.trace('Displaying group by results', groupByResult);
    if (groupByResult != undefined && groupByResult.values != undefined) {
      this.nbAvailableValues = groupByResult.values.length;
    }
    let newFacetValues = new FacetValues(groupByResult);
    this.updateValues(newFacetValues);
    this.canFetchMore = this.numberOfValues < this.nbAvailableValues;

    if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd && this.options.isMultiValueField) {
      this.triggerUpdateDeltaQuery(_.filter(this.values.getAll(), (facetValue: FacetValue) => {
        return !facetValue.selected && !facetValue.excluded;
      }));
    } else if (this.values.getSelected().length > 0 && !this.options.useAnd) {
      this.values.updateDeltaWithFilteredFacetValues(new FacetValues());
    }
    if (!this.values.hasSelectedOrExcludedValues() || this.options.useAnd || !this.options.isMultiValueField) {
      this.rebuildValueElements();
      this.updateAppearanceDependingOnState();
      this.ensurePinnedFacetHasntMoved();
    }
    this.keepDisplayedValuesNextTime = false;
  }

  protected updateQueryStateModel() {
    this.listenToQueryStateChange = false;
    this.updateExcludedQueryStateModel();
    this.updateIncludedQueryStateModel();
    this.facetHeader.updateOperatorQueryStateModel();
    this.updateLookupValueQueryStateModel();
    this.listenToQueryStateChange = true;
  }

  protected rebuildValueElements() {
    this.updateNumberOfValues();
    this.facetValuesList.rebuild(this.numberOfValues);
    if (this.searchInterface.isNewDesign()) {
      if (this.shouldRenderMoreLess()) {
        this.updateMoreLess();
        if (this.shouldRenderFacetSearch()) {
          this.updateSearchInNewDesign(this.nbAvailableValues > this.numberOfValues);
        }
      } else if (this.shouldRenderFacetSearch()) {
        this.updateSearchInNewDesign();
      }
    } else {
      if (this.shouldRenderMoreLess()) {
        this.updateMoreLess();
      }
    }
  }

  protected updateSearchInNewDesign(moreValuesAvailable = true) {
    if (this.searchInterface.isNewDesign() && moreValuesAvailable) {
      let renderer = new ValueElementRenderer(this, FacetValue.create(l('Search')));
      let searchButton = renderer.build().withNo([renderer.excludeIcon, renderer.icon]);
      $$(searchButton.listItem).addClass('coveo-facet-search-button');
      searchButton.stylishCheckbox.removeAttribute('tabindex');

      // Mobile do not like label. Use click event
      if (DeviceUtils.isMobileDevice()) {
        $$(searchButton.label).on('click', (e: Event) => {
          if (searchButton.checkbox.getAttribute('checked')) {
            searchButton.checkbox.removeAttribute('checked');
          } else {
            searchButton.checkbox.setAttribute('checked', 'checked');
          }
          $$(searchButton.checkbox).trigger('change');
          e.stopPropagation();
          e.preventDefault();
        });
      }

      $$(searchButton.checkbox).on('change', () => {
        $$(this.element).addClass('coveo-facet-searching');
        this.facetSearch.focus();
      });
      this.facetValuesList.valueContainer.appendChild(searchButton.listItem);
    }
  }

  protected updateMoreLess(lessElementIsShown = this.getMinimumNumberOfValuesToDisplay() < this.numberOfValues, moreValuesAvailable = this.nbAvailableValues > this.numberOfValues) {
    if (lessElementIsShown) {
      $$(this.lessElement).addClass('coveo-active');
    } else {
      $$(this.lessElement).removeClass('coveo-active');
    }

    if (moreValuesAvailable) {
      $$(this.moreElement).addClass('coveo-active');
    } else {
      $$(this.moreElement).removeClass('coveo-active');
    }

    if (lessElementIsShown || moreValuesAvailable) {
      $$(this.footerElement).removeClass('coveo-facet-empty');
    } else {
      $$(this.footerElement).addClass('coveo-facet-empty');
    }
  }

  protected handleClickMore(): void {
    this.showMore();
  }

  protected handleClickLess() {
    this.showLess();
  }

  private handleNuke() {
    window.removeEventListener('resize', this.resize);
  }

  private checkForComputedFieldAndSort() {
    if (this.options.sortCriteria.toLowerCase().indexOf('computedfield') != -1 && Utils.isNullOrUndefined(this.options.computedField)) {
      this.logger.warn('Sort criteria is specified as ComputedField, but the facet uses no computed field. Facet will always be empty !', this);
    }
  }

  private checkForValueCaptionType() {
    if (this.options.valueCaption && typeof this.options.valueCaption == 'function') {
      this.options.enableFacetSearch = false;
      this.options.includeInOmnibox = false;
      this.logger.warn('Using a function as valueCaption is now deprecated. Use a json key value pair instead. Facet search and omnibox has been disabled for this facet', this);
    }
  }

  private checkForCustomSort() {
    if (this.options.customSort != undefined && !_.contains(this.options.availableSorts, 'custom')) {
      this.options.availableSorts.unshift('custom');
    }
    if (this.options.availableSorts[0] == 'custom') {
      this.options.sortCriteria = 'nosort';
    }
  }

  private initBottomAndTopSpacer() {
    let bottomSpace = $$(this.options.paddingContainer).find('.coveo-bottomSpace');
    let topSpace = $$(this.options.paddingContainer).find('.coveo-topSpace');
    if (this.options.preservePosition) {
      $$(this.options.paddingContainer).on('mouseleave', () => this.unpinFacetPosition());

      this.pinnedTopSpace = topSpace;
      this.pinnedBottomSpace = bottomSpace;

      if (!this.pinnedTopSpace) {
        this.pinnedTopSpace = document.createElement('div');
        $$(this.pinnedTopSpace).addClass('coveo-topSpace');
        $$(this.pinnedTopSpace).insertBefore(<HTMLElement>this.options.paddingContainer.firstChild);
      }
      if (!this.pinnedBottomSpace) {
        this.pinnedBottomSpace = document.createElement('div');
        $$(this.pinnedBottomSpace).addClass('coveo-bottomSpace');
        this.options.paddingContainer.appendChild(this.pinnedBottomSpace);
      }
    }
  }

  private updateIncludedQueryStateModel() {
    let selectedValues: IQueryStateIncludedAttribute = {
      included: this.getSelectedValues(),
      title: this.includedAttributeId
    };
    this.queryStateModel.set(this.includedAttributeId, selectedValues.included);
  }

  private updateExcludedQueryStateModel() {
    let excludedValues: IQueryStateExcludedAttribute = {
      title: this.excludedAttributeId,
      excluded: this.getExcludedValues()
    };

    this.queryStateModel.set(this.excludedAttributeId, excludedValues.excluded);
  }

  private updateLookupValueQueryStateModel() {
    if (this.options.lookupField) {
      let valueToSet = {};
      _.each(this.values.getSelected().concat(this.values.getExcluded()), (value) => {
        valueToSet[value.value] = value.lookupValue;
      });
      this.queryStateModel.set(this.lookupValueAttributeId, valueToSet);
    }
  }

  private handleQueryStateChangedOperator(operator: string) {
    if (operator == 'and') {
      this.switchToAnd();
    } else if (operator == 'or') {
      this.switchToOr();
    }
  }

  private handleQueryStateChangedIncluded(includedChanged) {
    let toUnSelect = _.difference(this.getSelectedValues(), includedChanged);
    if (Utils.isNonEmptyArray(toUnSelect)) {
      this.deselectMultipleValues(toUnSelect);
    }
    if (!Utils.arrayEqual(this.getSelectedValues(), includedChanged, false)) {
      this.selectMultipleValues(includedChanged);
    }
  }

  private handleQueryStateChangedExcluded(excludedChanged) {
    let toUnExclude = _.difference(this.getExcludedValues(), excludedChanged);
    if (Utils.isNonEmptyArray(toUnExclude)) {
      this.unexcludeMultipleValues(toUnExclude);
    }
    if (!Utils.arrayEqual(this.getExcludedValues(), excludedChanged, false)) {
      this.excludeMultipleValues(excludedChanged);
    }
  }

  private handleLookupvalueChanged(lookupFieldChanged: { [value: string]: string }) {
    _.each(lookupFieldChanged, (lookupvalue, value) => {
      this.facetValuesList.get(decodeURIComponent(value)).facetValue.lookupValue = decodeURIComponent(lookupvalue);
    });
  }

  private handleQueryStateChanged(data: IAttributesChangedEventArg) {
    Assert.exists(data);
    this.ensureDom();

    let queryStateAttributes = data.attributes;
    let includedChanged = queryStateAttributes[this.includedAttributeId];
    let excludedChanged = queryStateAttributes[this.excludedAttributeId];
    let operator = queryStateAttributes[this.operatorAttributeId];
    let lookupValueChanged = queryStateAttributes[this.lookupValueAttributeId];

    if (this.listenToQueryStateChange) {
      if (!Utils.isNullOrEmptyString(operator)) {
        this.handleQueryStateChangedOperator(operator);
      }
      if (!Utils.isNullOrUndefined(includedChanged)) {
        this.handleQueryStateChangedIncluded(includedChanged);
      }
      if (!Utils.isNullOrUndefined(excludedChanged)) {
        this.handleQueryStateChangedExcluded(excludedChanged);
      }
      if (!Utils.isNullOrUndefined(lookupValueChanged)) {
        this.handleLookupvalueChanged(lookupValueChanged);
      }
    }
  }

  private handlePopulateOmnibox(data: IPopulateOmniboxEventArgs) {
    Assert.exists(data);
    Assert.exists(data.completeQueryExpression);

    // The omnibox calls can come in before a first query was executed (atypical, but
    // if no query is auto-triggered on initialization). To ensure that we've got the
    // proper filters, we ensure that at least a dumbshow query builder run occured
    // before proceeding.
    this.queryController.ensureCreatedQueryBuilder();

    if (this.canFetchMore) {
      this.handleOmniboxWithSearchInFacet(data);
    } else {
      this.handleOmniboxWithStaticValue(data);
    }
  }

  private handleOmniboxWithSearchInFacet(eventArg: IPopulateOmniboxEventArgs) {
    let regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');

    let promise = new Promise<IOmniboxDataRow>((resolve, reject) => {
      let searchParameters = new FacetSearchParameters(this);
      searchParameters.setValueToSearch(eventArg.completeQueryExpression.word);
      searchParameters.nbResults = this.options.numberOfValuesInOmnibox;
      this.facetQueryController.search(searchParameters).then((fieldValues) => {
        let facetValues = _.map(_.filter(fieldValues, (fieldValue: IIndexFieldValue) => {
          return regex.test(fieldValue.lookupValue);
        }), (fieldValue) => {
          return this.values.get(fieldValue.lookupValue) || FacetValue.create(fieldValue);
        });
        let element = new OmniboxValuesList(this, facetValues, eventArg, OmniboxValueElement).build();
        resolve({
          element: element,
          zIndex: this.omniboxZIndex
        });
      }).catch(() => {
        resolve({ element: undefined });
      });
    });
    eventArg.rows.push({ deferred: promise });
  }

  private handleDuringQuery() {
    this.ensureDom();
    if (!this.keepDisplayedValuesNextTime) {
      this.fadeInactiveValuesInMainList(this.options.facetSearchDelay);
    }
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);

    this.facetQueryController.prepareForNewQuery();
    if (this.values.hasSelectedOrExcludedValues()) {
      let expression = this.facetQueryController.computeOurFilterExpression();
      this.logger.trace('Putting filter in query', expression);
      data.queryBuilder.advancedExpression.add(expression);
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    let queryBuilder = data.queryBuilder;
    this.facetQueryController.putGroupByIntoQueryBuilder(queryBuilder);
  }

  private handleClearBreadcrumb() {
    this.reset();
  }

  private updateValues(facetValues: FacetValues) {
    Assert.exists(facetValues);
    if (this.keepDisplayedValuesNextTime) {
      this.values.updateCountsFromNewValues(facetValues);
    } else {
      facetValues.importActiveValuesFromOtherList(this.values);
      facetValues.sortValuesDependingOnStatus(this.numberOfValues);
      this.values = facetValues;
    }

    this.updateNumberOfValues();
  }

  private ensureFacetValueIsInList(facetValue: FacetValue) {
    Assert.exists(facetValue);
    if (!this.values.contains(facetValue.value)) {
      this.values.add(facetValue);
    }
  }

  private isAnyValueCurrentlyDisplayed(): boolean {
    return !this.values.isEmpty();
  }

  private buildFacetContent() {
    this.headerElement = this.buildHeader();
    this.element.appendChild(this.headerElement);
    this.initFacetValuesList();
    if (this.shouldRenderFacetSearch()) {
      this.initFacetSearch();
    }
    if (this.shouldRenderMoreLess()) {
      this.moreElement = this.buildMore();
      this.lessElement = this.buildLess();
    }
    this.footerElement = this.buildFooter();
    this.element.appendChild(this.footerElement);
    if (this.searchInterface.isNewDesign() && this.lessElement && this.moreElement) {
      this.footerElement.appendChild(this.lessElement);
      this.footerElement.appendChild(this.moreElement);
    } else if (this.moreElement && this.lessElement) {
      this.footerElement.appendChild(this.moreElement);
      this.footerElement.appendChild(this.lessElement);
    }
  }

  private buildHeader() {
    let icon = this.options.headerIcon;
    if (this.searchInterface.isNewDesign() && this.options.headerIcon == this.options.field) {
      icon = undefined;
    }
    this.facetHeader = new FacetHeader({
      facetElement: this.element,
      title: this.options.title,
      icon: icon,
      field: <string>this.options.field,
      enableClearElement: true,
      enableCollapseElement: this.options.enableCollapse,
      facet: this,
      settingsKlass: this.options.enableSettings ? FacetSettings : undefined,
      sortKlass: FacetSort,
      availableSorts: this.options.availableSorts,
      isNewDesign: this.getBindings().searchInterface.isNewDesign()
    });
    let built = this.facetHeader.build();
    this.facetSettings = this.facetHeader.settings;
    this.facetSort = this.facetHeader.sort;
    return built;
  }

  private unpinFacetPosition() {
    if (this.shouldFacetUnpin() && this.options.preservePosition) {
      $$(this.pinnedTopSpace).addClass('coveo-with-animation');
      $$(this.pinnedBottomSpace).addClass('coveo-with-animation');
      this.pinnedTopSpace.style.height = '0px';
      this.pinnedBottomSpace.style.height = '0px';
    }
    this.unpinnedViewportPosition = undefined;
    this.pinnedViewportPosition = undefined;
  }

  private isFacetPinned(): boolean {
    return Utils.exists(this.pinnedViewportPosition);
  }

  private shouldFacetUnpin(): boolean {
    return Utils.exists(this.unpinnedViewportPosition);
  }

  private ensurePinnedFacetHasntMoved(): void {
    if (this.isFacetPinned()) {
      Assert.exists(this.pinnedViewportPosition);
      $$(this.pinnedTopSpace).removeClass('coveo-with-animation');
      $$(this.pinnedBottomSpace).removeClass('coveo-with-animation');
      this.pinnedTopSpace.style.height = '0px';
      this.pinnedBottomSpace.style.height = '0px';

      // Under firefox scrolling the body doesn't work, but window does
      // on all browser, so we substitute those here when needed.
      let elementToScroll: any = this.options.scrollContainer == document.body ? window : this.options.scrollContainer;
      let currentViewportPosition = this.element.getBoundingClientRect().top;
      let offset = currentViewportPosition - this.pinnedViewportPosition;
      let scrollToOffset = () => {
        if (elementToScroll instanceof Window) {
          window.scrollTo(0, window.scrollY + offset);
        } else {
          (<HTMLElement>elementToScroll).scrollTop = elementToScroll.scrollTop + offset;
        }
      };
      // First try to adjust position by scrolling the page
      scrollToOffset();
      currentViewportPosition = this.element.getBoundingClientRect().top;
      offset = currentViewportPosition - this.pinnedViewportPosition;

      // If scrolling has worked (offset == 0), we're good to go, nothing to do anymore.
      // Otherwise try other voodoo magic.
      if (offset < 0) {
        // This means the facet element is scrolled up in the viewport,
        // scroll it down by adding space in the top container
        this.pinnedTopSpace.style.height = (offset * -1) + 'px';
      } else {
        // Here, this means the facet element is scrolled down in the viewport,
        // and there is not enough scroll space in the page / window to scroll far enough
        // we need to add space at the bottom so that we can finally scroll there.
        _.defer(() => {
          let heightBottom = 0;
          let attempts = 0;
          while (offset > 0 && attempts++ < 100) {
            heightBottom += 100;
            this.pinnedBottomSpace.style.height = heightBottom + 'px';
            currentViewportPosition = this.element.getBoundingClientRect().top;
            offset = currentViewportPosition - this.pinnedViewportPosition;
            scrollToOffset();
          }
        });
      }
      this.unpinnedViewportPosition = this.pinnedViewportPosition;
      this.pinnedViewportPosition = null;
    }
  }

  private buildFooter(): HTMLElement {
    return $$('div', { className: 'coveo-facet-footer' }).el;
  }

  private buildMore(): HTMLElement {
    let more: HTMLElement;
    if (this.searchInterface.isNewDesign()) {
      more = $$('div', { className: 'coveo-facet-more', tabindex: 0 },
        $$('span', { className: 'coveo-icon' })).el;
    } else {
      more = $$('a', { className: 'coveo-facet-more' }, l('More')).el;
    }
    const moreAction = () => this.handleClickMore();
    $$(more).on('click', moreAction);
    $$(more).on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, moreAction));
    return more;
  }

  private buildLess(): HTMLElement {
    let less: HTMLElement;
    if (this.searchInterface.isNewDesign()) {
      less = $$('div', { className: 'coveo-facet-less', tabindex: 0 },
        $$('span', { className: 'coveo-icon' })).el;
    } else {
      less = $$('a', { className: 'coveo-facet-less' }, l('Less')).el;
    }
    const lessAction = () => this.handleClickLess();
    $$(less).on('click', lessAction);
    $$(less).on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, lessAction));
    return less;
  }

  private triggerMoreQuery() {
    this.logger.info('Triggering new facet more query');
    this.showWaitingAnimation();
    // fetch 1 more value than we need, so we can see if there is more value to fetch still or if we have reached
    // the end of the availables values
    this.facetQueryController.fetchMore(this.numberOfValues + 1).then((queryResults?) => {
      let facetValues = new FacetValues(queryResults.groupByResults[0]);

      facetValues.importActiveValuesFromOtherList(this.values);
      facetValues.sortValuesDependingOnStatus(this.numberOfValues);
      this.values = facetValues;

      this.nbAvailableValues = this.values.size();

      this.updateNumberOfValues();
      this.canFetchMore = this.numberOfValues < this.nbAvailableValues;

      if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd && this.options.isMultiValueField) {
        this.triggerUpdateDeltaQuery(_.filter(this.values.getAll(), (facetValue: FacetValue) => !facetValue.selected && !facetValue.excluded));
      } else {
        if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd) {
          this.values.updateDeltaWithFilteredFacetValues(new FacetValues());
          this.hideWaitingAnimation();
        } else {
          this.hideWaitingAnimation();
        }

        this.rebuildValueElements();
      }
    }).catch(() => this.hideWaitingAnimation());
  }

  protected triggerUpdateDeltaQuery(facetValues: FacetValue[]): void {
    this.showWaitingAnimation();
    this.facetQueryController.searchInFacetToUpdateDelta(facetValues).then((queryResults?) => {
      let values: FacetValues = new FacetValues();
      _.each(queryResults.groupByResults, (groupByResult: IGroupByResult) => {
        _.each(groupByResult.values, (groupByValue: IGroupByValue) => {
          if (!values.contains(groupByValue.value)) {
            values.add(FacetValue.createFromGroupByValue(groupByValue));
          }
        });
      });
      this.values.updateDeltaWithFilteredFacetValues(values);
      this.rebuildValueElements();
      this.hideWaitingAnimation();
    });
  }

  protected updateNumberOfValues() {
    if (this.currentPage <= 0) {
      // We're on the first page, let's reset the number of values to a minimum.
      this.currentPage = 0;
      this.numberOfValues = 0;
    } else {
      // Calculate the number of value with the current page.
      this.numberOfValues = this.options.numberOfValues + (this.currentPage * this.options.pageSize);
    }

    // Make sure we have at least the absolute minimum of value to display.
    this.numberOfValues = Math.max(this.numberOfValues, this.getMinimumNumberOfValuesToDisplay());
  }

  private getMinimumNumberOfValuesToDisplay() {
    // The min value is the number of used values.
    let minValue = this.values.getExcluded().length + this.values.getSelected().length;

    // When using a custom sort, we have to show all values between the selected ones.
    // Thus, we must find the last selected value after a reorder and use that value as the number of value.
    if (this.options.customSort != null && this.facetSort != null && this.options.customSort.length > 0) {
      let lastSelectedValueIndex = -1;
      new FacetValuesOrder(this, this.facetSort).reorderValues(this.values.getAll()).forEach((facetValue, index) => {
        if (facetValue.selected) {
          lastSelectedValueIndex = index;
        }
      });
      minValue = lastSelectedValueIndex + 1;
    }
    return Math.max(minValue, this.options.numberOfValues);
  }

  private updateVisibilityBasedOnDependsOn() {
    if (Utils.isNonEmptyString(this.options.dependsOn)) {
      $$(this.element).toggleClass('coveo-facet-dependent', !this.doesParentFacetHasSelectedValue() && !this.values.hasSelectedOrExcludedValues());
    }
  }

  private doesParentFacetHasSelectedValue(): boolean {
    let id = QueryStateModel.getFacetId(this.options.dependsOn);
    let values = this.queryStateModel.get(id);
    return values != null && values.length != 0;
  }

  private shouldRenderFacetSearch() {
    return this.options.enableFacetSearch;
  }

  private shouldRenderMoreLess() {
    return this.options.enableMoreLess;
  }

  public debugInfo() {
    let info: any = {};
    info[this['constructor']['ID']] = {
      component: this,
      groupByRequest: this.facetQueryController.lastGroupByRequest,
      groupByResult: this.facetQueryController.lastGroupByResult
    };
    return info;
  }
}
Initialization.registerAutoCreateComponent(Facet);
