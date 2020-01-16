import 'styling/_SortDropdown';
import { findIndex } from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { IQuerySuccessEventArgs, IQueryErrorEventArgs, QueryEvents } from '../../events/QueryEvents';
import { IAttributeChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES, QueryStateModel } from '../../models/QueryStateModel';
import { $$ } from '../../utils/Dom';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { InitializationEvents } from '../../events/InitializationEvents';
import { Sort } from '../Sort/Sort';
import { Dropdown } from '../FormWidgets/Dropdown';
import { l } from '../../strings/Strings';

export interface ISortDropdownOptions {}

/**
 * The `SortDropdown` component renders a dropdown that the end user can interact with to select the criterion to use when sorting query results.
 */
export class SortDropdown extends Component {
  static ID = 'SortDropdown';

  static doExport = () => {
    exportGlobally({
      SortDropdown: SortDropdown
    });
  };

  /**
   * Options for the component
   * @componentOptions
   */
  static options: ISortDropdownOptions = {};

  private dropdown: Dropdown;
  private sortComponents: Sort[] = [];

  /**
   * Creates a new `SortDropdown` component instance.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for this component instance.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ISortDropdownOptions, bindings?: IComponentBindings) {
    super(element, SortDropdown.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, SortDropdown, options);

    this.bind.oneRootElement(InitializationEvents.afterInitialization, () => this.handleAfterInitialization());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.SORT, (args: IAttributeChangedEventArg) =>
      this.handleQueryStateChanged(args)
    );
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, (args: IQueryErrorEventArgs) => this.handleQueryError(args));
  }

  private handleAfterInitialization() {
    this.buildDropdown();
  }

  private buildDropdown() {
    this.sortComponents = this.getSortComponents();
    this.dropdown = new Dropdown(
      () => this.handleChange(),
      this.getValuesForDropdown(),
      value => this.getCaptionForValue(value),
      l('SortBy')
    );
    this.element.appendChild(this.dropdown.getElement());
    this.update();
  }

  private getSortComponents() {
    const sortComponents = $$(this.element)
      .findAll(`.${Component.computeCssClassNameForType('Sort')}`)
      .map(sortElement => {
        const sortCmp = <Sort>Component.get(sortElement, Sort);
        if (sortCmp.options.sortCriteria.length == 1) {
          return sortCmp;
        } else {
          this.logger.warn(
            `Each Sort component inside a SortDropdown should have only one sort criteria. Skipping ${
              sortCmp.options.caption
            } in the SortDropdown.`
          );
          return;
        }
      })
      .filter(sortCmp => sortCmp);

    return sortComponents;
  }

  private getValuesForDropdown(): string[] {
    return this.sortComponents.map(sort => sort.options.sortCriteria.toString());
  }

  private handleQueryStateChanged(data: IAttributeChangedEventArg) {
    this.update();
  }

  private update() {
    if (!this.dropdown) {
      return;
    }

    const sortCriteria = <string>this.queryStateModel.get(QueryStateModel.attributesEnum.sort);
    const itemIndex = this.getSortIndex(sortCriteria);
    itemIndex > -1 && this.dropdown.select(itemIndex, false);

    $$(this.dropdown.getElement()).toggleClass('coveo-selected', itemIndex > -1);
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    data.results.results.length ? this.showElement() : this.hideElement();
  }

  private handleQueryError(data: IQueryErrorEventArgs) {
    this.hideElement();
  }

  private handleChange() {
    const selectedValue = this.dropdown.getValue();
    const sortIndex = this.getSortIndex(selectedValue);
    sortIndex > -1 && this.sortComponents[sortIndex].selectAndExecuteQuery();
  }

  private getCaptionForValue(value: string) {
    const sortIndex = this.getSortIndex(value);
    return sortIndex > -1 ? this.sortComponents[sortIndex].options.caption : '';
  }

  private getSortIndex(itemValue: string) {
    return findIndex(this.sortComponents, sort => sort.options.sortCriteria.toString() === itemValue);
  }

  private hideElement() {
    $$(this.element).hide();
  }

  private showElement() {
    $$(this.element).show();
  }
}

Initialization.registerAutoCreateComponent(SortDropdown);
