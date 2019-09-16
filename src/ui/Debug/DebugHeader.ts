import { each } from 'underscore';
import { IQueryOptions } from '../../controllers/QueryController';
import { IDoneBuildingQueryEventArgs, QueryEvents } from '../../events/QueryEvents';
import { IDisplayedNewResultEventArgs, ResultListEvents } from '../../events/ResultListEvents';
import { COMPONENT_OPTIONS_ATTRIBUTES } from '../../models/ComponentOptionsModel';
import { $$ } from '../../utils/Dom';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Checkbox } from '../FormWidgets/Checkbox';
import { TextInput } from '../FormWidgets/TextInput';
import { Debug } from './Debug';

export class DebugHeader {
  private debug = false;
  private enableQuerySyntax = false;
  private highlightRecommendation = false;
  private requestAllFields = false;
  private search: TextInput;
  private widgets: HTMLElement[] = [];

  constructor(public debugInstance: Debug, public element: HTMLElement, public onSearch: (value: string) => void, public infoToDebug: any) {
    this.widgets.push(this.buildEnabledHighlightRecommendation());
    this.widgets.push(this.buildEnableDebugCheckbox());
    this.widgets.push(this.buildEnableQuerySyntaxCheckbox());
    this.widgets.push(this.buildRequestAllFieldsCheckbox());
    this.widgets.push(this.buildSearch());
    this.moveTo(element);

    $$(this.root).on(ResultListEvents.newResultDisplayed, (e, args: IDisplayedNewResultEventArgs) => this.handleNewResultDisplayed(args));
    $$(this.root).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
  }

  public moveTo(newElement: HTMLElement) {
    each(this.widgets, (widget: HTMLElement) => newElement.appendChild(widget));
    this.element = newElement;
  }

  public setSearch(onSearch: (value: string) => void) {
    this.onSearch = onSearch;
    this.resetSearchbox();
  }

  public setNewInfoToDebug(newInfoToDebug) {
    this.infoToDebug = newInfoToDebug;
  }

  private resetSearchbox() {
    if (this.search) {
      this.search.reset();
    }
  }

  private get bindings(): IComponentBindings {
    return this.debugInstance.bindings;
  }

  private get root(): HTMLElement {
    return this.debugInstance.element;
  }

  private get queryOptions(): IQueryOptions {
    return {
      closeModalBox: false,
      origin: this.debugInstance
    };
  }

  private handleNewResultDisplayed(args: IDisplayedNewResultEventArgs) {
    if (args.item != null && args.result.isRecommendation && this.highlightRecommendation) {
      $$(args.item).addClass('coveo-is-recommendation');
    }
  }

  private handleDoneBuildingQuery(args: IDoneBuildingQueryEventArgs) {
    args.queryBuilder.enableDebug = this.debug || args.queryBuilder.enableDebug;
    if (this.requestAllFields) {
      args.queryBuilder.fieldsToInclude = undefined;
      args.queryBuilder.includeRequiredFields = false;
    }
  }

  private buildSearch() {
    this.search = new TextInput(txtInputInstance => {
      const value = txtInputInstance.getValue().toLowerCase();
      this.onSearch(value);
    }, 'Search in debug');
    this.search.build();
    return this.search.getElement();
  }

  private buildEnableDebugCheckbox() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.debug = checkboxInstance.isSelected();

      this.bindings.queryController.executeQuery(this.queryOptions);
      this.resetSearchbox();
    }, 'Enable query debug');
    if (this.debug) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildEnableQuerySyntaxCheckbox() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.enableQuerySyntax = checkboxInstance.isSelected();

      this.bindings.componentOptionsModel.set(COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, {
        enableQuerySyntax: this.enableQuerySyntax
      });

      this.bindings.queryController.executeQuery(this.queryOptions);
    }, 'Enable query syntax in search box');
    if (this.enableQuerySyntax) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildRequestAllFieldsCheckbox() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.requestAllFields = checkboxInstance.isSelected();
      this.bindings.queryController.executeQuery(this.queryOptions);
    }, 'Request all fields available');
    if (this.requestAllFields) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildEnabledHighlightRecommendation() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.highlightRecommendation = checkboxInstance.isSelected();
      this.bindings.queryController.executeQuery(this.queryOptions);
    }, 'Highlight recommendation');
    if (this.highlightRecommendation) {
      checkbox.select();
    }
    return checkbox.build();
  }
}
