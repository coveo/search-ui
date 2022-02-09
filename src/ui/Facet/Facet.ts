import 'styling/_Facet';
import 'styling/_FacetFooter';
import * as _ from 'underscore';
import { FacetQueryController } from '../../controllers/FacetQueryController';
import { BreadcrumbEvents, IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { IPopulateOmniboxEventArgs, OmniboxEvents } from '../../events/OmniboxEvents';
import { IDoneBuildingQueryEventArgs, INewQueryEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { ISearchAlertsPopulateMessageEventArgs, SearchAlertsEvents } from '../../events/SearchAlertEvents';
import { exportGlobally } from '../../GlobalExports';
import { Assert } from '../../misc/Assert';
import { Defer } from '../../misc/Defer';
import { IAttributesChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { IQueryStateExcludedAttribute, IQueryStateIncludedAttribute, QueryStateModel } from '../../models/QueryStateModel';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { IStringMap } from '../../rest/GenericParam';
import { IGroupByResult } from '../../rest/GroupByResult';
import { IGroupByValue } from '../../rest/GroupByValue';
import { IQueryResults } from '../../rest/QueryResults';
import { ISearchEndpoint } from '../../rest/SearchEndpointInterface';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { ComponentsTypes } from '../../utils/ComponentsTypes';
import {
  DependsOnManager,
  IDependentFacet,
  IDependsOnCompatibleFacetOptions,
  IDependentFacetCondition
} from '../../utils/DependsOnManager';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { $$, Win } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import {
  analyticsActionCauseList,
  IAnalyticsActionCause,
  IAnalyticsFacetMeta,
  IAnalyticsFacetSortMeta
} from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption, IQueryExpression } from '../Base/IComponentOptions';
import { Initialization } from '../Base/Initialization';
import { IOmniboxDataRow } from '../Omnibox/OmniboxInterface';
import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { ResponsiveFacetOptions } from '../ResponsiveComponents/ResponsiveFacetOptions';
import { ResponsiveFacets } from '../ResponsiveComponents/ResponsiveFacets';
import { BreadcrumbValueElement } from './BreadcrumbValueElement';
import { BreadcrumbValueList } from './BreadcrumbValuesList';
import { FacetHeader } from './FacetHeader';
import { FacetSearch } from './FacetSearch';
import { FacetSearchParameters } from './FacetSearchParameters';
import { FacetSearchValuesList } from './FacetSearchValuesList';
import { FacetSettings } from './FacetSettings';
import { FacetSort } from './FacetSort';
import { FacetSortCriterion } from './FacetSortCriterion';
import { FacetUtils } from './FacetUtils';
import { FacetValueElement } from './FacetValueElement';
import { FacetValue } from './FacetValue';
import { FacetValues, ISortFacetValuesOptions } from './FacetValues';
import { FacetValuesList } from './FacetValuesList';
import { FacetValuesOrder } from './FacetValuesOrder';
import { OmniboxValueElement } from './OmniboxValueElement';
import { OmniboxValuesList } from './OmniboxValuesList';
import { ValueElement } from './ValueElement';
import { ValueElementRenderer } from './ValueElementRenderer';
import { IFieldValueCompatibleFacet } from '../FieldValue/IFieldValueCompatibleFacet';
import { IQueryOptions } from '../../controllers/QueryController';
import { ResponsiveComponentsUtils } from '../ResponsiveComponents/ResponsiveComponentsUtils';

type ComputedFieldOperation = 'sum' | 'average' | 'minimum' | 'maximum';
type ComputedFieldFormat = 'c0' | 'n0' | 'n2';

export interface IFacetOptions extends IResponsiveComponentOptions, IDependsOnCompatibleFacetOptions {
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
  additionalFilter?: IQueryExpression;
  useWildcardsInFacetSearch?: boolean;
}

/**
 * The `Facet` component displays a *facet* of the results for the current query. A facet is a list of values for a
 * certain field occurring in the results, ordered using a configurable criteria (e.g., number of occurrences).
 *
 * The list of values is obtained using a [`GroupByRequest`]{@link IGroupByRequest} operation performed at the same time
 * as the main query.
 *
 * The `Facet` component allows the end user to drill down inside a result set by restricting the result to certain
 * field values. It also allows filtering out values from the facet itself, and can provide a search box to look for
 * specific values inside larger sets.
 *
 * This is probably the most complex component in the Coveo JavaScript Search Framework and as such, it allows for many
 * configuration options.
 *
 * See also the [`FacetRange`]{@link FacetRange} and [`TimespanFacet`]{@link TimespanFacet} components (which
 * extend this component), and the [`FacetSlider`]{@link FacetSlider} and [`CategoryFacet`]{@link CategoryFacet} components (which do not extend this
 * component, but are very similar).
 */
export class Facet extends Component implements IFieldValueCompatibleFacet {
  static ID = 'Facet';
  static omniboxIndex = 50;

  static doExport = () => {
    exportGlobally({
      Facet: Facet,
      FacetHeader: FacetHeader,
      FacetSearchValuesList: FacetSearchValuesList,
      FacetSettings: FacetSettings,
      FacetSort: FacetSort,
      FacetUtils: FacetUtils,
      FacetValueElement: FacetValueElement,
      FacetValue: FacetValue
    });
  };

  /**
   * The possible options for a facet
   * @componentOptions
   */
  static options: IFacetOptions = {
    /**
     * Specifies the title to display at the top of the facet.
     *
     * Default value is the localized string for `NoTitle`.
     */
    title: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('NoTitle'),
      section: 'CommonOptions',
      priority: 10
    }),
    /**
     * Specifies the index field whose values the facet should use.
     *
     * The field must of the `string` type.
     *
     * This requires the given field to be configured correctly in the index as a *Facet field* (see
     * [Add or Edit Fields](https://docs.coveo.com/en/1982/)).
     *
     * Specifying a value for this option is required for the `Facet` component to work.
     */
    field: ComponentOptions.buildFieldOption({ required: true, groupByField: true, section: 'CommonOptions' }),
    headerIcon: ComponentOptions.buildStringOption({
      deprecated: 'This option is exposed for legacy reasons, and the recommendation is to not use this option.'
    }),
    /**
     * Specifies a unique identifier for the facet. Among other things, this identifier serves the purpose of saving
     * the facet state in the URL hash.
     *
     * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
     * those two facets. This `id` must be unique among the facets.
     *
     * Non-word characters except - @ $ _ . + ! * ' ( ) , , ( `^a-zA-Z0-9-@$_.+!*'(),,]+` ) are automatically removed from the `id` value.
     *
     * Default value is the [`field`]{@link Facet.options.field} option value.
     */
    id: ComponentOptions.buildStringOption({
      postProcessing: (value: string, options: IFacetOptions) => {
        if (value) {
          // All non-word characters, except @ (the default character that specifies a field in the index)
          // and characters that do no need to be encoded in the URL : - @ $ _ . + ! * ' ( ) , ,
          const modified = value.replace(/[^a-zA-Z0-9-@$_.+!*'(),,]+/g, '');
          if (Utils.isNullOrEmptyString(modified)) {
            return options.field as string;
          }
          return modified;
        }
        return options.field as string;
      }
    }),
    /**
     * Specifies whether the facet [`field`]{@link Facet.options.field} is configured in the index as a multi-value
     * field (semicolon separated values such as `abc;def;ghi`).
     *
     * Default value is `false`.
     */
    isMultiValueField: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'CommonOptions' }),
    /**
     * Specifies the field whose values the Facet should display.
     *
     * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
     */
    lookupField: ComponentOptions.buildFieldOption({
      deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
    }),
    /**
     * Specifies whether to display the facet **Settings** menu.
     *
     * See also the [`enableSettingsFacetState`]{@link Facet.options.enableSettingsFacetState},
     * [`availableSorts`]{@link Facet.options.availableSorts}, and
     * [`enableCollapse`]{@link Facet.options.enableCollapse} options.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `true`.
     */
    enableSettings: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'Sorting', priority: 9 }),
    /**
     * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies whether the
     * **Save state** menu option is available in the facet **Settings** menu.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `false`.
     */
    enableSettingsFacetState: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableSettings' }),
    /**
     * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies the sort criteria
     * options to display in the facet **Settings** menu.
     *
     * Possible values are:
     * - `"occurrences"`
     * - `"score"`
     * - `"alphaascending"`
     * - `"alphadescending"`
     * - `"computedfieldascending"`
     * - `"computedfielddescending"`
     * - `"custom"`
     *
     * See {@link IGroupByRequest.sortCriteria} for a description of each possible value.
     *
     * **Notes:**
     * > * The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * > * Using value captions will disable alphabetical sorts (see the [valueCaption]{@link Facet.options.valueCaption} option).
     *
     * Default value is `occurrences,score,alphaascending,alphadescending`.
     */
    availableSorts: ComponentOptions.buildListOption<FacetSortCriterion>({
      defaultValue: ['occurrences', 'score', 'alphaascending', 'alphadescending'],
      section: 'Sorting',
      depend: 'enableSettings',
      values: [
        'occurrences',
        'score',
        'alphaascending',
        'alphadescending',
        'computedfieldascending',
        'computedfielddescending',
        'chisquare',
        'nosort'
      ]
    }),
    /**
     * Specifies the criteria to use to sort the facet values.
     *
     * See {@link IGroupByRequest.sortCriteria} for the list and description of possible values.
     *
     * Default value is the first sort criteria specified in the [`availableSorts`]{@link Facet.options.availableSorts}
     * option, or `occurrences` if no sort criteria is specified.
     */
    sortCriteria: ComponentOptions.buildStringOption<FacetSortCriterion>({
      postProcessing: (value, options: IFacetOptions) =>
        value || (options.availableSorts.length > 0 ? (options.availableSorts[0] as FacetSortCriterion) : 'occurrences'),
      section: 'Sorting'
    }),
    /**
     * Specifies a custom order by which to sort the facet values.
     *
     * **Example:**
     *
     * You could use this option to specify a logical order for support tickets, such as:
     * ```html
     * <div class="CoveoFacet" data-field="@ticketstatus" data-title="Ticket Status" data-tab="All" data-custom-sort="New,Opened,Feedback,Resolved"></div>
     * ```
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     */
    customSort: ComponentOptions.buildListOption<string>({ section: 'Sorting' }),
    /**
     * Specifies the maximum number of field values to display by default in the facet before the user
     * clicks the arrow to show more.
     *
     * See also the [`enableMoreLess`]{@link Facet.options.enableMoreLess} option.
     */
    numberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0, section: 'CommonOptions' }),
    /**
     * Specifies the *injection depth* to use for the [`GroupByRequest`]{@link IGroupByRequest} operation.
     *
     * The injection depth determines how many results to scan in the index to ensure that the facet lists all potential
     * facet values. Increasing this value enhances the accuracy of the listed values at the cost of performance.
     *
     * Default value is `1000`. Minimum value is `1000`.
     * @notSupportedIn salesforcefree
     *
     * @examples 1500
     */
    injectionDepth: ComponentOptions.buildNumberOption({ defaultValue: 1000, min: 1000 }),
    showIcon: ComponentOptions.buildBooleanOption({
      defaultValue: false,
      deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
    }),
    /**
     * Specifies whether to use the `AND` operator in the resulting filter when multiple values are selected in the
     * facet.
     *
     * Setting this option to `true` means that items must have all of the selected values to match the resulting
     * query.
     *
     * Default value is `false`, which means that the filter uses the `OR` operator. Thus, by default, items must
     * have at least one of the selected values to match the query.
     */
    useAnd: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),
    /**
     * Specifies whether to allow the user to toggle between the `OR` and `AND` modes in the facet.
     *
     * Setting this option to `true` displays an icon in the top right corner of the facet. The user can click this icon
     * to toggle between between the two modes.
     *
     * Default value is `false`.
     */
    enableTogglingOperator: ComponentOptions.buildBooleanOption({
      defaultValue: false,
      alias: 'allowTogglingOperator'
    }),
    /**
     * Specifies whether to display a search box at the bottom of the facet for searching among the available facet
     * [`field`]{@link Facet.options.field} values.
     *
     * See also the [`facetSearchDelay`]{@link Facet.options.facetSearchDelay},
     * [`facetSearchIgnoreAccents`]{@link Facet.options.facetSearchIgnoreAccents}, and
     * [`numberOfValuesInFacetSearch`]{@link Facet.options.numberOfValuesInFacetSearch} options.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `true`.
     */
    enableFacetSearch: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'FacetSearch', priority: 8 }),
    /**
     * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies the delay (in
     * milliseconds) before sending a search request to the server when the user starts typing in the facet search box.
     *
     * Specifying a smaller value makes results appear faster. However, chances of having to cancel many requests
     * sent to the server increase as the user keeps on typing new characters.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `100`. Minimum value is `0`.
     */
    facetSearchDelay: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0, depend: 'enableFacetSearch' }),
    /**
     * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies whether to ignore
     * accents in the facet search box.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `false`.
     */
    facetSearchIgnoreAccents: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFacetSearch' }),
    /**
     * If the [`enableFacetSearch`]{@link Facet.options.enableFacetSearch} option is `true`, specifies the number of v
     * alues to display in the facet search results popup.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `15`. Minimum value is `1`.
     */
    numberOfValuesInFacetSearch: ComponentOptions.buildNumberOption({ defaultValue: 15, min: 1, section: 'FacetSearch' }),
    /**
     * Specifies whether [wildcards]{@link AllowedValuesPatternType.wildcards} are used as the [allowedValuesPatternType]{@link IGroupByRequest.allowedValuesPatternType}
     * in the [groupBy]{@link IGroupByRequest} for the facet search.
     *
     * Enabling this option returns results that end with the entered value. For example, searching for `veo` would match with `Coveo`.
     *
     * **Note:**
     * > If you are experiencing slow facet search and/or timeouts when this option is set to `true`, consider enabling the **Use cache for nested queries**
     * > option on your facet [field]{@link Facet.options.field} in the Coveo Cloud Admninistration Console (see [Add or Edit Fields]{@link https://docs.coveo.com/en/1982/}).
     */
    useWildcardsInFacetSearch: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'FacetSearch' }),
    /**
     * Specifies whether the facet should push data to the [`Breadcrumb`]{@link Breadcrumb} component.
     *
     * See also the [`numberOfValuesInBreadcrumb`]{@link Facet.options.numberOfValuesInBreadcrumb} option.
     *
     * Default value is `true`.
     */
    includeInBreadcrumb: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * If the [`includeInBreadcrumb`]{@link Facet.options.includeInBreadcrumb} option is `true`, specifies the maximum
     * number of values that the facet should display in the [`Breadcrumb`]{@link Breadcrumb} before outputting a
     * **more...** button.
     *
     * Default value is `5` on a desktop computer and `3` on a mobile device. Minimum value is `0`.
     */
    numberOfValuesInBreadcrumb: ComponentOptions.buildNumberOption({
      defaultFunction: () => (DeviceUtils.isMobileDevice() ? 3 : 5),
      min: 0,
      depend: 'includeInBreadcrumb'
    }),
    /**
     * Specifies whether the Facet should push data to the {@link Omnibox} component.
     *
     * See also {@link Facet.options.numberOfValuesInOmnibox}.
     *
     * Default value is `false`.
     *
     * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
     */
    includeInOmnibox: ComponentOptions.buildBooleanOption({
      defaultValue: false,
      deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
    }),
    /**
     * When {@link Facet.options.includeInOmnibox} is `true`, specifies the number of values to populate the
     * {@link Breadcrumb} with.
     *
     * Default value is `5` on desktop computer and `3` on a mobile device. Minimum value is `0`.
     *
     * @deprecated This option is exposed for legacy reasons. It is not recommended to use this option.
     */
    numberOfValuesInOmnibox: ComponentOptions.buildNumberOption({
      defaultFunction: () => (DeviceUtils.isMobileDevice() ? 3 : 5),
      min: 0,
      depend: 'includeInOmnibox',
      deprecated: 'This option is exposed for legacy reasons. It is not recommended to use this option.'
    }),
    /**
     * Specifies the name of a field on which to execute an aggregate operation for all distinct values of the facet
     * [`field`]{@link Facet.options.field}.
     *
     * The facet displays the result of the operation along with the number of occurrences for each value.
     *
     * You can use this option to compute the sum of a field (like a money amount) for each listed facet value.
     *
     * Works in conjunction with the [`computedFieldOperation`]{@link Facet.options.computedFieldOperation},
     * [`computedFieldFormat`]{@link Facet.options.computedFieldFormat}, and
     * [`computedFieldCaption`]{@link Facet.options.computedFieldCaption} options.
     * @notSupportedIn salesforcefree
     */
    computedField: ComponentOptions.buildFieldOption({ priority: 7 }),
    /**
     * Specifies the type of aggregate operation to perform on the [`computedField`]{@link Facet.options.computedField}.
     *
     * The possible values are:
     * - `sum` - Computes the sum of the computed field values.
     * - `average` - Computes the average of the computed field values.
     * - `minimum` - Finds the minimum value of the computed field values.
     * - `maximum` - Finds the maximum value of the computed field values.
     *
     * Default value is `sum`.
     * @notSupportedIn salesforcefree
     */
    computedFieldOperation: ComponentOptions.buildStringOption<ComputedFieldOperation>({
      defaultValue: 'sum',
      section: 'ComputedField'
    }),
    /**
     * Specifies how to format the values resulting from a
     * [`computedFieldOperation`]{@link Facet.options.computedFieldOperation}.
     *
     * The Globalize library defines all available formats (see
     * [Globalize](https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-)).
     *
     * The most commonly used formats are:
     * - `c0` - Formats the value as a currency.
     * - `n0` - Formats the value as an integer.
     * - `n2` - Formats the value as a floating point with 2 decimal digits.
     *
     * Default value is `"c0"`.
     * @notSupportedIn salesforcefree
     */
    computedFieldFormat: ComponentOptions.buildStringOption<ComputedFieldFormat>({
      defaultValue: 'c0',
      section: 'ComputedField'
    }),
    /**
     * Specifies what the caption of the [`computedField`]{@link Facet.options.computedField} should be in the facet
     * **Settings** menu for sorting.
     *
     * For example, setting this option to `"Money"` will display `"Money Ascending"` for computed field ascending.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is the localized string for `ComputedField`.
     * @notSupportedIn salesforcefree
     */
    computedFieldCaption: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('ComputedField'),
      section: 'ComputedField'
    }),
    /**
     * Specifies whether the facet should remain stable in its current position in the viewport while the mouse cursor
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
     * In some cases, the facet also adds margins to the `scrollContainer`, if scrolling alone is not enough to
     * preserve position.
     *
     * See also the [`paddingContainer`]{@link Facet.options.paddingContainer}, and
     * [`scrollContainer`]{@link Facet.options.scrollContainer} options.
     *
     * Default value is `true`.
     */
    preservePosition: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the parent container of the facets.
     *
     * Used by the [`preservePosition`]{@link Facet.options.preservePosition} option.
     *
     * Default value is `element.parentElement`.
     */
    paddingContainer: ComponentOptions.buildSelectorOption({
      defaultFunction: element => {
        const standardColumn = $$(element).parent('coveo-facet-column');
        if (standardColumn != null) {
          return standardColumn;
        }
        return element.parentElement;
      }
    }),
    /**
     * Specifies the HTML element (through a CSS selector) whose scroll amount the facet should adjust to preserve its
     * position when results are updated.
     *
     * Used by the [`preservePosition`]{@link Facet.options.preservePosition} option.
     *
     * Default value is `document.body`.
     */
    scrollContainer: ComponentOptions.buildSelectorOption({ defaultFunction: element => document.body }),
    /**
     * Specifies whether to enable the **More** and **Less** buttons in the Facet.
     *
     * See also the [`pageSize`]{@link Facet.options.pageSize} option.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `true`.
     */
    enableMoreLess: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * If the [`enableMoreLess`]{@link Facet.options.enableMoreLess} option is `true`, specifies the number of
     * additional results to fetch when clicking the **More** button.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `10`. Minimum value is `1`.
     */
    pageSize: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 1, depend: 'enableMoreLess' }),
    /**
     * If the [`enableSettings`]{@link Facet.options.enableSettings} option is `true`, specifies whether the
     * **Collapse \ Expand** menu option is available in the facet **Settings** menu.
     *
     * **Note:**
     * > The [`FacetRange`]{@link FacetRange} component does not support this option.
     *
     * Default value is `true`.
     */
    enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: true, depend: 'enableSettings' }),
    /**
     * Specifies an explicit list of [`allowedValues`]{@link IGroupByRequest.allowedValues} in the
     * [`GroupByRequest`]{@link IGroupByRequest}.
     *
     * If you specify a list of values for this option, the facet uses only these values (if they are available in
     * the current result set).
     *
     * **Example:**
     *
     * The following facet only uses the `Contact`, `Account`, and `File` values of the `@objecttype` field. Even if the
     * current result set contains other `@objecttype` values, such as `Message`, or `Product`, the facet does not use
     * those other values.
     *
     * ```html
     *
     * <div class="CoveoFacet" data-field="@objecttype" data-title="Object Type" data-tab="All" data-allowed-values="Contact,Account,File"></div>
     * ```
     *
     * Default value is `undefined`, and the facet uses all available values for its
     * [`field`]{@link Facet.options.field} in the current result set.
     */
    allowedValues: ComponentOptions.buildListOption<string>(),
    /**
     * Specifies an additional query expression (query override) to add to each
     * [`GroupByRequest`]{@link IGroupByRequest} that this facet performs.
     *
     * Example: `@date>=2014/01/01`
     * @notSupportedIn salesforcefree
     */
    additionalFilter: ComponentOptions.buildQueryExpressionOption(),
    /**
     * Specifies whether this facet only appears when a value is selected in its "parent" facet.
     *
     * To specify the parent facet, use its [`id`]{@link Facet.options.id}.
     *
     * Remember that by default, a facet `id` value is the same as its [`field`]{@link Facet.options.field} option
     * value.
     *
     * **Examples:**
     *
     * First case: the "parent" facet has no custom `id`:
     * ```html
     * <!-- "Parent" Facet: -->
     * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet'></div>
     *
     * <!-- The "dependent" Facet must refer to the default `id` of its "parent" Facet, which is the name of its field. -->
     * <div class='CoveoFacet' data-field='@myotherfield' data-title='My Dependent Facet' data-depends-on='@myfield'></div>
     * ```
     *
     * Second case: the "parent" facet has a custom `id`:
     * ```html
     * <!-- "Parent" Facet: -->
     * <div class='CoveoFacet' data-field='@myfield' data-title='My Parent Facet' data-id='myParentCustomId'></div>
     *
     * <!-- The "dependent" Facet must refer to the custom `id` of its "parent" Facet, which is 'myParentCustomId'. -->
     * <div class='CoveoFacet' data-field='@myotherfield' data-title='My Dependent Facet' data-depends-on='myParentCustomId'></div>
     * ```
     *
     * Default value is `undefined`
     */
    dependsOn: ComponentOptions.buildStringOption(),
    /**
     * A function that verifies whether the current state of the `dependsOn` facet allows the dependent facet to be displayed.
     *
     * If specified, the function receives a reference to the resolved `dependsOn` facet component instance as an argument, and must return a boolean.
     * The function's argument should typically be treated as read-only.
     *
     * By default, the dependent facet is displayed whenever one or more values are selected in its `dependsOn` facet.
     *
     * @externaldocs [Defining Dependent Facets](https://docs.coveo.com/3210/)
     */
    dependsOnCondition: ComponentOptions.buildCustomOption<IDependentFacetCondition>(
      () => {
        return null;
      },
      { depend: 'dependsOn', section: 'CommonOptions' }
    ),
    /**
     * Specifies a JSON object describing a mapping of facet values to their desired captions. See
     * [Normalizing Facet Value Captions](https://docs.coveo.com/en/368/).
     *
     * **Examples:**
     *
     * You can set the option in the ['init']{@link init} call:
     * ```javascript
     * var myValueCaptions = {
     *   "txt" : "Text files",
     *   "html" : "Web page",
     *   [ ... ]
     * };
     *
     * Coveo.init(document.querySelector("#search"), {
     *   Facet : {
     *     valueCaption : myValueCaptions
     *   }
     * });
     * ```
     *
     * Or before the `init` call, using the ['options']{@link options} top-level function:
     * ```javascript
     * Coveo.options(document.querySelector("#search"), {
     *   Facet : {
     *     valueCaption : myValueCaptions
     *   }
     * });
     * ```
     *
     * Or directly in the markup:
     * ```html
     * <!-- Ensure that the double quotes are properly handled in data-value-caption. -->
     * <div class='CoveoFacet' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
     * ```
     *
     * **Note:**
     * > Using value captions will disable alphabetical sorts (see the [availableSorts]{@link Facet.options.availableSorts} option).
     */
    valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>(),
    ...ResponsiveFacetOptions
  };

  public facetQueryController: FacetQueryController;
  public keepDisplayedValuesNextTime: boolean = false;
  public values = new FacetValues();
  public currentPage: number = 0;
  public numberOfValues: number;
  public firstQuery = true;
  public operatorAttributeId: string;
  public isFieldValueCompatible = true;

  /**
   * Renders and handles the facet **Search** part of the component.
   */
  public facetSearch: FacetSearch;

  /**
   * Renders and handles the facet **Settings** part of the component
   */
  public facetSettings: FacetSettings;
  public facetSort: FacetSort;
  public facetValuesList: FacetValuesList;
  public facetHeader: FacetHeader;
  public searchContainer: ValueElementRenderer;
  public dependsOnManager: DependsOnManager;

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

  /**
   * Creates a new `Facet` component. Binds multiple query events as well.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `Facet` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param facetClassId The ID to use for this facet (as `Facet` inherited from by other component
   * (e.g., [`FacetRange`]{@link FacetRange}). Default value is `Facet`.
   */
  constructor(public element: HTMLElement, public options: IFacetOptions, bindings?: IComponentBindings, facetClassId: string = Facet.ID) {
    super(element, facetClassId, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Facet, options);

    if (this.options.valueCaption != null) {
      this.options.availableSorts = _.filter(this.options.availableSorts, (sort: string) => !/^alpha.*$/.test(sort));
      this.logger.warn(`Because the ${this.options.field} facet is using value captions, alphabetical sorts are disabled.`);
    }

    ResponsiveFacets.init(this.root, this, this.options);

    // Serves as a way to render facet in the omnibox in the order in which they are instantiated
    this.omniboxZIndex = Facet.omniboxIndex;
    Facet.omniboxIndex--;

    this.checkForComputedFieldAndSort();
    this.checkForValueCaptionType();
    this.checkForCustomSort();
    this.initDependsOnManager();
    this.initFacetQueryController();
    this.initQueryEvents();
    this.initQueryStateEvents();
    this.initComponentStateEvents();
    this.initOmniboxEvents();
    this.initBreadCrumbEvents();
    this.initSearchAlertEvents();
    this.updateNumberOfValues();

    this.bind.oneRootElement(QueryEvents.querySuccess, () => {
      this.firstQuery = false;
    });
  }

  public setExpandedFacetSearchAccessibilityAttributes(searchResultsElement: HTMLElement) {
    if (!this.searchContainer) {
      return;
    }
    Assert.exists(searchResultsElement);
    const { accessibleElement } = this.searchContainer;
    accessibleElement.setAttribute('aria-expanded', true.toString());
  }

  public setCollapsedFacetSearchAccessibilityAttributes() {
    if (!this.searchContainer) {
      return;
    }
    this.searchContainer.accessibleElement.setAttribute('aria-expanded', false.toString());
  }

  public isCurrentlyDisplayed() {
    if (!$$(this.element).isVisible()) {
      return false;
    }

    if ($$(this.element).hasClass('coveo-active')) {
      return true;
    }

    if ($$(this.element).hasClass('coveo-facet-empty')) {
      return false;
    }

    return true;
  }

  public createDom() {
    this.initBottomAndTopSpacer();
    this.buildFacetContent();
    this.updateAppearanceDependingOnState();
    // After the facet has been created (and before the first query is applied)
    // Try to load a state from the setting, if it's available
    // Execute only _.once (only the first query, or the first time the user switch to a tab that contains a newly set of active facet)
    if (this.facetSettings && this.options.enableSettingsFacetState) {
      const loadOnce = <(args: INewQueryEventArgs) => any>_.once(() => {
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
   * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `selectValue('foobar')` or
   * `selectValue(new FacetValue('foobar'))`).
   */
  public selectValue(value: FacetValue | string): void {
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
   * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
   */
  public selectMultipleValues(values: FacetValue[] | string[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values as FacetValue[], value => {
      this.logger.info('Selecting facet value', this.facetValuesList.select(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Deselects a single value.
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `deselectValue('foobar')` or
   * `deselectValue(new FacetValue('foobar'))`).
   */
  public deselectValue(value: FacetValue | string): void {
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
   * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
   */
  public deselectMultipleValues(values: FacetValue[] | string[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values as FacetValue[], value => {
      this.logger.info('Deselecting facet value', this.facetValuesList.unselect(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Excludes a single value.
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a [`FacetValue`]{@link FacetValue} or a string (e.g., `excludeValue('foobar')` or
   * `excludeValue(new FacetValue('foobar'))`).
   */
  public excludeValue(value: FacetValue | string): void {
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
   * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
   */
  public excludeMultipleValues(values: FacetValue[] | string[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values as FacetValue[], value => {
      this.logger.info('Excluding facet value', this.facetValuesList.exclude(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Unexcludes a single value.
   *
   * Does not trigger a query automatically.
   *
   * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
   */
  public unexcludeValue(value: FacetValue | string): void {
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
   * @param values Can be an array of [`FacetValue`]{@link FacetValue} or an array of strings.
   */
  public unexcludeMultipleValues(values: FacetValue[] | string[]): void {
    Assert.exists(values);
    this.ensureDom();
    _.each(values as FacetValue[], value => {
      this.logger.info('Unexcluding facet value', this.facetValuesList.unExclude(value));
    });
    this.facetValueHasChanged();
  }

  /**
   * Toggles the selection state of a single value (selects the value if it is not already selected; un-selects the
   * value if it is already selected).
   *
   * Does not trigger a query automatically.
   * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
   */
  public toggleSelectValue(value: FacetValue | string): void {
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
   * @param value Can be a [`FacetValue`]{@link FacetValue} or a string.
   */
  public toggleExcludeValue(value: FacetValue | string): void {
    Assert.exists(value);
    this.ensureDom();
    this.logger.info('Toggle exclude facet value', this.facetValuesList.toggleExclude(value));
    this.facetValueHasChanged();
  }

  /**
   * Returns the currently displayed values as an array of strings.
   *
   * @returns {any[]} The currently displayed values.
   */
  public getDisplayedValues(): string[] {
    return _.pluck(this.getDisplayedFacetValues(), 'value');
  }

  /**
   * Returns the currently displayed values as an array of [`FacetValue`]{@link FacetValue}.
   *
   * @returns {T[]} The currently displayed values.
   */
  public getDisplayedFacetValues(): FacetValue[] {
    this.ensureDom();
    const displayed = this.facetValuesList.getAllCurrentlyDisplayed();
    return _.map(displayed, (value: ValueElement) => {
      return value.facetValue;
    });
  }

  /**
   * Returns the currently selected values as an array of strings.
   * @returns {string[]} The currently selected values.
   */
  public getSelectedValues(): string[] {
    this.ensureDom();
    return _.map(this.values.getSelected(), (value: FacetValue) => value.value);
  }

  /**
   * Determines whether the specified value is selected in the facet.
   * @param value The name of the facet value to verify.
   */
  public hasSelectedValue(value: string) {
    const facetValue = this.values.get(value);
    return facetValue && facetValue.selected;
  }

  /**
   * Returns the currently excluded values as an array of strings.
   * @returns {string[]} The currently excluded values.
   */
  public getExcludedValues(): string[] {
    this.ensureDom();
    return _.map(this.values.getExcluded(), (value: FacetValue) => value.value);
  }

  /**
   * Resets the facet by un-selecting all values, un-excluding all values, and redrawing the facet.
   */
  public reset(): void {
    this.ensureDom();
    this.values.reset();
    this.rebuildValueElements();
    this.updateAppearanceDependingOnState();
    this.updateQueryStateModel();
  }

  /**
   * Switches the facet to `AND` mode.
   *
   * See the [`useAnd`]{@link Facet.options.useAnd}, and
   * [`enableTogglingOperator`]{@link Facet.options.enableTogglingOperator} options.
   */
  public switchToAnd(): void {
    this.ensureDom();
    this.logger.info('Switching to AND');
    this.facetHeader.switchToAnd();
  }

  /**
   * Switches the facet to `OR` mode.
   *
   * See the [`useAnd`]{@link Facet.options.useAnd}, and
   * [`enableTogglingOperator`]{@link Facet.options.enableTogglingOperator} options.
   */
  public switchToOr(): void {
    this.ensureDom();
    this.logger.info('Switching to OR');
    this.facetHeader.switchToOr();
  }

  /**
   * Returns the endpoint for the facet.
   * @returns {ISearchEndpoint} The endpoint for the facet.
   */
  public getEndpoint(): ISearchEndpoint {
    return this.queryController.getEndpoint();
  }

  /**
   * Changes the sort parameter for the facet.
   *
   * See {@link Facet.options.availableSorts} for the list of possible values.
   *
   * Also triggers a new query.
   *
   * @param criteria The new sort parameter for the facet.
   */
  public updateSort(criteria: string): void {
    this.ensureDom();
    if (this.options.sortCriteria != criteria) {
      this.options.sortCriteria = criteria;
      this.usageAnalytics.logCustomEvent<IAnalyticsFacetSortMeta>(
        analyticsActionCauseList.facetUpdateSort,
        {
          criteria,
          facetId: this.options.id,
          facetField: this.options.field.toString(),
          facetTitle: this.options.title
        },
        this.element
      );
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
   * Shows a waiting animation in the facet header (a spinner).
   */
  public showWaitingAnimation() {
    this.ensureDom();
    if (!this.showingWaitAnimation) {
      $$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'visible';
      this.showingWaitAnimation = true;
    }
  }

  /**
   * Hides the waiting animation in the facet header.
   */
  public hideWaitingAnimation(): void {
    this.ensureDom();
    if (this.showingWaitAnimation) {
      $$(this.headerElement).find('.coveo-facet-header-wait-animation').style.visibility = 'hidden';
      this.showingWaitAnimation = false;
    }
  }

  public processFacetSearchAllResultsSelected(facetValues: FacetValue[]): void {
    const valuesForAnalytics = [];
    _.each(facetValues, facetValue => {
      this.ensureFacetValueIsInList(facetValue);
      valuesForAnalytics.push(facetValue.value);
    });
    // Calculate the correct number of values from the current selected/excluded values (those will stay no matter what next rendering)
    // add the new one that will be selected (and are not already selected in the facet)
    // The minimum number of values is the number of values set in the option
    const valuesThatStays = this.values.getSelected().concat(this.values.getExcluded());
    this.numberOfValues = valuesThatStays.length + _.difference(valuesThatStays, facetValues).length;
    this.numberOfValues = Math.max(this.numberOfValues, this.options.numberOfValues);

    this.updateQueryStateModel();
    this.triggerNewQuery(() =>
      this.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.facetSelectAll, {
        facetId: this.options.id,
        facetField: this.options.field.toString(),
        facetTitle: this.options.title
      })
    );
  }

  public pinFacetPosition() {
    if (this.options.preservePosition) {
      this.pinnedViewportPosition = this.element.getBoundingClientRect().top;
    }
  }

  /**
   * Returns the configured caption for the given [`FacetValue`]{@link FacetValue}.
   *
   * @param facetValue The `FacetValue` whose caption the method should return.
   */
  public getValueCaption(facetValue: IIndexFieldValue | FacetValue | string): string {
    Assert.exists(facetValue);
    const lookupValue = typeof facetValue === 'string' ? facetValue : facetValue.lookupValue || facetValue.value;
    let ret = FacetUtils.tryToGetTranslatedCaption(<string>this.options.field, lookupValue);

    if (Utils.exists(this.options.valueCaption)) {
      if (typeof this.options.valueCaption == 'object') {
        ret = this.options.valueCaption[lookupValue] || ret;
      }
      if (typeof this.options.valueCaption == 'function') {
        const fv = facetValue instanceof FacetValue ? facetValue : FacetValue.create(facetValue);
        const valueFromList = this.facetValuesList.get(fv).facetValue;
        ret = this.options.valueCaption.call(this, valueFromList);
      }
    }
    return ret;
  }

  /**
   * Returns the configured caption for a desired facet value.
   *
   * @param value The string facet value whose caption the method should return.
   */
  public getCaptionForStringValue(value: string) {
    Assert.exists(value);
    return this.getValueCaption(value);
  }

  /**
   * Shows the next page of results in the facet.
   *
   * See the [`enableMoreLess`]{@link Facet.options.enableMoreLess}, and [`pageSize`]{@link Facet.options.pageSize}
   * options.
   *
   * Triggers a query if needed, or displays the already available values.
   */
  public showMore() {
    this.currentPage = Math.floor((this.numberOfValues - this.options.numberOfValues) / this.options.pageSize) + 1;
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
   * See the [`enableMoreLess`]{@link Facet.options.enableMoreLess}, and
   * [`numberOfValues`]{@link Facet.options.numberOfValues} options.
   */
  public showLess() {
    $$(this.lessElement).removeClass('coveo-active');
    this.currentPage = 0;
    this.updateNumberOfValues();
    $$(this.moreElement).addClass('coveo-active');
    this.values.sortValuesDependingOnStatus(this.numberOfValues);
    this.rebuildValueElements();
    this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.facetShowLess);
  }

  /**
   * Collapses the facet.
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
    const options: IQueryOptions = {
      ...(beforeExecuteQuery ? { beforeExecuteQuery } : { ignoreWarningSearchEvent: true }),
      closeModalBox: !ResponsiveComponentsUtils.isSmallFacetActivated($$(this.root))
    };
    this.queryController.executeQuery(options);
    this.showWaitingAnimation();
  }

  protected handleDeferredQuerySuccess(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    this.unfadeInactiveValuesInMainList();
    this.hideWaitingAnimation();
    const groupByResult = data.results.groupByResults[this.facetQueryController.lastGroupByRequestIndex];
    this.facetQueryController.lastGroupByResult = groupByResult;
    // Two corner case to handle regarding the "sticky" aspect of facets :
    // 1) The group by is empty (so there is nothing to "sticky")
    // 2) There is only one value displayed currently, so there is nothing to "sticky" either
    if (!groupByResult) {
      this.keepDisplayedValuesNextTime = false;
    }
    if (this.values.getAll().length == 1) {
      this.keepDisplayedValuesNextTime = false;
    }
    this.processNewGroupByResults(groupByResult);
  }

  protected handleQueryError() {
    this.updateValues(new FacetValues());
    this.updateAppearanceDependingOnState();
    this.hideWaitingAnimation();
  }

  protected handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);

    if (this.values.hasSelectedOrExcludedValues()) {
      const element = new BreadcrumbValueList(
        this,
        this.values.getSelected().concat(this.values.getExcluded()),
        BreadcrumbValueElement
      ).build();
      args.breadcrumbs.push({ element: element });
    }
  }

  protected handlePopulateSearchAlerts(args: ISearchAlertsPopulateMessageEventArgs) {
    if (this.values.hasSelectedOrExcludedValues()) {
      const excludedValues = this.values.getExcluded();
      const selectedValues = this.values.getSelected();

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
    $$(this.facetHeader.eraserElement).toggleClass('coveo-facet-header-eraser-visible', this.values.hasSelectedOrExcludedValues());
  }

  protected initQueryEvents() {
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.handleDuringQuery());
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
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
      this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
        this.handlePopulateBreadcrumb(args)
      );
      this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, (args: IClearBreadcrumbEventArgs) => this.handleClearBreadcrumb());
    }
  }

  protected initSearchAlertEvents() {
    this.bind.onRootElement(SearchAlertsEvents.searchAlertsPopulateMessage, (args: ISearchAlertsPopulateMessageEventArgs) =>
      this.handlePopulateSearchAlerts(args)
    );
  }

  protected handleOmniboxWithStaticValue(eventArg: IPopulateOmniboxEventArgs) {
    const regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');
    const match = _.first(
      _.filter(this.getDisplayedValues(), (displayedValue: string) => {
        const value = this.getValueCaption(this.facetValuesList.get(displayedValue).facetValue);
        return regex.test(value);
      }),
      this.options.numberOfValuesInOmnibox
    );
    const facetValues = _.map(match, (gotAMatch: string) => {
      return this.facetValuesList.get(gotAMatch).facetValue;
    });
    const element = new OmniboxValuesList(this, facetValues, eventArg, OmniboxValueElement).build();
    eventArg.rows.push({ element: element, zIndex: this.omniboxZIndex });
  }

  protected processNewGroupByResults(groupByResult: IGroupByResult) {
    this.logger.trace('Displaying group by results', groupByResult);
    if (groupByResult != undefined && groupByResult.values != undefined) {
      this.nbAvailableValues = groupByResult.values.length;
    }
    const newFacetValues = new FacetValues(groupByResult);
    this.updateValues(newFacetValues);
    this.canFetchMore = this.numberOfValues < this.nbAvailableValues;

    if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd && this.options.isMultiValueField) {
      this.triggerUpdateDeltaQuery(
        _.filter(this.values.getAll(), (facetValue: FacetValue) => {
          return !facetValue.selected && !facetValue.excluded;
        })
      );
    } else if (this.values.getSelected().length > 0 && !this.options.useAnd) {
      this.values.updateDeltaWithFilteredFacetValues(new FacetValues(), this.options.isMultiValueField);
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
    if (this.shouldRenderMoreLess()) {
      this.updateMoreLess();
      if (this.shouldRenderFacetSearch()) {
        this.updateSearchElement(this.nbAvailableValues > this.numberOfValues);
      }
    } else if (this.shouldRenderFacetSearch()) {
      this.updateSearchElement();
    }
  }

  protected updateSearchElement(moreValuesAvailable = true) {
    if (!moreValuesAvailable) {
      return;
    }

    const renderer = new ValueElementRenderer(this, FacetValue.create(l('Search')));
    this.searchContainer = renderer.build().withNo([renderer.excludeIcon, renderer.icon]);
    $$(this.searchContainer.listItem).addClass('coveo-facet-search-button');

    new AccessibleButton()
      .withElement(this.searchContainer.accessibleElement)
      .withLabel(l('SearchFacetResults', this.options.title))
      .withEnterKeyboardAction(e => this.toggleSearchMenu(e))
      .build();

    this.setCollapsedFacetSearchAccessibilityAttributes();

    // Mobile do not like label. Use click event
    if (DeviceUtils.isMobileDevice()) {
      $$(this.searchContainer.label).on('click', e => this.toggleSearchMenu(e));
    }

    $$(this.searchContainer.checkbox).on('change', () => {
      $$(this.element).addClass('coveo-facet-searching');
      this.facetSearch.focus();
    });
    this.facetValuesList.valueContainer.appendChild(this.searchContainer.listItem);
  }

  protected updateMoreLess(
    lessElementIsShown = this.getMinimumNumberOfValuesToDisplay() < this.numberOfValues,
    moreValuesAvailable = this.nbAvailableValues > this.numberOfValues
  ) {
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

  private toggleSearchMenu(e: Event) {
    const searchButton = this.searchContainer;

    if (searchButton.checkbox.getAttribute('checked')) {
      searchButton.checkbox.removeAttribute('checked');
    } else {
      searchButton.checkbox.setAttribute('checked', 'checked');
    }

    $$(searchButton.checkbox).trigger('change');

    e.stopPropagation();
    e.preventDefault();
  }

  private checkForComputedFieldAndSort() {
    if (this.options.sortCriteria.toLowerCase().indexOf('computedfield') != -1 && Utils.isNullOrUndefined(this.options.computedField)) {
      this.logger.warn(
        'Sort criteria is specified as ComputedField, but the facet uses no computed field. Facet will always be empty !',
        this
      );
    }
  }

  private checkForValueCaptionType() {
    if (this.options.valueCaption && typeof this.options.valueCaption == 'function') {
      this.options.enableFacetSearch = false;
      this.options.includeInOmnibox = false;
      this.logger.warn(
        'Using a function as valueCaption is now deprecated. Use a json key value pair instead. Facet search and omnibox has been disabled for this facet',
        this
      );
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

  private initDependsOnManager() {
    const facetInfo: IDependentFacet = {
      reset: () => this.reset(),
      ref: this
    };
    this.dependsOnManager = new DependsOnManager(facetInfo);
  }

  private dependsOnUpdateParentDisplayValue() {
    if (!this.options.dependsOn) {
      return;
    }

    const masterFacetComponent = ComponentsTypes.getAllFacetInstancesFromElement(this.root).filter((cmp: Facet) => {
      const idFacet = cmp instanceof Facet;
      return idFacet && cmp.options.id === this.options.dependsOn;
    }) as Facet[];

    if (!masterFacetComponent.length) {
      this.logger.warn(
        `Unable to find a Facet with the id or field "${this.options.dependsOn}".`,
        `The master facet values can't be updated.`
      );
      return;
    }
    if (masterFacetComponent.length > 1) {
      this.logger.warn(
        `Multiple facets with id "${this.options.dependsOn}" found.`,
        `A given facet may only depend on a single other facet.`,
        `Ensure that each facet in your search interface has a unique id.`,
        `The master facet cannot be updated.`,
        masterFacetComponent
      );
      return;
    }
    const masterFacet = masterFacetComponent[0];
    masterFacet.keepDisplayedValuesNextTime = false;
  }

  private initBottomAndTopSpacer() {
    const bottomSpace = $$(this.options.paddingContainer).find('.coveo-bottomSpace');
    const topSpace = $$(this.options.paddingContainer).find('.coveo-topSpace');
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
    const selectedValues: IQueryStateIncludedAttribute = { included: this.getSelectedValues(), title: this.includedAttributeId };
    this.queryStateModel.set(this.includedAttributeId, selectedValues.included);
  }

  private updateExcludedQueryStateModel() {
    const excludedValues: IQueryStateExcludedAttribute = { title: this.excludedAttributeId, excluded: this.getExcludedValues() };

    this.queryStateModel.set(this.excludedAttributeId, excludedValues.excluded);
  }

  private updateLookupValueQueryStateModel() {
    if (this.options.lookupField) {
      const valueToSet = {};
      _.each(this.values.getSelected().concat(this.values.getExcluded()), value => {
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
    const toUnSelect = _.difference(this.getSelectedValues(), includedChanged);
    if (Utils.isNonEmptyArray(toUnSelect)) {
      this.deselectMultipleValues(toUnSelect);
    }
    if (!Utils.arrayEqual(this.getSelectedValues(), includedChanged, false)) {
      this.selectMultipleValues(includedChanged);
    }
  }

  private handleQueryStateChangedExcluded(excludedChanged) {
    const toUnExclude = _.difference(this.getExcludedValues(), excludedChanged);
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
    this.dependsOnUpdateParentDisplayValue();
    const trimValuesFromModel = (values?: string[]) => {
      if (values) {
        values = _.map(values, value => value.trim());
      }
      return values;
    };

    const queryStateAttributes: IStringMap<any> = data.attributes;
    let includedChanged: string[] = trimValuesFromModel(queryStateAttributes[this.includedAttributeId]);
    let excludedChanged: string[] = trimValuesFromModel(queryStateAttributes[this.excludedAttributeId]);
    const operator: string = queryStateAttributes[this.operatorAttributeId];
    const lookupValueChanged: IStringMap<string> = queryStateAttributes[this.lookupValueAttributeId];

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
    const regex = new RegExp('^' + eventArg.completeQueryExpression.regex.source, 'i');

    const promise = new Promise<IOmniboxDataRow>((resolve, reject) => {
      const searchParameters = new FacetSearchParameters(this);
      searchParameters.setValueToSearch(eventArg.completeQueryExpression.word);
      searchParameters.nbResults = this.options.numberOfValuesInOmnibox;
      this.facetQueryController
        .search(searchParameters)
        .then(fieldValues => {
          const facetValues = _.map(
            _.filter(fieldValues, (fieldValue: IIndexFieldValue) => {
              return regex.test(fieldValue.lookupValue);
            }),
            fieldValue => {
              return this.values.get(fieldValue.lookupValue) || FacetValue.create(fieldValue);
            }
          );
          const element = new OmniboxValuesList(this, facetValues, eventArg, OmniboxValueElement).build();
          resolve({ element: element, zIndex: this.omniboxZIndex });
        })
        .catch(() => {
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

  private handleBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);

    this.facetQueryController.prepareForNewQuery();
    if (this.values.hasSelectedOrExcludedValues()) {
      const expression = this.facetQueryController.computeOurFilterExpression();
      this.logger.trace('Putting filter in query', expression);
      data.queryBuilder.advancedExpression.add(expression);
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    const queryBuilder = data.queryBuilder;
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
      this.values = this.consolidateAndSortNewFacetValues(facetValues);
    }

    this.updateNumberOfValues();
  }

  private consolidateAndSortNewFacetValues(newValues: FacetValues) {
    newValues.importActiveValuesFromOtherList(this.values);
    newValues.sort(this.optionsToSortFacetValues);
    return newValues;
  }

  private get optionsToSortFacetValues(): ISortFacetValuesOptions {
    return {
      facetValuesOrder: this.facetValuesOrder,
      numberOfValues: this.numberOfValues
    };
  }

  private get facetValuesOrder() {
    return new FacetValuesOrder(this, this.facetSort);
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
    if (this.lessElement && this.moreElement) {
      this.footerElement.appendChild(this.lessElement);
      this.footerElement.appendChild(this.moreElement);
    }
  }

  private buildHeader() {
    let icon = this.options.headerIcon;
    if (this.options.headerIcon == this.options.field) {
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
      availableSorts: this.options.availableSorts
    });
    const built = this.facetHeader.build();
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
      const elementToScroll: any = this.options.scrollContainer == document.body ? window : this.options.scrollContainer;
      let currentViewportPosition = this.element.getBoundingClientRect().top;
      let offset = currentViewportPosition - this.pinnedViewportPosition;
      const scrollToOffset = () => {
        if (elementToScroll instanceof Window) {
          window.scrollTo(0, new Win(elementToScroll).scrollY() + offset);
        } else {
          (<HTMLElement>elementToScroll).scrollTop = elementToScroll.scrollTop + offset;
        }
      };
      // First try to adjust position by scrolling the page
      scrollToOffset();
      currentViewportPosition = this.element.getBoundingClientRect().top;
      offset = currentViewportPosition - this.pinnedViewportPosition;
      // If scrolling has worked (offset == 0), we're good to go, nothing to do anymore.

      if (offset < 0) {
        // This means the facet element is scrolled up in the viewport,
        // scroll it down by adding space in the top container
        this.pinnedTopSpace.style.height = offset * -1 + 'px';
      }
      this.unpinnedViewportPosition = this.pinnedViewportPosition;
      this.pinnedViewportPosition = null;
    }
  }

  private buildFooter(): HTMLElement {
    return $$('div', { className: 'coveo-facet-footer' }).el;
  }

  private buildMore(): HTMLElement {
    const svgContainer = $$('span', { className: 'coveo-facet-more-icon' }, SVGIcons.icons.arrowDown).el;
    SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-more-icon-svg');
    const more = $$('div', { className: 'coveo-facet-more', tabindex: 0 }, svgContainer).el;

    new AccessibleButton()
      .withElement(more)
      .withLabel(l('ShowMoreFacetResults', this.options.title))
      .withSelectAction(() => this.handleClickMore())
      .build();

    return more;
  }

  private buildLess(): HTMLElement {
    const svgContainer = $$('span', { className: 'coveo-facet-less-icon' }, SVGIcons.icons.arrowUp).el;
    SVGDom.addClassToSVGInContainer(svgContainer, 'coveo-facet-less-icon-svg');
    const less = $$('div', { className: 'coveo-facet-less', tabindex: 0 }, svgContainer).el;

    new AccessibleButton()
      .withElement(less)
      .withLabel(l('ShowLessFacetResults', this.options.title))
      .withSelectAction(() => this.handleClickLess())
      .build();

    return less;
  }

  private triggerMoreQuery() {
    this.logger.info('Triggering new facet more query');
    this.showWaitingAnimation();
    // fetch 1 more value than we need, so we can see if there is more value to fetch still or if we have reached
    // the end of the availables values
    this.facetQueryController
      .fetchMore(this.numberOfValues + 1)
      .then((queryResults: IQueryResults) => {
        this.logAnalyticsFacetShowMoreLess(analyticsActionCauseList.facetShowMore);
        const facetValues = new FacetValues(queryResults.groupByResults[0]);
        this.values = this.consolidateAndSortNewFacetValues(facetValues);

        this.nbAvailableValues = this.values.size();

        this.updateNumberOfValues();
        this.canFetchMore = this.numberOfValues < this.nbAvailableValues;

        if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd && this.options.isMultiValueField) {
          this.triggerUpdateDeltaQuery(
            _.filter(this.values.getAll(), (facetValue: FacetValue) => !facetValue.selected && !facetValue.excluded)
          );
        } else if (this.values.hasSelectedOrExcludedValues() && !this.options.useAnd) {
          this.values.updateDeltaWithFilteredFacetValues(new FacetValues(), this.options.isMultiValueField);
          this.hideWaitingAnimation();
        } else {
          this.hideWaitingAnimation();
        }
        this.rebuildValueElements();
      })
      .catch(() => this.hideWaitingAnimation());
  }

  protected triggerUpdateDeltaQuery(facetValues: FacetValue[]): void {
    this.showWaitingAnimation();
    this.facetQueryController.searchInFacetToUpdateDelta(facetValues).then((queryResults?) => {
      const values: FacetValues = new FacetValues();
      _.each(queryResults.groupByResults, (groupByResult: IGroupByResult) => {
        _.each(groupByResult.values, (groupByValue: IGroupByValue) => {
          if (!values.contains(groupByValue.value)) {
            values.add(FacetValue.createFromGroupByValue(groupByValue));
          }
        });
      });
      this.values.updateDeltaWithFilteredFacetValues(values, this.options.isMultiValueField);
      this.cleanupDeltaValuesForMultiValueField();
      this.rebuildValueElements();
      this.hideWaitingAnimation();
    });
  }

  protected updateNumberOfValues() {
    if (this.keepDisplayedValuesNextTime) {
      return;
    }

    if (this.currentPage <= 0) {
      // We're on the first page, let's reset the number of values to a minimum.
      this.currentPage = 0;
      this.numberOfValues = 0;
    } else {
      // Calculate the number of value with the current page.
      this.numberOfValues = this.options.numberOfValues + this.currentPage * this.options.pageSize;
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

  private cleanupDeltaValuesForMultiValueField() {
    // On a multi value field, it's possible to end up in a scenario where many of the current values are empty
    // Crop those out, and adjust the nbAvailable values for the "search" and "show more";
    if (this.options.isMultiValueField) {
      _.each(this.values.getAll(), v => {
        if (v.occurrences == 0 && !v.selected && !v.excluded) {
          this.values.remove(v.value);
        }
      });
      this.nbAvailableValues = this.values.getAll().length;
    }
  }

  private shouldRenderFacetSearch() {
    return this.options.enableFacetSearch;
  }

  private shouldRenderMoreLess() {
    return this.options.enableMoreLess;
  }

  public debugInfo() {
    const info: any = {};
    info[this['constructor']['ID']] = {
      component: this,
      groupByRequest: this.facetQueryController.lastGroupByRequest,
      groupByResult: this.facetQueryController.lastGroupByResult
    };
    return info;
  }

  private logAnalyticsFacetShowMoreLess(cause: IAnalyticsActionCause) {
    this.usageAnalytics.logCustomEvent<IAnalyticsFacetMeta>(
      cause,
      {
        facetId: this.options.id,
        facetField: this.options.field.toString(),
        facetTitle: this.options.title
      },
      this.element
    );
  }
}

Initialization.registerAutoCreateComponent(Facet);

Facet.doExport();
