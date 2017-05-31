import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_SimpleFilter';
import {$$} from "../../utils/Dom";
import {Dropdown} from "../FormWidgets/Dropdown";
import {IBuildingQueryEventArgs, QueryEvents} from "../../events/QueryEvents";
import {ComponentOptions} from "../Base/ComponentOptions";
import {l} from "../../strings/Strings";

export interface ISimpleFilterOptions{

    title: string[];
}

export class SimpleFilter extends Component {
    static ID = 'SimpleFilter';
    static doExport = () => {
        exportGlobally({
            'SimpleFilter': SimpleFilter
        })
    };
    static options: ISimpleFilterOptions = {
        title: ComponentOptions.buildListOption<string>()
    };

    private dropdown: Dropdown;

    constructor(public element: HTMLElement, public options: ISimpleFilterOptions, public bindings?: IComponentBindings){
        super(element, SimpleFilter.ID, bindings);
        this.type = 'SimpleFilter';
        this.options = ComponentOptions.initComponentOptions(element, SimpleFilter, options);
        this.dropdown = new Dropdown ((dropdown)=> {
            console.log(dropdown.getValue());
            this.queryController.executeQuery()
        }, this.options.title);
        this.element.appendChild(this.dropdown.build());

        this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    }

    private handleBuildingQuery(args: IBuildingQueryEventArgs ) {
      //  args.queryBuilder.advancedExpression.addFieldExpression('@year', '==', [this.dropdown.getValue()])
    }
}
Initialization.registerAutoCreateComponent(SimpleFilter);

SimpleFilter.doExport();