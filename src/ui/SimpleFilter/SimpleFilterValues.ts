import 'styling/_SimpleFilter';
import { IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import * as _ from 'underscore';
import { QueryBuilder } from '../Base/QueryBuilder';
import { SimpleFilter, ISimpleFilterOptions } from './SimpleFilter';
import { IGroupByRequest } from '../../rest/GroupByRequest';

export class SimpleFilterValues {
  private groupByRequestValues: string[] = [];
  private position: number;

  constructor(public simpleFilter: SimpleFilter, public options: ISimpleFilterOptions) {}

  public getValuesFromGroupBy(): string[] {
    return this.groupByRequestValues;
  }

  public groupBy(data: IQuerySuccessEventArgs) {
    this.groupByRequestValues = [];
    const groupByResult = data.results.groupByResults;
    if (groupByResult.length > 0 && this.position != undefined) {
      _.each(groupByResult[this.position].values, value => {
        if (this.groupByRequestValues.indexOf(value.lookupValue) < 0) {
          this.groupByRequestValues.push(value.lookupValue);
        }
      });
    }
  }

  public handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    const queryBuilder = data.queryBuilder;
    this.putGroupByIntoQueryBuilder(queryBuilder);
  }

  private putGroupByIntoQueryBuilder(queryBuilder: QueryBuilder) {
    const groupByRequest = this.createBasicGroupByRequest();
    queryBuilder.groupByRequests.push(groupByRequest);
    this.position = queryBuilder.groupByRequests.length - 1;
  }

  private createBasicGroupByRequest(): IGroupByRequest {
    let groupByRequest: IGroupByRequest = {
      field: <string>this.options.field,
      maximumNumberOfValues: this.options.maximumNumberOfValues,
      injectionDepth: 1000
    };
    return groupByRequest;
  }
}
