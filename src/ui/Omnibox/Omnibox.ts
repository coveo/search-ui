///<reference path="FieldAddon.ts" />
///<reference path="QueryExtensionAddon.ts" />
///<reference path="QuerySuggestAddon.ts" />
///<reference path="OldOmniboxAddon.ts" />

import 'styling/_Omnibox';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import {
  IOmniboxPreprocessResultForQueryEventArgs,
  IPopulateOmniboxSuggestionsEventArgs,
  OmniboxEvents,
  IQuerySuggestSelection
} from '../../events/OmniboxEvents';
import { IBuildingQueryEventArgs, IDuringQueryEventArgs, QueryEvents, INewQueryEventArgs } from '../../events/QueryEvents';
import { StandaloneSearchInterfaceEvents } from '../../events/StandaloneSearchInterfaceEvents';
import { Assert } from '../../misc/Assert';
import { COMPONENT_OPTIONS_ATTRIBUTES } from '../../models/ComponentOptionsModel';
import { IAttributeChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES, QueryStateModel } from '../../models/QueryStateModel';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import {
  IAnalyticsActionCause,
  IAnalyticsNoMeta,
  IAnalyticsOmniboxSuggestionMeta,
  analyticsActionCauseList
} from '../Analytics/AnalyticsActionListMeta';
import { PendingSearchAsYouTypeSearchEvent } from '../Analytics/PendingSearchAsYouTypeSearchEvent';
import { logSearchBoxSubmitEvent } from '../Analytics/SharedAnalyticsCalls';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { IQueryboxOptions, Querybox } from '../Querybox/Querybox';
import { QueryboxQueryParameters } from '../Querybox/QueryboxQueryParameters';
import { StandaloneSearchInterface } from '../SearchInterface/SearchInterface';
import { FieldAddon } from './FieldAddon';
import { OldOmniboxAddon } from './OldOmniboxAddon';
import { QueryExtensionAddon } from './QueryExtensionAddon';
import { IQuerySuggestAddon, QuerySuggestAddon, VoidQuerySuggestAddon } from './QuerySuggestAddon';
import { Grammar } from '../../magicbox/Grammar';
import { Complete } from '../../magicbox/Grammars/Complete';
import { Expressions } from '../../magicbox/Grammars/Expressions';
import { Suggestion } from '../../magicbox/SuggestionsManager';
import { ExpressionDef } from '../../magicbox/Expression/Expression';
import { Result } from '../../magicbox/Result/Result';
import { MagicBoxInstance, createMagicBox } from '../../magicbox/MagicBox';
import { QueryboxOptionsProcessing } from '../Querybox/QueryboxOptionsProcessing';
import { OmniboxAnalytics } from './OmniboxAnalytics';
import { findWhere } from 'underscore';
import { BreadcrumbEvents } from '../../events/BreadcrumbEvents';

export interface IOmniboxSuggestion extends Suggestion {
  executableConfidence?: number;
}

export interface IOmniboxOptions extends IQueryboxOptions {
  inline?: boolean;
  enableFieldAddon?: boolean;
  enableSimpleFieldAddon?: boolean;
  listOfFields?: IFieldOption[];
  fieldAlias?: { [alias: string]: IFieldOption };
  enableQuerySuggestAddon?: boolean;
  enableQueryExtensionAddon?: boolean;
  omniboxTimeout?: number;
  placeholder?: string;
  numberOfSuggestions?: number;
  querySuggestCharacterThreshold?: number;
  grammar?: (
    grammar: { start: string; expressions: { [id: string]: ExpressionDef } }
  ) => { start: string; expressions: { [id: string]: ExpressionDef } };
  clearFiltersOnNewQuery?: boolean;
}

const MINIMUM_EXECUTABLE_CONFIDENCE = 0.8;

