import { SearchInterface, ISearchInterfaceOptions } from '../SearchInterface/SearchInterface';
import { ComponentOptions } from '../Base/ComponentOptions';
import { QueryEvents, IQuerySuccessEventArgs, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { OmniboxEvents } from '../../events/OmniboxEvents';
import { ResultListEvents } from '../../events/ResultListEvents';
import { SettingsEvents } from '../../events/SettingsEvents';
import { PreferencesPanelEvents } from '../../events/PreferencesPanelEvents';
import { AnalyticsEvents } from '../../events/AnalyticsEvents';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { BreadcrumbEvents } from '../../events/BreadcrumbEvents';
import { QuickviewEvents } from '../../events/QuickviewEvents';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { Model, MODEL_EVENTS } from '../../models/Model';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import { INoResultsEventArgs } from '../../events/QueryEvents';
import { IQueryErrorEventArgs } from '../../events/QueryEvents';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ResponsiveRecommendation } from '../ResponsiveComponents/ResponsiveRecommendation';
import { history } from 'coveo.analytics';
import { get } from '../Base/RegisteredNamedMethods';
import { InitializationEvents } from '../../events/InitializationEvents';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { DefaultRecommendationTemplate } from '../Templates/DefaultRecommendationTemplate';
import { RecommendationQuery } from './RecommendationQuery';
import { RecommendationAnalyticsClient } from '../Analytics/RecommendationAnalyticsClient';
import 'styling/_Recommendation';
import { IStringMap } from '../../rest/GenericParam';

export interface IRecommendationOptions extends ISearchInterfaceOptions {
  mainSearchInterface?: HTMLElement;
  userContext?: IStringMap<any>;
  id?: string;
  optionsToUse?: string[];
  sendActionsHistory?: boolean;
  hideIfNoResults?: boolean;
  enableResponsiveMode?: boolean;
  responsiveBreakpoint?: number;
  dropdownHeaderLabel?: string;
}

/**
 * The Recommendation component is a {@link SearchInterface} that displays recommendations typically based on user
 * history.
 *
 * This component usually listens to the main SearchInterface. When the main SearchInterface generates a query, the
 * Recommendation component generates another query to get the recommendations at the same time.
 *
 * To get history-based recommendations, you will likely want to include the `pageview` script in your page (see
 * [coveo.analytics.js](https://github.com/coveo/coveo.analytics.js)). However, including this script is not mandatory.
 * For instance, you could use the Recommendation component without the Coveo Machine Learning service to create a
 * simple "recommended people" interface.
 *
 * It is possible to include this component inside another SearchInterface, but it is also possible to instantiate it as
 * a "standalone" search interface, without even instantiating a main SearchInterface component. In any case, a
 * Recommendation component always acts as a full-fledged search interface. Therefore, you can include any component
 * inside the Recommendation component (Searchbox, Facet, Sort, etc.), just as you would inside the main SearchInterface
 * component.
 */
export class Recommendation extends SearchInterface implements IComponentBindings {
  static ID = 'Recommendation';
  private static NEXT_ID = 1;

  static doExport = () => {
    exportGlobally({
      Recommendation: Recommendation,
      DefaultRecommendationTemplate: DefaultRecommendationTemplate,
      RecommendationQuery: RecommendationQuery,
      RecommendationAnalyticsClient: RecommendationAnalyticsClient
    });
  };

