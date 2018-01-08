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

export interface ITimespanFacet {
  title: string;
  field: IFieldOption;
}

/**
 * The TimespanFacet component displays a {@link FacetRange} with prebuilt ranges that return documents
 * that were last updated in either the last day, week, month or year.
 *
 * This component in a thin wrapper around a standard {@link FacetRange} component. It's only goal is to offer good default ranges values out of the box and to make it easy to add it in a standard search page.
 *
 * If you wish to configure different ranges than those automatically configured with this component, feel free to use the standard {@link FacetRange} component with custom code to generate the needed ranges.
 */
export class TimespanFacet extends Component {
  static ID = 'TimespanFacet';

  /**
   * @componentOptions
   */
  static options: ITimespanFacet = {
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

  constructor(public element: HTMLElement, public options?: ITimespanFacet, bindings?: IComponentBindings) {
    super(element, TimespanFacet.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, TimespanFacet, options);
    this.buildFacet();
  }

  public set ranges(ranges: IRangeValue[]) {
    this.rangeValues = ranges;
    this.buildFacet();
  }

  public get ranges() {
    return this.rangeValues;
  }

  public get facet() {
    return this.facetRange;
  }

  public buildFacet() {
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

  public destroyFacet() {
    if (this.facetRangeElement) {
      this.facetRangeElement.remove();
    }
    delete this.facetRange;
  }
}
