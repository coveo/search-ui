import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IGroupByRequest } from '../../rest/GroupByRequest';
import { Initialization } from '../Base/Initialization';
import { $$ } from '../../utils/Dom';
import * as Globalize from 'globalize';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

export interface IAggregateOptions {
  field: IFieldOption;
  operation?: string;
  format?: string;
}

/**
 * The Aggregate component allows to display the result on an aggregate operation on the index.
 *
 * It hooks itself to the query to add a new {@link IGroupByRequest}, then displays the result.
 */
export class Aggregate extends Component {
  static ID = 'Aggregate';

  static doExport() {
    exportGlobally({
      Aggregate: Aggregate
    });
  }

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IAggregateOptions = {
    /**
     * Specifies the field on which to do the aggregate operation. This parameter is mandatory.
     */
    field: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * Specifies the aggregate operation to perform.
     *
     * The possible values are:
     * - `sum` - Computes the sum of the computed field values.
     * - `average` - Computes the average of the computed field values.
     * - `minimum` - Finds the minimum value of the computed field values.
     * - `maximum` - Finds the maximum value of the computed field values.
     *
     * Default value is `sum`.
     */
    operation: ComponentOptions.buildStringOption({ defaultValue: 'sum' }),

    /**
     * Specifies how to format the value.
     *
     * The available formats are defined in the Globalize library (see
     * [Globalize](https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-).
     *
     * The most commonly used formats are:
     * - `c0` - Formats the value as a currency.
     * - `n0` - Formats the value as an integer.
     * - `n2` - Formats the value as a floating point with 2 decimal digits.
     *
     * Default value is `c0`.
     */
    format: ComponentOptions.buildStringOption({ defaultValue: 'c0' })
  };

  private index: number;

  /**
   * Creates a new Aggregate component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Aggregate component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IAggregateOptions, bindings?: IComponentBindings) {
    super(element, Aggregate.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Aggregate, options);

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    $$(this.element).hide();
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    var request: IGroupByRequest = {
      field: <string>this.options.field,
      maximumNumberOfValues: 0,
      computedFields: [
        {
          field: <string>this.options.field,
          operation: this.options.operation
        }
      ]
    };

    this.index = args.queryBuilder.groupByRequests.length;
    args.queryBuilder.groupByRequests.push(request);
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    if (_.isNumber(this.index) && args.results.groupByResults.length != 0) {
      var gbr = args.results.groupByResults[this.index];
      var aggregate = gbr.globalComputedFieldResults[0];
      $$(this.element).text(Globalize.format(aggregate, this.options.format));
      $$(this.element).show();
    } else {
      $$(this.element).hide();
    }
  }
}

Initialization.registerAutoCreateComponent(Aggregate);
