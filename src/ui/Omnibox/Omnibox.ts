///<reference path="FieldAddon.ts" />
///<reference path="QueryExtensionAddon.ts" />
///<reference path="RevealQuerySuggestAddon.ts" />
///<reference path="OldOmniboxAddon.ts" />

import {IQueryboxOptions} from '../Querybox/Querybox';
import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {StandaloneSearchInterfaceEvents} from '../../events/StandaloneSearchInterfaceEvents';
import {MODEL_EVENTS, IAttributeChangedEventArg} from '../../models/Model';
import {QUERY_STATE_ATTRIBUTES} from '../../models/QueryStateModel';
import {IAnalyticsNoMeta, analyticsActionCauseList, IAnalyticsOmniboxSuggestionMeta} from '../Analytics/AnalyticsActionListMeta';
import {OmniboxEvents, IOmniboxPreprocessResultForQueryEventArgs} from '../../events/OmniboxEvents';
import {$$} from '../../utils/Dom';
import {Assert} from '../../misc/Assert';
import {QueryStateModel} from '../../models/QueryStateModel';
import {Initialization} from '../Base/Initialization';
import {Querybox} from '../Querybox/Querybox';
import {FieldAddon} from './FieldAddon';
import {QueryExtensionAddon} from './QueryExtensionAddon';
import {RevealQuerySuggestAddon} from './RevealQuerySuggestAddon';
import {OldOmniboxAddon} from './OldOmniboxAddon';
import _ = require('underscore');
import {QueryboxQueryParameters} from '../Querybox/QueryboxQueryParameters';

export interface IPopulateOmniboxSuggestionsEventArgs {
  omnibox: Omnibox;
  suggestions: Array<Coveo.MagicBox.Suggestion[] | Promise<Coveo.MagicBox.Suggestion[]>>;
}

export interface IOmniboxSuggestion extends Coveo.MagicBox.Suggestion {
}

export interface IOmniboxOptions extends IQueryboxOptions {
  inline?: boolean;
  enableFieldAddon?: boolean;
  enableSimpleFieldAddon?: boolean;
  listOfFields?: string[];
  fieldAlias?: { [alias: string]: string };
  enableRevealQuerySuggestAddon?: boolean;
  enableQueryExtensionAddon?: boolean;
  omniboxTimeout?: number;
  placeholder?: string;

  grammar?: (grammar: { start: string; expressions: { [id: string]: Coveo.MagicBox.ExpressionDef }; }) => { start: string; expressions: { [id: string]: Coveo.MagicBox.ExpressionDef } }
}
;

/**
 * This component is very similar to the simpler {@link Querybox} Component and support all the same options/behavior except for the search-as-you-type feature.<br/>
 * In addition, it takes care of adding a type-ahead capability. The type-ahead and the suggestions it displays are customizable and extensible by any custom component.<br/>
 * The type-ahead is configurable by activating addon which are provided OOTB (facets, analytics suggestions, reveal suggestions, and advanced coveo syntax suggestions).<br/>
 * It is also possible for external code to provide suggestions.
 */
export class Omnibox extends Component {
  public static ID = 'Omnibox';

