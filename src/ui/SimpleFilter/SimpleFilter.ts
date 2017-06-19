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
import { BreadcrumbEvents, IBreadcrumbItem, IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';





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

    const select = $$('span', { className: 'coveo-simplefilter-select' });
    const selectText = $$('span', { className: 'coveo-simplefilter-selecttext' }, l(this.options.title));
    const icon = $$('span', { className: 'coveo-icon' });

    this.checkboxContainer = $$('div', { className: 'coveo-checkbox-container' });
    this.checkboxes = _.map(this.options.values, (value) => this.createCheckboxes(value));
    _.each(this.checkboxes, (result) => {
      this.checkboxContainer.el.appendChild(result.checkbox.getElement());
    });

    select.el.appendChild(selectText.el);
    select.el.appendChild(this.buildCircleElement().el);
    select.el.appendChild(icon.el);
    this.element.appendChild(select.el);
    this.element.appendChild(this.checkboxContainer.el);
    this.createWrapper().append(this.element);

    $$(this.element).on('click', (e: Event) => this.handleClick(e));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
    // this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.setStateEmpty());
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
    this.expanded = $$(this.checkboxContainer).hasClass('coveo-checkbox-container-expanded');
    if (!this.expanded) {
      this.open();
    } else if (this.expanded) {
      this.close();
    }
  }

  private handleClick(e: Event) {
    if (e.target == this.element || e.target == $$(this.element).find('.coveo-simplefilter-select') ||
      e.target == $$(this.element).find('.coveo-circle') || e.target == $$(this.element).find('.coveo-icon')
      || e.target == $$(this.element).find('.coveo-simplefilter-selecttext')) {

      e.stopImmediatePropagation();
      this.toggle();
    }
  }


  private open() {
    $$(this.element).addClass('coveo-checkbox-container-expanded');
    this.checkboxContainer.addClass('coveo-checkbox-container-expanded');
    if ($$(document.body).find('.coveo-dropdown-background') == null) {
      let backdrop = $$('div', { className: 'coveo-dropdown-background' });
      backdrop.on('click', () => this.close());
      this.element.parentElement.appendChild(backdrop.el);
    } else {
      const dropdown = $$(document.body).find('.coveo-dropdown-background');
      $$(dropdown).on('click', () => this.close());
    }
  }

  private close() {
    $$(this.element).removeClass('coveo-checkbox-container-expanded');
    this.checkboxContainer.removeClass('coveo-checkbox-container-expanded');
    if ($$(this.element.parentElement).find('.coveo-dropdown-background') != null && $$(document.body).find('.coveo-checkbox-container-expanded') == null) {
      $$(this.element.parentElement).find('.coveo-dropdown-background').remove();
    }
  }

  private handleCheckboxToggle() {
    this.circleElement.text(this.getSelectedValues().length.toString());
    const title = $$(this.element).find('.coveo-simplefilter-selecttext');
    if (this.getSelectedValues().length == 1) {
      $$(title).text(l(this.getSelectedValues()[0]));
    } else {
      $$(title).text(this.options.title);
    }
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

  private createWrapper() {
    if ($$(document.body).find('.coveo-filter-header-wrapper') == null) {
      const mainSection = $$(document.body).find('.coveo-main-section');
      const wrapper = $$('div', { className: 'coveo-filter-header-wrapper' });
      wrapper.insertBefore(mainSection);
      return wrapper;
    } else {
      const wrapper = $$(document.body).find('.coveo-filter-header-wrapper');
      return $$(wrapper);
    }
  }

  private handleRemoveFromBreadcrumb(label: string) {
    _.each(this.checkboxes, (object: { checkbox: Checkbox, value: string }) => {
      if (object.value == label) {
        object.checkbox.toggle();
      }
    });
  }

  // ///////////////////////////////////////BREADCRUMB//////////////////////////////////////////////

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {


    let elem = document.createElement('div');
    $$(elem).addClass('coveo-simplefilter-breadcrumb');

    let title = document.createElement('span');
    $$(title).addClass('coveo-simplefilter-breadcrumb-title');
    $$(title).text(this.options.title);
    elem.appendChild(title);

    let values = document.createElement('span');
    $$(values).addClass('coveo-simplefilter-breadcrumb-values');
    elem.appendChild(values);

    _.each(this.getSelectedValues(), (test) => {
      let value = document.createElement('span');
      $$(value).addClass('coveo-simplefilter-breadcrumb-value');
      $$(value).text(l(test));
      values.appendChild(value);
      let clear = document.createElement('span');
      $$(clear).addClass('coveo-simplefilter-breadcrumb-clear');
      value.appendChild(clear);
      $$(value).on('click', () => this.handleRemoveFromBreadcrumb(value.textContent));
    });




    args.breadcrumbs.push({
      element: elem
    });
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
