

module Coveo {

  export interface SuggestionForOmniboxOptionsOnSelect {
    (value: string, args: IPopulateOmniboxEventArgs):void;
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

    public buildOmniboxElement(results: SuggestionForOmniboxResult[], args: IPopulateOmniboxEventArgs): JQuery {
      var element;
      if (results.length != 0) {
        element = $("<div></div>");
        if(this.structure.header) {
          var header = this.buildElementHeader();
          element.append(header);
        }
        var rows = this.buildRowElements(results, args);
        _.each(rows, (row) => {
          element.append(row);
        })
      }
      return element;
    }

    private buildElementHeader() {
      return $(this.structure.header.template({
        headerTitle: this.structure.header.title
      }));
    }

    private buildRowElements(results: SuggestionForOmniboxResult[], args: IPopulateOmniboxEventArgs): JQuery[] {
      var ret = [];
      _.each(results, (result) => {
        var row = $(this.structure.row({
          rawValue: result.value,
          data: JQueryUtils.highlightElement(result.value, args.completeQueryExpression.word)
        }));
        row.click(() => {
          this.onSelect.call(this, result.value, args);
        });
        row.on("keyboardSelect", () => {
          this.onSelect.call(this, result.value, args);
        });
        ret.push(row)
      })
      return ret;
    }
  }
}