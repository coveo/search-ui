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
import {IQueryResults} from '../../rest/QueryResults';
import {lab} from 'd3';
import {SimpleFilterGroupByValues} from './SimpleFilterGroupByValues';

export interface ISimpleFilterOptions {
  title: string;
  values: string[];
  field: IFieldOption;
  valueCaption: any;
  allowedValues: string[];
  maximumNumberOfValues: number;
}

interface ILabeledCheckbox {
  checkbox: Checkbox
  label: string
}

export class SimpleFilter extends Component {
  static ID = 'SimpleFilter';
  static doExport = () => {
    exportGlobally({
      'SimpleFilter': SimpleFilter
    });
  }

  static options: ISimpleFilterOptions = {
    maximumNumberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5 }),
    values: ComponentOptions.buildListOption<string>(),
    field: ComponentOptions.buildFieldOption({ required: true }),
    allowedValues: ComponentOptions.buildListOption<string>({defaultValue: []}),
    title: ComponentOptions.buildStringOption({ defaultValue: l('NoTitle') }),
    valueCaption: ComponentOptions.buildJsonOption()
  };

  public checkboxes: ILabeledCheckbox [];
  public checkboxContainer: Dom;
  private circleElement: Dom;
  private backdrop: Dom;
  private selectTitle: Dom;
  private computedValues: string [] = [];
  private isSticky: boolean = false;
  private groupByBuilder: SimpleFilterGroupByValues;

  constructor(public element: HTMLElement, public options: ISimpleFilterOptions, public bindings?: IComponentBindings) {
    super(element, SimpleFilter.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SimpleFilter, options);
    this.element.title = this.options.title;
    this.buildContent();
    $$(this.element).on('click', (e: Event) => this.handleClick(e));
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) => this.handlePopulateBreadcrumb(args));
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.handleClearBreadcrumb());
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleGroupBy(args));
  }

  public getValueCaption(value: string): string {
    let ret = value;

    if (Utils.exists(this.options.valueCaption)) {
      ret = this.options.valueCaption[ret] || ret;
    }
    return l(ret);
  }

  public getSelectedCaptions(): string[] {
    return _.map(this.getSelectedLabeledCheckboxes(), (labeledCheckbox: ILabeledCheckbox) => labeledCheckbox.label);
  }

  public toggle() {
    $$(this.checkboxContainer).hasClass('coveo-simplefilter-checkbox-container-expanded') ? this.closeContainer() : this.openContainer();
  }

  public openContainer() {
    $$(this.element).addClass('coveo-simplefilter-checkbox-container-expanded');
    this.checkboxContainer.addClass('coveo-simplefilter-checkbox-container-expanded');
    this.refreshCheckboxContainer();
    this.isSticky = true;
    if (!this.backdrop.hasClass('coveo-dropdown-background-active')) {
      this.showBackdrop();
    }
  }

  public closeContainer() {
    $$(this.element).removeClass('coveo-simplefilter-checkbox-container-expanded');
    this.checkboxContainer.removeClass('coveo-simplefilter-checkbox-container-expanded');
    this.options.allowedValues = this.getSelectedCaptions();
    if (this.backdrop.hasClass('coveo-dropdown-background-active')) {
      this.hideBackdrop();
    }
    if(this.getSelectedCaptions().length == 0) {
      this.isSticky = false;
    }
  }

  private handleClick(e: Event) {

    if (e.target == this.element) {
      this.toggle();
    }
  }

  private handleCheckboxToggle() {
    const selectedValues = this.getSelectedCaptions();
    this.circleElement.text(selectedValues.length.toString());
    if (selectedValues.length == 1) {
      this.setDisplayedTitle(l(selectedValues[0]));
    } else {
      this.setDisplayedTitle(this.options.title);
    }
    this.queryController.executeQuery();
  }

  private createCheckbox(label: string) {

    const checkbox = new Checkbox(() => {
      this.handleCheckboxToggle();
    }, l(this.getValueCaption(label)));

    return { checkbox, label };
  }

  private createCheckboxes() {

    if(this.options.allowedValues.length > 0) {
      this.checkboxes = _.map(this.options.allowedValues, (caption) => this.createCheckbox(caption));
      _.each(this.checkboxes, (checkbox) => {
        if (this.options.allowedValues.indexOf(checkbox.label) >= 0) {
          checkbox.checkbox.select(false);
        }
      })
    } else if(this.options.values != undefined) {
      this.checkboxes = _.map(this.options.values, (caption) => this.createCheckbox(caption));
    } else if(this.computedValues != undefined){
      this.checkboxes = _.map(this.computedValues, (caption) => this.createCheckbox(caption));
    }
    _.each(this.checkboxes, (result) => {
      this.checkboxContainer.el.appendChild(result.checkbox.getElement());
    });
}

  private createCheckboxContainer() {
    this.checkboxContainer = $$('div', { className: 'coveo-simplefilter-checkbox-container' });
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
    this.circleElement = $$('span', { className: 'coveo-simplefilter-circle' }, this.getSelectedCaptions().length.toString());
    return this.circleElement.el;
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

    if (this.getSelectedCaptions().length > 0) {
      const elem = $$('div', { className: 'coveo-simplefilter-breadcrumb' });
      const title = $$('span', { className: 'coveo-simplefilter-breadcrumb-title' }, this.options.title);
      elem.el.appendChild(title.el);
      const values = $$('span', { className: 'coveo-simplefilter-breadcrumb-values' });
      elem.el.appendChild(values.el);

      _.each(this.getSelectedCaptions(), (selectedValue) => {
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

    _.each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
      if (l(labeledCheckbox.label) == label) {
        labeledCheckbox.checkbox.reset();
        this.refreshCheckboxContainer();
      }
    });
  }

  private handleClearBreadcrumb() {

    _.each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
      if (labeledCheckbox.checkbox.isSelected()) {
        labeledCheckbox.checkbox.toggle();
      }
    });
  }

  private handleGroupBy(data: IQuerySuccessEventArgs) {

    if(this.options.values == undefined) {
      this.groupByBuilder.groupBy(data);
      this.computedValues = this.groupByBuilder.getComputedValues();
      this.refreshCheckboxContainer();
      if (!$$(this.element).hasClass('coveo-simplefilter-checkbox-container-expanded')) {
        this.isSticky = false;
      }
    }
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    Assert.exists(args);
    Assert.exists(args.queryBuilder);
    const selectedValues = this.getSelectedCaptions();

    if (selectedValues.length > 0) {
      args.queryBuilder.advancedExpression.addFieldExpression(this.options.field.toString(), '==', selectedValues);
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {

    if(this.options.values == undefined) {
      Assert.exists(data);
      Assert.exists(data.queryBuilder);
      this.options.allowedValues = this.getSelectedCaptions();
      this.groupByBuilder = new SimpleFilterGroupByValues(this, this.options);
      this.groupByBuilder.handleDoneBuildingQuery(data);
    }
  }

  private getSelectedLabeledCheckboxes(): ILabeledCheckbox[] {
    return _.filter(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => labeledCheckbox.checkbox.isSelected());
  }

  private setDisplayedTitle(title: string) {
    this.selectTitle.text(title);
  }

  private getDisplayedTitle(): string {
    return this.selectTitle.text();
  }

  private showBackdrop() {
    this.backdrop.addClass('coveo-dropdown-background-active');
  }

  private hideBackdrop() {
    this.backdrop.removeClass('coveo-dropdown-background-active');
  }

  private getBackdrop(): Dom {
    return this.backdrop;
  }

  private findOrCreateWrapper() {

    if ($$(this.root).find('.coveo-simplefilter-header-wrapper') == null) {
      const wrapper = $$('div', { className: 'coveo-simplefilter-header-wrapper' });
      wrapper.insertBefore(this.element);
      return wrapper;
    } else {
      const wrapper = $$(this.root).find('.coveo-simplefilter-header-wrapper');
      return $$(wrapper);
    }
  }

  private refreshCheckboxContainer() {

    if(!this.isSticky) {
      this.checkboxContainer.empty();
      this.createCheckboxes();
    }

    if(this.checkboxes.length == 0 && !this.isSticky) {
      $$(this.element).addClass('coveo-simplefilter-empty');
    } else {
      $$(this.element).removeClass('coveo-simplefilter-empty');
    }
    $$(this.circleElement).text(this.getSelectedCaptions().length.toString());
  }

}

Initialization.registerAutoCreateComponent(SimpleFilter);