  /**
   * The options for the recommendation component
   * @componentOptions
   */
  static options: IRecommendationOptions = {
    /**
     * Specifies the main {@link SearchInterface} to listen to.
     */
    mainSearchInterface: ComponentOptions.buildSelectorOption(),

    /**
     * Specifies the user context to send to Coveo usage analytics.
     * The component sends this information with the query alongside the user history to get the recommendations.
     */
    userContext: ComponentOptions.buildJsonOption(),

    /**
     * Specifies the ID of the interface.
     * The usage analytics use the interface ID to know which recommendation interface was selected.
     *
     * Default value is `Recommendation` for the first one and `Recommendation_{number}`, where {number} depends on the
     * number of Recommendation interfaces with default IDs in the page for the others.
     */
    id: ComponentOptions.buildStringOption(),

    /**
     * Specifies which options from the main {@link QueryBuilder} to use in the triggered query.
     *
     * Possible values are:
     * - `expression`
     * - `advancedExpression`
     * - `constantExpression`
     * - `disjunctionExpression`
     *
     * **Example:**
     *
     * Adding the expression (`q`) and the advanced expression (`aq`) parts of the main query in the triggered query:
     *
     * `data-options-to-use="expression,advancedExpression"`
     *
     * Default value is `expression`.
     */
    optionsToUse: ComponentOptions.buildListOption<'expression' | 'advancedExpression' | 'constantExpression' | 'disjunctionExpression'>({
      defaultValue: ['expression']
    }),

    /**
     * Specifies whether to send the actions history along with the triggered query.
     *
     * Setting this option to `false` makes it impossible for this component to get Coveo Machine Learning
     * recommendations.
     *
     * However, setting this option to `false` can be useful to display side results in a search page.
     *
     * Default value is `true`.
     *
     * @deprecated This option is now deprecated. The correct way to control this behavior is to configure an appropriate machine learning model in the administration interface (Recommendation, Relevance tuning, Query suggestions).
     */
    sendActionsHistory: ComponentOptions.buildBooleanOption({
      defaultValue: true,
      deprecated:
        'This option is now deprecated. The correct way to control this behaviour is to configure an appropriate machine learning model in the administration interface (Recommendation, Relevance tuning, Query suggestions)'
    }),

    /**
     * Specifies whether to hide the Recommendations component if no result or recommendation is available.
     *
     * Default value is `false`.
     */
    hideIfNoResults: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    autoTriggerQuery: ComponentOptions.buildBooleanOption({
      postProcessing: (value: boolean, options: IRecommendationOptions) => {
        if (options.mainSearchInterface) {
          return false;
        }
        return value;
      }
    }),

    /**
     * Specifies whether to enable *responsive mode* for Recommendation components. Setting this options to `false` on
     * any Recommendation component in a search interface disables responsive mode for all other Recommendation
     * components in the search interface.
     *
     * Responsive mode displays all Recommendation components under a single dropdown button whenever the width of the
     * HTML element which the search interface is bound to reaches or falls behind a certain threshold (see
     * {@link Recommendation.options.responsiveBreakpoint}).
     *
     * See also {@link Recommendation.options.dropdownHeaderLabel}.
     *
     * Default value is `true`.
     */
    enableResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If {@link Recommendation.options.enableResponsiveMode} is `true` for all Recommendation components, specifies the
     * width threshold (in pixels) of the search interface at which Recommendation components go in responsive mode.
     *
     * Recommendation components go in responsive mode when the width of the search interface is equal to or lower than
     * this value.
     *
     * The `search interface` corresponds to the HTML element with the class `CoveoSearchInterface`.
     *
     * If more than one Recommendation component in the search interface specifies a value for this option, then the
     * framework uses the last occurrence of the option.
     *
     * Default value is `1000`.
     */
    responsiveBreakpoint: ComponentOptions.buildNumberOption({ defaultValue: 1000 }),

    /**
     * If {@link Recommendation.options.enableResponsiveMode} is `true` for all Recommendation components, specifies the
     * label of the dropdown button that allows to display the Recommendation components when in responsive mode.
     *
     * If more than one Recommendation component in the search interface specifies a value for this option, then the
     * framework uses the first occurrence of the option.
     *
     * Default value is `Recommendations`.
     */
    dropdownHeaderLabel: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Recommendations' })
  };

  // These are used by the analytics client for recommendation
  // so that clicks event inside the recommendation component can be modified and attached to the main search interface.
  public mainQuerySearchUID: string;
  public mainQueryPipeline: string;
  public historyStore: CoveoAnalytics.HistoryStore;

