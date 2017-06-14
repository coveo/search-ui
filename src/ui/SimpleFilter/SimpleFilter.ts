import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_SimpleFilter';
import { $$, Dom } from '../../utils/Dom';
import { IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { l } from '../../strings/Strings';
import { Assert } from '../../misc/Assert';
import * as _ from 'underscore';
import { Checkbox } from '../FormWidgets/Checkbox';
import { IGroupByRequest } from '../../rest/GroupByRequest';
import { QueryBuilder } from '../Base/QueryBuilder';
import { Utils } from '../../utils/Utils';
import { BreadcrumbEvents, IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { BreadcrumbValueElement } from '../Facet/BreadcrumbValueElement';
import { BreadcrumbValueList } from '../Facet/BreadcrumbValuesList';




export interface ISimpleFilterOptions {
  title: string;
  values: string[];
  field: IFieldOption;
  valueCaption: any;
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
    field: ComponentOptions.buildFieldOption({ required: true }),
    title: ComponentOptions.buildStringOption({ defaultValue: l('NoTitle') }),
    valueCaption: ComponentOptions.buildJsonOption()
  };

  public checkboxes: { checkbox: Checkbox, value: string }[] = [];
  public checkboxContainer: Dom;
  private expanded = false;
  private circleElement: Dom;

  constructor(public element: HTMLElement, public options: ISimpleFilterOptions, public bindings?: IComponentBindings) {
    super(element, SimpleFilter.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SimpleFilter, options);

    const mainxd = $$(document.body).find('.coveo-main-section');
    const wrapper = $$('div', { className: 'coveo-filter-header-wrapper' });
    const select = $$('span', { className: 'coveo-SimpleFilter-Select' }, l(this.options.title));
    const icon = $$('span', { className: 'coveo-icon' });
    wrapper.insertBefore(mainxd);

    select.el.appendChild(this.buildCircleElement().el);
    select.el.appendChild(icon.el);
    this.element.appendChild(select.el);

    this.checkboxContainer = $$('div', { className: 'coveo-checkbox-container' });
    this.checkboxes = _.map(this.options.values, (value) => this.createCheckboxes(value));
    _.each(this.checkboxes, (result) => {
      this.checkboxContainer.el.appendChild(result.checkbox.getElement());
    });
    this.element.appendChild(this.checkboxContainer.el);
    wrapper.append(this.element);
    $$(this.element).on('click', (e: Event) => this.handleClick(e));

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.groupBy(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));

  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    Assert.exists(args);
    Assert.exists(args.queryBuilder);
    const selectedValues = this.getSelectedValues();
    if (selectedValues.length > 0) {
      args.queryBuilder.advancedExpression.addFieldExpression(this.options.field.toLocaleString(), '==', selectedValues);
    }
  }

  public toggle() {
    if (!this.expanded) {
      this.open();
    } else {
      this.close();
    }
  }

  private handleClick(e: Event) {
    if (e.target == this.element || e.target == $$(this.element).find('.coveo-SimpleFilter-Select') ||
      e.target == $$(this.element).find('.coveo-circle') || e.target == $$(this.element).find('.coveo-icon')) {

      e.stopImmediatePropagation();
      this.toggle();
    }
  }
  private open() {
    this.checkboxContainer.addClass('coveo-checkbox-container-expanded');
    this.expanded = true;
    let backdrop = $$('div', { className: 'coveo-dropdown-background' });
    this.element.parentElement.appendChild(backdrop.el);
  }

  private close() {
    this.checkboxContainer.removeClass('coveo-checkbox-container-expanded');
    this.expanded = false;
    $$(this.element.parentElement).find('.coveo-dropdown-background').remove();
  }

  private handleCheckboxToggle() {
    this.circleElement.text(this.getSelectedValues().length.toString());
    this.queryController.executeQuery();
  }

  private createCheckboxes(value: string) {
    const checkbox = new Checkbox(() => {
      this.handleCheckboxToggle();
    }, l(this.getValueCaption(value)));
    return { checkbox, value };
  }

  public getValueCaption(value: string): string {
    let ret = value;

    if (Utils.exists(this.options.valueCaption)) {
      if (typeof this.options.valueCaption == 'object') {
        ret = this.options.valueCaption[ret] || ret;
      }
    }
    return ret;
  }

  public getSelected(): { checkbox: Checkbox, value: string }[] {
    return _.filter(this.checkboxes, (object: { checkbox: Checkbox, value: string }) => object.checkbox.isSelected());
  }

  public getSelectedValues(): string[] {
    return _.map(this.getSelected(), (object: { checkbox: Checkbox, value: string }) => object.value);
  }

  private buildCircleElement(): Dom {
    this.circleElement = $$('span', { className: 'coveo-circle' }, this.getSelectedValues().length.toString());
    return this.circleElement;
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////
  private groupBy(data: IQuerySuccessEventArgs) {
    const groupByResult = data.results.groupByResults;
    return groupByResult;
  }

  protected createBasicGroupByRequest(allowedValues?: string[], addComputedField: boolean = true): IGroupByRequest {
    const groupByRequest: IGroupByRequest = {
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
    const groupByRequest = this.createBasicGroupByRequest();
    queryBuilder.groupByRequests.push(groupByRequest);
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    const queryBuilder = data.queryBuilder;
    this.putGroupByIntoQueryBuilder(queryBuilder);
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////
}
Initialization.registerAutoCreateComponent(SimpleFilter);