/**
 * The `Omnibox` component extends the [`Querybox`]{@link Querybox}, and thus provides the same basic options and
 * behaviors. Furthermore, the `Omnibox` adds a type-ahead capability to the search input.
 *
 * You can configure the type-ahead feature by enabling or disabling certain addons, which the Coveo JavaScript Search
 * Framework provides out-of-the-box (see the [`enableFieldAddon`]{@link Omnibox.options.enableFieldAddon},
 * [`enableQueryExtension`]{@link Omnibox.options.enableQueryExtensionAddon}, and
 * [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} options).
 *
 * Custom components and external code can also extend or customize the type-ahead feature and the query completion
 * suggestions it provides by attaching their own handlers to the
 * [`populateOmniboxSuggestions`]{@link OmniboxEvents.populateOmniboxSuggestions} event.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate an `Omnibox` along with an
 * optional {@link SearchButton}.
 */
export class Omnibox extends Component {
  public static ID = 'Omnibox';

  static doExport = () => {
    exportGlobally({
      Omnibox: Omnibox,
      QueryboxQueryParameters: QueryboxQueryParameters
    });
  };

  /**
   * The options for the omnibox
   * @componentOptions
   */
  static options: IOmniboxOptions = {
    /**
     * Specifies whether query completion suggestions appearing in the `Omnibox` should push the result list and facets
     * down, rather than rendering themselves over them (and partially hiding them).
     *
     * Set this option as well as {@link Omnibox.options.enableSearchAsYouType} and
     * {@link Omnibox.options.enableQuerySuggestAddon} to `true` for a cool effect!
     *
     * Default value is `false`.
     */
    inline: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Whether to automatically trigger a new query whenever the end user types additional text in the search box input.
     *
     * See also the [`searchAsYouTypeDelay`]{@link Omnibox.options.searchAsYouTypeDelay} option.
     *
     * **Note:**
     * > If you set this option and the [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon}
     * > option to `true`, the query suggestion feature returns the auto-completion of the currently typed keyword as
     * > its first suggestion.
     *
     * Default value is `false`.
     */
    enableSearchAsYouType: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Advanced Options' }),

    /**
     * If {@link Omnibox.options.enableSearchAsYouType} is `true`, specifies the delay (in milliseconds) before
     * triggering a new query when the end user types in the `Omnibox`.
     *
     * Default value is `2000`. Minimum value is `0`.
     */
    searchAsYouTypeDelay: ComponentOptions.buildNumberOption({
      defaultValue: 2000,
      min: 0,
      depend: 'enableSearchAsYouType',
      section: 'Advanced Options'
    }),

    /**
     * The `field` addon makes the `Omnibox` highlight and complete field syntax. Setting this option to `true` automatically sets
     * the [enableQuerySyntax]{@link Querybox.options.enableQuerySyntax} option to `true` as a side effect.
     *
     * **Example:**
     * > Suppose you want to search for PDF files. You start typing `@f` in the search box. The `Omnibox` provides
     * > you with several matching fields. You select the `@filetype` field. Then, you start typing `=p` in the input.
     * > This time, the `Omnibox` provides you with several matching values for the `@filetype` field. You select the
     * > `pdf` suggestion, and submit your search request. Since the `enableQuerySyntax` option is set to `true`, the
     * > Coveo Search API interprets the basic expression as query syntax and returns the items whose `@filetype` field
     * > matches the `pdf` value.
     *
     * Default value is `false`.
     */
    enableFieldAddon: ComponentOptions.buildBooleanOption({
      defaultValue: false,
      depend: 'enableQuerySyntax',
      postProcessing: (value, options: IOmniboxOptions) => {
        if (value) {
          options.enableQuerySyntax = true;
        }
        return value;
      },
      section: 'Advanced Options'
    }),
    enableSimpleFieldAddon: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableFieldAddon' }),
    listOfFields: ComponentOptions.buildFieldsOption({ depend: 'enableFieldAddon' }),

    /**
     * Whether to display Coveo Machine Learning (Coveo ML) query suggestions in the `Omnibox`.
     *
     * The corresponding Coveo ML model must be properly configured in your Coveo Cloud organization, otherwise this
     * option has no effect (see
     * [Managing Machine Learning Query Suggestions in a Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=168)).
     *
     * **Note:**
     * > When you set this option and the [`enableSearchAsYouType`]{@link Omnibox.options.enableSearchAsYouType} option
     * > to `true`, the query suggestion feature returns the auto-completion of the currently typed keyword as its first
     * > query suggestion.
     *
     * Default value is `true`.
     */
    enableQuerySuggestAddon: ComponentOptions.buildBooleanOption({
      defaultValue: true,
      alias: ['enableTopQueryAddon', 'enableRevealQuerySuggestAddon']
    }),

    /**
     * If {@link Querybox.options.enableQuerySyntax} is `true`, specifies whether to enable the `query extension` addon.
     *
     * The `query extension` addon allows the Omnibox to complete the syntax for query extensions.
     *
     * Default value is `false`.
     */
    enableQueryExtensionAddon: ComponentOptions.buildBooleanOption({
      defaultValue: false,
      depend: 'enableQuerySyntax',
      postProcessing: (value, options: IOmniboxOptions) => {
        if (value) {
          options.enableQuerySyntax = true;
        }
        return value;
      },
      section: 'Advanced Options'
    }),

    /**
     * Specifies a placeholder for the input.
     */
    placeholder: ComponentOptions.buildLocalizedStringOption(),

    /**
     * Specifies a timeout (in milliseconds) before rejecting suggestions in the Omnibox.
     *
     * Default value is `2000`. Minimum value is `0`.
     */
    omniboxTimeout: ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 }),
    /**
     * Specifies whether the Coveo Platform should try to interpret special query syntax such as field references in the
     * query that the user enters in the Querybox (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
     *
     * Setting this option to `true` also causes the query syntax in the Querybox to highlight.
     *
     * Default value is `false`.
     */
    enableQuerySyntax: ComponentOptions.buildBooleanOption({
      defaultValue: false,
      section: 'Advanced Options'
    }),
    /**
     * Specifies the number of suggestions that should appear in standard ML-powered query suggestions.
     *
     * This option only affects the number of suggestions that appear with the {@link Omnibox.options.enableQuerySuggestAddon} option.
     *
     * This options does not affect the {@link AnalyticsSuggestions} or the {@link FieldSuggestions} component, which expose their own dedicated options for this parameter.
     *
     * Default value is `5`.
     *
     * Minimum value is `1`.
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({
      defaultValue: 5,
      min: 1
    }),
    /**
     * The minimum number of characters required in the in the text input before displaying available query suggestions when focus is on the component.
     *
     * Note: Only effective when [enableQuerySuggestAddon]{@link Omnibox.options.enableQuerySuggestAddon} is true.
     *
     * depend: 'enableQuerySuggestAddon'
     *
     * Default (and minimum): 0, meaning that trending query suggestions are displayed when focus is on the component, even if its text input is empty.
     */
    querySuggestCharacterThreshold: ComponentOptions.buildNumberOption({
      defaultValue: 0,
      min: 0
    }),

    /**
     * Whether to clear all active query filters when the end user submits a new query from the search box.
     *
     * Note: This does not include the filter expression enforced by the currently selected tab, if any.
     *
     * **Default:** `false`
     */
    clearFiltersOnNewQuery: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  public magicBox: MagicBoxInstance;
  private lastSuggestions: IOmniboxSuggestion[] = [];
  private lastQuery: string;
  private modifyEventTo: IAnalyticsActionCause;
  private movedOnce = false;
  private searchAsYouTypeTimeout: number;
  private skipAutoSuggest = false;
  private omniboxAnalytics: OmniboxAnalytics;

  public suggestionAddon: IQuerySuggestAddon;

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
    const originalValueForQuerySyntax = this.options.enableQuerySyntax;
    new QueryboxOptionsProcessing(this).postProcess();
    this.omniboxAnalytics = this.searchInterface.getOmniboxAnalytics();
    $$(this.element).toggleClass('coveo-query-syntax-disabled', this.options.enableQuerySyntax == false);

    this.suggestionAddon = this.options.enableQuerySuggestAddon ? new QuerySuggestAddon(this) : new VoidQuerySuggestAddon();
    new OldOmniboxAddon(this);
    this.createMagicBox();

    this.bind.onRootElement(QueryEvents.newQuery, (args: INewQueryEventArgs) => this.handleNewQuery(args));
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(StandaloneSearchInterfaceEvents.beforeRedirect, () => this.handleBeforeRedirect());
    this.bind.onRootElement(QueryEvents.querySuccess, () => this.handleQuerySuccess());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.Q, (args: IAttributeChangedEventArg) =>
      this.handleQueryStateChanged(args)
    );
    if (this.isAutoSuggestion()) {
      this.bind.onRootElement(QueryEvents.duringQuery, (args: IDuringQueryEventArgs) => this.handleDuringQuery(args));
    }
    this.bind.onComponentOptions(MODEL_EVENTS.CHANGE_ONE, COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, (args: IAttributeChangedEventArg) => {
      if (args.value.enableQuerySyntax != null) {
        this.options.enableQuerySyntax = args.value.enableQuerySyntax;
      } else {
        this.options.enableQuerySyntax = originalValueForQuerySyntax;
      }
      this.updateGrammar();
    });
    this.bind.onRootElement(OmniboxEvents.querySuggestGetFocus, (args: IQuerySuggestSelection) => this.handleQuerySuggestGetFocus(args));
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
      logSearchBoxSubmitEvent(this.usageAnalytics);
    });
    this.magicBox.blur();
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

  public resultAtCursor(match?: string | { (result: Result): boolean }) {
    return this.magicBox.resultAtCursor(match);
  }

  private createGrammar() {
    let grammar = null;

    if (this.options.enableQuerySyntax) {
      grammar = Expressions(Complete);
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

    if (this.options.grammar != null) {
      grammar = this.options.grammar(grammar);
    }

    return grammar;
  }

  private updateGrammar() {
    const grammar = this.createGrammar();
    this.magicBox.grammar = new Grammar(grammar.start, grammar.expressions);
    this.magicBox.setText(this.magicBox.getText());
  }

  private createMagicBox() {
    const grammar = this.createGrammar();
    this.magicBox = createMagicBox(this.element, new Grammar(grammar.start, grammar.expressions), this.root, {
      inline: this.options.inline,
      selectableSuggestionClass: 'coveo-omnibox-selectable',
      selectedSuggestionClass: 'coveo-omnibox-selected',
      suggestionTimeout: this.options.omniboxTimeout
    });

    const input = $$(this.magicBox.element).find('input');

    if (input) {
      $$(input).setAttribute('aria-label', l('SubmitSearch'));
    }

    this.setupMagicBox();
  }

  private setupMagicBox() {
    this.magicBox.onmove = () => {
      // We assume that once the user has moved its selection, it becomes an explicit omnibox analytics event
      if (this.isAutoSuggestion()) {
        this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
      }
      this.movedOnce = true;
    };

    this.magicBox.onfocus = () => {
      if (this.isAutoSuggestion()) {
        // This flag is used to block the automatic query when the UI is loaded with a query (#q=foo)
        // and then the input is focused. We want to block that query, even if it match the suggestion
        // Only when there is an actual change in the input (user typing something) is when we want the automatic query to kick in
        this.skipAutoSuggest = true;
      }
    };

    this.magicBox.onsuggestions = (suggestions: IOmniboxSuggestion[]) => {
      // If text is empty, this can mean that user selected text from the search box
      // and hit "delete" : Reset the partial queries in this case
      if (Utils.isEmptyString(this.getText())) {
        this.omniboxAnalytics.partialQueries = [];
      }
      this.movedOnce = false;
      this.lastSuggestions = suggestions;
      if (this.isAutoSuggestion() && !this.skipAutoSuggest) {
        this.searchAsYouType();
      }
    };

    if (this.options.enableSearchAsYouType) {
      $$(this.element).addClass('coveo-magicbox-search-as-you-type');
    }

    this.magicBox.onchange = () => {
      this.skipAutoSuggest = false;
      const text = this.getText();
      if (text != undefined && text != '') {
        if (this.isAutoSuggestion()) {
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
    this.magicBox.onsubmit = () => this.submit();

    this.magicBox.onselect = (suggestion: IOmniboxSuggestion) => {
      const index = _.indexOf(this.lastSuggestions, suggestion);
      const suggestions = _.compact(_.map(this.lastSuggestions, suggestion => suggestion.text));
      this.magicBox.clearSuggestion();
      this.updateQueryState();
      // A bit tricky here : When it's machine learning auto suggestions
      // the mouse selection and keyboard selection acts differently :
      // keyboard selection will automatically do the query (which will log a search as you type event -> further modified by this.modifyEventTo if needed)
      // mouse selection will not "auto" send the query.
      // the movedOnce variable detect the keyboard movement, and is used to differentiate mouse vs keyboard
      if (!this.isAutoSuggestion()) {
        this.usageAnalytics.cancelAllPendingEvents();
        this.triggerNewQuery(false, () => {
          this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(
            this.getOmniboxAnalyticsEventCause(),
            this.buildCustomDataForPartialQueries(index, suggestions)
          );
        });
      } else if (this.isAutoSuggestion() && this.movedOnce) {
        this.handleAutoSuggestionWithKeyboard(index, suggestions);
      } else if (this.isAutoSuggestion() && !this.movedOnce) {
        this.handleAutoSuggestionsWithMouse(index, suggestions);
      }

      // Consider a selection like a reset of the partial queries (it's the end of a suggestion pattern)
      if (this.isAutoSuggestion()) {
        this.omniboxAnalytics.partialQueries = [];
      }
    };

    this.magicBox.onblur = () => {
      if (this.isAutoSuggestion()) {
        this.setText(this.getQuery(true));
        this.usageAnalytics.sendAllPendingEvents();
      }
    };

    this.magicBox.onclear = () => {
      this.updateQueryState();
      if (this.options.triggerQueryOnClear || this.options.enableSearchAsYouType) {
        this.triggerNewQuery(false, () => {
          this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxClear, {});
        });
      }
    };

    this.magicBox.ontabpress = () => {
      this.handleTabPress();
    };

    this.magicBox.getSuggestions = () => this.handleSuggestions();
  }

  private handleAutoSuggestionWithKeyboard(index: number, suggestions: string[]) {
    if (this.searchAsYouTypeTimeout) {
      // Here, there is currently a search as you typed queued up :
      // Think : user typed very quickly, then very quickly selected a suggestion (without waiting for the search as you type)
      // Cancel the search as you type query, then immediately do the query with the selection (+analytics event with the selection)
      this.usageAnalytics.cancelAllPendingEvents();
      clearTimeout(this.searchAsYouTypeTimeout);
      this.searchAsYouTypeTimeout = undefined;
      this.triggerNewQuery(false, () => {
        this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(
          this.getOmniboxAnalyticsEventCause(),
          this.buildCustomDataForPartialQueries(index, suggestions)
        );
      });
    } else {
      // Here, the search as you type query has returned, but the analytics event has not ye been sent.
      // Think : user typed slowly, the query returned, and then the user selected a suggestion.
      // Since the analytics event has not yet been sent (search as you type event have a 5 sec delay)
      // modify the pending event, then send the newly modified analytics event immediately.
      this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
      this.modifyCustomDataOnPending(index, suggestions);
      this.modifyQueryContentOnPending();
      this.usageAnalytics.sendAllPendingEvents();
    }
  }

  private handleAutoSuggestionsWithMouse(index: number, suggestions: string[]) {
    if (this.searchAsYouTypeTimeout || index != 0) {
      // Here : the user either very quickly chose the first suggestion, and the search as you type is still queued up.
      // OR
      // the user chose something different then the first suggestion.
      // Remove the search as you type if it's there, and do the query with the suggestion directly.
      this.clearSearchAsYouType();
      this.usageAnalytics.cancelAllPendingEvents();
      this.triggerNewQuery(false, () => {
        this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(
          this.getOmniboxAnalyticsEventCause(),
          this.buildCustomDataForPartialQueries(index, suggestions)
        );
      });
    } else {
      // Here : the user either very slowly chose a suggestion, and there is no search as you typed queued up
      // AND
      // the user chose the first suggestion.
      // this means the query is already returned, but the analytics event is still queued up.
      // modify the analytics event, and send it.
      this.modifyEventTo = this.getOmniboxAnalyticsEventCause();
      this.modifyCustomDataOnPending(index, suggestions);
      this.modifyQueryContentOnPending();
      this.usageAnalytics.sendAllPendingEvents();

      // This should happen if :
      // users did a (short) query first, which does not match the first suggestion. (eg: typed "t", then search)
      // then, refocus the search box. The same suggestion(s) will re-appear.
      // By selecting the first one with the mouse, we need to retrigger a query because this means the search as you type could not
      // kick in and do the query automatically.
      if (this.lastQuery != this.getText()) {
        this.triggerNewQuery(false, () => {
          this.usageAnalytics.logSearchEvent<IAnalyticsOmniboxSuggestionMeta>(
            this.getOmniboxAnalyticsEventCause(),
            this.buildCustomDataForPartialQueries(index, suggestions)
          );
        });
      }
    }
  }

  private modifyCustomDataOnPending(index: number, suggestions: string[]) {
    const pendingEvt = this.usageAnalytics.getPendingSearchEvent();
    if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent) {
      const newCustomData = this.buildCustomDataForPartialQueries(index, suggestions);
      _.each(_.keys(newCustomData), (k: string) => {
        (<PendingSearchAsYouTypeSearchEvent>pendingEvt).modifyCustomData(k, newCustomData[k]);
      });
    }
  }

  private modifyQueryContentOnPending() {
    const pendingEvt = this.usageAnalytics.getPendingSearchEvent();
    if (pendingEvt instanceof PendingSearchAsYouTypeSearchEvent) {
      const queryContent = this.getQuery(this.options.enableSearchAsYouType);
      pendingEvt.modifyQueryContent(queryContent);
    }
  }

  private buildCustomDataForPartialQueries(index: number, suggestions: string[]): IAnalyticsOmniboxSuggestionMeta {
    this.updateOmniboxAnalytics(suggestions, index);
    return this.omniboxAnalytics.buildCustomDataForPartialQueries();
  }

  private handleQuerySuggestGetFocus({ suggestion }: IQuerySuggestSelection) {
    const suggestions = _.compact(_.map(this.lastSuggestions, suggestion => suggestion.text));
    const ranking = this.lastSuggestions.indexOf(findWhere(this.lastSuggestions, { text: suggestion }));
    this.updateOmniboxAnalytics(suggestions, ranking);
  }

  private updateOmniboxAnalytics(suggestions: string[], suggestionRanking: number) {
    this.omniboxAnalytics.suggestions = suggestions;
    this.omniboxAnalytics.suggestionRanking = suggestionRanking;
  }

  private handleSuggestions() {
    const text = this.getText();
    if (this.options.querySuggestCharacterThreshold <= text.length) {
      const suggestionsEventArgs: IPopulateOmniboxSuggestionsEventArgs = {
        suggestions: [],
        omnibox: this
      };
      this.bind.trigger(this.element, OmniboxEvents.populateOmniboxSuggestions, suggestionsEventArgs);
      if (!Utils.isNullOrEmptyString(text)) {
        this.omniboxAnalytics.partialQueries.push(text);
      }
      return _.compact(suggestionsEventArgs.suggestions);
    } else {
      return [];
    }
  }

  private handleBeforeRedirect() {
    this.updateQueryState();
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);
    Assert.exists(data.queryBuilder);
    this.updateQueryState();
    this.lastQuery = this.getQuery(data.searchAsYouType);

    const result: Result =
      this.lastQuery == this.magicBox.getDisplayedResult().input
        ? this.magicBox.getDisplayedResult().clone()
        : this.magicBox.grammar.parse(this.lastQuery).clean();
    const preprocessResultForQueryArgs: IOmniboxPreprocessResultForQueryEventArgs = {
      result: result
    };

    if (this.options.enableQuerySyntax) {
      const notQuotedValues = preprocessResultForQueryArgs.result.findAll('FieldValueNotQuoted');
      _.each(notQuotedValues, (value: Result) => (value.value = '"' + value.value.replace(/"|\u00A0/g, ' ') + '"'));
      if (this.options.fieldAlias) {
        const fieldNames = preprocessResultForQueryArgs.result.findAll(
          (result: Result) => result.expression.id == 'FieldName' && result.isSuccess()
        );
        _.each(fieldNames, (result: Result) => {
          const alias = _.find(_.keys(this.options.fieldAlias), (alias: string) => alias.toLowerCase() == result.value.toLowerCase());
          if (alias != null) {
            result.value = <string>this.options.fieldAlias[alias];
          }
        });
      }
    }

    this.bind.trigger(this.element, OmniboxEvents.omniboxPreprocessResultForQuery, preprocessResultForQueryArgs);
    const query = preprocessResultForQueryArgs.result.toString();
    new QueryboxQueryParameters(this.options).addParameters(data.queryBuilder, query);
  }

  private handleNewQuery(data: INewQueryEventArgs) {
    Assert.exists(data);
    this.options.clearFiltersOnNewQuery && this.clearFiltersIfNewQuery(data);
  }

  private clearFiltersIfNewQuery({ origin, searchAsYouType }: INewQueryEventArgs) {
    if (this.queryController.firstQuery) {
      return;
    }

    // Prevent queries triggered by unrelated components to clear the the filters
    // e.g., a facet selection
    const validOrigins = [Omnibox.ID, 'SearchButton'];
    if (!origin || validOrigins.indexOf(origin.type) === -1) {
      return;
    }

    const lastQuery = this.queryController.getLastQuery().q || '';
    const newQuery = this.getQuery(searchAsYouType);
    if (lastQuery !== newQuery) {
      this.bind.trigger(this.root, BreadcrumbEvents.clearBreadcrumb);
    }
  }

  private handleTabPress() {
    if (this.options.enableQuerySuggestAddon) {
      this.handleTabPressForSuggestions();
    }
    this.handleTabPressForOldOmniboxAddon();
  }

  private handleTabPressForSuggestions() {
    if (!this.options.enableSearchAsYouType) {
      const suggestions = _.compact(_.map(this.lastSuggestions, suggestion => suggestion.text));
      this.usageAnalytics.logCustomEvent(
        this.getOmniboxAnalyticsEventCause(),
        this.buildCustomDataForPartialQueries(0, suggestions),
        this.element
      );
    } else {
      this.setText(this.getQuery(true));
    }
  }

  private handleTabPressForOldOmniboxAddon() {
    const domSuggestions = this.lastSuggestions.filter(suggestions => suggestions.dom).map(suggestions => $$(suggestions.dom));
    const selected = this.findAllElementsWithClass(domSuggestions, '.coveo-omnibox-selected');
    if (selected.length > 0) {
      $$(selected[0]).trigger('tabSelect');
    } else if (!this.options.enableQuerySuggestAddon) {
      const selectable = this.findAllElementsWithClass(domSuggestions, '.coveo-omnibox-selectable');
      if (selectable.length > 0) {
        $$(selectable[0]).trigger('tabSelect');
      }
    }
  }

  private findAllElementsWithClass(elements: Dom[], className: string): Dom[] {
    return elements
      .map(element => element.find(className))
      .filter(s => s)
      .reduce((total, s) => total.concat(s), []);
  }

  private triggerNewQuery(searchAsYouType: boolean, analyticsEvent: () => void) {
    clearTimeout(this.searchAsYouTypeTimeout);
    const shouldExecuteQuery = this.shouldExecuteQuery(searchAsYouType);
    this.lastQuery = this.getQuery(searchAsYouType);
    shouldExecuteQuery && analyticsEvent();

    this.queryController.executeQuery({
      searchAsYouType: searchAsYouType,
      logInActionsHistory: true,
      cancel: !shouldExecuteQuery,
      origin: this
    });
  }

  private getQuery(searchAsYouType: boolean) {
    if (this.lastQuery == this.magicBox.getText()) {
      return this.lastQuery;
    }

    if (!searchAsYouType) {
      return this.magicBox.getText();
    }

    const wordCompletion = this.magicBox.getWordCompletion();

    if (wordCompletion != null) {
      return wordCompletion;
    }

    const currentOmniboxSuggestion = this.magicBox.getWordCompletion() || this.getFirstSuggestion();
    if (currentOmniboxSuggestion) {
      return currentOmniboxSuggestion;
    }

    if (this.isAutoSuggestion()) {
      return this.lastQuery || this.magicBox.getText();
    }

    return this.magicBox.getText();
  }

  private getFirstSuggestion() {
    if (this.lastSuggestions == null) {
      return '';
    }

    if (this.lastSuggestions.length <= 0) {
      return '';
    }

    const textSuggestion = _.find(this.lastSuggestions, (suggestion: IOmniboxSuggestion) => suggestion.text != null);

    if (textSuggestion == null) {
      return '';
    }

    return textSuggestion.text;
  }

  public updateQueryState() {
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, this.magicBox.getText());
  }

  private handleQueryStateChanged(args: IAttributeChangedEventArg) {
    Assert.exists(args);
    const q = <string>args.value;
    if (q != this.magicBox.getText()) {
      this.magicBox.setText(q);
    }
  }

  private handleQuerySuccess() {
    if (!this.isAutoSuggestion()) {
      this.omniboxAnalytics.partialQueries = [];
    }
  }

  private handleDuringQuery(args: IDuringQueryEventArgs) {
    // When the query results returns ... (args.promise)
    args.promise.then(() => {
      // Get a handle on a pending search as you type (those events are delayed, not sent instantly)
      const pendingEvent = this.usageAnalytics.getPendingSearchEvent();
      if (pendingEvent instanceof PendingSearchAsYouTypeSearchEvent) {
        (<PendingSearchAsYouTypeSearchEvent>pendingEvent).beforeResolve.then(evt => {
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
      this.searchAsYouTypeTimeout = window.setTimeout(() => {
        if (this.suggestionShouldTriggerQuery() || forceExecuteQuery) {
          const suggestions = _.map(this.lastSuggestions, suggestion => suggestion.text);
          const index = _.indexOf(suggestions, this.magicBox.getWordCompletion());
          this.triggerNewQuery(true, () => {
            this.usageAnalytics.logSearchAsYouType<IAnalyticsOmniboxSuggestionMeta>(
              analyticsActionCauseList.searchboxAsYouType,
              this.buildCustomDataForPartialQueries(index, suggestions)
            );
          });
          this.clearSearchAsYouType();
        }
      }, this.options.searchAsYouTypeDelay);
    }
  }

  private isAutoSuggestion() {
    return this.options.enableSearchAsYouType && this.options.enableQuerySuggestAddon;
  }

  private shouldExecuteQuery(searchAsYouType: boolean) {
    const text = this.getQuery(searchAsYouType);
    if (this.searchInterface.options.allowQueriesWithoutKeywords === false) {
      return this.lastQuery != text && Utils.isNonEmptyString(text);
    }
    return this.lastQuery != text && text != null;
  }

  private suggestionShouldTriggerQuery(suggestions = this.lastSuggestions) {
    if (this.shouldExecuteQuery(true)) {
      if (suggestions && suggestions[0]) {
        const suggestion = suggestions[0];
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

Omnibox.options = { ...Omnibox.options, ...Querybox.options };
Initialization.registerAutoCreateComponent(Omnibox);