  private mainInterfaceQuery: IQuerySuccessEventArgs;

  /**
   * Creates a new Recommendation component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Recommendation component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time)
   * @param _window
   */
  constructor(public element: HTMLElement, public options: IRecommendationOptions = {}, public analyticsOptions = {}, _window = window) {
    super(element, ComponentOptions.initComponentOptions(element, Recommendation, options), analyticsOptions, _window);
    if (!this.options.id) {
      this.generateDefaultId();
    }

    // This is done to allow the component to be included in another search interface without triggering the parent events.
    this.preventEventPropagation();

    if (this.options.mainSearchInterface) {
      this.bindToMainSearchInterface();
    }

    $$(this.element).on(QueryEvents.buildingQuery, (e: Event, args: IBuildingQueryEventArgs) =>
      this.handleRecommendationBuildingQuery(args)
    );
    $$(this.element).on(QueryEvents.querySuccess, (e: Event, args: IQuerySuccessEventArgs) => this.handleRecommendationQuerySuccess(args));
    $$(this.element).on(QueryEvents.noResults, (e: Event, args: INoResultsEventArgs) => this.handleRecommendationNoResults());
    $$(this.element).on(QueryEvents.queryError, (e: Event, args: IQueryErrorEventArgs) => this.handleRecommendationQueryError());

    this.historyStore = new history.HistoryStore();
    if (!this.options.mainSearchInterface) {
      // When the recommendation component is "standalone", we add additional safeguard against bad config.
      this.ensureCurrentPageViewExistsInStore();
    }
    ResponsiveRecommendation.init(this.root, this, options);
  }

  public getId(): string {
    return this.options.id;
  }

  public enable() {
    super.enable();
    this.show();
  }

  public disable() {
    super.disable();
    this.hide();
  }

  public hide(): void {
    $$(this.element).addClass('coveo-hidden');
  }

  public show(): void {
    $$(this.element).removeClass('coveo-hidden');
  }

  private ensureCurrentPageViewExistsInStore() {
    // It's not 100% sure that the element will actually be added in the store.
    // It's possible that an external script configured by the end user to log the page view already did that.
    // So we *could* end up with duplicate values in the store :
    // We rely on the fact that the coveo.analytics lib has defensive code against consecutive page view that are identical.
    // This is mainly done if the recommendation component is being initialized before the page view could be logged correctly by the coveo.analytics externa lib.
    const historyElement = {
      name: 'PageView',
      value: document.location.toString(),
      time: JSON.stringify(new Date()),
      title: document.title
    };
    this.historyStore.addElement(historyElement);
  }

  private bindToMainSearchInterface() {
    this.bindComponentOptionsModelToMainSearchInterface();
    this.bindQueryEventsToMainSearchInterface();
  }

  private bindComponentOptionsModelToMainSearchInterface() {
    // Try to fetch the componentOptions from the main search interface.
    // Since we do not know which interface is init first (recommendation or full search interface)
    // add a mechanism that waits for the full search interface to be correctly initialized
    // then, set the needed values on the component options model.
    let searchInterfaceComponent = <SearchInterface>get(this.options.mainSearchInterface, SearchInterface);
    let alreadyInitialized = searchInterfaceComponent != null;

    let onceInitialized = () => {
      let mainSearchInterfaceOptionsModel = <ComponentOptionsModel>searchInterfaceComponent.getBindings().componentOptionsModel;
      this.componentOptionsModel.setMultiple(mainSearchInterfaceOptionsModel.getAttributes());
      $$(this.options.mainSearchInterface).on(this.componentOptionsModel.getEventName(MODEL_EVENTS.ALL), () => {
        this.componentOptionsModel.setMultiple(mainSearchInterfaceOptionsModel.getAttributes());
      });
    };

    if (alreadyInitialized) {
      onceInitialized();
    } else {
      $$(this.options.mainSearchInterface).on(InitializationEvents.afterComponentsInitialization, () => {
        searchInterfaceComponent = <SearchInterface>get(this.options.mainSearchInterface, SearchInterface);
        onceInitialized();
      });
    }
  }

