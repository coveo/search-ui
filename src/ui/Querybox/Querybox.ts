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
  autoFocus?: boolean;
  placeholder?: string;
  triggerQueryOnClear?: boolean;
}

/**
 * The Querybox component allows the user to enter a query in an input.
 *
 * When the user submits the query by pressing the **Enter** key, this component triggers a query and logs the
 * corresponding analytics data.
 *
 * For technical reasons, this component must be instantiated on a `div` element rather than directly on an `input`
 * element.
 */
export class Querybox extends Component {
  static ID = 'Querybox';
  /**
   * The options for the Querybox.
   * @componentOptions
   */

  public static options: IQueryboxOptions = {
    /**
     * Specifies whether the search-as-you-type feature should be enabled.
     *
     * Default value is `false`.
     */
    enableSearchAsYouType: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * If the {@link Querybox.options.enableSearchAsYouType} option is set to `true`, this option specifies the delay
     * (in ms) between a keypress and a query being triggered.
     *
     * Default value is `500`.
     */
    searchAsYouTypeDelay: ComponentOptions.buildNumberOption({ defaultValue: 500, min: 0 }),

    /**
     * Specifies whether the Coveo Platform should try to interpret special query syntax such as field references in the
     * query entered in the Querybox (see
     * <a target="_blank" href="http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005">Coveo Query Syntax Reference</a>).
     *
     * Query syntax in the Querybox will also be highlighted when this option is enabled.
     * 
     * See also {@link Querybox.options.enableWildcards}, {@link Querybox.options.enableQuestionMarks} and
     * {@link Querybox.options.enableLowercaseOperators}.
     *
     * Default value is `true`.
     */
    enableQuerySyntax: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If the {@link Querybox.options.enableQuerySyntax} is set to `true`, specifies whether the Coveo Platform should
     * expand keywords containing wildcard characters (*) to the possible matching keywords in order to broaden the
     * query (see
     * <a target="_blank" href="http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005">Coveo Query Syntax Reference</a>).
     *
     * Default value is `false`.
     *
     * #### Example
     * > If this option and the enableQuerySyntax option are both set to `true`, then the Coveo Platform will expand the
     * > `doc*` keyword to keywords such as `doc`, `dochtml`, `document` or `documentation`.
     */
    enableWildcards: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * If the {@link Querybox.options.enableQuerySyntax} and {@link Querybox.options.enableWildcards} options are both
     * set to `true`, specifies whether the Coveo Platform should expand keywords containing question mark characters
     * (?) to the possible matching keywords in order to broaden the query (see
     * <a target="_blank" href="http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005">Coveo Query Syntax Reference</a>).
     *
     * Default value is `false`.
     *
     * #### Example
     * > If this option, the enableQuerySyntax and the enableWildcards options are all set to `true`, then the Coveo
     * > Platform will expand the `Cove?` keyword to keywords such as
     * > `Cove`, `Cover` and `Coveo`.
     */
    enableQuestionMarks: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * If the {@link Querybox.options.enableQuerySyntax} option is set to `true`, specifies whether the `AND`, `NOT`,
     * `OR` and `NEAR` keywords in the Querybox should be treated as query operators in the query even when they are
     * typed in lowercase. This option applies to all query operators (see
     * <a target="_blank" href="http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005">Coveo Query Syntax Reference</a>).
     *
     * Default value is `false`.
     *
     * #### Example
     * > If this option and the enableQuerySyntax option are both set to `true`, then the Coveo Platform will interpret
     * > the `near` keyword in a query such as `service center near me` as a query operator (not as a query term).
     *
     * > Otherwise, if the enableQuerySyntax option is set to `true` and this option is set to `false`, the `NEAR`
     * > keyword will have to be typed in uppercase in order for it to be interpreted as a query operator.
     */
    enableLowercaseOperators: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether a basic expression containing at least a certain number of keywords (see
     * {@link Querybox.options.partialMatchKeywords}) will automatically be converted to a partial match expression, so
     * that documents containing at least a certain subset of those keywords (see
     * {@link Querybox.options.partialMatchThreshold}) will match the query.
     *
     * Default value is `false`.
     *
     * #### Example
     * ```html
     * [ ... ]
     *
     * <!-- With the following markup configuration, if a basic expression contains at least 4 keywords, -->
     * <!-- then documents containing at least 75% of those keywords (rounded up) will match the query. -->
     *
     * <!-- For instance, if the basic expression is "Coveo custom component configuration help", then documents -->
     * <!-- containing all 5 of those keywords, or 4 of them (75% of 5 rounded up) will match the query. -->
     * <div classname="CoveoSearchBox" data-enable-omnibox="false" data-enable-partial-match="true" data-partial-match-keywords="4" data-partial-match-threshold="75%">
     * </div>
     *
     * [ ... ]
     * ```
     */
    enablePartialMatch: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * When the {@link Querybox.options.enablePartialMatch} option is set to `true`, this option specifies the minimum
     * number of keywords required in the basic expression for it to be converted to a partial match expression.
     *
     * See also the {@link Querybox.options.partialMatchThreshold} option.
     *
     * Default value is `5`.
     *
     * #### Note
     * > Only the basic expression of the query (see {@link q}) can be converted to a partial match expression.
     *
     * #### Example
     * > If the partialMatchKeywords option is set to `7`, the basic expression will have to contain at least 7 keywords
     * > to be converted to a partial match expression.
     */
    partialMatchKeywords: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),

