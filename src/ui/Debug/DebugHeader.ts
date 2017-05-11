import { IComponentBindings } from '../Base/ComponentBindings';
import { Checkbox } from '../FormWidgets/Checkbox';
import { COMPONENT_OPTIONS_ATTRIBUTES } from '../../models/ComponentOptionsModel';
import { TextInput } from '../FormWidgets/TextInput';
import { $$ } from '../../utils/Dom';

export class DebugHeader {
  private debug = false;
  private enableQuerySyntax = false;
  private highlightRecommendation = false;
  private search: HTMLElement;

  constructor(public element: HTMLElement, public bindings: IComponentBindings, public onSearch: (value: string)=> void, public infoToDebug: any) {

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

  private buildEnableDebugCheckbox(search: HTMLElement) {
    const chkbox = new Checkbox((chkboxInstance) => {
      this.debug = chkboxInstance.isSelected();

      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
      let input = search.querySelector('input') as HTMLInputElement;
      input.value = '';
    }, 'Enable query debug');
    if (this.debug) {
      chkbox.select();
    }
    return chkbox.build();
  }

  private buildEnableQuerySyntaxCheckbox() {
    const chkbox = new Checkbox((chkboxInstance) => {
      this.enableQuerySyntax = chkboxInstance.isSelected();
      this.bindings.componentOptionsModel.set(COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, {enableQuerySyntax: this.enableQuerySyntax});
      this.bindings.queryController.executeQuery({
        closeModalBox: false
      })
    }, 'Enable query syntax in search box');
    if (this.enableQuerySyntax) {
      chkbox.select();
    }
    return chkbox.build();
  }

  private buildEnabledHighlightRecommendation() {
    const chkbox = new Checkbox((chkboxInstance) => {
      this.highlightRecommendation = chkboxInstance.isSelected();
      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
    }, 'Highlight recommendation');
    if (this.highlightRecommendation) {
      chkbox.select();
    }
    return chkbox.build();
  }

  private downloadHref() {
    return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.infoToDebug));
  }
}
