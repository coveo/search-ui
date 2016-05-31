/// <reference path='../Facet/Facet.ts' />

import {IFacetOptions, Facet} from '../Facet/Facet';
import {IRangeValue} from '../../rest/RangeValue';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Utils} from '../../utils/Utils';
import {TemplateHelpers} from '../Templates/TemplateHelpers';
import {DateUtils} from '../../utils/DateUtils';
import {FacetRangeQueryController} from '../../controllers/FacetRangeQueryController';
import {IGroupByResult} from '../../rest/GroupByResult';
import {Initialization} from '../Base/Initialization';

declare const Globalize;

export interface IFacetRangeOptions extends IFacetOptions {
  ranges?: IRangeValue[];
  dateField?: boolean;
}

export class FacetRange extends Facet {
  static ID = 'FacetRange';
  static parent = Facet;
  static options = <IFacetRangeOptions>{
    dateField: ComponentOptions.buildBooleanOption({ defaultValue: false }),
  };

  public options: IFacetRangeOptions;

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
          ret = Globalize.format(start, this.options.valueCaption) + ' - ' + Globalize.format(end, this.options.valueCaption)
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
        })
      }
    }
    super.processNewGroupByResults(groupByResult);
  }
}
Initialization.registerAutoCreateComponent(FacetRange);
