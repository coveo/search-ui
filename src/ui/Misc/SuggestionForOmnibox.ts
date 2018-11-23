import { IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { DomUtils } from '../../utils/DomUtils';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';

export interface ISuggestionForOmniboxOptionsOnSelect {
  (value: string, args: IPopulateOmniboxEventArgs): void;
}

export interface ISuggestionForOmniboxOptions {
  omniboxZIndex?: number;
  headerTitle?: string;
  onSelect?: ISuggestionForOmniboxOptionsOnSelect;
  numberOfSuggestions?: number;
}

export interface ISuggestionForOmniboxTemplate {
  header?: {
    template: (...args: any[]) => string;
    title: string;
  };
  row: (...args: any[]) => string;
}

export interface ISuggestionForOmniboxResult {
  value: string;
}

export class SuggestionForOmnibox {
  constructor(
    public structure: ISuggestionForOmniboxTemplate,
    public onSelect: (value: string, args: IPopulateOmniboxEventArgs) => void,
    public onTabPress: (value: string, args: IPopulateOmniboxEventArgs) => void
  ) {}

  public buildOmniboxElement(results: ISuggestionForOmniboxResult[], args: IPopulateOmniboxEventArgs): HTMLElement {
    let element: HTMLElement;
    if (results.length != 0) {
      element = $$('div').el;
      if (this.structure.header) {
        let header = this.buildElementHeader();
        element.appendChild(header);
      }
      let rows = this.buildRowElements(results, args);
      _.each(rows, row => {
        element.appendChild(row);
      });
    }
    return element;
  }

  private buildElementHeader(): HTMLElement {
    return $$(
      'div',
      undefined,
      this.structure.header.template({
        headerTitle: this.structure.header.title
      })
    ).el;
  }

  private buildRowElements(results: ISuggestionForOmniboxResult[], args: IPopulateOmniboxEventArgs): HTMLElement[] {
    let ret = [];
    _.each(results, result => {
      let row = $$(
        'div',
        undefined,
        this.structure.row({
          rawValue: result.value,
          data: DomUtils.highlightElement(result.value, args.completeQueryExpression.word)
        })
      ).el;
      $$(row).on('click', () => {
        this.onSelect.call(this, result.value, args);
      });
      $$(row).on('keyboardSelect', () => {
        this.onSelect.call(this, result.value, args);
      });
      $$(row).on('tabSelect', () => {
        this.onTabPress.call(this, result.value, args);
      });
      ret.push(row);
    });
    return ret;
  }
}
