import {Initialization} from '../Base/Initialization';
import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {MODEL_EVENTS, IAttributeChangedEventArg} from '../../models/Model';
import {QUERY_STATE_ATTRIBUTES, QueryStateModel} from '../../models/QueryStateModel';
import {StandaloneSearchInterfaceEvents} from '../../events/StandaloneSearchInterfaceEvents';
import {IAnalyticsNoMeta, analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta';
import {$$} from '../../utils/Dom';
import {Assert} from '../../misc/Assert';
import {QueryboxQueryParameters} from './QueryboxQueryParameters';

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
}

/**
 * A component that allows a user to enter a query inside an input.<br/>
 * The component will trigger a query when submitted (the 'Enter' keypress) and log the proper analytics data.<br/>
 * It must be instantiated on a div (and not directly on an input element) : This is for styling purpose (ghost type ahead, for example).
 */
export class Querybox extends Component {
  static ID = 'Querybox';
  /**
   * The options for the Querybox.
   * @componentOptions
   */
  public static options: IQueryboxOptions = {
    /**
     * Specify if search as you type should be enabled.<br/>
     * Default to false.
     */
    enableSearchAsYouType: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If enableSearchAsYouType is enabled, this option specify the delay (in ms) between a keypress and a query being triggered<br/>
     * Default to 500 ms
     */
    searchAsYouTypeDelay: ComponentOptions.buildNumberOption({ defaultValue: 500, min: 0 }),
    /**
     * Specifies whether the Coveo Platform does try to interpret special query syntax such as field references in the query entered through the query box.<br/>
     * This means that a
     * The default value is true.
     */
    enableQuerySyntax: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies whether the Coveo Platform expands keywords containing wildcard characters (*) to the possible matching keywords to broaden the query.<br/>
     * The default value is false.
     */
    enableWildcards: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether the Coveo Platform expands keywords containing question mark characters (?) to the possible matching keywords to broaden the query.<br/>
     * The default value is false.
     */
    enableQuestionMarks: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If true, the or and and keywords in the query box will be treated as boolean operators for the query when they are typed in lowercase.<br/>
     * This applies for all operators<br/>
     * Default value is false
     */
    enableLowercaseOperators: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether a query containing a large number of keywords (see partialMatchKeywords) is automatically converted to a partial match expression in order to match documents containing only a subset of the keywords (see partialMatchThreshold for defining the subset).<br/>
     * The default value is false.
     */
    enablePartialMatch: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * When partial match is enabled, specifies the minimum number of keywords that must be present in the query to activate the partial match.<br/>
     * The default value is 5.
     */
    partialMatchKeywords: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),
    /**
     * When partial match is enabled, specifies either an absolute or percentage value indicating the minimum number of keywords a document must contain in order to match the query.<br/>
     * The default value is 50%.
     */
    partialMatchThreshold: ComponentOptions.buildStringOption({ defaultValue: '50%' }),
    placeholder: ComponentOptions.buildStringOption(),
    autoFocus: ComponentOptions.buildBooleanOption({ defaultValue: true })
  }

  public magicBox: Coveo.MagicBox.Instance;
  private lastQuery: string;
  private searchAsYouTypeTimeout: number;

  /**
   * Create a new Querybox.<br/>
   * Create a new Coveo.Magicbox instance and wrap magic box method (on blur, on submit etc).<br/>
   * Bind event on buildingQuery and on redirection (for standalone box).
   * @param element The HTMLElement on which the element will be instantiated. This cannot be an HTMLInputElement for technical reason
   * @param options The options for the querybox.
   * @param bindings The bindings that the component requires to function normally. If not set, will automatically resolve them (With slower execution time)
   */
  constructor(public element: HTMLElement, public options?: IQueryboxOptions, public bindings?: IComponentBindings) {
    super(element, Querybox.ID, bindings);

    if (element instanceof HTMLInputElement) {
      this.logger.error('QueryBox can\'t be use on a HTMLInputElement');
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
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxClear, {})
      this.triggerNewQuery(false);
    };

    if (this.options.autoFocus) {
      this.magicBox.focus();
    }
  }

  /**
   * Trigger a query. The current input content will be added to the query<br/>
   * If the content of the input has not changed since the last submit, no new query will be triggered.
   */
  public submit(): void {
    this.magicBox.clearSuggestion();
    this.updateQueryState();
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {})
    this.triggerNewQuery(false);
  }

  /**
   * Set the content of the input
   * @param text The string to set in the input
   */
  public setText(text: string): void {
    this.magicBox.setText(text);
    this.updateQueryState();
  }

  /**
   * Clear the content of the input
   */
  public clear(): void {
    this.magicBox.clear();
  }

  /**
   * Get the current content of the input
   * @returns {string}
   */
  public getText(): string {
    return this.magicBox.getText();
  }

  public getResult() {
    return this.magicBox.getResult();
  }

  public getDisplayedResult() {
    return this.magicBox.getDisplayedResult();
  }

  public getCursor(): number {
    return this.magicBox.getCursor();
  }

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
      this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxAsYouType, {})
      this.triggerNewQuery(true);
    }, this.options.searchAsYouTypeDelay);
  }
}
Initialization.registerAutoCreateComponent(Querybox);
