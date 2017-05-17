import { IComponentBindings } from '../Base/ComponentBindings';
import { Checkbox } from '../FormWidgets/Checkbox';
import { COMPONENT_OPTIONS_ATTRIBUTES } from '../../models/ComponentOptionsModel';
import { TextInput } from '../FormWidgets/TextInput';
import { $$ } from '../../utils/Dom';
import { ResultListEvents, IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { InitializationEvents } from '../../events/InitializationEvents';
import { stringify } from 'circular-json';

export class DebugHeader {
  private debug = false;
  private enableQuerySyntax = false;
  private highlightRecommendation = false;
  private search: HTMLElement;

  constructor(public root: HTMLElement, public element: HTMLElement, public bindings: IComponentBindings, public onSearch: (value: string) => void, public infoToDebug: any) {
    this.element.appendChild(this.buildEnabledHighlightRecommendation());
    this.element.appendChild(this.buildEnableDebugCheckbox());
    this.element.appendChild(this.buildEnableQuerySyntaxCheckbox());
    this.element.appendChild(this.buildSearch());
    this.element.appendChild(this.buildDownloadLink());

    // After components initialization ensure any component that might modify the result will have the chance to do their job before we display debug info
    $$(this.root).on(InitializationEvents.afterInitialization, () => {
      $$(this.root).on(ResultListEvents.newResultDisplayed, (e, args: IDisplayedNewResultEventArgs) => this.handleNewResultDisplayed(args));
    });
    $$(this.root).on(QueryEvents.buildingQuery, (e, args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
  }

  private handleNewResultDisplayed(args: IDisplayedNewResultEventArgs) {
    if (args.item != null && args.result.isRecommendation && this.highlightRecommendation) {
      $$(args.item).addClass('coveo-is-recommendation');
    }
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    args.queryBuilder.enableDebug = this.debug || args.queryBuilder.enableDebug;
  }

  private buildSearch() {
    const txtInput = new TextInput((txtInputInstance) => {
      const value = txtInputInstance.getValue().toLowerCase();
      this.onSearch(value);
    }, 'Search in debug');
    this.search = txtInput.build();
    return this.search;
  }

  private buildDownloadLink() {
    const downloadLink = $$('a', {
      download: 'debug.json',
      'href': this.downloadHref()
    }, 'Download');
    return downloadLink.el;
  }

  private buildEnableDebugCheckbox() {
    const checkbox = new Checkbox((chkboxInstance) => {
      this.debug = chkboxInstance.isSelected();

      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
      let input = this.search.querySelector('input') as HTMLInputElement;
      input.value = '';
    }, 'Enable query debug');
    if (this.debug) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildEnableQuerySyntaxCheckbox() {
    const checkbox = new Checkbox((chkboxInstance) => {
      this.enableQuerySyntax = chkboxInstance.isSelected();
      this.bindings.componentOptionsModel.set(COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, { enableQuerySyntax: this.enableQuerySyntax });
      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
    }, 'Enable query syntax in search box');
    if (this.enableQuerySyntax) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildEnabledHighlightRecommendation() {
    const checkbox = new Checkbox((chkboxInstance) => {
      this.highlightRecommendation = chkboxInstance.isSelected();
      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
    }, 'Highlight recommendation');
    if (this.highlightRecommendation) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private downloadHref() {
    return 'data:text/json;charset=utf-8,' + encodeURIComponent(stringify(this.infoToDebug));
  }
}
