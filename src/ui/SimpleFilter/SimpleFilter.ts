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
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

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
  private circleElement: Dom;
  private backdrop: Dom;
  private selectTitle: Dom;

  constructor(public element: HTMLElement, public options: ISimpleFilterOptions, public bindings?: IComponentBindings) {
    super(element, SimpleFilter.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SimpleFilter, options);
    this.element.title = this.options.title;
    this.buildContent();
    $$(this.element).on('click', (e: Event) => this.handleClick(e));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.handleClearBreadcrumb());
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.groupBy(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
  }

  public getValueCaption(value: string): string {
    let ret = value;

    if (Utils.exists(this.options.valueCaption)) {
      ret = this.options.valueCaption[ret] || ret;
    }
    return ret;
  }

  public getSelected(): { checkbox: Checkbox, value: string }[] {
    return _.filter(this.checkboxes, (object: { checkbox: Checkbox, value: string }) => object.checkbox.isSelected());
  }

  public getSelectedValues(): string[] {
    return _.map(this.getSelected(), (object: { checkbox: Checkbox, value: string }) => object.value);
  }

  public toggle() {
    $$(this.checkboxContainer).hasClass('coveo-checkbox-container-expanded') ? this.closeContainer() : this.openContainer();
  }

  public openContainer() {
    $$(this.element).addClass('coveo-checkbox-container-expanded');
    this.checkboxContainer.addClass('coveo-checkbox-container-expanded');
    if (this.backdrop.hasClass('coveo-dropdown-background-active') == false) {
      this.showBackdrop();
    }
  }

  public closeContainer() {
    $$(this.element).removeClass('coveo-checkbox-container-expanded');
    this.checkboxContainer.removeClass('coveo-checkbox-container-expanded');
    if (this.backdrop.hasClass('coveo-dropdown-background-active') == true) {
      this.hideBackdrop();
    }
  }

  public setDisplayedTitle(title: string) {
    this.selectTitle.text(title);
  }

  public getDisplayedTitle(): string {
    return this.selectTitle.text();
  }

  public getBackdrop(): Dom {
    return this.backdrop;
  }

  public putGroupByIntoQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);
    const groupByRequest = this.createBasicGroupByRequest();
    queryBuilder.groupByRequests.push(groupByRequest);
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

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    Assert.exists(args);
    Assert.exists(args.queryBuilder);
    const selectedValues = this.getSelectedValues();
    if (selectedValues.length > 0) {
      args.queryBuilder.advancedExpression.addFieldExpression(this.options.field.toString(), '==', selectedValues);
    }
  }

  private handleClick(e: Event) {
    if (e.target == this.element) {
      this.toggle();
    }
  }

  private handleCheckboxToggle() {
    const selectedValues = this.getSelectedValues();
    this.circleElement.text(selectedValues.length.toString());
    if (selectedValues.length == 1) {
      this.setDisplayedTitle(l(selectedValues[0]));
    } else {
      this.setDisplayedTitle(this.options.title);
    }
    this.queryController.executeQuery();
  }

  private createCheckbox(value: string) {
    const checkbox = new Checkbox(() => {
      this.handleCheckboxToggle();
    }, l(this.getValueCaption(value)));
    return { checkbox, value };
  }

  private createCheckboxContainer() {
    this.checkboxContainer = $$('div', { className: 'coveo-checkbox-container' });
    this.checkboxes = _.map(this.options.values, (value) => this.createCheckbox(value));
    _.each(this.checkboxes, (result) => {
      this.checkboxContainer.el.appendChild(result.checkbox.getElement());
    });
  }

  private buildContent() {
    this.createCheckboxContainer();
    this.element.appendChild(this.buildSelect());
    this.element.appendChild(this.checkboxContainer.el);
    this.findOrCreateWrapper().append(this.element);
    this.createBackdrop();
  }

  private buildSelect(): HTMLElement {
    const select = $$('span', { className: 'coveo-simplefilter-select' });
    this.selectTitle = $$('span', { className: 'coveo-simplefilter-selecttext' }, l(this.options.title));
    select.el.appendChild(this.selectTitle.el);
    select.el.appendChild(this.buildCircleElement());
    select.el.appendChild(this.buildSvgToggleUpIcon());
    return select.el;
  }

  private buildSvgToggleUpIcon(): HTMLElement {
    let svgIcon = $$('span', null, SVGIcons.arrowDown).el;
    SVGDom.addClassToSVGInContainer(svgIcon, 'coveo-simplefilter-toggle-down-svg');
    return svgIcon;
  }

  private buildCircleElement(): HTMLElement {
    this.circleElement = $$('span', { className: 'coveo-circle' }, this.getSelectedValues().length.toString());
    return this.circleElement.el;
  }

  private findOrCreateWrapper() {
    if ($$(this.root).find('.coveo-filter-header-wrapper') == null) {
      const wrapper = $$('div', { className: 'coveo-filter-header-wrapper' });
      wrapper.insertBefore(this.element);
      return wrapper;
    } else {
      const wrapper = $$(this.root).find('.coveo-filter-header-wrapper');
      return $$(wrapper);
    }
  }

  private showBackdrop() {
    this.backdrop.addClass('coveo-dropdown-background-active');
  }

  private hideBackdrop() {
    this.backdrop.removeClass('coveo-dropdown-background-active');
  }

  private createBackdrop() {
    const backdrop = $$(this.root).find('.coveo-dropdown-background');
    if (backdrop == null) {
      this.backdrop = $$('div', { className: 'coveo-dropdown-background' });
      this.root.appendChild(this.backdrop.el);
    } else {
      this.backdrop = $$(backdrop);
    }
    this.backdrop.on('click', () => this.closeContainer());
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    if (this.getSelectedValues().length > 0) {
      const elem = $$('div', { className: 'coveo-simplefilter-breadcrumb' });
      const title = $$('span', { className: 'coveo-simplefilter-breadcrumb-title' }, this.options.title);
      elem.el.appendChild(title.el);
      const values = $$('span', { className: 'coveo-simplefilter-breadcrumb-values' });
      elem.el.appendChild(values.el);

      _.each(this.getSelectedValues(), (selectedValue) => {
        const value = $$('span', { className: 'coveo-simplefilter-breadcrumb-value' }, l(selectedValue));
        values.el.appendChild(value.el);
        const svgContainer = $$('span', { className: 'coveo-simplefilter-breadcrumb-clear' }, SVGIcons.checkboxHookExclusionMore);
        SVGDom.addClassToSVGInContainer(svgContainer.el, 'coveo-simplefilter-breadcrumb-clear-svg');
        value.el.appendChild(svgContainer.el);
        value.el.title = l(selectedValue);
        $$(value).on('click', () => this.handleRemoveFromBreadcrumb(value.el.textContent));
      });

      args.breadcrumbs.push({
        element: elem.el
      });
    }
  }

  private handleRemoveFromBreadcrumb(label: string) {
    _.each(this.checkboxes, (object: { checkbox: Checkbox, value: string }) => {
      if (l(object.value) == label) {
        object.checkbox.reset();
      }
    });
  }

  private handleClearBreadcrumb() {
    _.each(this.checkboxes, (object: { checkbox: Checkbox, value: string }) => {
      if (object.checkbox.isSelected()) {
        object.checkbox.toggle();
      }
    });
  }

  private groupBy(data: IQuerySuccessEventArgs) {
    const groupByResult = data.results.groupByResults;
    return groupByResult;
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    const queryBuilder = data.queryBuilder;
    this.putGroupByIntoQueryBuilder(queryBuilder);
  }
}

Initialization.registerAutoCreateComponent(SimpleFilter);
