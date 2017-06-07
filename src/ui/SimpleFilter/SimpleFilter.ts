import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_SimpleFilter';
import { $$, Dom } from '../../utils/Dom';
import {
  IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs,
  QueryEvents
} from '../../events/QueryEvents';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { l } from '../../strings/Strings';
import { Assert } from '../../misc/Assert';
import * as _ from 'underscore';
import { Checkbox } from '../FormWidgets/Checkbox';
import { IGroupByRequest } from '../../rest/GroupByRequest';
import { QueryBuilder } from '../Base/QueryBuilder';
import { IStringMap } from '../../rest/GenericParam';
import { Utils } from '../../utils/Utils';
import { BreadcrumbEvents, IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { BreadcrumbValueElement } from '../Facet/BreadcrumbValueElement';
import { BreadcrumbValueList } from '../Facet/BreadcrumbValuesList';


export interface ISimpleFilterOptions {
  title: string;
  values: string[];
  field: IFieldOption;
  // includeInBreadcrumb: boolean,
  valueCaption?: any;
}

export class SimpleFilter extends Component {
  static ID = 'SimpleFilter';
  static doExport = () => {
    exportGlobally({
      'SimpleFilter': SimpleFilter
    });
  }
  static options: ISimpleFilterOptions = {

    values: ComponentOptions.buildListOption<string>(),
    field: ComponentOptions.buildFieldOption({ required: true, groupByField: true, section: 'Identification' }),
    title: ComponentOptions.buildStringOption({ defaultValue: l('NoTitle') }),
    // includeInBreadcrumb: ComponentOptions.buildBooleanOption({defaultValue : true}),
    valueCaption: ComponentOptions.buildCustomOption<IStringMap<string>>(() => {
      return null;
    }),
  };

  public checkboxes: { checkbox: Checkbox, value: string }[] = [];
  public checkboxContainer: Dom;
  private expanded = false;

  constructor(public element: HTMLElement, public options: ISimpleFilterOptions, public bindings?: IComponentBindings) {
    super(element, SimpleFilter.ID, bindings);
    this.type = 'SimpleFilter';
    this.options = ComponentOptions.initComponentOptions(element, SimpleFilter, options);

    let select = $$('select', { className: 'select' });
    let option = $$('option', { className: 'option' });
    option.el.innerText = l(this.options.title);
    select.el.appendChild(option.el);

    let overselect = $$('div', { className: 'overselect' });
    const multiselect = $$('div', { className: 'multiselect' });
    multiselect.el.appendChild(select.el);
    multiselect.el.appendChild(overselect.el);
    this.element.appendChild(multiselect.el);

    this.checkboxContainer = $$('div', { className: 'checkboxes' });
    this.checkboxes = _.map(this.options.values, (value) => this.createCheckboxes(value));
    _.each(this.checkboxes, (result) => {
      this.checkboxContainer.el.appendChild(result.checkbox.getElement());
    });
    this.element.appendChild(this.checkboxContainer.el);

    $$(document.body).on('click', (e: Event) => {
      let target = <Element>e.target;

      if (overselect.el == e.target) {
        this.onClick();
      } else {
        while (target != this.element) {
          if (target != this.root && target.parentElement != null) {
            target = target.parentElement;
          }
          if ((target == this.root || target.parentElement == null) && this.expanded) {
            this.onClick();
            break;
          } else if ((target == this.root || target.parentElement == null) && !this.expanded) {
            break;
          }
        }
      }
    });
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.groupBy(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));

  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    Assert.exists(args);
    Assert.exists(args.queryBuilder);
    let selectedValues = this.getSelectedValues();
    if (selectedValues.length > 0) {
      args.queryBuilder.advancedExpression.addFieldExpression(this.options.field.toLocaleString(), '==', selectedValues);
    }
  }

  public onClick() {

    if (!this.expanded) {
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

  private createCheckboxes(value: string) {
    const checkbox = new Checkbox(() => {
      this.onCheck();
    }, l(this.getValueCaption(value)));
    return { checkbox, value };
  }

  public getValueCaption(value: string): string {
    let lookupValue = value;
    let ret = lookupValue;

    if (Utils.exists(this.options.valueCaption)) {
      if (typeof this.options.valueCaption == 'object') {
        ret = this.options.valueCaption[lookupValue] || ret;
      }
    }
    return ret;
  }

  public getSelected() {
    return _.filter(this.checkboxes, (object: { checkbox: Checkbox, value: string }) => object.checkbox.isSelected());
  }

  public getSelectedValues() {
    return _.map(this.getSelected(), (object: { checkbox: Checkbox, value: string }) => object.value);
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////
  private groupBy(data: IQuerySuccessEventArgs) {
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

  // ///////////////////////////////////////////////////////////////////////////////////////////////
}
Initialization.registerAutoCreateComponent(SimpleFilter);
