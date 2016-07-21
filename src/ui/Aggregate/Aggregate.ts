import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs} from '../../events/QueryEvents';
import {IGroupByRequest} from '../../rest/GroupByRequest';
import {Initialization} from '../Base/Initialization';
import {$$} from '../../utils/Dom';
import Globalize = require('globalize');

export interface IAggregateOptions {
  field: string;
  operation?: string;
  format?: string;
}

/**
 * This simple component allows to display the result on an aggregate operation on the index.<br/>
 * It hook itself on the query to add a new group by request, then display the result.
 */
export class Aggregate extends Component {
  static ID = 'Aggregate';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IAggregateOptions = {
    /**
     * The field on which to do the aggregate operation
     */
    field: ComponentOptions.buildStringOption({ required: true }),
    /**
     * The aggregate operation to perform.<br/>
     * The available values are:
     * <ul>
     *   <li>sum - Computes the sum of the computed field values.</li>
     *   <li>average - Computes the average of the computed field values.</li>
     *   <li>minimum - Finds the minimum value of the computed field values.</li>
     *   <li>maximum - Finds the maximum value of the computed field values.</li>
     * </ul><br/>
     * The default value is sum.
     */
    operation: ComponentOptions.buildStringOption({ defaultValue: 'sum' }),
    /**
     * Specifies how to format the value<br/>
     * The formats available are defined by the Globalize library. The most common used formats are:
     * <ul>
     *   <li>c0 - Formats the value as a currency.</li>
     *   <li>n0 - Formats the value as an integer.</li>
     *   <li>n2 - Formats the value as a floating point with 2 decimal digits.</li>
     * </ul>
     * See : <a href='https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-'>Globalize</a> for more informations.<br/>
     * Default value is 'c0
     */
    format: ComponentOptions.buildStringOption({ defaultValue: 'c0' })
  }

  private index: number;

  /**
   * Create a new Aggregate component
   * @param element
   * @param options
   * @param bindings
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
      field: this.options.field,
      maximumNumberOfValues: 0,
      computedFields: [{
        field: this.options.field,
        operation: this.options.operation
      }]
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
