/**
 * The IAnalyticsActionCause interface describes the cause of an event for the analytics service.
 *
 * See the {@link Analytics} component
 */
export interface IAnalyticsActionCause {
  /**
   * Specifies the name of the event. While you can actually set this property to any arbitrary string value, its value
   * should uniquely identify the precise action that triggers the event. Thus, each individual event should have its
   * own unique `name` value.
   *
   * Example: `searchBoxSubmit`, `resultSort`, etc.
   */
  name: string;

  /**
   * Specifies the type of the event. While you can actually set this property to any arbitrary string value, it should
   * describe the general category of the event. Thus, more than one event can have the same `type` value, which makes
   * it possible to group events with identical types when doing reporting.
   *
   * Example: All search box related events could have `searchbox` as their `type` value.
   */
  type: string;
  metaMap?: { [name: string]: number };
}

export interface IAnalyticsNoMeta {}

export interface IAnalyticsInterfaceChange {
  interfaceChangeTo: string;
}

export interface IAnalyticsContextAddMeta {
  contextName: string;
}

export interface IAnalyticsContextRemoveMeta {
  contextName: string;
}

export interface IAnalyticsResultsSortMeta {
  resultsSortBy: string;
}

/**
 * The `IAnalyticsDocumentViewMeta` interface describes the expected metadata when logging a click event / item view.
 *
 * See also the [`Analytics`]{@link Analytics} component, and more specifically its
 * [`logClickEvent`]{@link Analytics.logClickEvent} method.
 */
export interface IAnalyticsDocumentViewMeta {
  /**
   * The URL of the clicked item.
   */
  documentURL?: string;

  /**
   * The title of the clicked item.
   */
  documentTitle?: string;

  /**
   * The author of the clicked item.
   */
  author: string;
}

export interface IAnalyticsOmniboxFacetMeta {
  facetId: string;
  facetTitle: string;
  facetValue?: string;
  suggestions: string;
  suggestionRanking: number;
  query: string;
}
export interface IAnalyticsSimpleFilterMeta {
  simpleFilterTitle: string;
  simpleFilterSelectedValue?: string;
  simpleFilterField: string;
}
export interface IAnalyticsFacetMeta {
  facetId: string;
  facetValue?: string;
  facetTitle: string;
}

export interface IAnalyticsQueryErrorMeta {
  query: string;
  aq: string;
  cq: string;
  dq: string;
  errorType: string;
  errorMessage: string;
}

export interface IAnalyticsTopSuggestionMeta {
  suggestionRanking: number;
  partialQueries: string;
  suggestions: string;
  partialQuery: string;
}

export interface IAnalyticsOmniboxSuggestionMeta {
  suggestionRanking: number;
  partialQueries: string;
  suggestions: string;
  partialQuery: string;
}

export interface IAnalyticsFacetSliderChangeMeta {
  facetId: string;
  facetRangeStart: any;
  facetRangeEnd: any;
}

export interface IAnalyticsFacetGraphSelectedMeta extends IAnalyticsFacetSliderChangeMeta {}

export interface IAnalyticsFacetOperatorMeta extends IAnalyticsFacetMeta {
  facetOperatorBefore: string;
  facetOperatorAfter: string;
}

export interface IAnalyticsPreferencesChangeMeta {
  preferenceName: string;
  preferenceType: string;
}

export interface IAnalyticsCustomFiltersChangeMeta {
  customFilterName: string;
  customFilterType: string;
  customFilterExpression: string;
}

export interface IAnalyticsCaseAttachMeta {
  resultUriHash: string;
  articleID: string;
  caseID: string;
  author: string;
}

export interface IAnalyticsCaseContextAddMeta {
  caseID: string;
}

export interface IAnalyticsCaseContextRemoveMeta {
  caseID: string;
}

export interface IAnalyticsCaseDetachMeta extends IAnalyticsCaseAttachMeta {}

export interface IAnalyticsCaseCreationInputChangeMeta {
  inputTitle: string;
  input: string;
  value: string;
}

export interface IAnalyticsCaseCreationDeflectionMeta {
  hasClicks: boolean;
  values: { [field: string]: string };
}

export interface IAnalyticsPagerMeta {
  pagerNumber: number;
}

export interface IAnalyticsResultsPerPageMeta {
  currentResultsPerPage: number;
}

export interface IAnalyticsTriggerNotify {
  notification: string;
}

export interface IAnalyticsTriggerRedirect {
  redirectedTo: string;
}

export interface IAnalyticsTriggerQuery {
  query: string;
}

export interface IAnalyticsTriggerExecute {
  executed: string;
}