    /**
     * When the {@link Querybox.options.enablePartialMatch} option is set to `true`, this option specifies an absolute
     * or relative (percentage) value indicating the minimum number of partial match expression keywords a document must
     * contain in order to match the query.
     *
     * See also the {@link Querybox.options.partialMatchKeywords} option.
     *
     * Default value is `50%`.
     *
     * #### Note
     * > The relative threshold is always rounded up to the nearest integer.
     *
     * #### Example
     * > If the partialMatchThreshold option is set to `50%` and the partial match expression contains exactly 9
     * > keywords, then documents will have to contain at least 5 of those keywords to match the query (50% of 9,
     * >rounded up).
     *
     * > With the same configuration, if the partial match expression contains exactly 12 keywords, then documents will
     * > have to contain at least 6 of those keywords to match the query (50% of 12).
     *
     * > If the partialMatchThreshold option is set to `2`, then documents will always have to contain at least 2 of the
     * > partial match expression keywords to match the query, no matter how many keywords the partial match expression
     * > actually contains.
     */
    partialMatchThreshold: ComponentOptions.buildStringOption({ defaultValue: '50%' }),

    /**
     * Specifies whether or not to trigger a query when the Querybox is cleared.
     *
     * Default value is `true`.
     */
    triggerQueryOnClear: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    // Removed public doc; this option currently is of no use for this component.
    placeholder: ComponentOptions.buildStringOption(),

    /**
     * Specifies whether the Querybox should get the focus and be selected upon initialization.
     *
     * Default value is `true`.
     */
    autoFocus: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  public magicBox: Coveo.MagicBox.Instance;
  private lastQuery: string;
  private searchAsYouTypeTimeout: number;

  /**
   * Creates a new Querybox.
   *
   * Creates a new Coveo.Magicbox instance and wraps the Magicbox methods (onblur, onsubmit etc).
   *
   * Binds event on buildingQuery and on redirection (for standalone box).
   *
   * @param element The `HTMLElement` on which the element will be instantiated. This cannot be an `HTMLInputElement`
   * for technical reasons.
   *
   * @param options The options for the Querybox.
   *
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IQueryboxOptions, public bindings?: IComponentBindings) {
    super(element, Querybox.ID, bindings);

    if (element instanceof HTMLInputElement) {
      this.logger.error('Querybox cannot be used on an HTMLInputElement');
    }

    this.options = ComponentOptions.initComponentOptions(element, Querybox, options);

    this.magicBox = Coveo.MagicBox.create(element, new Coveo.MagicBox.Grammar('Query', {
      Query: '[Term*][Spaces?]',
      Term: '[Spaces?][Word]',
      Spaces: / +/,
      Word: /[^ ]+/
    }), {
        inline: true
      });

    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(StandaloneSearchInterfaceEvents.beforeRedirect, () => this.updateQueryState());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.Q, (args: IAttributeChangedEventArg) => this.handleQueryStateChanged(args));

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

    if (this.options.autoFocus) {
      this.magicBox.focus();
    }
  }

  /**
   * Triggers a query. The content of the input will be added to the query. If the content of the input has not changed
   * since the last submit, no new query will be triggered.
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
  public resultAtCursor(match?: string | { (result): boolean; }) {
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
