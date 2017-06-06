import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_SimpleFilter';
import {$$, Dom} from "../../utils/Dom";
import {
    IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs,
    QueryEvents
} from "../../events/QueryEvents";
import {ComponentOptions, IFieldOption} from "../Base/ComponentOptions";
import {l} from "../../strings/Strings";
import {Assert} from "../../misc/Assert";
import * as _ from 'underscore';
import {Checkbox} from "../FormWidgets/Checkbox";
import {IGroupByRequest} from "../../rest/GroupByRequest";
import {QueryBuilder} from "../Base/QueryBuilder";
import {IStringMap} from "../../rest/GenericParam";
import {Utils} from "../../utils/Utils";


export interface ISimpleFilterOptions{
    title: string;
    captions: string[],
    field: IFieldOption,
    valueCaption: any
}

export class SimpleFilter extends Component {
    static ID = 'SimpleFilter';
    static doExport = () => {
        exportGlobally({
            'SimpleFilter': SimpleFilter
        })
    };
    static options: ISimpleFilterOptions = {
        captions: ComponentOptions.buildListOption<string>(),
        field: ComponentOptions.buildFieldOption({ required: true, groupByField: true, section: 'Identification' }),
        title: ComponentOptions.buildStringOption(),
        valueCaption: ComponentOptions.buildCustomOption<IStringMap<string>>(() => {
            return null;
        }),
    };

    private selectedValues: string[] = [];
    private checkboxes: Checkbox [] = [];
    private checkboxContainer: Dom;
    private expanded = false;

    constructor(public element: HTMLElement, public options: ISimpleFilterOptions, public bindings?: IComponentBindings){
        super(element, SimpleFilter.ID, bindings);
        this.type = 'SimpleFilter';
        this.options = ComponentOptions.initComponentOptions(element, SimpleFilter, options);

        let select = $$('select', {className: 'select'});
        let option = $$('option', {className: 'option'});
        option.el.innerText = l(this.options.title);
        select.el.appendChild(option.el) ;

        let overselect = $$('div', {className: 'overselect'});
        const multiselect = $$('div', { className: 'multiselect'});

        $$(document.body).on('click', (e: Event)=> {
            let target = <Element>e.target;

            if( overselect.el == e.target){
                this.onClick()
            } else {
                while (target != this.element) {
                    if(target != this.root) {
                        target = target.parentElement;
                    }
                    if (target == this.root  && this.expanded) {
                        this.onClick();
                        break;
                    } else if (target == this.root && !this.expanded){
                        break;
                    }
                }
            }
        });


        multiselect.el.appendChild(select.el);
        multiselect.el.appendChild(overselect.el);
        this.element.appendChild(multiselect.el);
        this.checkboxContainer = $$('div', { className: 'checkboxes'});

        this.checkboxes = _.map(this.options.captions, (value)=> this.createCheckboxes(value));
        _.each(this.checkboxes, (result) => {
            this.checkboxContainer.el.appendChild(result.getElement())
        });

        this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
        this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.groupBy(args));
        this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
        this.element.appendChild(this.checkboxContainer.el);
        var x = this.queryController;
    }

    private handleBuildingQuery(args: IBuildingQueryEventArgs) {
        Assert.exists(args);
        Assert.exists(args.queryBuilder);
        this.selectedValues = [];

        _.each(_.filter(this.checkboxes, (result) => {
            return result.isSelected();
        }), (checkboxes) => {
            this.selectedValues.push(checkboxes.getCaption());
        });

        if(this.selectedValues.length > 0) {
            args.queryBuilder.advancedExpression.addFieldExpression(this.options.field.toLocaleString(), '==', this.selectedValues);
        }
    }

    private onClick () {

        if(!this.expanded){
            this.checkboxContainer.el.style.display = 'block';
            this.expanded = true;
        } else {
            this.checkboxContainer.el.style.display = 'none';
            this.expanded = false;
        }
    }
    private onCheck() {
        this.queryController.executeQuery();
    }

    private createCheckboxes (captionValue: string): Checkbox{
        const checkbox = new Checkbox(() => {
            this.onCheck();
        }, l(this.getValueCaption(captionValue)));
         checkbox.setCaption(captionValue);
        return checkbox;
    }

    public getValueCaption(caption: string): string {
        let lookupValue = caption;
        let ret = lookupValue;

        if (Utils.exists(this.options.valueCaption)) {
            if (typeof this.options.valueCaption == 'object') {
                ret = this.options.valueCaption[lookupValue] || ret;
            }
        }
        return ret;
    }

    private groupBy (data: IQuerySuccessEventArgs) {
        let groupByResult = data.results.groupByResults;
        return groupByResult;
    }

    protected createBasicGroupByRequest(allowedValues?: string[], addComputedField: boolean = true): IGroupByRequest {
        let groupByRequest: IGroupByRequest = {
            field: <string>this.options.field,
            maximumNumberOfValues: 5,
            injectionDepth: 1000,
        };

        if (allowedValues != null) {
            groupByRequest.allowedValues = allowedValues;
        }
        return groupByRequest;
    }

    public putGroupByIntoQueryBuilder(queryBuilder: QueryBuilder) {
        Assert.exists(queryBuilder);
        let groupByRequest = this.createBasicGroupByRequest();
        queryBuilder.groupByRequests.push(groupByRequest);
    }

    private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
        Assert.exists(data);
        Assert.exists(data.queryBuilder);
        let queryBuilder = data.queryBuilder;
        this.putGroupByIntoQueryBuilder(queryBuilder);
    }


}
Initialization.registerAutoCreateComponent(SimpleFilter);
