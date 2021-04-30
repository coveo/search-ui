import 'styling/DynamicFacet/_DynamicFacet';
import { Initialization } from '../Base/Initialization';
import { DynamicFacet } from './DynamicFacet';
import { IDynamicFacetRangeOptions, DynamicFacetRangeValueFormat, isFacetRangeValueFormat } from './IDynamicFacetRange';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';
import { FacetType } from '../../rest/Facet/FacetRequest';
import { IRangeValue } from '../../rest/RangeValue';
import { DynamicFacetValues } from './DynamicFacetValues/DynamicFacetValues';
import { DynamicFacetRangeValueCreator } from './DynamicFacetValues/DynamicFacetRangeValueCreator';
import { DynamicFacetRangeQueryController } from '../../controllers/DynamicFacetRangeQueryController';
import { Utils } from '../../Core';
import { FacetRangeSortOrder, isFacetRangeSortOrder } from '../../rest/Facet/FacetRangeSortOrder';
import { Logger } from '../../misc/Logger';

/**
 * A `DynamicFacetRange` is a [facet](https://docs.coveo.com/en/198/) whose values are expressed as ranges.
 *
 * You must set the [`field`]{@link DynamicFacet.options.field} option to a value targeting a numeric or date [field](https://docs.coveo.com/en/200/)
 * in your index for this component to work.
 *
 * This component extends the [`DynamicFacet`]{@link DynamicFacet} component and supports all `DynamicFacet` options except:
 *
 * - [`enableFacetSearch`]{@link DynamicFacet.options.enableFacetSearch}
 * - [`useLeadingWildcardInFacetSearch`]{@link DynamicFacet.options.useLeadingWildcardInFacetSearch}
 * - [`enableMoreLess`]{@link DynamicFacet.options.enableMoreLess}
 * - [`valueCaption`]{@link DynamicFacet.options.valueCaption}
 *
 * @notSupportedIn salesforcefree
 * @availablesince [October 2019 Release (v2.7219)](https://docs.coveo.com/en/3084/)
 */
export class DynamicFacetRange extends DynamicFacet implements IComponentBindings {
  static ID = 'DynamicFacetRange';
  static parent = DynamicFacet;
  static doExport = () => exportGlobally({ DynamicFacetRange });

  /**
   * The options for the DynamicFacetRange
   * @componentOptions
   */
  static options: IDynamicFacetRangeOptions = {
    /**
     * The label to insert between the minimum and maximum value of each range displayed in the facet.
     *
     * **Default:** The localized string for `to`.
     *
     * @examples until, up to
     */
    valueSeparator: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('To'),
      section: 'CommonOptions'
    }),
    field: ComponentOptions.buildFieldOption({ required: true, section: 'CommonOptions' }),
    /**
     * The string format to apply to the minimum and maximum value of each range displayed in the facet.
     *
     * See [`DynamicFacetRangeValueFormat`]{@link DynamicFacetRangeValueFormat} for the list and
     * description of allowed formats.
     *
     * **Default:** If the [`field`]{@link DynamicFacet.options.field} contains "date", the format will be [`date`]{@link DynamicFacetRangeValueFormat.date}.
     * Else, it will be [`number`]{@link DynamicFacetRangeValueFormat.number}.
     *
     * @examples date
     */
    valueFormat: ComponentOptions.buildStringOption<DynamicFacetRangeValueFormat>({
      postProcessing: (value, options: IDynamicFacetRangeOptions) => {
        if (isFacetRangeValueFormat(value)) {
          return value;
        }

        if (options.field.indexOf('date') !== -1) {
          return DynamicFacetRangeValueFormat.date;
        }

        return DynamicFacetRangeValueFormat.number;
      },
      section: 'CommonOptions'
    }),
    /**
     * The currency symbol to use if the [`valueFormat`]{@link DynamicFacetRange.options.valueFormat} is [`currency`]{@link DynamicFacetRangeValueFormat.currency}.
     *
     * By default, the component uses the currency associated with the currently loaded culture file (see [Changing the Language of Your Search Interface](https://docs.coveo.com/421/)).
     */
    currencySymbol: ComponentOptions.buildStringOption({ section: 'CommonOptions' }),
    /**
     * The list of [range values]{@link IRangeValue} to request (see [Requesting Specific FacetRange Values](https://docs.coveo.com/en/2790/)).
     *
     * This value will override the [`numberOfValues`]{@link DynamicFacet.options.numberOfValues} value.
     *
     * If this option is not defined, the index will try to generate automatic ranges.
     */
    ranges: ComponentOptions.buildJsonOption<IRangeValue[]>({
      required: false,
      section: 'CommonOptions',
      postProcessing: ranges => (Utils.isNonEmptyArray(ranges) ? ranges : [])
    }),
    /**
     * The sort order to use for this facet.
     *
     * Can be either `ascending` or `descending`.
     *
     * **Default:** `ascending`.
     */
    sortOrder: <FacetRangeSortOrder>ComponentOptions.buildStringOption({
      postProcessing: value => {
        if (!value) {
          return undefined;
        }

        if (isFacetRangeSortOrder(value)) {
          return value;
        }

        new Logger(value).warn('sortOrder is not of the the allowed values: "ascending", "descending"');
        return undefined;
      },
      section: 'Sorting'
    })
  };

  public isFieldValueCompatible = false;

  /**
   * Creates a new `DynamicFacetRange` instance.
   *
   * @param element The element from which to instantiate the component.
   * @param options The component options.
   * @param bindings The component bindings. Automatically resolved by default.
   */
  constructor(public element: HTMLElement, public options: IDynamicFacetRangeOptions, bindings?: IComponentBindings) {
    super(element, ComponentOptions.initComponentOptions(element, DynamicFacetRange, options), bindings, DynamicFacetRange.ID);

    this.disableUnavailableOptions();
  }

  protected initValues() {
    this.values = new DynamicFacetValues(this, DynamicFacetRangeValueCreator);
  }

  protected initDynamicFacetQueryController() {
    this.dynamicFacetQueryController = new DynamicFacetRangeQueryController(this);
  }

  private disableUnavailableOptions() {
    this.options.enableFacetSearch = false;
    this.options.useLeadingWildcardInFacetSearch = false;
    this.options.enableMoreLess = false;
    this.options.valueCaption = {};
    this.options.sortCriteria = undefined;
    this.options.customSort = undefined;
  }

  public get facetType(): FacetType {
    if (this.options.valueFormat === DynamicFacetRangeValueFormat.date) {
      return FacetType.dateRange;
    }

    return FacetType.numericalRange;
  }

  public showMoreValues() {
    this.logger.warn('The "showMoreValues" method is not available on the "DynamicFacetRange" component');
  }

  public showLessValues() {
    this.logger.warn('The "showLessValues" method is not available on the "DynamicFacetRange" component');
  }

  public async triggerNewIsolatedQuery() {
    this.logger.warn('The "triggerNewIsolatedQuery" method is not available on the "DynamicFacetRange" component');
  }
}

Initialization.registerAutoCreateComponent(DynamicFacetRange);
DynamicFacetRange.doExport();
