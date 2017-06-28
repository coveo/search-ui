import 'styling/_SimpleFilter';
import { IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import * as _ from 'underscore';
import { IGroupByRequest } from '../../rest/GroupByRequest';
import { QueryBuilder } from '../Base/QueryBuilder';
import {SimpleFilter} from './SimpleFilter';

export interface ISimpleFilterOptions {
    field: IFieldOption;
    allowedValues: string[];
    maximumNumberOfValues: number;
}

export class SimpleFilterGroupByValues  {

    static options: ISimpleFilterOptions = {
        maximumNumberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5 }),
        field: ComponentOptions.buildFieldOption({ required: true }),
        allowedValues: ComponentOptions.buildListOption<string>({defaultValue: []}),
    };


    private computedValues: string [] = [];
    private position: number;

    constructor(public simplefilter: SimpleFilter, public options: ISimpleFilterOptions) {
        this.options.field = simplefilter.options.field;
        this.options.allowedValues = simplefilter.options.allowedValues;
        this.options.maximumNumberOfValues = simplefilter.options.maximumNumberOfValues;
    }

    public groupBy(data: IQuerySuccessEventArgs) {
        this.computedValues = [];
        const groupByResult = data.results.groupByResults;
        if(groupByResult.length > 0) {
            _.each(groupByResult[this.position].values, (value) => {
                if(!(this.computedValues.indexOf(value.lookupValue) >= 0)) {
                    this.computedValues.push(value.lookupValue)
                }
            });
        }
    }

    public handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
        const queryBuilder = data.queryBuilder;
        this.putGroupByIntoQueryBuilder(queryBuilder);
    }


    public putGroupByIntoQueryBuilder(queryBuilder: QueryBuilder) {
        const groupByRequest = this.createBasicGroupByRequest(this.options.allowedValues);
        queryBuilder.groupByRequests.push(groupByRequest);
        this.position = queryBuilder.groupByRequests.length -1;
    }

    public createBasicGroupByRequest(allowedValues?: string[], addComputedField: boolean = true): IGroupByRequest {
        let groupByRequest: IGroupByRequest = {
            field: <string>this.options.field,
            maximumNumberOfValues: this.options.maximumNumberOfValues,
            injectionDepth: 1000,
        };

        if (allowedValues != null) {
            groupByRequest.allowedValues = allowedValues;
        }
        return groupByRequest;
    }

    public getComputedValues(): string[] {
        return this.computedValues;
    }
}
