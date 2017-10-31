import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
export const MagicBox: any = require('exports-loader?Coveo.MagicBox!magic-box');
import { Initialization } from '../Base/Initialization';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { MODEL_EVENTS, IAttributeChangedEventArg } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES, QueryStateModel } from '../../models/QueryStateModel';
import { StandaloneSearchInterfaceEvents } from '../../events/StandaloneSearchInterfaceEvents';
import { IAnalyticsNoMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { $$ } from '../../utils/Dom';
import { Assert } from '../../misc/Assert';
import { QueryboxQueryParameters } from './QueryboxQueryParameters';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

export interface IQueryboxOptions {
  enableSearchAsYouType?: boolean;
  searchAsYouTypeDelay?: number;
  enableQuerySyntax?: boolean;
  enableWildcards?: boolean;
  enableQuestionMarks?: boolean;
  enableLowercaseOperators?: boolean;
  enablePartialMatch?: boolean;
  partialMatchKeywords?: number;
  partialMatchThreshold?: string;
  placeholder?: string;
  triggerQueryOnClear?: boolean;
}

/**
 * The `Querybox` component renders an input which the end user can interact with to enter and submit queries.
 *
 * When the end user submits a search request, the `Querybox` component triggers a query and logs the corresponding
 * usage analytics data.
 *
 * For technical reasons, it is necessary to instantiate this component on a `div` element rather than on an `input`
 * element.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate a `Querybox` along with an
 * optional [`SearchButton`]{@link SearchButton} component.
 */
export class Querybox extends Component {
  static ID = 'Querybox';

  static doExport = () => {
    exportGlobally({
      Querybox: Querybox,
      MagicBox: MagicBox,
      QueryboxQueryParameters: QueryboxQueryParameters
    });
  };

  /**
   * The options for the Querybox.
   * @componentOptions
   */
  public static options: IQueryboxOptions = {
    /**
     * Specifies whether to enable the search-as-you-type feature.
     *
     * Default value is `false`.
     */
    enableSearchAsYouType: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'SearchAsYouType' }),

    /**
     * If the [`enableSearchAsYouType`]{@link Querybox.options.enableSearchAsYouType} option is `true`, specifies how
     * long to wait (in milliseconds) between each key press before triggering a new query.
     *
     * Default value is `50`. Minimum value is `0`
     */
    searchAsYouTypeDelay: ComponentOptions.buildNumberOption({ defaultValue: 50, min: 0, section: 'SearchAsYouType' }),

    /**
     * Specifies whether to interpret special query syntax (e.g., `@objecttype=message`) when the end user types
     * a query in the `Querybox` (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Setting this
     * option to `true` also causes the `Querybox` to highlight any query syntax.
     *
     * Regardless of the value of this option, the Coveo Cloud REST Search API always interprets expressions surrounded
     * by double quotes (`"`) as exact phrase match requests.
     *
     * See also [`enableLowercaseOperators`]{@link Querybox.options.enableLowercaseOperators}.
     *
     * **Notes:**
     * > * End user preferences can override the value you specify for this option.
     * >
     * > If the end user selects a value other than **Automatic** for the **Enable query syntax** setting (see
     * > the [`enableQuerySyntax`]{@link ResultsPreferences.options.enableQuerySyntax} option of the
     * > [`ResultsPreferences`]{@link ResultsPreferences} component), the end user preference takes precedence over this
     * > option.
     * >
     * > * On-premises versions of the Coveo Search API require this option to be set to `true` in order to interpret
     * > expressions surrounded by double quotes (`"`) as exact phrase match requests.
     *
     * Default value is `false`.
     */
    enableQuerySyntax: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),

    /**
     * Specifies whether to expand basic expression keywords containing wildcards characters (`*`) to the possible
     * matching keywords in order to broaden the query (see
     * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
     *
     * See also [`enableQuestionMarks`]{@link Querybox.options.enableQuestionMarks}.
     *
     *  **Note:**
     * > If you are using an on-premises version of the Coveo Search API, you need to set the
     * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` to be able to set
     * > `enableWildcards` to `true`.
     *
     * Default value is `false`.
     */
    enableWildcards: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),

    /**
     * If [`enableWildcards`]{@link Querybox.options.enableWildcards} is `true`, specifies whether to expand basic
     * expression keywords containing question mark characters (`?`) to the possible matching keywords in order to
     * broaden the query (see
     * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
     *
     * **Note:**
     * > If you are using an on-premises version of the Coveo Search API, you also need to set the
     * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` in order to be able to set
     * > `enableQuestionMarks` to `true`.
     *
     * Default value is `false`.
     */
    enableQuestionMarks: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableWildcards' }),

    /**
     * If the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is `true`, specifies whether to
     * interpret the `AND`, `NOT`, `OR`, and `NEAR` keywords in the `Querybox` as query operators in the query, even if
     * the end user types those keywords in lowercase.
     *
     * This option applies to all query operators (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
     *
     * **Example:**
     * > If this option and the `enableQuerySyntax` option are both `true`, the Coveo Platform interprets the `near`
     * > keyword in a query such as `service center near me` as the `NEAR` query operator (not as a query term).
     *
     * > Otherwise, if the `enableQuerySyntax` option is `true` and this option is `false`, the end user has to type the
     * > `NEAR` keyword in uppercase for the Coveo Platform to interpret it as a query operator.
     *
     * Default value is `false`.
     */
    enableLowercaseOperators: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),

    /**
     * Specifies whether to automatically convert any basic expression containing at least a certain number of keywords
     * (see the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option) to a *partial match
     * expression*, so that items containing at least a certain subset of those keywords (see the
     * [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option) will match the query.
     *
     * **Example:**
     *
     * > With the following markup configuration, if a basic expression contains at least 4 keywords, items containing
     * > at least 75% of those keywords (round up) will match the query.
     * > ```html
     * > <div class='CoveoQuerybox' data-enable-partial-match='true' data-partial-match-keywords='4' data-partial-match-threshold='75%'></div>
     * > ```
     * > For instance, if the basic expression is `Coveo custom component configuration help`, items containing
     * > all 5 of those keywords, or 4 of them (75% of 5 rounded up) will match the query.
     *
     * Default value is `false`, which implies that an item must contain all of the basic expression keywords to match
     * the query.
     * @notSupportedIn salesforcefree
     */
    enablePartialMatch: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * When the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch} option is `true`, specifies the
     * minimum number of keywords that need to be present in the basic expression to convert it to a partial match
     * expression.
     *
     * See also the [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option.
     *
     * **Note:**
     * > Only the basic expression of the query (see [`q`]{@link q}) can be converted to a partial match expression.
     *
     * **Example:**
     * > If the `partialMatchKeywords` value is `7`, the basic expression will have to contain at least 7 keywords
     * > to be converted to a partial match expression.
     *
     * Default value is `5`.
     * @notSupportedIn salesforcefree
     */
    partialMatchKeywords: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1, depend: 'enablePartialMatch' }),

    /**
     * When the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch} option is `true`, specifies an
     * absolute or relative (percentage) value indicating the minimum number of partial match expression keywords an
     * item must contain to match the query.
     *
     * See also the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option.
     *
     * **Note:**
     * > The relative threshold is always rounded up to the nearest integer.
     *
     * **Examples:**
     * > If the `partialMatchThreshold` value is `50%` and the partial match expression contains exactly 9 keywords,
     * > items will have to contain at least 5 of those keywords to match the query (50% of 9, rounded up).
     *
     * > With the same configuration, if the partial match expression contains exactly 12 keywords, items will have to
     * > contain at least 6 of those keywords to match the query (50% of 12).
     *
     * > If the `partialMatchThreshold` value is `2`, items will always have to contain at least 2 of the partial match
     * > expression keywords to match the query, no matter how many keywords the partial match expression actually
     * > contains.
     *
     * Default value is `50%`.
     * @notSupportedIn salesforcefree
     */
    partialMatchThreshold: ComponentOptions.buildStringOption({ defaultValue: '50%', depend: 'enablePartialMatch' }),

    /**
     * Specifies whether to trigger a query when clearing the `Querybox`.
     *
     * Default value is `true`.
     */
    triggerQueryOnClear: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  public magicBox: Coveo.MagicBox.Instance;
  private lastQuery: string;
  private searchAsYouTypeTimeout: number;

  /**
   * Creates a new `Querybox component`. Creates a new `Coveo.Magicbox` instance and wraps the Magicbox methods
   * (`onblur`, `onsubmit` etc.). Binds event on `buildingQuery` and before redirection (for standalone box).
   * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
   * technical reasons.
   * @param options The options for the `Querybox` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IQueryboxOptions, public bindings?: IComponentBindings) {
    super(element, Querybox.ID, bindings);

    if (element instanceof HTMLInputElement) {
      this.logger.error('Querybox cannot be used on an HTMLInputElement');
    }

    this.options = ComponentOptions.initComponentOptions(element, Querybox, options);
    this.options = _.extend({}, this.options, this.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.searchBox));

    this.magicBox = MagicBox.create(
      element,
      new MagicBox.Grammar('Query', {
        Query: '[Term*][Spaces?]',
        Term: '[Spaces?][Word]',
        Spaces: / +/,
        Word: /[^ ]+/
      }),
      {
        inline: true
      }
    );

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(StandaloneSearchInterfaceEvents.beforeRedirect, () => this.updateQueryState());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.Q, (args: IAttributeChangedEventArg) =>
      this.handleQueryStateChanged(args)
    );

    if (this.options.enableSearchAsYouType) {
      $$(this.element).addClass('coveo-search-as-you-type');
      this.magicBox.onchange = () => {
        this.searchAsYouType();
      };
    }

    this.magicBox.onsubmit = () => {
      this.submit();
    };

    this.magicBox.onblur = () => {
      this.updateQueryState();
    };

    this.magicBox.onclear = () => {
      this.updateQueryState();
      if (this.options.triggerQueryOnClear) {
        this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxClear, {});
        this.triggerNewQuery(false);
      }
    };
  }

  /**
   * Adds the current content of the input to the query and triggers a query if the current content of the input has
   * changed since last submit.
   *
   * Also logs the `serachboxSubmit` event in the usage analytics.
   */
  public submit(): void {
    this.magicBox.clearSuggestion();
    this.updateQueryState();
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
    this.triggerNewQuery(false);
  }

  /**
   * Sets the content of the input.
   *
   * @param text The string to set in the input.
   */
  public setText(text: string): void {
    this.magicBox.setText(text);
    this.updateQueryState();
  }

  /**
   * Clears the content of the input.
   *
   * See also the [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear} option.
   */
  public clear(): void {
    this.magicBox.clear();
  }

  /**
   * Gets the content of the input.
   *
   * @returns {string} The content of the input.
   */
  public getText(): string {
    return this.magicBox.getText();
  }

  /**
   * Gets the result from the input.
   *
   * @returns {Result} The result.
   */
  public getResult() {
    return this.magicBox.getResult();
  }

  /**
   * Gets the displayed result from the input.
   *
   * @returns {Result} The displayed result.
   */
  public getDisplayedResult() {
    return this.magicBox.getDisplayedResult();
  }

  /**
   * Gets the current cursor position in the input.
   *
   * @returns {number} The cursor position (index starts at 0).
   */
  public getCursor(): number {
    return this.magicBox.getCursor();
  }

  /**
   * Gets the result at cursor position.
   *
   * @param match {string | { (result): boolean }} The match condition.
   *
   * @returns {Result[]} The result.
   */
  public resultAtCursor(match?: string | { (result): boolean }) {
    return this.magicBox.resultAtCursor(match);
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs): void {
    Assert.exists(args);
    Assert.exists(args.queryBuilder);

    this.updateQueryState();
    this.lastQuery = this.magicBox.getText();
    new QueryboxQueryParameters(this.options).addParameters(args.queryBuilder, this.lastQuery);
  }

  private triggerNewQuery(searchAsYouType: boolean): void {
    clearTimeout(this.searchAsYouTypeTimeout);
    let text = this.magicBox.getText();
    if (this.lastQuery != text && text != null) {
      this.lastQuery = text;
      this.queryController.executeQuery({
        searchAsYouType: searchAsYouType,
        logInActionsHistory: true
      });
    }
  }

  private updateQueryState(): void {
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, this.magicBox.getText());
  }

  private handleQueryStateChanged(args: IAttributeChangedEventArg): void {
    Assert.exists(args);
    let q = <string>args.value;
    if (q != this.magicBox.getText()) {
      this.magicBox.setText(q);
    }
  }

  private searchAsYouType(): void {
    clearTimeout(this.searchAsYouTypeTimeout);
    this.searchAsYouTypeTimeout = setTimeout(() => {
      this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxAsYouType, {});
      this.triggerNewQuery(true);
    }, this.options.searchAsYouTypeDelay);
  }
}
Initialization.registerAutoCreateComponent(Querybox);
