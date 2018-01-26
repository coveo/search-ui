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
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { SimpleFilterValues } from './SimpleFilterValues';
import { FacetUtils } from '../Facet/FacetUtils';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { analyticsActionCauseList, IAnalyticsSimpleFilterMeta } from '../Analytics/AnalyticsActionListMeta';

export interface ISimpleFilterOptions {
  title: string;
  values: string[];
  field: IFieldOption;
  valueCaption: any;
  maximumNumberOfValues: number;
}

interface ILabeledCheckbox {
  checkbox: Checkbox;
  label: string;
}

/**
 * The `SimpleFilter` component displays a dropdown menu containing field values which the end user can select to filter
 * the query results.
 *
 * The list of available field values in the dropdown menu can either be static (defined through the
 * [`values`]{@link SimpleFilter.options.values} option), or dynamic (automatically obtained through a
 * [`GroupByRequest`]{@link IGroupByRequest} operation performed at the same time as the main query).
 */
export class SimpleFilter extends Component {
  static ID = 'SimpleFilter';
  static doExport = () => {
    exportGlobally({
      SimpleFilter: SimpleFilter
    });
  };
  /**
   * The possible options for the SimpleFilter.
   * @componentOptions
   */
  static options: ISimpleFilterOptions = {
    /**
     * Specifies the maximum number of field values to display in the `SimpleFilter` dropdown menu.
     *
     * Default value is `5`. Minimum value is `0`.
     */
    maximumNumberOfValues: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 }),

    /**
     * Specifies a static list of field values to display in the `SimpleFilter` dropdown menu.
     *
     * This option is undefined by default, which means that the component generates a dynamic list of field values
     * by performing a [`GroupByRequest`]{@link IGroupByRequest} operation at the same time as the main query.
     */
    values: ComponentOptions.buildListOption<string>(),

    /**
     * Specifies the field whose values the `SimpleFilter` should output result filters from.
     *
     * Specifying a value for this option is required for the `SimpleFilter` component to work.
     */
    field: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * Specifies the title to display for the `SimpleFilter`.
     *
     * Default value is the localized string for `NoTitle`.
     */
    title: ComponentOptions.buildStringOption({ defaultValue: l('NoTitle') }),

    /**
     * Specifies a JSON object describing a mapping of `SimpleFilter` values to their desired captions.
     *
     * **Examples:**
     *
     * * You can set the option in the ['init']{@link init} call:
     * ```javascript
     * var myValueCaptions = {
     *   "txt" : "Text files",
     *   "html" : "Web page",
     *   [ ... ]
     * };
     *
     * Coveo.init(document.querySelector("#search"), {
     *   SimpleFilter : {
     *     valueCaption : myValueCaptions
     *   }
     * });
     * ```
     *
     * * Or before the `init` call, using the ['options']{@link options} top-level function:
     * ```javascript
     * Coveo.options(document.querySelector("#search"), {
     *   SimpleFilter : {
     *     valueCaption : myValueCaptions
     *   }
     * });
     * ```
     *
     * * Or directly in the markup:
     * ```html
     * <!-- Ensure that the double quotes are properly handled in `data-value-caption`. -->
     * <div class='CoveoSimpleFilter' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
     * ```
     */
    valueCaption: ComponentOptions.buildJsonOption()
  };

  private valueContainer: Dom;
  private checkboxes: ILabeledCheckbox[];
  private previouslySelected: string[] = [];
  private circleElement: Dom;
  private backdrop: Dom;
  private selectTitle: Dom;
  private groupByRequestValues: string[] = [];
  private isSticky: boolean = false;
  private groupByBuilder: SimpleFilterValues;

  /**
   * Creates a new `SimpleFilter` component. Binds multiple query events as well.
   * @param element the HTMLElement on which to instantiate the component.
   * @param options The options for the `SimpleFilter` component.
   * @param bindings The bindings that the component requires to function normally.
   */
  constructor(public element: HTMLElement, public options: ISimpleFilterOptions, public bindings?: IComponentBindings) {
    super(element, SimpleFilter.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SimpleFilter, options);
    this.element.title = this.options.title;
    this.buildContent();
    $$(this.element).on('click', (e: Event) => this.handleClick(e));
    $$(this.element).setAttribute('tabindex', '0');
    this.bindKeyboardEvents();
    this.bind.onRootElement(BreadcrumbEvents.populateBreadcrumb, (args: IPopulateBreadcrumbEventArgs) =>
      this.handlePopulateBreadcrumb(args)
    );
    this.bind.onRootElement(BreadcrumbEvents.clearBreadcrumb, () => this.handleClearBreadcrumb());
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
  }

  /**
   * Gets the `SimpleFilter` `valueContainer`.
   * @returns {Dom} The `SimpleFilter` valueContainer.
   */
  public getValueContainer(): Dom {
    return this.valueContainer;
  }

  /**
   * Gets the caption of a specific field value.
   * @param value The field value whose caption the method should attempt to get.
   * @returns {any} The value caption, if available; the original value otherwise.
   */
  public getValueCaption(value: string): string {
    let ret = value;

    if (_.contains(_.keys(this.options.valueCaption), value)) {
      ret = this.options.valueCaption[ret] || ret;
      return l(ret);
    } else {
      return FacetUtils.tryToGetTranslatedCaption(this.options.field.toString(), ret);
    }
  }

  /**
   * Gets the captions of the currently selected field values in the `SimpleFilter`.
   * @returns {string[]} An array containing the selected captions.
   */
  public getSelectedCaptions(): string[] {
    return _.map(this.getSelectedValues(), (selectedValue: string) => this.getValueCaption(selectedValue));
  }

  /**
   * Opens or closes the `SimpleFilter` `valueContainer`, depending on its current state.
   */
  public toggleContainer() {
    $$(this.valueContainer).hasClass('coveo-simplefilter-value-container-expanded') ? this.closeContainer() : this.openContainer();
  }

  /**
   * Selects the specified value. Also triggers a query, by default.
   * @param value The value to select.
   * @param triggerQuery `true` by default. If set to `false`, the method triggers no query.
   */
  public selectValue(value: string, triggerQuery = true) {
    _.each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
      const translated = this.getValueCaption(labeledCheckbox.label);
      if (labeledCheckbox.label == value || translated == value) {
        labeledCheckbox.checkbox.select(triggerQuery);
      }
    });
  }

  /**
   * Un-selects the specified value.
   * @param value The value whose state the method should reset.
   */
  public deselectValue(value: string) {
    _.each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
      const translated = this.getValueCaption(labeledCheckbox.label);
      if (labeledCheckbox.label == value || translated == value) {
        labeledCheckbox.checkbox.reset();
      }
    });
  }

  /**
   * Selects or un-selects the specified value, depending on its current state.
   * @param value The value whose state the method should toggle.
   */
  public toggleValue(value: string) {
    _.each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
      const translated = this.getValueCaption(labeledCheckbox.label);
      if (labeledCheckbox.label == value || translated == value) {
        labeledCheckbox.checkbox.toggle();
      }
    });
  }

  /**
   * Resets the component to its original state.
   */
  public resetSimpleFilter() {
    _.each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
      if (labeledCheckbox.checkbox.isSelected()) {
        this.deselectValue(labeledCheckbox.label);
      }
    });
  }

  /**
   * Opens the `SimpleFilter` `valueContainer`.
   */
  public openContainer() {
    $$(this.element).addClass('coveo-simplefilter-value-container-expanded');
    this.valueContainer.addClass('coveo-simplefilter-value-container-expanded');
    this.refreshValueContainer();
    this.isSticky = true;
    if (!this.backdrop.hasClass('coveo-dropdown-background-active')) {
      this.showBackdrop();
    }
  }

  /**
   * Closes the `SimpleFilter` `valueContainer`.
   */
  public closeContainer() {
    $$(this.element).removeClass('coveo-simplefilter-value-container-expanded');
    this.valueContainer.removeClass('coveo-simplefilter-value-container-expanded');
    if (this.backdrop.hasClass('coveo-dropdown-background-active')) {
      this.hideBackdrop();
    }
    if (this.getSelectedLabeledCheckboxes().length == 0) {
      this.isSticky = false;
    }
  }

  private getSelectedValues() {
    return _.map(this.getSelectedLabeledCheckboxes(), (labeledCheckbox: ILabeledCheckbox) => labeledCheckbox.label);
  }

  private bindKeyboardEvents() {
    // On "ENTER" keypress, we can either toggle the container if that is the top level element (this.element)
    // Or toggle a filter selection, using the text of the label.
    $$(this.element).on(
      'keyup',
      KeyboardUtils.keypressAction(KEYBOARD.ENTER, e => {
        if (e.target == this.element) {
          this.toggleContainer();
        } else {
          this.toggleValue($$(e.target).text());
        }
      })
    );

    // When navigating with "TAB" keypress, close the container if we are navigating out of the top level element.
    // Navigating "inside" the SimpleFilter (relatedTarget.parent) should not close the container, but will simply navigate to the next filter selection
    $$(this.element).on('blur', (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (!$$(relatedTarget).parent(Component.computeCssClassName(SimpleFilter))) {
        this.closeContainer();
      }
    });
  }

  private handleClick(e: Event) {
    e.stopPropagation();
    if (e.target == this.element) {
      this.toggleContainer();
    }
  }

  private handleValueToggle(checkbox: Checkbox) {
    const selectedValues = this.getSelectedValues();
    this.circleElement.text(selectedValues.length.toString());
    this.circleElement.removeClass('coveo-simplefilter-circle-hidden');
    if (selectedValues.length == 1) {
      this.setDisplayedTitle(this.getValueCaption(selectedValues[0]));
      this.element.title = this.getValueCaption(selectedValues[0]);
    } else {
      this.setDisplayedTitle(this.options.title);
      this.element.title = this.options.title;

      if (selectedValues.length < 1) {
        this.circleElement.addClass('coveo-simplefilter-circle-hidden');
      }
    }
    const action = checkbox.isSelected()
      ? analyticsActionCauseList.simpleFilterSelectValue
      : analyticsActionCauseList.simpleFilterDeselectValue;
    this.usageAnalytics.logSearchEvent<IAnalyticsSimpleFilterMeta>(action, {
      simpleFilterTitle: this.options.title,
      simpleFilterSelectedValue: checkbox.label,
      simpleFilterField: <string>this.options.field
    });
    this.queryController.executeQuery();
  }

  private createCheckbox(label: string) {
    const checkbox = new Checkbox(() => {
      this.handleValueToggle(checkbox);
    }, this.getValueCaption(label));
    checkbox.getElement().title = l(label);
    $$(checkbox.getElement()).setAttribute('tabindex', '0');
    return { checkbox, label };
  }

  private createCheckboxes() {
    if (this.previouslySelected.length > 0) {
      this.checkboxes = _.map(this.previouslySelected, caption => this.createCheckbox(caption));
      _.each(this.checkboxes, checkbox => {
        if (this.previouslySelected.indexOf(checkbox.label) >= 0) {
          this.selectValue(checkbox.label, false);
        }
      });
    } else if (this.options.values != undefined) {
      this.checkboxes = _.map(this.options.values, caption => this.createCheckbox(caption));
    } else if (this.groupByRequestValues != undefined) {
      this.checkboxes = _.map(this.groupByRequestValues, caption => this.createCheckbox(caption));
    }
    _.each(this.checkboxes, result => {
      this.valueContainer.append(result.checkbox.getElement());
    });
    if (this.checkboxes.length > 0) {
      $$($$(this.checkboxes[this.checkboxes.length - 1].checkbox.getElement()).find('.coveo-checkbox-button')).on('blur', () => {
        this.closeContainer();
      });
    }
  }

  private createValueContainer() {
    this.valueContainer = $$('div', { className: 'coveo-simplefilter-value-container' });
  }

  private buildContent() {
    this.createValueContainer();
    this.element.appendChild(this.buildSelect());
    this.element.appendChild(this.valueContainer.el);
    this.findOrCreateWrapper().append(this.element);
    this.createBackdrop();
  }

  private buildSelect(): HTMLElement {
    const select = $$('span', { className: 'coveo-simplefilter-select' });
    this.selectTitle = $$('span', { className: 'coveo-simplefilter-selecttext' }, this.getValueCaption(this.options.title));
    select.append(this.selectTitle.el);
    select.append(this.buildCircleElement());
    select.append(this.buildSvgToggleUpIcon());
    return select.el;
  }

  private buildSvgToggleUpIcon(): HTMLElement {
    let svgIcon = $$('span', null, SVGIcons.icons.arrowDown).el;
    SVGDom.addClassToSVGInContainer(svgIcon, 'coveo-simplefilter-toggle-down-svg');
    return svgIcon;
  }

  private buildCircleElement(): HTMLElement {
    this.circleElement = $$(
      'span',
      { className: 'coveo-simplefilter-circle coveo-simplefilter-circle-hidden' },
      this.getSelectedLabeledCheckboxes().length.toString()
    );
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
    if (this.getSelectedLabeledCheckboxes().length > 0) {
      const elem = $$('div', { className: 'coveo-simplefilter-breadcrumb' });
      const title = $$('span', { className: 'coveo-simplefilter-breadcrumb-title' }, this.options.title);
      elem.append(title.el);
      const values = $$('span', { className: 'coveo-simplefilter-breadcrumb-values' });
      elem.append(values.el);

      _.each(this.getSelectedLabeledCheckboxes(), selectedlabeledCheckbox => {
        const value = $$('span', { className: 'coveo-simplefilter-breadcrumb-value' }, this.getValueCaption(selectedlabeledCheckbox.label));
        values.append(value.el);
        const svgContainer = $$('span', { className: 'coveo-simplefilter-breadcrumb-clear' }, SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom.addClassToSVGInContainer(svgContainer.el, 'coveo-simplefilter-breadcrumb-clear-svg');
        value.append(svgContainer.el);
        value.el.title = this.getValueCaption(selectedlabeledCheckbox.label);
        $$(value).on('click', () => this.handleRemoveFromBreadcrumb(selectedlabeledCheckbox));
      });

      args.breadcrumbs.push({
        element: elem.el
      });
    }
  }

  private handleRemoveFromBreadcrumb(labeledCheckbox: ILabeledCheckbox) {
    labeledCheckbox.checkbox.reset();
    this.refreshValueContainer();
  }

  private handleClearBreadcrumb() {
    this.usageAnalytics.logSearchEvent<IAnalyticsSimpleFilterMeta>(analyticsActionCauseList.simpleFilterClearAll, {
      simpleFilterTitle: this.options.title,
      simpleFilterField: <string>this.options.field
    });
    this.resetSimpleFilter();
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (data.results.results.length > 0) {
      this.findOrCreateWrapper().removeClass('coveo-no-results');
    } else {
      this.findOrCreateWrapper().addClass('coveo-no-results');
    }

    if (this.options.values == undefined) {
      this.groupByBuilder.groupBy(data);
      this.groupByRequestValues = this.groupByBuilder.getValuesFromGroupBy();
      this.refreshValueContainer();
      if (!$$(this.element).hasClass('coveo-simplefilter-value-container-expanded')) {
        this.isSticky = false;
      }
    }
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    Assert.exists(args);
    Assert.exists(args.queryBuilder);
    const selectedValues = this.getSelectedValues();

    if (selectedValues.length > 0) {
      args.queryBuilder.advancedExpression.addFieldExpression(this.options.field.toString(), '==', selectedValues);
    }
  }

  private handleDoneBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    if (this.options.values == undefined) {
      Assert.exists(data);
      Assert.exists(data.queryBuilder);
      this.previouslySelected = this.getSelectedValues();
      this.groupByBuilder = new SimpleFilterValues(this, this.options);
      this.groupByBuilder.handleDoneBuildingQuery(data);
    }
  }

  private getSelectedLabeledCheckboxes(): ILabeledCheckbox[] {
    return _.filter(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => labeledCheckbox.checkbox.isSelected());
  }

  private setDisplayedTitle(title: string) {
    this.selectTitle.text(this.getValueCaption(title));
  }

  private showBackdrop() {
    this.backdrop.addClass('coveo-dropdown-background-active');
  }

  private hideBackdrop() {
    this.backdrop.removeClass('coveo-dropdown-background-active');
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

  private refreshValueContainer() {
    if (!this.isSticky) {
      this.valueContainer.empty();
      this.createCheckboxes();
    }

    if (this.checkboxes.length == 0 && !this.isSticky) {
      $$(this.element).addClass('coveo-simplefilter-empty');
    } else {
      $$(this.element).removeClass('coveo-simplefilter-empty');
    }
    $$(this.circleElement).text(this.getSelectedLabeledCheckboxes().length.toString());
  }
}

Initialization.registerAutoCreateComponent(SimpleFilter);
