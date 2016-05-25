import {IPopulateOmniboxEventArgs} from '../../events/OmniboxEvents';
import {StringUtils} from '../../utils/StringUtils';
import {DomUtils} from '../../utils/DomUtils';
import {$$} from '../../utils/Dom';

export interface SuggestionForOmniboxOptionsOnSelect {
  (value: string, args: IPopulateOmniboxEventArgs): void;
}

export interface SuggestionForOmniboxOptions {
  omniboxZIndex?: number;
  headerTitle?: string;
  onSelect?: SuggestionForOmniboxOptionsOnSelect;
  numberOfSuggestions?: number;
}

export interface SuggestionForOmniboxTemplate {
  header?: {
    template: (...args: any[]) => string;
    title: string;
  };
  row: (...args: any[]) => string;
}

export interface SuggestionForOmniboxResult {
  value: string;
}

export class SuggestionForOmnibox {

  constructor(public structure: SuggestionForOmniboxTemplate, public onSelect: (value: string, args: IPopulateOmniboxEventArgs) => void) {
  }

  public buildOmniboxElement(results: SuggestionForOmniboxResult[], args: IPopulateOmniboxEventArgs): HTMLElement {
    let element: HTMLElement;
    if (results.length != 0) {
      element = $$('div').el;
      if (this.structure.header) {
        let header = this.buildElementHeader();
        element.appendChild(header);
      }
      let rows = this.buildRowElements(results, args);
      _.each(rows, (row) => {
        element.appendChild(row);
      })
    }
    return element;
  }

  private buildElementHeader(): HTMLElement {
    return $$('div', undefined, this.structure.header.template({
      headerTitle: this.structure.header.title
    })).el;
  }

  private buildRowElements(results: SuggestionForOmniboxResult[], args: IPopulateOmniboxEventArgs): HTMLElement[] {
    let ret = [];
    _.each(results, (result) => {
      let row = $$('div', undefined, this.structure.row({
        rawValue: result.value,
        data: DomUtils.highlightElement(result.value, args.completeQueryExpression.word)
      })).el;
      $$(row).on('click', () => {
        this.onSelect.call(this, result.value, args);
      })
      $$(row).on('keyboardSelect', () => {
        this.onSelect.call(this, result.value, args);
      })
      ret.push(row)
    })
    return ret;
  }
}
