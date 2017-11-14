import { IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { DomUtils } from '../../utils/DomUtils';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';

export interface ISuggestionForOmniboxOptionsOnSelect {
  (result: string, args: IPopulateOmniboxEventArgs): void;
}

export interface ISuggestionForOmniboxRowTemplateOptions<T extends ISuggestionForOmniboxResult = ISuggestionForOmniboxResult> {
  rawValue: string;
  data?: string;
  word: string;
  result: T;
}

export interface ISuggestionForOmniboxOptions {
  omniboxZIndex?: number;
  headerTitle?: string;
  onSelect?: ISuggestionForOmniboxOptionsOnSelect;
  numberOfSuggestions?: number;
}

export interface ISuggestionForOmniboxTemplate<T extends ISuggestionForOmniboxResult = ISuggestionForOmniboxResult> {
  header?: {
    template: (...args: any[]) => string;
    title: string;
  };
  row: (args: ISuggestionForOmniboxRowTemplateOptions<T>) => string;
}

export interface ISuggestionForOmniboxResult {
  value: string;
  keyword: string;
}

export class SuggestionForOmnibox<T extends ISuggestionForOmniboxResult = ISuggestionForOmniboxResult> {
  constructor(
    public structure: ISuggestionForOmniboxTemplate<T>,
    public onSelect: (value: string, args: IPopulateOmniboxEventArgs) => void,
    public onTabPress: (value: string, args: IPopulateOmniboxEventArgs) => void
  ) {}

  public buildOmniboxElement(results: T[], args: IPopulateOmniboxEventArgs): HTMLElement {
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

  private buildRowElements(results: T[], args: IPopulateOmniboxEventArgs): HTMLElement[] {
    let ret = [];
    _.each(results, result => {
      let row = $$(
        'div',
        undefined,
        this.structure.row({
          rawValue: result.value,
          data: DomUtils.highlightElement(result.value, args.completeQueryExpression.word),
          word: args.completeQueryExpression.word,
          result: result
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