export interface IAnalyticsSearchAlertsMeta {
  subscription: string;
}

export interface IAnalyticsSearchAlertsUpdateMeta extends IAnalyticsSearchAlertsMeta {
  frequency: string;
}

export interface IAnalyticsSearchAlertsFollowDocumentMeta extends IAnalyticsDocumentViewMeta {
  documentSource: string;
  documentLanguage: string;
  contentIDKey: string;
  contentIDValue: string;
}

export interface IAnalyticsResultsLayoutChange {
  resultsLayoutChangeTo: string;
}

/**
 *
 */
export var analyticsActionCauseList = {
  /**
   * Identifies the search event that gets logged when the initial query is performed as a result of loading a search interface.
   *
   * `actionCause`: `'interfaceLoad'`
   * `actionType`: `'interface'`
   */
  interfaceLoad: <IAnalyticsActionCause>{
    name: 'interfaceLoad',
    type: 'interface'
  },
  /**
   * Identifies the search event that gets logged when a new tab is selected in the search interface.
   *
   * `actionCause`: `'interfaceChange'`
   * `actionType`: `'interface'`
   *
   * Logging an event with this actionType also adds the following key-value pair in the custom data property of the Usage Analytics HTTP service request.
   * `"interfaceChangeTo"`: <newTabId>
   */
  interfaceChange: <IAnalyticsActionCause>{
    name: 'interfaceChange',
    type: 'interface',
    metaMap: { interfaceChangeTo: 1 }
  },
  /**
   * Identifies the search event that gets logged when any `hd` or `hq` gets cleared from {@link QueryStateModel}, and then triggers a new query.
   *
   * `actionCause`: `'contextRemove'`
   * `actionType`: `'misc'`
   *
   * Logging an event with this actionType also adds the following key-value pair in the custom data property of the Usage Analytics HTTP service request.
   * `"contextName"`: <contextName>
   */
  contextRemove: <IAnalyticsActionCause>{
    name: 'contextRemove',
    type: 'misc',
    metaMap: { contextName: 1 }
  },
  /**
   * Identifies the search event that gets logged when `enableAutoCorrection: true` and the query is automatically corrected.
   *
   * `actionCause`: `'didyoumeanAutomatic'`
   * `actionType`: `'misc'`
   */
  didyoumeanAutomatic: <IAnalyticsActionCause>{
    name: 'didyoumeanAutomatic',
    type: 'misc'
  },
  /**
   * Identifies the search event that gets logged when the query suggestion with the corrected term is selected and successfully updates the query.
   *
   * `actionCause`: `'didyoumeanClick'`
   * `actionType`: `'misc'`
   */
  didyoumeanClick: <IAnalyticsActionCause>{
    name: 'didyoumeanClick',
    type: 'misc'
  },
  /**
   * Identifies the search event that gets logged when a sorting method is selected.
   *
   * `actionCause`: `'resultsSort'`
   * `actionType`: `'misc'`
   *
   * Logging an event with this actionType also adds the following key-value pair in the custom data property of the Usage Analytics HTTP service request.
   * `"resultsSortBy"`: <sortingCategory>
   */
  resultsSort: <IAnalyticsActionCause>{
    name: 'resultsSort',
    type: 'misc',
    metaMap: { resultsSortBy: 1 }
  },
  /**
   * Identifies the search event that gets logged when a submit button is selected on a search box.
   *
   * `actionCause`: `'searchboxSubmit'`
   * `actionType`: `'search box'`
   */
  searchboxSubmit: <IAnalyticsActionCause>{
    name: 'searchboxSubmit',
    type: 'search box'
  },
  /**
   * Identifies the search event that gets logged when a clear button is selected on a search box.
   *
   * `actionCause`: `'searchboxClear'`
   * `actionType`: `'search box'`
   */
  searchboxClear: <IAnalyticsActionCause>{
    name: 'searchboxClear',
    type: 'search box'
  },
  /**
   * Identifies the search as you type event that gets logged when a query is automatically generated, and results are displayed while a user is entering text in the search box before they voluntarily submit the query.
   *
   * `actionCause`: `'searchboxAsYouType'`
   * `actionType`: `'search box'`
   */
  searchboxAsYouType: <IAnalyticsActionCause>{
    name: 'searchboxAsYouType',
    type: 'search box'
  },
  /**
   * Identifies the search as you type event that gets logged when a breadcrumb facet is selected and the query is updated.
   *
   * `actionCause`: `'breadcrumbFacet'`
   * `actionType`: `'breadcrumb'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   */
  breadcrumbFacet: <IAnalyticsActionCause>{
    name: 'breadcrumbFacet',
    type: 'breadcrumb',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clears all values from the advanced search filter summary.
   *
   * `actionCause`: `'breadcrumbAdvancedSearch'`
   * `actionType`: `'breadcrumb'`
   */
  breadcrumbAdvancedSearch: <IAnalyticsActionCause>{
    name: 'breadcrumbAdvancedSearch',
    type: 'breadcrumb'
  },
  /**
   * Identifies the search event that gets logged when the event to clear the current breadcrumbs is triggered.
   *
   * `actionCause`: `'breadcrumbResetAll'`
   * `actionType`: `'breadcrumb'`
   */
  breadcrumbResetAll: <IAnalyticsActionCause>{
    name: 'breadcrumbResetAll',
    type: 'breadcrumb'
  },
  /**
   * Identifies the search event that gets logged when a user clicks a tag value from an item tag field to add a filter.
   *
   * `actionCause`: `'documentTag'`
   * `actionType`: `'document'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  documentTag: <IAnalyticsActionCause>{
    name: 'documentTag',
    type: 'document',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clicks a field value from an item field to add a filter.
   *
   * `actionCause`: `'documentField'`
   * `actionType`: `'document'`
   *
   * Logging an event with this actionType also adds the following key-value pair in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  documentField: <IAnalyticsActionCause>{
    name: 'documentField',
    type: 'document',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the click event that gets logged when the Quick View element is selected and a Quick View modal of the document is displayed.
   *
   * `actionCause`: `'documentQuickview'`
   * `actionType`: `'document'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"documentTitle":`: <correspondingDocumentTitle>
   * `"documentURL":`: <correspondingDocumentURL>
   */
  documentQuickview: <IAnalyticsActionCause>{
    name: 'documentQuickview',
    type: 'document',
    metaMap: { documentTitle: 1, documentURL: 2 }
  },
  /**
   * Identifies the click and custom event that gets logged when a user clicks on a search result to open an item.
   *
   * `actionCause`: `'documentOpen'`
   * `actionType`: `'document'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"documentTitle":`: <correspondingDocumentTitle>
   * `"documentURL":`: <correspondingDocumentURL>
   */
  documentOpen: <IAnalyticsActionCause>{
    name: 'documentOpen',
    type: 'document',
    metaMap: { documentTitle: 1, documentURL: 2 }
  },
  /**
   * Identifies the search event that gets logged when a user selects or deselects a facet filter from the Omnibox.
   *
   * `actionCause`: `'omniboxFacetSelect'`
   * `actionType`: `'omnibox'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  omniboxFacetSelect: <IAnalyticsActionCause>{
    name: 'omniboxFacetSelect',
    type: 'omnibox',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clicks a facet value to filter out results containing this value from the Omnibox.
   *
   * `actionCause`: `'omniboxFacetExclude'`
   * `actionType`: `'omnibox'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  omniboxFacetExclude: <IAnalyticsActionCause>{
    name: 'omniboxFacetExclude',
    type: 'omnibox',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user selects or deselects a facet filter from the Omnibox.
   *
   * `actionCause`: `'omniboxFacetDeselect'`
   * `actionType`: `'omnibox'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  omniboxFacetDeselect: <IAnalyticsActionCause>{
    name: 'omniboxFacetDeselect',
    type: 'omnibox',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clicks a facet value to not filter out results containing this value from the Omnibox.
   *
   * `actionCause`: `'omniboxFacetUnexclude'`
   * `actionType`: `'omnibox'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  omniboxFacetUnexclude: <IAnalyticsActionCause>{
    name: 'omniboxFacetUnexclude',
    type: 'omnibox',
    metaMap: { faceId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clicks a query suggestion based on the usage analytics recorded queries.
   *
   * `actionCause`: `'omniboxAnalytics'`
   * `actionType`: `'omnibox'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"partialQuery":`: <correspondingPartialQuery>
   * `"suggestionRanking":`: <suggestionRankingValue>
   * `"partialQueries":`: <correspondingPartialQueries>
   * `"suggestions":`: <availableQuerySuggestions>
   */
  omniboxAnalytics: <IAnalyticsActionCause>{
    name: 'omniboxAnalytics',
    type: 'omnibox',
    metaMap: {
      partialQuery: 1,
      suggestionRanking: 2,
      partialQueries: 3,
      suggestions: 4
    }
  },
  /**
   * Identifies the search event that gets logged when a suggested search query is selected from a standalone searchbox.
   *
   * `actionCause`: `'omniboxFromLink'`
   * `actionType`: `'omnibox'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"partialQuery":`: <correspondingPartialQuery>
   * `"suggestionRanking":`: <suggestionRankingValue>
   * `"partialQueries":`: <correspondingPartialQueries>
   * `"suggestions":`: <availableQuerySuggestions>
   */
  omniboxFromLink: <IAnalyticsActionCause>{
    name: 'omniboxFromLink',
    type: 'omnibox',
    metaMap: {
      partialQuery: 1,
      suggestionRanking: 2,
      partialQueries: 3,
      suggestions: 4
    }
  },
  /**
   * Identifies the search event that gets logged when a user selects a query suggestion from a list built from values of a field.
   *
   * `actionCause`: `'omniboxField'`
   * `actionType`: `'omnibox'`
   */
  omniboxField: <IAnalyticsActionCause>{
    name: 'omniboxField',
    type: 'omnibox'
  },
  /**
   * Identifies the search event that gets logged when the Clear Facet **X** button is selected.
   *
   * `actionCause`: `'facetClearAll'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pair in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   */
  facetClearAll: <IAnalyticsActionCause>{
    name: 'facetClearAll',
    type: 'facet',
    metaMap: { facetId: 1 }
  },
  /**
   * Identifies the custom event that gets logged when a query is being typed into the facet search box.
   *
   * `actionCause`: `'facetSearch'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pair in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   */
  facetSearch: <IAnalyticsActionCause>{
    name: 'facetSearch',
    type: 'facet',
    metaMap: { facetId: 1 }
  },
  /**
   * Identifies the search event that gets logged when a user toggles the Collapse/Expand icon???
   *
   * `actionCause`: `'facetToggle'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetOperatorBefore":`: <facetOperatorBeforeToggle>
   * `"facetOperatorAfter":`: <facetOperatorAfterToggle>
   */
  facetToggle: <IAnalyticsActionCause>{
    name: 'facetToggle',
    type: 'facet',
    metaMap: { facetId: 1, facetOperatorBefore: 2, facetOperatorAfter: 3 }
  },
  /**
   * Identifies the search event that gets logged when a facet slider changes range values.
   *
   * `actionCause`: `'facetRangeSlider'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetRangeStart":`: <correspondingRangeStart>
   * `"facetRangeEnd":`: <correspondingRangeEnd>
   */
  facetRangeSlider: <IAnalyticsActionCause>{
    name: 'facetRangeSlider',
    type: 'facet',
    metaMap: { facetId: 1, facetRangeStart: 2, facetRangeEnd: 3 }
  },
  /**
   * Identifies the search event that gets logged when a facet graph changes range values.
   *
   * `actionCause`: `'facetRangeGraph'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetRangeStart":`: <correspondingRangeStart>
   * `"facetRangeEnd":`: <correspondingRangeEnd>
   */
  facetRangeGraph: <IAnalyticsActionCause>{
    name: 'facetRangeGraph',
    type: 'facet',
    metaMap: { facetId: 1, facetRangeStart: 2, facetRangeEnd: 3 }
  },
  /**
   * Identifies the search event that gets logged when a facet check box is selected and the query is updated.
   *
   * `actionCause`: `'facetSelect'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  facetSelect: <IAnalyticsActionCause>{
    name: 'facetSelect',
    type: 'facet',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when all filters on a facet are selected.
   *
   * `actionCause`: `'facetSelectAll'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  facetSelectAll: <IAnalyticsActionCause>{
    name: 'facetSelectAll',
    type: 'facet',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a facet check box is deselected and the query is updated.
   *
   * `actionCause`: `'facetSelect'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  facetDeselect: <IAnalyticsActionCause>{
    name: 'facetDeselect',
    type: 'facet',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clicks a facet value to filter out results containing the facet value.
   *
   * `actionCause`: `'facetExclude'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  facetExclude: <IAnalyticsActionCause>{
    name: 'facetExclude',
    type: 'facet',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clicks a facet value to not filter out results containing the facet value.
   *
   * `actionCause`: `'facetUnexclude'`
   * `actionType`: `'facet'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"facetId":`: <correspondingFacetId>
   * `"facetValue":`: <correspondingFacetValue>
   * `"facetTitle":`: <correspondingFacetTitle>
   */
  facetUnexclude: <IAnalyticsActionCause>{
    name: 'facetUnexclude',
    type: 'facet',
    metaMap: { facetId: 1, facetValue: 2, facetTitle: 3 }
  },
  /**
   * Identifies the search and custom event that gets logged when a user clicks the Go Back link after an error page.
   *
   * `actionCause`: `'errorBack'`
   * `actionType`: `'errors'`
   */
  errorBack: <IAnalyticsActionCause>{
    name: 'errorBack',
    type: 'errors'
  },
  /**
   * Identifies the search and custom event that gets logged when a user clears the query box after an error page.
   *
   * `actionCause`: `'errorClearQuery'`
   * `actionType`: `'errors'`
   */
  errorClearQuery: <IAnalyticsActionCause>{
    name: 'errorClearQuery',
    type: 'errors'
  },
  /**
   * Identifies the search and custom event that gets logged when a user clicks the Retry link after an error page.
   *
   * `actionCause`: `'errorRetry'`
   * `actionType`: `'errors'`
   */
  errorRetry: <IAnalyticsActionCause>{
    name: 'errorRetry',
    type: 'errors'
  },
  /**
   * Identifies the search and custom event that gets logged when a user clicks the Cancel last action link when no results are returned following their last action.
   *
   * `actionCause`: `'noResultsBack'`
   * `actionType`: `'noResults'`
   */
  noResultsBack: <IAnalyticsActionCause>{
    name: 'noResultsBack',
    type: 'noResults'
  },
  /**
   * In the context of Coveo for Salesforce, this is logged when a user switches from a search results list in the Insight Panel to the Expanded Search using the Expanded Search icon.
   *
   * `actionCause`: `'expandToFullUI'`
   * `actionType`: `'interface'`
   */
  expandToFullUI: <IAnalyticsActionCause>{
    name: 'expandToFullUI',
    type: 'interface'
  },
  /**
   * In the context of some Coveo for Salesforce user interfaces, this is logged when a user fills a form input in the case creation page.
   *
   * `actionCause`: `'inputChange'`
   * `actionType`: `'caseCreation'`
   */
  caseCreationInputChange: <IAnalyticsActionCause>{
    name: 'inputChange',
    type: 'caseCreation'
  },
  /**
   * In the context of some Coveo for Salesforce user interfaces, this is logged when a user creates a case by clicking the submit button.
   *
   * `actionCause`: `'submitButton'`
   * `actionType`: `'caseCreation'`
   */
  caseCreationSubmitButton: <IAnalyticsActionCause>{
    name: 'submitButton',
    type: 'caseCreation'
  },
  /**
   * In the context of some Coveo for Salesforce user interfaces, this is logged when a user cancels the creation of their case by clicking the cancel button.
   *
   * `actionCause`: `'cancelButton'`
   * `actionType`: `'caseCreation'`
   */
  caseCreationCancelButton: <IAnalyticsActionCause>{
    name: 'cancelButton',
    type: 'caseCreation'
  },
  /**
   * In the context of some Coveo for Salesforce user interfaces, this is logged when a user leaves the case creation page.
   *
   * `actionCause`: `'unloadPage'`
   * `actionType`: `'caseCreation'`
   */
  caseCreationUnloadPage: <IAnalyticsActionCause>{
    name: 'unloadPage',
    type: 'caseCreation'
  },
  /**
   * In the context of Coveo for Salesforce, this is logged when a user checks the Show only contextual result checkbox from the Insight Panel.
   *
   * `actionCause`: `'casecontextAdd'`
   * `actionType`: `'casecontext'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"caseID":`: <correspondingCaseId>
   */
  casecontextAdd: <IAnalyticsActionCause>{
    name: 'casecontextAdd',
    type: 'casecontext',
    metaMap: { caseID: 5 }
  },
  /**
   * In the context of Coveo for Salesforce, this is logged when a user clears the Show only contextual result checkbox from the Insight Panel.
   *
   * `actionCause`: `'casecontextRemove'`
   * `actionType`: `'casecontext'`
   *
   * Logging an event with this actionType also adds the following key-value pair in the custom data property of the Usage Analytics HTTP service request.
   * `"caseID":`: <correspondingCaseId>
   */
  casecontextRemove: <IAnalyticsActionCause>{
    name: 'casecontextRemove',
    type: 'casecontext',
    metaMap: { caseID: 5 }
  },
  /**
   * Identifies the search and custom event that gets logged when a checkbox in the search preferences is toggled.
   *
   * `actionCause`: `'preferencesChange'`
   * `actionType`: `'preferences'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"preferenceName":`: <correspondingPreferenceName>
   * `"preferenceType":`: <correspondingPreferenceType>
   */
  preferencesChange: <IAnalyticsActionCause>{
    name: 'preferencesChange',
    type: 'preferences',
    metaMap: { preferenceName: 1, preferenceType: 2 }
  },
  /**
   * In the context of Coveo for Salesforce, this is logged when an agent opens the User Actions panel.
   *
   * `actionCause`: `'getUserHistory'`
   * `actionType`: `'userHistory'`
   */
  getUserHistory: <IAnalyticsActionCause>{
    name: 'getUserHistory',
    type: 'userHistory'
  },
  /**
   * In the context of some Coveo for Salesforce user interfaces, this is logged when an agent clicks a link in the User Actions panel.
   *
   * `actionCause`: `'userActionDocumentClick'`
   * `actionType`: `'userHistory'`
   */
  userActionDocumentClick: <IAnalyticsActionCause>{
    name: 'userActionDocumentClick',
    type: 'userHistory'
  },
  /**
   * In the context of Coveo for Salesforce, this is logged when a user attaches a knowledge base article to a case.
   *
   * `actionCause`: `'caseAttach'`
   * `actionType`: `'case'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"documentTitle":`: <correspondingDocumentTitle>
   * `"resultUriHash":`: <correspondingResultUriHash>
   * `"articleID":`: <correspondingArticleId>
   * `"caseID":`: <correspondingCaseID>
   */
  caseAttach: <IAnalyticsActionCause>{
    name: 'caseAttach',
    type: 'case',
    metaMap: { documentTitle: 1, resultUriHash: 3, articleID: 4, caseID: 5 }
  },
  /**
   * In the context of Coveo for Salesforce, this is logged when a user detaches a knowledge base article to a case.
   *
   * `actionCause`: `'caseDetach'`
   * `actionType`: `'case'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"documentTitle":`: <correspondingDocumentTitle>
   * `"resultUriHash":`: <correspondingResultUriHash>
   * `"articleID":`: <correspondingArticleId>
   * `"caseID":`: <correspondingCaseID>
   */
  caseDetach: <IAnalyticsActionCause>{
    name: 'caseDetach',
    type: 'case',
    metaMap: { documentTitle: 1, resultUriHash: 3, articleID: 4, caseID: 5 }
  },
  /**
   * Identifies the search event that gets logged when a user modifies a custom search filter or removes one from the breadcrumbs.
   *
   * `actionCause`: `'customfiltersChange'`
   * `actionType`: `'customfilters'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"customFilterName":`: <correspondingCustomFilterName>
   * `"customFilterType":`: <correspondingCustomFilterType>
   * `"customFilterExpression":`: <correspondingCustomFilterExpression>
   */
  customfiltersChange: <IAnalyticsActionCause>{
    name: 'customfiltersChange',
    type: 'customfilters',
    metaMap: { customFilterName: 1, customFilterType: 2, customFilterExpression: 3 }
  },
  /**
   * Identifies the custom event that gets logged when a page number is selected and more items are loaded.
   *
   * `actionCause`: `'pagerNumber'`
   * `actionType`: `'getMoreResults'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"pagerNumber":`: <correspondingPageNumber>
   */
  pagerNumber: <IAnalyticsActionCause>{
    name: 'pagerNumber',
    type: 'getMoreResults',
    metaMap: { pagerNumber: 1 }
  },
  /**
   * Identifies the custom event that gets logged when the Next Page link is selected and more items are loaded.
   *
   * `actionCause`: `'pagerNext'`
   * `actionType`: `'getMoreResults'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"pagerNumber":`: <correspondingPageNumber>
   */
  pagerNext: <IAnalyticsActionCause>{
    name: 'pagerNext',
    type: 'getMoreResults',
    metaMap: { pagerNumber: 1 }
  },
  /**
   * Identifies the custom event that gets logged when the Previous Page link is selected and more items are loaded.
   *
   * `actionCause`: `'pagerPrevious'`
   * `actionType`: `'getMoreResults'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"pagerNumber":`: <correspondingPageNumber>
   */
  pagerPrevious: <IAnalyticsActionCause>{
    name: 'pagerPrevious',
    type: 'getMoreResults',
    metaMap: { pagerNumber: 1 }
  },
  /**
   * Identifies the custom event that gets logged when the user scrolls to the bottom of the item page and more results are loaded.
   *
   * `actionCause`: `'pagerScrolling'`
   * `actionType`: `'getMoreResults'`
   */
  pagerScrolling: <IAnalyticsActionCause>{
    name: 'pagerScrolling',
    type: 'getMoreResults'
  },
  /**
   * Identifies the custom event that gets logged when the Results per page component is selected.
   *
   * `actionCause`: `'pagerResize'`
   * `actionType`: `'getMoreResults'`
   */
  pagerResize: <IAnalyticsActionCause>{
    name: 'pagerResize',
    type: 'getMoreResults'
  },
  /**
   * Identifies the search event that gets logged when the user accepts to share their location (latitude and longitude) with the search page.
   *
   * `actionCause`: `'positionSet'`
   * `actionType`: `'distance'`
   */
  positionSet: <IAnalyticsActionCause>{
    name: 'positionSet',
    type: 'distance'
  },
  /**
   * Identifies the search event that gets logged when the search page loads with a query, such as when a user clicks a link pointing to a search results page with a query or enters a query in a standalone search box that points to a search page.
   *
   * `actionCause`: `'searchFromLink'`
   * `actionType`: `'interface'`
   */
  searchFromLink: <IAnalyticsActionCause>{
    name: 'searchFromLink',
    type: 'interface'
  },
  /**
   * Identifies the custom event that gets logged when a user action triggers a notification set in the effective query pipeline on the search page.
   *
   * `actionCause`: `'notify'`
   * `actionType`: `'queryPipelineTriggers'`
   */
  triggerNotify: <IAnalyticsActionCause>{
    name: 'notify',
    type: 'queryPipelineTriggers'
  },
  /**
   * Identifies the custom event that gets logged when a user action executes a JavaScript function set in the effective query pipeline on the search page.
   *
   * `actionCause`: `'execute'`
   * `actionType`: `'queryPipelineTriggers'`
   */
  triggerExecute: <IAnalyticsActionCause>{
    name: 'execute',
    type: 'queryPipelineTriggers'
  },
  /**
   * Identifies the custom event that gets logged when a user action triggers a new query set in the effective query pipeline on the search page.
   *
   * `actionCause`: `'query'`
   * `actionType`: `'queryPipelineTriggers'`
   */
  triggerQuery: <IAnalyticsActionCause>{
    name: 'query',
    type: 'queryPipelineTriggers'
  },
  /**
   * Identifies the custom event that gets logged when a user action redirects them to a URL set in the effective query pipeline on the search page.
   *
   * `actionCause`: `'redirect'`
   * `actionType`: `'queryPipelineTriggers'`
   */
  triggerRedirect: <IAnalyticsActionCause>{
    name: 'redirect',
    type: 'queryPipelineTriggers'
  },
  /**
   * Identifies the custom event that gets logged when a user query encounters an error during execution.
   *
   * `actionCause`: `'query'`
   * `actionType`: `'errors'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"query":`: <correspondingQuery>
   * `"aq":`: <correspondingAdvancedQuery>
   * `"cq":`: <correspondingConstantQuery>
   * `"dq":`: <correspondingDisjunctiveQuery>
   * `"errorType":`: <errorType>
   * `"errorMessage":`: <errorMessage>
   */
  queryError: <IAnalyticsActionCause>{
    name: 'query',
    type: 'errors',
    metaMap: { query: 1, aq: 2, cq: 3, dq: 4, errorType: 5, errorMessage: 6 }
  },
  /**
   * Identifies the custom event that gets logged when a user exports search results in an XLS file by clicking the Export to Excel option.
   *
   * `actionCause`: `'exportToExcel'`
   * `actionType`: `'misc'`
   */
  exportToExcel: <IAnalyticsActionCause>{
    name: 'exportToExcel',
    type: 'misc'
  },
  /**
   * Identifies the custom event that gets logged when a user performs a query that returns recommendations in the Recommendations panel.
   *
   * `actionCause`: `'recommendation'`
   * `actionType`: `'recommendation'`
   */
  recommendation: <IAnalyticsActionCause>{
    name: 'recommendation',
    type: 'recommendation'
  },
  /**
   * Identifies the search event that gets logged when a user action (that is not a query) reloads the Recommendations panel with new recommendations.
   *
   * `actionCause`: `'recommendationInterfaceLoad'`
   * `actionType`: `'recommendation'`
   */
  recommendationInterfaceLoad: <IAnalyticsActionCause>{
    name: 'recommendationInterfaceLoad',
    type: 'recommendation'
  },
  /**
   * Identifies the click event that gets logged when a user clicks a recommendation in the Recommendations panel.
   *
   * `actionCause`: `'recommendationOpen'`
   * `actionType`: `'recommendation'`
   */
  recommendationOpen: <IAnalyticsActionCause>{
    name: 'recommendationOpen',
    type: 'recommendation'
  },
  /**
   * Identifies the search event that gets logged???
   *
   * `actionCause`: `'advancedSearch'`
   * `actionType`: `'advancedSearch'`
   */
  advancedSearch: <IAnalyticsActionCause>{
    name: 'advancedSearch',
    type: 'advancedSearch'
  },
  /**
   * Identifies the custom??? event that gets logged???
   *
   * `actionCause`: `'followDocument'`
   * `actionType`: `'searchAlerts'`
   */
  searchAlertsFollowDocument: <IAnalyticsActionCause>{
    name: 'followDocument',
    type: 'searchAlerts'
  },
  /**
   * Identifies the custom event that gets logged???
   *
   * `actionCause`: `'followQuery'`
   * `actionType`: `'searchAlerts'`
   */
  searchAlertsFollowQuery: <IAnalyticsActionCause>{
    name: 'followQuery',
    type: 'searchAlerts'
  },
  /**
   * Identifies the custom event that gets logged???
   *
   * `actionCause`: `'updateSubscription'`
   * `actionType`: `'searchAlerts'`
   */
  searchAlertsUpdateSubscription: <IAnalyticsActionCause>{
    name: 'updateSubscription',
    type: 'searchAlerts'
  },
  /**
   * Identifies the custom??? event that gets logged???
   *
   * `actionCause`: `'deleteSubscription'`
   * `actionType`: `'searchAlerts'`
   */
  searchAlertsDeleteSubscription: <IAnalyticsActionCause>{
    name: 'deleteSubscription',
    type: 'searchAlerts'
  },
  /**
   * Identifies the custom??? event that gets logged???
   *
   * `actionCause`: `'unfollowDocument'`
   * `actionType`: `'searchAlerts'`
   */
  searchAlertsUnfollowDocument: <IAnalyticsActionCause>{
    name: 'unfollowDocument',
    type: 'searchAlerts'
  },
  /**
   * Identifies the analytics??? event that gets logged???
   *
   * `actionCause`: `'unfollowQuery'`
   * `actionType`: `'searchAlerts'`
   */
  searchAlertsUnfollowQuery: <IAnalyticsActionCause>{
    name: 'unfollowQuery',
    type: 'searchAlerts'
  },
  /**
   * Identifies the search event that gets logged when a user selects a simple filter value under the search box.
   *
   * `actionCause`: `'selectValue'`
   * `actionType`: `'simpleFilter'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"simpleFilterTitle":`: <correspondingSimpleFilterTitle>
   * `"simpleFilterValue":`: <correspondingSimpleFilterValue>
   * `"simpleFilterField":`: <correspondingSimpleFilterField>
   */
  simpleFilterSelectValue: <IAnalyticsActionCause>{
    name: 'selectValue',
    type: 'simpleFilter',
    metaMap: { simpleFilterTitle: 1, simpleFilterValue: 2, simpleFilterField: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user deselects a simple filter value under the search box.
   *
   * `actionCause`: `'selectValue'`
   * `actionType`: `'simpleFilter'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"simpleFilterTitle":`: <correspondingSimpleFilterTitle>
   * `"simpleFilterValue":`: <correspondingSimpleFilterValue>
   * `"simpleFilterField":`: <correspondingSimpleFilterField>
   */
  simpleFilterDeselectValue: <IAnalyticsActionCause>{
    name: 'selectValue',
    type: 'simpleFilter',
    metaMap: { simpleFilterTitle: 1, simpleFilterValues: 2, simpleFilterField: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user clicks the Clear all button to remove all simple filters under the search box.
   *
   * `actionCause`: `'selectValue'`
   * `actionType`: `'simpleFilter'`
   *
   * Logging an event with this actionType also adds the following key-value pairs in the custom data property of the Usage Analytics HTTP service request.
   * `"simpleFilterTitle":`: <correspondingSimpleFilterTitle>
   * `"simpleFilterValue":`: <correspondingSimpleFilterValue>
   * `"simpleFilterField":`: <correspondingSimpleFilterField>
   */
  simpleFilterClearAll: <IAnalyticsActionCause>{
    name: 'selectValue',
    type: 'simpleFilter',
    metaMap: { simpleFilterTitle: 1, simpleFilterField: 3 }
  },
  /**
   * Identifies the search event that gets logged when a user changes the search results layout (list, card, or table).
   *
   * `actionCause`: `'changeResultsLayout'`
   * `actionType`: `'resultsLayout'`
   */
  resultsLayoutChange: <IAnalyticsActionCause>{
    name: 'changeResultsLayout',
    type: 'resultsLayout'
  },
  /**
   * Identifies the click event that gets logged when a user clicks the Show More link under a search result that support the folding component
   *
   * `actionCause`: `'showMoreFoldedResults'`
   * `actionType`: `'folding'`
   */
  foldingShowMore: <IAnalyticsActionCause>{
    name: 'showMoreFoldedResults',
    type: 'folding'
  },
  /**
   * Identifies the click event that gets logged when a user clicks the Show Less link under a search result that support the folding component
   *
   * `actionCause`: `'showMoreFoldedResults'`
   * `actionType`: `'folding'`
   */
  foldingShowLess: <IAnalyticsActionCause>{
    name: 'showLessFoldedResults',
    type: 'folding'
  }
};
