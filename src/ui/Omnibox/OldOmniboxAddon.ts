///<reference path="Omnibox.ts"/>
import { Omnibox, IOmniboxSuggestion } from './Omnibox';
import { IOmniboxDataRow } from './OmniboxInterface';
import {
  OmniboxEvents,
  IPopulateOmniboxEventArgs,
  IPopulateOmniboxEventRow,
  IPopulateOmniboxSuggestionsEventArgs
} from '../../events/OmniboxEvents';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import * as _ from 'underscore';

export class OldOmniboxAddon {
  constructor(public omnibox: Omnibox) {
    this.omnibox.bind.on(this.omnibox.element, OmniboxEvents.populateOmniboxSuggestions, (args: IPopulateOmniboxSuggestionsEventArgs) => {
      _.each(this.getSuggestion(), suggestion => {
        args.suggestions.push(suggestion);
      });
    });
  }

  private lastQuery: string;
  private lastSuggestions: Promise<IOmniboxSuggestion[]>[];

  public getSuggestion(): Promise<IOmniboxSuggestion[]>[] {
    let text = this.omnibox.magicBox.getText();

    if (text.length == 0) {
      return null;
    }

    if (this.lastQuery == text) {
      return this.lastSuggestions;
    }

    this.lastQuery = text;

    let eventArgs = this.buildPopulateOmniboxEventArgs();
    $$(this.omnibox.root).trigger(OmniboxEvents.populateOmnibox, eventArgs);

    return (this.lastSuggestions = this.rowsToSuggestions(eventArgs.rows));
  }

  private getCurrentQueryExpression() {
    let cursorPos = this.omnibox.getCursor();
    let value = this.omnibox.getText();
    let length = value.length;
    let start = cursorPos;
    let end = cursorPos;
    if (value[start] == ' ') {
      start--;
    }
    while (start > 0 && value[start] != ' ') {
      start--;
    }
    while (end < length && value[end] != ' ') {
      end++;
    }
    return value.substring(start, end);
  }

  private getRegexToSearch(strValue?: string) {
    if (strValue == null) {
      strValue = this.omnibox.getText();
    }
    return new RegExp(Utils.escapeRegexCharacter(strValue), 'i');
  }

  private getQueryExpressionBreakDown() {
    let ret = [];
    let queryWords = this.omnibox.getText().split(' ');
    _.each(queryWords, word => {
      ret.push({
        word: word,
        regex: this.getRegexToSearch(word)
      });
    });
    return ret;
  }

  private replace(searchValue: string, newValue: string) {
    this.omnibox.setText(this.omnibox.getText().replace(searchValue, newValue));
  }

  private clearCurrentExpression() {
    this.replace(this.getCurrentQueryExpression(), '');
  }

  private insertAt(at: number, toInsert: string) {
    let oldValue = this.omnibox.getText();
    let newValue = [oldValue.slice(0, at), toInsert, oldValue.slice(at)].join('');
    this.omnibox.setText(newValue);
  }

  private replaceCurrentExpression(newValue: string) {
    this.replace(this.getCurrentQueryExpression(), newValue);
  }

  private buildPopulateOmniboxEventArgs() {
    let currentQueryExpression = this.getCurrentQueryExpression();
    let ret: IPopulateOmniboxEventArgs = {
      rows: [],
      completeQueryExpression: {
        word: this.omnibox.getText(),
        regex: this.getRegexToSearch()
      },
      currentQueryExpression: {
        word: currentQueryExpression,
        regex: this.getRegexToSearch(currentQueryExpression)
      },
      allQueryExpressions: this.getQueryExpressionBreakDown(),
      cursorPosition: this.omnibox.getCursor(),
      clear: () => {
        this.omnibox.clear();
      },
      clearCurrentExpression: () => {
        this.clearCurrentExpression();
      },
      replace: (searchValue: string, newValue: string) => {
        this.replace(searchValue, newValue);
      },
      replaceCurrentExpression: (newValue: string) => {
        this.replaceCurrentExpression(newValue);
      },
      insertAt: (at: number, toInsert: string) => {
        this.insertAt(at, toInsert);
      },
      closeOmnibox: () => {
        this.omnibox.magicBox.blur();
      }
    };
    return ret;
  }

  private rowsToSuggestions(rows: IOmniboxDataRow[]): Promise<IOmniboxSuggestion[]>[] {
    return _.map(rows, (row: IPopulateOmniboxEventRow) => {
      if (!Utils.isNullOrUndefined(row.element)) {
        return new Promise<IOmniboxSuggestion[]>(resolve => {
          resolve([
            {
              dom: row.element,
              index: row.zIndex
            }
          ]);
        });
      } else if (!Utils.isNullOrUndefined(row.deferred)) {
        return new Promise<IOmniboxSuggestion[]>(resolve => {
          row.deferred.then(row => {
            if (row.element != null) {
              resolve([
                {
                  dom: row.element,
                  index: row.zIndex
                }
              ]);
            } else {
              resolve(null);
            }
          });
        });
      }
      return null;
    });
  }
}