  private bindQueryEventsToMainSearchInterface() {
    // Whenever a query sucessfully returns on the full search interface, refresh the recommendation component.
    $$(this.options.mainSearchInterface).on(QueryEvents.querySuccess, (e: Event, args: IQuerySuccessEventArgs) => {
      this.mainInterfaceQuery = args;
      this.mainQuerySearchUID = args.results.searchUid;
      this.mainQueryPipeline = args.results.pipeline;
      this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.recommendation, {});
      this.queryController.executeQuery({
        closeModalBox: false
      });
    });

    $$(this.options.mainSearchInterface).on(QueryEvents.queryError, () => this.hide());
  }

  private handleRecommendationBuildingQuery(data: IBuildingQueryEventArgs) {
    if (!this.disabled) {
      this.modifyQueryForRecommendation(data);
      this.addRecommendationInfoInQuery(data);
    }
  }

  private handleRecommendationQuerySuccess(data: IQuerySuccessEventArgs) {
    if (!this.disabled) {
      if (this.options.hideIfNoResults) {
        if (data.results.totalCount === 0) {
          this.hide();
        } else {
          this.show();
        }
      }
    }
  }

  private handleRecommendationNoResults() {
    if (!this.disabled) {
      if (this.options.hideIfNoResults) {
        this.hide();
      }
    }
  }

  private handleRecommendationQueryError() {
    if (!this.disabled) {
      this.hide();
    }
  }

  private modifyQueryForRecommendation(data: IBuildingQueryEventArgs) {
    if (this.mainInterfaceQuery) {
      Utils.copyObjectAttributes(data.queryBuilder, this.mainInterfaceQuery.queryBuilder, this.options.optionsToUse);
    }
  }

  private addRecommendationInfoInQuery(data: IBuildingQueryEventArgs) {
    if (!_.isEmpty(this.options.userContext)) {
      data.queryBuilder.addContext(this.options.userContext);
    }

    data.queryBuilder.recommendation = this.options.id;
  }

  private preventEventPropagation() {
    this.preventEventPropagationOn(QueryEvents);
    this.preventEventPropagationOn(OmniboxEvents);
    this.preventEventPropagationOn(ResultListEvents);
    this.preventEventPropagationOn(SettingsEvents);
    this.preventEventPropagationOn(PreferencesPanelEvents);
    this.preventEventPropagationOn(AnalyticsEvents);
    this.preventEventPropagationOn(BreadcrumbEvents);
    this.preventEventPropagationOn(QuickviewEvents);
    this.preventEventPropagationOn(InitializationEvents);
    this.preventEventPropagationOn(this.getAllModelEvents());
  }

  private preventEventPropagationOn(
    eventType,
    eventName = (event: string) => {
      return event;
    }
  ) {
    for (let event in eventType) {
      $$(this.root).on(eventName(event), (e: Event) => e.stopPropagation());
    }
  }

  private getAllModelEvents() {
    let events = {};
    _.each(_.values(Model.eventTypes), event => {
      _.each(_.values(QUERY_STATE_ATTRIBUTES), attribute => {
        let eventName = this.getBindings().queryStateModel.getEventName(event + attribute);
        events[eventName] = eventName;
      });
    });
    return events;
  }

  private generateDefaultId() {
    let id = 'Recommendation';
    if (Recommendation.NEXT_ID !== 1) {
      this.logger.warn(
        'Generating another recommendation default id',
        'Consider configuring a human friendly / meaningful id for this interface'
      );
      id = id + '_' + Recommendation.NEXT_ID;
    }
    Recommendation.NEXT_ID++;
    this.options.id = id;
  }
}

// We do not register the Recommendation component since it is done with .coveo('initRecommendation')
