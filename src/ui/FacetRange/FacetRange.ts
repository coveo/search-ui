/// <reference path='../Facet/Facet.ts' />

import { IFacetOptions, Facet } from '../Facet/Facet';
import { IRangeValue } from '../../rest/RangeValue';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Utils } from '../../utils/Utils';
import { TemplateHelpers } from '../Templates/TemplateHelpers';
import { DateUtils } from '../../utils/DateUtils';
import { FacetRangeQueryController } from '../../controllers/FacetRangeQueryController';
import { IGroupByResult } from '../../rest/GroupByResult';
import { Initialization } from '../Base/Initialization';
import Globalize = require('globalize');

export interface IFacetRangeOptions extends IFacetOptions {
  ranges?: IRangeValue[];
  dateField?: boolean;
}
/**
 * The FacetRange component displays a {@link Facet} whose values are expressed as ranges. These ranges are computed
 * from the results of the current query.
 *
 * This component inherits from the Facet component. Thus, any option available for a Facet component is also available
 * for a FacetRange component.
 */
export class FacetRange extends Facet implements IComponentBindings {
  static ID = 'FacetRange';
  static parent = Facet;

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IFacetRangeOptions = {

    /**
     * Specifies whether the field for which you require a range is a date field.
     *
     * This allows the component to correctly build the outgoing {@link IGroupByRequest}.
     *
     * Default value is `false`.
     */
    dateField: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies an array of {@link IRangeValue} to use as Facet values.
     *
     * It is only possible to specify a value for this option in the {@link init} call of your search interface. You
     * cannot set it directly as an HTML attribute.
     *
     * **Example:**
     *
     * ```javascript
     * var myRanges = [{
     *      start: 0,
     *      end: 100,
     *      label: "0 - 100",
     *      endInclusive: false
     *    }, {
     *      start: 100,
     *      end: 200,
     *      label: "100 - 200",
     *      endInclusive: false
     *    }, {
     *      start: 200,
     *      end: 300,
     *      label: "200 - 300",
     *      endInclusive: false
     * }]
     *
     * // You can call the init script using "pure" JavaScript:
     * Coveo.init(document.querySelector('#search'), {
     *    FacetRange : {
     *        ranges : myRanges
     *    }
     * })
     *
     * // Or you can call the init script using the jQuery extension:
     * $("#search").coveo("init", {
     *    FacetRange : {
     *        ranges : myRanges
     *    }
     * })
     * ```
     *
     * Default value is `null` and the index will automatically generate ranges.
     */
    ranges: ComponentOptions.buildCustomOption<IRangeValue[]>(() => {
      return null;
    })
  };

  public options: IFacetRangeOptions;

  /**
   * Creates a new FacetRange component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the FacetRange component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, options: IFacetRangeOptions, bindings?: IComponentBindings) {
    super(element, ComponentOptions.initComponentOptions(element, FacetRange, options), bindings, FacetRange.ID);

    this.options.enableFacetSearch = false;
    this.options.enableSettings = false;
    this.options.includeInOmnibox = false;
    this.options.enableMoreLess = false;
  }

  public getValueCaption(facetValue: any): string {
    var ret = super.getValueCaption(facetValue);
    if (Utils.exists(this.options.valueCaption) && typeof this.options.valueCaption == 'string') {
      var startEnd = /^(.*)\.\.(.*)$/.exec(facetValue.value);
      if (startEnd != null) {
        var helper = TemplateHelpers.getHelper(this.options.valueCaption);
        if (helper != null) {
          ret = helper.call(this, startEnd[1]) + ' - ' + helper.call(this, startEnd[2]);
        } else {
          var start = startEnd[1].match(/^[\+\-]?[0-9]+(\.[0-9]+)?$/) ? <any>Number(startEnd[1]) : <any>DateUtils.convertFromJsonDateIfNeeded(startEnd[1]);
          var end = startEnd[2].match(/^[\+\-]?[0-9]+(\.[0-9]+)?$/) ? <any>Number(startEnd[2]) : <any>DateUtils.convertFromJsonDateIfNeeded(startEnd[2]);
          ret = Globalize.format(start, this.options.valueCaption) + ' - ' + Globalize.format(end, this.options.valueCaption);
        }
      }
    }
    return ret;
  }

  protected initFacetQueryController() {
    this.facetQueryController = new FacetRangeQueryController(this);
  }

  protected processNewGroupByResults(groupByResult: IGroupByResult) {
    if (groupByResult != null) {
      if (this.options.ranges == null && (!this.keepDisplayedValuesNextTime || this.values.hasSelectedOrExcludedValues())) {
        this.keepDisplayedValuesNextTime = false;
        groupByResult.values.sort((valueA, valueB) => {
          var startEndA = valueA.value.split('..');
          var startEndB = valueB.value.split('..');
          if (this.options.dateField) {
            return Date.parse(startEndA[0]) - Date.parse(startEndB[0]);
          }
          return Number(startEndA[0]) - Number(startEndB[0]);
        });
      }
    }
    super.processNewGroupByResults(groupByResult);
  }
}
Initialization.registerAutoCreateComponent(FacetRange);
