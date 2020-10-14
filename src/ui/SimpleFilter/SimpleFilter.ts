import 'styling/_SimpleFilter';
import { contains, each, filter, keys, map } from 'underscore';
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { exportGlobally } from '../../GlobalExports';
import { Assert } from '../../misc/Assert';
import { Logger } from '../../misc/Logger';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { $$, Dom } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { analyticsActionCauseList, IAnalyticsSimpleFilterMeta } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption } from '../Base/IComponentOptions';
import { Initialization } from '../Base/Initialization';
import { FacetSortCriterion } from '../Facet/FacetSortCriterion';
import { FacetUtils } from '../Facet/FacetUtils';
import { Checkbox } from '../FormWidgets/Checkbox';
import { SimpleFilterValues } from './SimpleFilterValues';

export interface ISimpleFilterOptions {
  title: string;
  values: string[];
  field: IFieldOption;
  valueCaption: any;
  maximumNumberOfValues: number;
  sortCriteria: string;
  enableClearButton?: boolean;
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
 *
 * @availablesince [November 2017 Release (v2.3477.9)](https://docs.coveo.com/en/373/#november-2017-release-v234779)
 */
export class SimpleFilter extends Component {
  static ID = 'SimpleFilter';
  static doExport = () => {
    exportGlobally({
      SimpleFilter
    });
  };

  static simpleFilterSortCritera() {
    return ['score', 'occurrences', 'alphaascending', 'alphadescending', 'chisquare'];
  }
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
    title: ComponentOptions.buildLocalizedStringOption({ localizedString: () => l('NoTitle') }),

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
    valueCaption: ComponentOptions.buildJsonOption(),
    /**
     *
     * string?
     * The sort criteria to use.
     *
     * **Default:** `score`
     *
     * **Allowed values:**
     *
     * `score`: sort using the score value which is computed from the number of occurrences of a field value, as well as from the position
     * where query result items having this field value appear in the ranked query result set. When using this sort criterion, a field value
     * with 100 occurrences might appear after one with only 10 occurrences, if the occurrences of the latter field value tend to appear higher
     * in the ranked query result set.
     *
     * `occurrences`: sort by number of occurrences, with field values having the highest number of occurrences appearing first.
     *
     * `alphaascending/alphadescending`: sort alphabetically on the field values.
     *
     * `chisquare`: sort based on the relative frequency of field values in the query result set compared to their frequency in the entire index. This means that a field value that does
     * not appear often in the index, but does appear often in the query result set will tend to appear higher.
     *
     * @availablesince [July 2019 Release (v2.6459)](https://docs.coveo.com/en/2938/)
     *
     */
    sortCriteria: ComponentOptions.buildStringOption<FacetSortCriterion>({
      postProcessing: (value, options: ISimpleFilterOptions) => {
        const sortCriteriaToValidate = value || 'score';
        if (SimpleFilter.simpleFilterSortCritera().indexOf(sortCriteriaToValidate.toLowerCase()) !== -1) {
          return sortCriteriaToValidate;
        } else {
          new Logger(SimpleFilter).warn(
            `The simpleFilter component doesn't accept ${sortCriteriaToValidate} as the value for the sortCriteria option.`,
            `Available option are : ${SimpleFilter.simpleFilterSortCritera().toString()}`
          );
          return 'score';
        }
      }
    }),
    /**
     * Whether to show a button to clear all selected values.
     *
     * @availablesince [March 2020 Release (v2.8521)](https://docs.coveo.com/en/3203/)
     */
    enableClearButton: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  private valueContainer: Dom;
  private checkboxes: ILabeledCheckbox[];
  private previouslySelected: string[] = [];
  private circleElement: Dom;
  private clearElement: Dom;
  private backdrop: Dom;
  private selectTitle: Dom;
  private groupByRequestValues: string[] = [];
  private isSticky: boolean = false;
  private groupByBuilder: SimpleFilterValues;
  private shouldTriggerQuery = true;

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

    new AccessibleButton()
      .withElement(this.element)
      .withClickAction((e: Event) => this.handleClick(e))
      .withEnterKeyboardAction((e: KeyboardEvent) => this.handleKeyboardSelect(e))
      .withBlurAction((e: MouseEvent) => this.handleBlur(e))
      .withLabel(this.options.title)
      .build();

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

    if (contains(keys(this.options.valueCaption), value)) {
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
    return map(this.getSelectedValues(), (selectedValue: string) => this.getValueCaption(selectedValue));
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
    each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
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
    each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
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
    each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
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
    each(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => {
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

  public getSelectedValues() {
    return map(this.getSelectedLabeledCheckboxes(), (labeledCheckbox: ILabeledCheckbox) => labeledCheckbox.label);
  }

  private handleClick(e: Event) {
    e.stopPropagation();
    if (e.target == this.element) {
      this.toggleContainer();
    }
  }

  private handleKeyboardSelect(e: Event) {
    if (e.target == this.element) {
      this.toggleContainer();
    } else {
      this.toggleValue($$(e.target as HTMLElement).text());
    }
  }

  private handleBlur(e: MouseEvent) {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget) {
      return;
    }
    if (!$$(relatedTarget).parent(Component.computeCssClassName(SimpleFilter))) {
      this.closeContainer();
    }
  }

  private handleValueToggle(checkbox: Checkbox) {
    const selectedValues = this.getSelectedValues();
    this.circleElement.text(selectedValues.length.toString());
    this.circleElement.removeClass('coveo-simplefilter-circle-hidden');
    this.options.enableClearButton && this.clearElement.show();

    if (selectedValues.length == 1) {
      this.setDisplayedTitle(this.getValueCaption(selectedValues[0]));
      this.element.title = this.getValueCaption(selectedValues[0]);
    } else {
      this.setDisplayedTitle(this.options.title);
      this.element.title = this.options.title;

      if (selectedValues.length < 1) {
        this.circleElement.addClass('coveo-simplefilter-circle-hidden');
        this.options.enableClearButton && this.clearElement.hide();
      }
    }

    if (selectedValues.length == 0) {
      this.isSticky = false;
    }

    const action = checkbox.isSelected()
      ? analyticsActionCauseList.simpleFilterSelectValue
      : analyticsActionCauseList.simpleFilterDeselectValue;

    if (this.shouldTriggerQuery) {
      this.usageAnalytics.logSearchEvent<IAnalyticsSimpleFilterMeta>(action, {
        simpleFilterTitle: this.options.title,
        simpleFilterSelectedValue: checkbox.label,
        simpleFilterField: <string>this.options.field
      });
      this.queryController.executeQuery();
    }
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
      this.checkboxes = map(this.previouslySelected, caption => this.createCheckbox(caption));
      each(this.checkboxes, checkbox => {
        if (this.previouslySelected.indexOf(checkbox.label) >= 0) {
          this.selectValue(checkbox.label, false);
        }
      });
    } else if (this.options.values != undefined) {
      this.checkboxes = map(this.options.values, caption => this.createCheckbox(caption));
    } else if (this.groupByRequestValues != undefined) {
      this.checkboxes = map(this.groupByRequestValues, caption => this.createCheckbox(caption));
    }
    if (
      this.options.sortCriteria.toLocaleLowerCase() === 'alphaascending' ||
      this.options.sortCriteria.toLowerCase() === 'alphadescending'
    ) {
      this.checkboxes.sort((a, b) => a.checkbox.label.localeCompare(b.checkbox.label));
      if (this.options.sortCriteria.toLowerCase() === 'alphadescending') {
        this.checkboxes.reverse();
      }
    }
    each(this.checkboxes, result => {
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
    this.selectTitle = $$('span', { className: 'coveo-simplefilter-selecttext' }, this.options.title);
    select.append(this.selectTitle.el);
    select.append(this.buildCircleElement());
    this.options.enableClearButton && select.append(this.buildClearElement());
    select.append(this.buildSvgToggleUpIcon());
    return select.el;
  }

  private buildSvgToggleUpIcon(): HTMLElement {
    let svgIcon = $$('span', { className: 'coveo-simplefilter-toggle-svg-container' }, SVGIcons.icons.arrowDown).el;
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

  public buildClearElement(): HTMLElement {
    this.clearElement = $$(
      'button',
      {
        title: l('DeselectFilterValues', this.options.title),
        'aria-label': l('Clear', this.options.title),
        className: 'coveo-simplefilter-eraser'
      },
      SVGIcons.icons.mainClear
    );
    this.clearElement.hide();

    this.clearElement.on('click', (evt: Event) => {
      evt.stopPropagation();
      this.handleClear();
    });

    return this.clearElement.el;
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
      const title = $$('span', { className: 'coveo-simplefilter-breadcrumb-title' }, `${this.options.title}:`);
      elem.append(title.el);
      const values = $$('span', { className: 'coveo-simplefilter-breadcrumb-values' });
      elem.append(values.el);

      each(this.getSelectedLabeledCheckboxes(), selectedlabeledCheckbox => {
        const value = $$('span', { className: 'coveo-simplefilter-breadcrumb-value' }, this.getValueCaption(selectedlabeledCheckbox.label));
        values.append(value.el);
        const svgContainer = $$('span', { className: 'coveo-simplefilter-breadcrumb-clear' }, SVGIcons.icons.mainClear);
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
    // Bit of a hack with that flag, but essentially we want "clear breadcrumb" to be a global, unique event.
    // Not something that will log a special event for SimpleFilter (or any component)
    this.resetWithoutTriggeringQuery();
  }

  private handleClear() {
    this.usageAnalytics.logSearchEvent<IAnalyticsSimpleFilterMeta>(analyticsActionCauseList.simpleFilterClearAll, {
      simpleFilterTitle: this.options.title,
      simpleFilterField: <string>this.options.field
    });

    this.resetWithoutTriggeringQuery();
    this.queryController.executeQuery();
  }

  private resetWithoutTriggeringQuery() {
    this.shouldTriggerQuery = false;
    this.resetSimpleFilter();
    this.shouldTriggerQuery = true;
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
    return filter(this.checkboxes, (labeledCheckbox: ILabeledCheckbox) => labeledCheckbox.checkbox.isSelected());
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