  /**
   * The options for the omnibox
   * @componentOptions
   */
  static options: IOmniboxOptions = {
    /**
     * Specifies that suggestions appearing in the omnibox should push the result down, instead of appearing over the results.<br/>
     * Activate this as well a searchAsYouType + reveal suggestions for a cool effect !<br/>
     * Default value is false
     */
    inline: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether a new query is automatically triggered whenever the user types new text inside the query box.<br/>
     * Activate this as well a inline + reveal suggestions for a cool effect !<br/>
     * The default is false.
     */
    enableSearchAsYouType: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * When search as you type is enabled, specifies the delay in milliseconds before a new query is triggered when the user types new text inside the query box.<br/>
     * The default value is 2000 milliseconds.
     */
    searchAsYouTypeDelay: ComponentOptions.buildNumberOption({
      defaultValue: 2000,
      min: 0,
      depend: 'enableSearchAsYouType'
    }),
    /**
     * Specifies whether the field addon should be enabled.<br/>
     * The field addon allows the search box to highlight and complete field syntax.<br/>
     * Default value is false
     */
    enableFieldAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),
    enableSimpleFieldAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFieldAddon' }),
    listOfFields: ComponentOptions.buildFieldsOption({ depend: 'enableFieldAddon' }),
    /**
     * Specifies whether the reveal query suggestions should be enabled.<br/>
     * This implies that your integration has a proper reveal integration configured.<br/>
     * Default value is false
     */
    enableRevealQuerySuggestAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, alias: 'enableTopQueryAddon' }),
    /**
     * Specifies whether the query extension addon should be enabled.<br/>
     * This allows the omnibox to complete the syntax for query extensions.<br/>
     * Default value is false
     */
    enableQueryExtensionAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),
    /**
     * Specifies a placeholder for input
     */
    placeholder: ComponentOptions.buildStringOption(),
    /**
     * Specifies a timeout before rejecting suggestions in the omnibox.<br/>
     * Default value is 2000 (2 seconds)
     */
    omniboxTimeout: ComponentOptions.buildNumberOption({ defaultValue: 2000 })
  }

  public magicBox: Coveo.MagicBox.Instance;
  private partialQueries: string[] = [];
  private lastSuggestions: IOmniboxSuggestion[] = [];
  private lastQuery: string;

  /**
   * Create a new omnibox with, enable required addons, and bind events on letious query events
   */
  constructor(public element: HTMLElement, public options?: IOmniboxOptions, bindings?: IComponentBindings) {
    super(element, Omnibox.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Omnibox, options);

    let grammar: { start: string; expressions: { [id: string]: Coveo.MagicBox.ExpressionDef } };

    if (this.options.enableQuerySyntax) {
      grammar = Coveo.MagicBox.Grammars.Expressions(Coveo.MagicBox.Grammars.Complete);

      if (this.options.enableFieldAddon) {
        new FieldAddon(this);
      }
      if (this.options.fieldAlias != null) {
        this.options.listOfFields = this.options.listOfFields || [];
        this.options.listOfFields = this.options.listOfFields.concat(_.keys(this.options.fieldAlias));
      }
      if (this.options.enableQueryExtensionAddon) {
        new QueryExtensionAddon(this);
      }
    } else {
      grammar = { start: 'Any', expressions: { Any: /.*/ } };
    }

    if (this.options.enableRevealQuerySuggestAddon) {
      new RevealQuerySuggestAddon(this);
    }

    new OldOmniboxAddon(this);

    if (this.options.grammar != null) {
      grammar = this.options.grammar(grammar);
    }

    this.magicBox = Coveo.MagicBox.create(element, new Coveo.MagicBox.Grammar(grammar.start, grammar.expressions), {
      inline: this.options.inline,
      selectableSuggestionClass: 'coveo-omnibox-selectable',
      selectedSuggestionClass: 'coveo-omnibox-selected',
      suggestionTimeout: this.options.omniboxTimeout
    });

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(StandaloneSearchInterfaceEvents.beforeRedirect, () => this.handleBeforeRedirect());
    this.bind.onRootElement(QueryEvents.querySuccess, () => this.handleQuerySuccess());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.Q, (args: IAttributeChangedEventArg) => this.handleQueryStateChanged(args))

    this.setupMagicBox();
  }

  /**
   * Trigger a query. The current input content will be added to the query<br/>
   * If the content of the input has not changed since the last submit, no new query will be triggered.
   */
  public submit() {
    this.magicBox.clearSuggestion();
    this.updateQueryState();
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {})
    this.triggerNewQuery(false);
  }

  /**
   * Get the current content of the input
   * @returns {string}
   */
  public getText() {
    return this.magicBox.getText();
  }

  /**
   * Set the content of the input
   * @param text The string to set in the input
   */
  public setText(text: string) {
    this.magicBox.setText(text);
    this.updateQueryState();
  }

  /**
   * Clear the content of the input
   */
  public clear() {
    this.magicBox.clear();
  }

  /**
   * Get the HTMLInputElement of the omnibox
   */
  public getInput() {
    return <HTMLInputElement>this.magicBox.element.querySelector('input');
  }

  public getResult() {
    return this.magicBox.getResult();
  }

  public getDisplayedResult() {
    return this.magicBox.getDisplayedResult();
  }

  public getCursor() {
    return this.magicBox.getCursor();
  }

  public resultAtCursor(match?: string | { (result: Coveo.MagicBox.Result): boolean; }) {
    return this.magicBox.resultAtCursor(match);
  }

  private setupMagicBox() {
    // skipSearchAsYouType is to circumvent something special with the magic box :
    // the onsuggestion callback is called even on "blur"
    // This variable is thus used to differentiate between : is it a suggestion callback with really no suggestions
    // or a suggestion callback purposely set empty to keep the magicbox internal state in sync
    let skipSearchAsYouType = false;

    this.magicBox.onsuggestions = (suggestions: IOmniboxSuggestion[]) => {
      let diff = suggestions.length != this.lastSuggestions.length ||
        _.filter(suggestions, (suggestion: IOmniboxSuggestion, i: number) => {
          return suggestion.text != this.lastSuggestions[i].text;
        }).length > 0;
      this.lastSuggestions = suggestions;
      // retrigger a new search as you type only if there are diff or if the input is not the same
      if (this.options.enableSearchAsYouType && (diff || suggestions.length == 0)) {
        if (skipSearchAsYouType) {
          skipSearchAsYouType = false;
        } else {
          this.searchAsYouType();
        }
      }
    }
    if (this.options.enableSearchAsYouType) {
      $$(this.element).addClass('coveo-magicbox-search-as-you-type');
      this.magicBox.onchange = () => {
        this.searchAsYouType();
      };
    }
    if (this.options.placeholder) {
      (<HTMLInputElement>this.magicBox.element.querySelector('input')).placeholder = this.options.placeholder;
    }
    this.magicBox.onsubmit = () => {
      this.magicBox.clearSuggestion();
      this.updateQueryState();
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {})
      this.triggerNewQuery(false);
    };

    this.magicBox.onselect = (suggestion: IOmniboxSuggestion) => {
      let index = _.indexOf(this.lastSuggestions, suggestion);
      let suggestions = _.map(this.lastSuggestions, (suggestion) => suggestion.text);
      this.magicBox.clearSuggestion();
      this.updateQueryState();
      this.usageAnalytics.cancelAllPendingEvents();
      this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(analyticsActionCauseList.omniboxAnalytics, {
        partialQueries: this.cleanCustomData(this.partialQueries),
        suggestionRanking: index,
        suggestions: this.cleanCustomData(suggestions),
        partialQuery: _.last(this.partialQueries)
      })
      this.triggerNewQuery(false);
    }

    this.magicBox.onblur = () => {
      if (this.options.enableSearchAsYouType && !this.options.inline) {
        this.setText(this.lastQuery);
      } else {
        this.updateQueryState();
      }
      if (this.options.enableSearchAsYouType) {
        skipSearchAsYouType = true;
      }
    };

    this.magicBox.onclear = () => {
      this.updateQueryState();
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxClear, {})
      this.triggerNewQuery(false);
    };

    if (this.options.autoFocus) {
      this.magicBox.focus();
    }

    this.magicBox.getSuggestions = () => this.handleSuggestions();
  }

  private cleanCustomData(toClean: string[], rejectLength = 256) {
    // Filter out only consecutive values that are the identical
    toClean = _.filter(toClean, (partial: string, pos?: number, array?: string[]) => {
      return pos === 0 || partial !== array[pos - 1];
    });

    // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
    // Need to replace ;
    toClean = _.map(toClean, (partial) => {
      return partial.replace(/;/g, '');
    });

    // Reduce right to get the last X words that adds to less then rejectLength
    let reducedToRejectLengthOrLess = [];
    _.reduceRight(toClean, (memo: number, partial: string) => {
      let totalSoFar = memo + partial.length;
      if (totalSoFar <= rejectLength) {
        reducedToRejectLengthOrLess.push(partial);
      }
      return totalSoFar;
    }, 0);
    toClean = reducedToRejectLengthOrLess.reverse();
    let ret = toClean.join(';');

    // analytics service can store max 256 char in a custom event
    // if we're over that, call cleanup again with an arbitrary 10 less char accepted
    if (ret.length >= 256) {
      return this.cleanCustomData(toClean, rejectLength - 10);
    }

    return toClean.join(';');
  }

  private handleSuggestions() {
    let suggestionsEventArgs: IPopulateOmniboxSuggestionsEventArgs = {
      suggestions: [],
      omnibox: this
    };
    this.bind.trigger(this.element, OmniboxEvents.populateOmniboxSuggestions, suggestionsEventArgs);
    this.partialQueries.push(this.getText());
    return suggestionsEventArgs.suggestions;
  }

  private handleBeforeRedirect() {
    this.updateQueryState();
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    this.updateQueryState();
    this.lastQuery = this.getQuery(data.searchAsYouType);

    let result: Coveo.MagicBox.Result = this.lastQuery == this.magicBox.getDisplayedResult().input ? this.magicBox.getDisplayedResult().clone() : this.magicBox.grammar.parse(this.lastQuery).clean();
    let preprocessResultForQueryArgs: IOmniboxPreprocessResultForQueryEventArgs = {
      result: result
    };

    if (this.options.enableQuerySyntax) {
      let notQuotedValues = preprocessResultForQueryArgs.result.findAll('FieldValueNotQuoted');
      _.each(notQuotedValues, (value: Coveo.MagicBox.Result) => value.value = '"' + value.value.replace(/"|\u00A0/g, ' ') + '"');
      if (this.options.fieldAlias) {
        let fieldNames = preprocessResultForQueryArgs.result.findAll((result: Coveo.MagicBox.Result) => result.expression.id == 'FieldName' && result.isSuccess());
        _.each(fieldNames, (result: Coveo.MagicBox.Result) => {
          let alias = _.find(_.keys(this.options.fieldAlias), (alias: string) => alias.toLowerCase() == result.value.toLowerCase());
          if (alias != null) {
            result.value = this.options.fieldAlias[alias];
          }
        });
      }
    }

    this.bind.trigger(this.element, OmniboxEvents.omniboxPreprocessResultForQuery, preprocessResultForQueryArgs)
    let query = preprocessResultForQueryArgs.result.toString();

    new QueryboxQueryParameters(this.options).addParameters(data.queryBuilder, query);
  }


  private triggerNewQuery(searchAsYouType: boolean) {
    clearTimeout(this.searchAsYouTypeTimeout);
    let text = this.getQuery(searchAsYouType);
    if (this.lastQuery != text && text != null) {
      this.lastQuery = text;
      this.queryController.executeQuery({
        searchAsYouType: searchAsYouType
      });
    }
  }

  private getQuery(searchAsYouType: boolean) {
    let query: string
    if (searchAsYouType) {
      query = this.magicBox.getWordCompletion();
      if (query == null && this.lastSuggestions != null && this.lastSuggestions.length > 0) {
        let textSuggestion = _.find(this.lastSuggestions, (suggestion: IOmniboxSuggestion) => suggestion.text != null);
        if (textSuggestion != null) {
          query = textSuggestion.text;
        }
      }
    }
    return query || this.magicBox.getText();
  }

  public updateQueryState() {
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, this.magicBox.getText());
  }

  private handleQueryStateChanged(args: IAttributeChangedEventArg) {
    Assert.exists(args);
    let q = <string>args.value;
    if (q != this.magicBox.getText()) {
      this.magicBox.setText(q);
    }
  }

  private handleQuerySuccess() {
    if (!this.options.enableSearchAsYouType) {
      this.partialQueries = [];
    } else {
      //this.usageAnalytics.
    }
  }

  private searchAsYouTypeTimeout: number;

  private searchAsYouType() {
    clearTimeout(this.searchAsYouTypeTimeout);
    if (this.getText().length == 0) {
      this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxAsYouType, {})
      this.triggerNewQuery(true);
    } else if (this.magicBox.getWordCompletion()) {
      let suggestions = _.map(this.lastSuggestions, (suggestion) => suggestion.text);
      let index = _.indexOf(suggestions, this.magicBox.getWordCompletion());
      this.usageAnalytics.logSearchAsYouType<IAnalyticsOmniboxSuggestionMeta>(analyticsActionCauseList.searchboxAsYouType, {
        partialQueries: this.cleanCustomData(this.partialQueries),
        suggestionRanking: index,
        suggestions: this.cleanCustomData(suggestions),
        partialQuery: _.last(this.partialQueries)
      })
      this.triggerNewQuery(true);
    } else if (this.getQuery(true) != this.getText()) {
      this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxAsYouType, {})
      this.triggerNewQuery(true);
    } else {
      this.searchAsYouTypeTimeout = setTimeout(() => {
        this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxAsYouType, {})
        this.triggerNewQuery(true);
      }, this.options.searchAsYouTypeDelay);
    }
  }
}

Omnibox.options = _.extend({}, Omnibox.options, Querybox.options);

Initialization.registerAutoCreateComponent(Omnibox);
