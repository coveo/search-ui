/**
 * The common subset of fields used to describe Coveo Cloud usage analytics [_search_]{@link ISearchEvent}, [_click_](@link IClickEvent), and [_custom_](@link ICustomEvent) events.
 */
export interface IAnalyticsEvent {
  /**
   * The unique identifier of the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `74682726-0e20-46eb-85ac-f37259346f57`
   */
  searchQueryUid: string;
  /**
   * A unique name describing the action that triggered the event.
   *
   * See the [`name`](https://coveo.github.io/search-ui/interfaces/ianalyticsactioncause.html#name) property of the [`IAnalyticsActionCause`](https://coveo.github.io/search-ui/interfaces/ianalyticsactioncause.html) interface.
   *
   * **Example:** `pagerNext`
   */
  actionCause: string;
  /**
   * A name describing the category of actions to which the action that triggered the event belongs.
   *
   * See the [`type`](https://coveo.github.io/search-ui/interfaces/ianalyticsactioncause.html#type) property of the [`IAnalyticsActionCause`](https://coveo.github.io/search-ui/interfaces/ianalyticsactioncause.html) interface.
   *
   * **Example:** `getMoreResults`
   */
  actionType: string;
  /**
   * The identifier of the end-user whose action triggered the event.
   *
   * **Note:** This field is normally set to the [`user`](https://coveo.github.io/search-ui/components/analytics.html#options.user) option value of the [`Analytics`](https://coveo.github.io/search-ui/components/analytics.html) component. However, when actually recording the event, the Coveo Cloud usage analytics service may override this value with information extracted from the search token.
   *
   * **Example:** `asmith@example.com`
   */
  username?: string;
  /**
   * The display name of the end-user whose action triggered the event.
   *
   * **Note:** This field is normally set to the [`userDisplayName`](https://coveo.github.io/search-ui/components/analytics.html#options.userdisplayname) option value of the [`Analytics`](https://coveo.github.io/search-ui/components/analytics.html) component. However, when actually recording the event, the Coveo Cloud usage analytics service may override this value with information extracted from the search token.
   *
   * **Example:** `Alice Smith`
   */
  userDisplayName?: string;
  /**
   * Whether the event should be logged anonymously to the Coveo Cloud usage analytics service.
   *
   * **Note:** This field is normally set to the [`anonymous`](https://coveo.github.io/search-ui/components/analytics.html#options.anonymous) option value of the [`Analytics`](https://coveo.github.io/search-ui/components/analytics.html) component.
   */
  anonymous?: boolean;
  /**
   * The name of the device or browser that triggered the event.
   *
   * **Note:** The framework normally sets this field by parsing the current `navigator.userAgent` value.
   *
   * **Example:** `Chrome`
   */
  device: string;
  /**
   * Whether the event originates from a mobile device.
   *
   * **Note:** The framework normally sets this field by parsing the current `navigator.userAgent` value.
   */
  mobile: boolean;
  /**
   * The identifier of the search interface from which the event originates.
   *
   * **Note:** This field is normally set through the [`searchHub`](https://coveo.github.io/search-ui/components/analytics.html#options.searchhub) option of the [`Analytics`](https://coveo.github.io/search-ui/components/analytics.html) component. However, when actually recording the event, the Coveo Cloud usage analytics service may override this value with information extracted from the search token.
   *
   * **Example:** `PartnerPortalSearch`
   */
  originLevel1: string;
  /**
   * The identifier of the tab from which the event originates.
   *
   * **Note:** The framework normally sets this field to the identifier of the currently selected [`Tab`](https://coveo.github.io/search-ui/components/tab.html) in the search interface.
   *
   * **Example:** `All`
   */
  originLevel2: string;
  /**
   * The address of the webpage that linked to the search interface from which the event originates.
   *
   * **Note:** The framework normally sets this field to the current `document.referrer` value.
   *
   * **Example:** `http://example.com/`
   */
  originLevel3?: string;
  /**
   * The broad application context from which the event originates.
   *
   * **Note:** By default, the framework sets this field to `Search`. However, you can use the [`setOriginContext`](https://coveo.github.io/search-ui/components/analytics.html#setorigincontext) method of the [`Analytics`](https://coveo.github.io/search-ui/components/analytics.html) component to modify the default value.
   *
   * **Example:** `Search`
   */
  originContext: string;
  /**
   * The language of the search interface from which the event originates.
   *
   * Must be a valid [ISO-639-1 code](https://en.wikipedia.org/wiki/ISO_639-1).
   *
   * **Note:** By default, the framework sets this field according to the currently loaded culture file (see [Changing the Language of Your Search Interface](https://docs.coveo.com/en/421/)).
   *
   * **Example:** `en`
   */
  language: string;
  /**
   * The time it took to get a response from the Search API for the query related to the event (in milliseconds).
   *
   * **Note:** The framework normally sets this field to `0`, except for [search events]{@link ISearchEvent} in which case it sets the field by retrieving the information from the related Search API query response.
   *
   */
  responseTime: number;
  /**
   * The software acting on behalf of the end-user whose action triggered the event.
   *
   * **Note:** By default, the framework sets this field to the current `navigator.userAgent` value.
   *
   * **Example:** `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36`
   */
  userAgent?: string;
  /**
   * The groups the end-user whose action triggered the event belongs to.
   *
   * **Note:** This field is normally left undefined, and the Coveo Cloud usage analytics service attempts to extract the information from the search token when actually recording the event.
   */
  userGroups?: string;
  /**
   * Additional metadata to send along with the event.
   *
   * **Note:** This field may include custom user context information (see [Sending Custom Context Information](https://docs.coveo.com/en/399/)).
   *
   * **Example:** `{ "currentResultsPerPage": 25, "userRole": "developer" }`
   */
  customData?: { [key: string]: any };
  /**
   * A GUID representing the current user. This GUID is generated locally and stored in a non-expiring browser cookie.
   */
  clientId: string;
}
