///<reference path="FieldAddon.ts" />
///<reference path="QueryExtensionAddon.ts" />
///<reference path="RevealQuerySuggestAddon.ts" />
///<reference path="OldOmniboxAddon.ts" />
import { IQueryboxOptions } from '../Querybox/Querybox';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { StandaloneSearchInterfaceEvents } from '../../events/StandaloneSearchInterfaceEvents';
import { MODEL_EVENTS, IAttributeChangedEventArg } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { IAnalyticsNoMeta, analyticsActionCauseList, IAnalyticsOmniboxSuggestionMeta } from '../Analytics/AnalyticsActionListMeta';
import { OmniboxEvents, IOmniboxPreprocessResultForQueryEventArgs } from '../../events/OmniboxEvents';
import { $$ } from '../../utils/Dom';
import { Assert } from '../../misc/Assert';
import { QueryStateModel } from '../../models/QueryStateModel';
import { Initialization } from '../Base/Initialization';
import { Querybox } from '../Querybox/Querybox';
import { FieldAddon } from './FieldAddon';
import { QueryExtensionAddon } from './QueryExtensionAddon';
import { RevealQuerySuggestAddon } from './RevealQuerySuggestAddon';
import { OldOmniboxAddon } from './OldOmniboxAddon';
import { QueryboxQueryParameters } from '../Querybox/QueryboxQueryParameters';
import { IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { IDuringQueryEventArgs } from '../../events/QueryEvents';
import { PendingSearchAsYouTypeSearchEvent } from '../Analytics/PendingSearchAsYouTypeSearchEvent';
import { Utils } from '../../utils/Utils';
import { MagicBox } from '../../ExternalModulesShim';
import { StandaloneSearchInterface } from '../SearchInterface/SearchInterface';
import _ = require('underscore');

export interface IPopulateOmniboxSuggestionsEventArgs {
  omnibox: Omnibox;
  suggestions: Array<Coveo.MagicBox.Suggestion[] | Promise<Coveo.MagicBox.Suggestion[]>>;
}

export interface IOmniboxSuggestion extends Coveo.MagicBox.Suggestion {
  executableConfidence?: number;
}

export interface IOmniboxOptions extends IQueryboxOptions {
  inline?: boolean;
  enableFieldAddon?: boolean;
  enableSimpleFieldAddon?: boolean;
  listOfFields?: IFieldOption[];
  fieldAlias?: { [alias: string]: IFieldOption };
  enableRevealQuerySuggestAddon?: boolean;
  enableQueryExtensionAddon?: boolean;
  omniboxTimeout?: number;
  placeholder?: string;
  grammar?: (grammar: { start: string; expressions: { [id: string]: Coveo.MagicBox.ExpressionDef }; }) => { start: string; expressions: { [id: string]: Coveo.MagicBox.ExpressionDef } };
}

const MINIMUM_EXECUTABLE_CONFIDENCE = 0.8;

/**
 * The Omnibox component is very similar to the simpler {@link Querybox} component. It supports all of the same options
 * and behaviors.
 *
 * The Omnibox component takes care of adding type-ahead capability to the search input. Custom components can extend
 * and customize the type-ahead and the suggestions it provides.
 *
 * The type-ahead is configurable by activating addons, which the Coveo JavaScript Search Framework provides OOTB
 * (facets, analytics suggestions, Coveo Machine Learning suggestions and advanced Coveo syntax suggestions).
 *
 * It is also possible for external code to provide type-ahead suggestions.
 *
 * See also the {@link Searchbox} component, which can automatically instantiate an Omnibox component along with an
 * optional {@link SearchButton} component.
 */
export class Omnibox extends Component {
  public static ID = 'Omnibox';

  /**
   * The options for the omnibox
   * @componentOptions
   */
  static options: IOmniboxOptions = {

    /**
     * Specifies whether suggestions appearing in the Omnibox should push the result down instead of appearing over the
     * results.
     *
     * Set this option as well as {@link Omnibox.options.enableSearchAsYouType} and
     * {@link Omnibox.options.enableRevealQuerySuggestAddon} to `true` for a cool effect!
     *
     * Default value is `false`.
     */
    inline: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to automatically trigger a new query whenever the end user types new text inside the Omnibox.
     *
     * Set this option as well a {@link Omnibox.options.inline} and
     * {@link Omnibox.options.enableRevealQuerySuggestAddon} to `true` for a cool effect!
     *
     * Default value is `false`.
     */
    enableSearchAsYouType: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * If {@link Omnibox.options.enableSearchAsYouType} is `true`, specifies the delay (in milliseconds) before
     * triggering a new query when the user types new text inside the Omnibox.
     *
     * Default value is `2000`. Minimum value is `0`.
     */
    searchAsYouTypeDelay: ComponentOptions.buildNumberOption({
      defaultValue: 2000,
      min: 0,
      depend: 'enableSearchAsYouType'
    }),

    /**
     * If {@link Querybox.options.enableQuerySyntax} is `true`, specifies whether to enable the `field` addon.
     *
     * The `field` addon allows the search box to highlight and complete field syntax.
     *
     * **Example:**
     *
     * > Suppose you want to filter on a certain file type. You start typing `@sysf` in the input. The Omnibox provides
     * > you with several matching fields. You select the `@sysfiletype` suggestion and type `=`. If this option is set
     * > to `true`, then the Omnibox provides you with suggestions for available matching file types.
     *
     * Default value is `false`.
     */
    enableFieldAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),
    enableSimpleFieldAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFieldAddon' }),
    listOfFields: ComponentOptions.buildFieldsOption({ depend: 'enableFieldAddon' }),

    /**
     * Specifies whether to enable the Coveo Machine Learning (Coveo ML) query suggestions.
     *
     * This implies that you have a proper Coveo ML integration configured (see
     * [Coveo Machine Learning](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=177)).
     *
     * Default value is `true`.
     */
    enableRevealQuerySuggestAddon: ComponentOptions.buildBooleanOption({ defaultValue: true, alias: 'enableTopQueryAddon' }),

    /**
     * If {@link Querybox.options.enableQuerySyntax} is `true`, specifies whether to enable the `query extension` addon.
     *
     * The `query extension` addon allows the Omnibox to complete the syntax for query extensions.
     *
     * Default value is `false`.
     */
    enableQueryExtensionAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),

    /**
     * Specifies a placeholder for the input.
     */
    placeholder: ComponentOptions.buildLocalizedStringOption(),

    /**
     * Specifies a timeout (in milliseconds) before rejecting suggestions in the Omnibox.
     *
     * Default value is `2000`. Minimum value is `0`.
     */
    omniboxTimeout: ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 })
  };

  public magicBox: Coveo.MagicBox.Instance;
  private partialQueries: string[] = [];
  private lastSuggestions: IOmniboxSuggestion[] = [];
  private lastQuery: string;
  private modifyEventTo: IAnalyticsActionCause;
  private movedOnce = false;
  private searchAsYouTypeTimeout: number;
  private skipRevealAutoSuggest = false;

  /**
   * Creates a new Omnibox component. Also enables necessary addons and binds events on various query events.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Omnibox component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IOmniboxOptions, bindings?: IComponentBindings) {
    super(element, Omnibox.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Omnibox, options);

    let grammar: { start: string; expressions: { [id: string]: Coveo.MagicBox.ExpressionDef } };

    if (this.options.enableQuerySyntax) {
      grammar = MagicBox.Grammars.Expressions(MagicBox.Grammars.Complete);

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

    this.magicBox = MagicBox.create(element, new MagicBox.Grammar(grammar.start, grammar.expressions), {
      inline: this.options.inline,
      selectableSuggestionClass: 'coveo-omnibox-selectable',
      selectedSuggestionClass: 'coveo-omnibox-selected',
      suggestionTimeout: this.options.omniboxTimeout
    });

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(StandaloneSearchInterfaceEvents.beforeRedirect, () => this.handleBeforeRedirect());
    this.bind.onRootElement(QueryEvents.querySuccess, () => this.handleQuerySuccess());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.Q, (args: IAttributeChangedEventArg) => this.handleQueryStateChanged(args));
    if (this.isRevealAutoSuggestion()) {
      this.bind.onRootElement(QueryEvents.duringQuery, (args: IDuringQueryEventArgs) => this.handleDuringQuery(args));
    }
    this.setupMagicBox();
  }

  /**
   * Adds the current content of the input to the query and triggers a query if the current content of the input has
   * changed since last submit.
   *
   * Also logs a `searchboxSubmit` event in the usage analytics.
   */
  public submit() {
    this.magicBox.clearSuggestion();
    this.updateQueryState();
    this.triggerNewQuery(false, () => {
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
    });
  }

  /**
   * Gets the current content of the input.
   * @returns {string} The current content of the input.
   */
  public getText() {
    return this.magicBox.getText();
  }

  /**
   * Sets the content of the input
   * @param text The string to set in the input.
   */
  public setText(text: string) {
    this.magicBox.setText(text);
    this.updateQueryState();
  }

  /**
   * Clears the content of the input.
   */
  public clear() {
    this.magicBox.clear();
  }

  /**
   * Gets the `HTMLInputElement` of the Omnibox.
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
    this.magicBox.onmove = () => {
      // We assume that once the user has moved its selection, it becomes an explicit omnibox analytics event
      if (this.isRevealAutoSuggestion()) {
        this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
      }
      this.movedOnce = true;
    };

    this.magicBox.onfocus = () => {
      if (this.isRevealAutoSuggestion()) {
        // This flag is used to block the automatic query when the UI is loaded with a query (#q=foo)
        // and then the input is focused. We want to block that query, even if it match the suggestion
        // Only when there is an actual change in the input (user typing something) is when we want the automatic query to kick in
        this.skipRevealAutoSuggest = true;
      }
    };

    this.magicBox.onsuggestions = (suggestions: IOmniboxSuggestion[]) => {
      // If text is empty, this can mean that user selected text from the search box
      // and hit "delete" : Reset the partial queries in this case
      if (Utils.isEmptyString(this.getText())) {
        this.partialQueries = [];
      }
      this.movedOnce = false;
      this.lastSuggestions = suggestions;
      if (this.isRevealAutoSuggestion() && !this.skipRevealAutoSuggest) {
        this.searchAsYouType();
      }
    };

    if (this.options.enableSearchAsYouType) {
      $$(this.element).addClass('coveo-magicbox-search-as-you-type');
    }

    this.magicBox.onchange = () => {
      this.skipRevealAutoSuggest = false;
      let text = this.getText();
      if (text != undefined && text != '') {
        if (this.isRevealAutoSuggestion()) {
          if (this.movedOnce) {
            this.searchAsYouType(true);
          }
        } else if (this.options.enableSearchAsYouType) {
          this.searchAsYouType(true);
        }
      } else {
        this.clear();
      }

    };

    if (this.options.placeholder) {
      (<HTMLInputElement>this.magicBox.element.querySelector('input')).placeholder = this.options.placeholder;
    }
    this.magicBox.onsubmit = () => {
      this.magicBox.clearSuggestion();
      this.updateQueryState();
      this.triggerNewQuery(false, () => {
        this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      });
      this.magicBox.blur();
    };

    this.magicBox.onselect = (suggestion: IOmniboxSuggestion) => {
      let index = _.indexOf(this.lastSuggestions, suggestion);
      let suggestions = _.compact(_.map(this.lastSuggestions, (suggestion) => suggestion.text));
      this.magicBox.clearSuggestion();
      this.updateQueryState();
      // A bit tricky here : When it's reveal auto suggestions
      // the mouse selection and keyboard selection acts differently :
      // keyboard selection will automatically do the query (which will log a search as you type event -> further modified by this.modifyEventTo if needed)
      // mouse selection will not "auto" send the query.
      // the movedOnce variable detect the keyboard movement, and is used to differentiate mouse vs keyboard
      if (!this.isRevealAutoSuggestion()) {
        this.usageAnalytics.cancelAllPendingEvents();
        this.triggerNewQuery(false, () => {
          this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(this.getOmniboxAnalyticsEventCause(), this.buildCustomDataForPartialQueries(index, suggestions));
        });
      } else if (this.isRevealAutoSuggestion() && this.movedOnce) {
        this.handleRevealAutoSuggestionWithKeyboard(index, suggestions);
      } else if (this.isRevealAutoSuggestion() && !this.movedOnce) {
        this.handleRevealAutoSuggestionsWithMouse(index, suggestions);
      }

      // Consider a selection like a reset of the partial queries (it's the end of a suggestion pattern)
      if (this.isRevealAutoSuggestion()) {
        this.partialQueries = [];
      }
    };

    this.magicBox.onblur = () => {
      if (this.options.enableSearchAsYouType && !this.options.inline) {
        this.setText(this.lastQuery);
      } else {
        this.updateQueryState();
      }
      if (this.isRevealAutoSuggestion()) {
        this.usageAnalytics.sendAllPendingEvents();
      }
    };

    this.magicBox.onclear = () => {
      this.updateQueryState();
      if (this.options.triggerQueryOnClear) {
        this.triggerNewQuery(false, () => {
          this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxClear, {});
        });
      }
    };

    if (this.options.autoFocus) {
      this.magicBox.focus();
    }

    this.magicBox.ontabpress = () => {
      this.handleTabPress();
    };


    this.magicBox.getSuggestions = () => this.handleSuggestions();
  }

  private handleRevealAutoSuggestionWithKeyboard(index: number, suggestions: string[]) {
    if (this.searchAsYouTypeTimeout) {
      // Here, there is currently a search as you typed queued up :
      // Think : user typed very quickly, then very quickly selected a suggestion (without waiting for the search as you type)
      // Cancel the search as you type query, then immediately do the query with the selection (+analytics event with the selection)
      this.usageAnalytics.cancelAllPendingEvents();
      clearTimeout(this.searchAsYouTypeTimeout);
      this.searchAsYouTypeTimeout = undefined;
      this.triggerNewQuery(false, () => {
        this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(this.getOmniboxAnalyticsEventCause(), this.buildCustomDataForPartialQueries(index, suggestions));
      });

    } else {
      // Here, the search as you type query has returned, but the analytics event has not ye been sent.
      // Think : user typed slowly, the query returned, and then the user selected a suggestion.
      // Since the analytics event has not yet been sent (search as you type event have a 5 sec delay)
      // modify the pending event, then send the newly modified analytics event immediately.
      this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
      this.modifyCustomDataOnPending(index, suggestions);
      this.usageAnalytics.sendAllPendingEvents();
    }
  }

  private handleRevealAutoSuggestionsWithMouse(index: number, suggestions: string[]) {
    if (this.searchAsYouTypeTimeout || index != 0) {
      // Here : the user either very quickly chose the first suggestion, and the search as you type is still queued up.
      // OR
      // the user chose something different then the first suggestion.
      // Remove the search as you type if it's there, and do the query with the suggestion directly.
      this.clearSearchAsYouType();
      this.usageAnalytics.cancelAllPendingEvents();
      this.triggerNewQuery(false, () => {
        this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(this.getOmniboxAnalyticsEventCause(), this.buildCustomDataForPartialQueries(index, suggestions));
      });

    } else {
      // Here : the user either very slowly chose a suggestion, and there is no search as you typed queued up
      // AND
      // the user chose the first suggestion.
      // this means the query is already returned, but the analytics event is still queued up.
      // modify the analytics event, and send it.
      this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
      this.modifyCustomDataOnPending(index, suggestions);
      this.usageAnalytics.sendAllPendingEvents();
    }
  }

  private modifyCustomDataOnPending(index: number, suggestions: string[]) {
    let pendingEvt = this.usageAnalytics.getPendingSearchEvent();
    if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent) {
      let newCustomData = this.buildCustomDataForPartialQueries(index, suggestions);
      _.each(_.keys(newCustomData), (k: string) => {
        (<PendingSearchAsYouTypeSearchEvent>pendingEvt).modifyCustomData(k, newCustomData[k]);
      });
    }
  }

  private buildCustomDataForPartialQueries(index: number, suggestions: string[]): IAnalyticsOmniboxSuggestionMeta {
    return {
      partialQueries: this.cleanCustomData(this.partialQueries),
      suggestionRanking: index,
      suggestions: this.cleanCustomData(suggestions),
      partialQuery: _.last(this.partialQueries)
    };
  }

  private cleanCustomData(toClean: string[], rejectLength = 256) {
    // Filter out only consecutive values that are the identical
    toClean = _.compact(_.filter(toClean, (partial: string, pos?: number, array?: string[]) => {
      return pos === 0 || partial !== array[pos - 1];
    }));

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
    let text = this.getText();
    if (!Utils.isNullOrEmptyString(text)) {
      this.partialQueries.push(text);
    }
    return _.compact(suggestionsEventArgs.suggestions);
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
            result.value = <string>this.options.fieldAlias[alias];
          }
        });
      }
    }

    this.bind.trigger(this.element, OmniboxEvents.omniboxPreprocessResultForQuery, preprocessResultForQueryArgs);
    let query = preprocessResultForQueryArgs.result.toString();
    new QueryboxQueryParameters(this.options).addParameters(data.queryBuilder, query);
  }

  private handleTabPress() {
    if (this.options.enableRevealQuerySuggestAddon) {
      this.handleTabPressForRevealSuggestions();
    } else {
      this.handleTabPressForOldOmniboxAddon();
    }
  }

  private handleTabPressForRevealSuggestions() {
    if (!this.options.enableSearchAsYouType) {
      let suggestions = _.compact(_.map(this.lastSuggestions, (suggestion) => suggestion.text));
      this.usageAnalytics.logCustomEvent(this.getOmniboxAnalyticsEventCause(), this.buildCustomDataForPartialQueries(0, suggestions), this.element);
    }
  }

  private handleTabPressForOldOmniboxAddon() {
    if (this.lastSuggestions && this.lastSuggestions[0] && this.lastSuggestions[0].dom) {
      let firstSelected = $$(this.lastSuggestions[0].dom).find('.coveo-omnibox-selected');
      let firstSelectable = $$(this.lastSuggestions[0].dom).find('.coveo-omnibox-selectable');
      if (firstSelected) {
        $$(firstSelected).trigger('tabSelect');
      } else if (firstSelectable) {
        $$(firstSelectable).trigger('tabSelect');
      }
    }
  }

  private triggerNewQuery(searchAsYouType: boolean, analyticsEvent: () => void) {
    clearTimeout(this.searchAsYouTypeTimeout);
    let text = this.getQuery(searchAsYouType);
    if (this.shouldExecuteQuery(searchAsYouType)) {
      this.lastQuery = text;
      analyticsEvent();
      this.queryController.executeQuery({
        searchAsYouType: searchAsYouType,
        logInActionsHistory: true
      });
    }
  }

  private getQuery(searchAsYouType: boolean) {
    let query: string;
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
    if (!this.isRevealAutoSuggestion()) {
      this.partialQueries = [];
    }
  }

  private handleDuringQuery(args: IDuringQueryEventArgs) {
    // When the query results returns ... (args.promise)
    args.promise.then(() => {
      // Get a handle on a pending search as you type (those events are delayed, not sent instantly)
      let pendingEvent = this.usageAnalytics.getPendingSearchEvent();
      if (pendingEvent instanceof PendingSearchAsYouTypeSearchEvent) {
        (<PendingSearchAsYouTypeSearchEvent>pendingEvent).beforeResolve.then((evt) => {
          // Check if we need to modify the event type beforeResolving it
          args.promise.then(() => {
            if (this.modifyEventTo) {
              evt.modifyEventCause(this.modifyEventTo);
              this.modifyEventTo = null;
            }
          });
        });
      }
    });
  }

  private searchAsYouType(forceExecuteQuery = false) {
    this.clearSearchAsYouType();
    if (this.shouldExecuteQuery(true)) {
      this.searchAsYouTypeTimeout = setTimeout(() => {
        if (this.suggestionShouldTriggerQuery() || forceExecuteQuery) {
          let suggestions = _.map(this.lastSuggestions, (suggestion) => suggestion.text);
          let index = _.indexOf(suggestions, this.magicBox.getWordCompletion());
          this.triggerNewQuery(true, () => {
            this.usageAnalytics.logSearchAsYouType<IAnalyticsOmniboxSuggestionMeta>(analyticsActionCauseList.searchboxAsYouType, this.buildCustomDataForPartialQueries(index, suggestions));
          });
          this.clearSearchAsYouType();
        }

      }, this.options.searchAsYouTypeDelay);
    }
  }

  private isRevealAutoSuggestion() {
    return this.options.enableSearchAsYouType && this.options.enableRevealQuerySuggestAddon;
  }

  private shouldExecuteQuery(searchAsYouType: boolean) {
    let text = this.getQuery(searchAsYouType);
    return this.lastQuery != text && text != null;
  }

  private suggestionShouldTriggerQuery(suggestions = this.lastSuggestions) {
    if (this.shouldExecuteQuery(true)) {
      if (suggestions && suggestions[0]) {
        let suggestion = suggestions[0];
        // If we have access to a confidence level, return true if we are equal or above the minimum confidence level.
        if (suggestion && suggestion.executableConfidence != undefined) {
          return suggestion.executableConfidence >= MINIMUM_EXECUTABLE_CONFIDENCE;
        }
        // If we don't have access to a confidence level, return true only if it "starts with" the content of the search box
        if (suggestion.text && suggestion.text.indexOf(this.magicBox.getText()) == 0) {
          return true;
        }
      }
    }
    return false;
  }

  private clearSearchAsYouType() {
    clearTimeout(this.searchAsYouTypeTimeout);
    this.searchAsYouTypeTimeout = undefined;
  }

  private getOmniboxAnalyticsEventCause() {
    if (this.searchInterface instanceof StandaloneSearchInterface) {
      return analyticsActionCauseList.omniboxFromLink;
    }
    return analyticsActionCauseList.omniboxAnalytics;
  }
}

Omnibox.options = _.extend({}, Omnibox.options, Querybox.options);
Initialization.registerAutoCreateComponent(Omnibox);
