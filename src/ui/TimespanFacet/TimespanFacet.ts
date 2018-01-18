import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { l } from '../../strings/Strings';
import { FacetRange } from '../FacetRange/FacetRange';
import * as moment from 'moment';
import { exportGlobally } from '../../GlobalExports';
import { IRangeValue } from '../../rest/RangeValue';
import { pluck } from 'underscore';
import { Dom, $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';

export interface ITimespanFacetOptions {
  title?: string;
  field?: IFieldOption;
}

/**
 * The TimespanFacet component displays a {@link FacetRange} with prebuilt ranges.
 *
 * The prebuilt ranges allow you to see the items last updated in the last day, week, month, or year.
 *
 * This component in a thin wrapper around the standard {@link FacetRange} component.
 *
 * This component is meant to offer out of the box default ranges, so it can easily be inserted in a standard search page.
 *
 * To configure different ranges than those offered by this component, use the standard {@link FacetRange} component instead.
 */
export class TimespanFacet extends Component {
  static ID = 'TimespanFacet';

  /**
   * @componentOptions
   */
  static options: ITimespanFacetOptions = {
    /**
     * Specifies the title to display at the top of the facet.
     *
     * Default value is the localized string for `Last updated`.
     */
    title: ComponentOptions.buildStringOption({
      defaultValue: l('LastUpdated')
    }),
    /**
     * Specifies the index field whose values the facet should use.
     *
     * Default value is the field `@date`
     */
    field: ComponentOptions.buildFieldOption({
      defaultValue: '@date'
    })
  };

  static doExport = () => {
    exportGlobally({
      TimespanFacet
    });
  };

  private rangeValues: IRangeValue[] = [
    {
      start: moment(0).toDate(),
      end: moment()
        .endOf('day')
        .toDate(),
      label: l('AllDates'),
      endInclusive: false
    },
    {
      start: moment()
        .startOf('day')
        .subtract(1, 'day')
        .toDate(),
      end: moment()
        .endOf('day')
        .toDate(),
      label: l('WithinLastDay'),
      endInclusive: false
    },
    {
      start: moment()
        .startOf('day')
        .subtract(1, 'week')
        .toDate(),
      end: moment()
        .endOf('day')
        .toDate(),
      label: l('WithinLastWeek'),
      endInclusive: false
    },
    {
      start: moment()
        .startOf('day')
        .subtract(1, 'month')
        .toDate(),
      end: moment()
        .endOf('day')
        .toDate(),
      label: l('WithinLastMonth'),
      endInclusive: false
    },
    {
      start: moment()
        .startOf('day')
        .subtract(1, 'year')
        .toDate(),
      end: moment()
        .endOf('day')
        .toDate(),
      label: l('WithinLastYear'),
      endInclusive: false
    }
  ];

  private facetRangeElement: Dom;
  private facetRange: FacetRange;

  constructor(public element: HTMLElement, public options?: ITimespanFacetOptions, bindings?: IComponentBindings) {
    super(element, TimespanFacet.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, TimespanFacet, options);
    this.buildFacet();
  }

  /**
   * Sets a new range for the component.
   */
  public set ranges(ranges: IRangeValue[]) {
    this.rangeValues = ranges;
    this.buildFacet();
  }

  /**
   * Returns the current range the facet uses to query the index
   */
  public get ranges() {
    return this.rangeValues;
  }

  /**
   * Returns the underlying {@link FacetRange} component associated to the Timespan Facet.
   */
  public get facet() {
    return this.facetRange;
  }

  private buildFacet() {
    this.destroyFacet();
    this.facetRangeElement = $$('div');
    $$(this.element).append(this.facetRangeElement.el);
    this.facetRange = new FacetRange(this.facetRangeElement.el, {
      field: this.options.field,
      title: this.options.title,
      ranges: this.rangeValues,
      availableSorts: ['custom'],
      customSort: pluck(this.rangeValues, 'label')
    });
  }

  private destroyFacet() {
    if (this.facetRangeElement) {
      this.facetRangeElement.remove();
    }
    delete this.facetRange;
  }
}

Initialization.registerAutoCreateComponent(TimespanFacet);
