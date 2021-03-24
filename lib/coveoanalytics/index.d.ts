declare namespace CoveoAnalytics {
  interface Response {}

  interface SearchDocument {
    documentUri: string;
    documentUriHash: string;
  }

  interface EventBaseRequest {
    language?: string;
    userAgent?: string;
    customData?: any;
    anonymous?: boolean;
    username?: string;
    userDisplayName?: any;
    splitTestRunName?: string;
    splitTestRunVersion?: string;

    originLevel1?: string;
    originLevel2?: string;
    originLevel3?: string;
  }

  interface SearchEventRequest extends EventBaseRequest {
    searchQueryUid: string;
    queryText: string;
    actionCause: string;
    responseTime: number;
    advancedQuery?: string;
    numberOfResults?: number;
    contextual?: boolean;
    results?: SearchDocument[];
    queryPipeline?: string;
    userGroups?: string[];
  }

  interface ClickEventRequest extends EventBaseRequest {
    documentUri: string;
    documentUriHash: string;
    collectionName: string;
    sourceName: string;
    documentPosition: number;
    actionCause: string;

    searchQueryUid?: string;
    documentTitle?: string;
    documentUrl?: string;
    documentAuthor?: string;
    queryPipeline?: string;
    rankingModifier?: string;
  }

  interface CustomEventRequest extends EventBaseRequest {
    eventType: string;
    eventValue: string;
    lastSearchQueryUid?: string;
  }

  interface ViewEventRequest extends EventBaseRequest {
    location: string;
    referrer?: string;
    title?: string;
    contentIdKey?: string;
    contentIdValue?: string;
    contentType?: string;
  }

  interface DefaultEventResponse {
    raw: Response;
    visitId: string;
    visitorId: string;
  }

  interface SearchEventResponse extends DefaultEventResponse {}

  interface ClickEventResponse extends DefaultEventResponse {}

  interface CustomEventResponse extends DefaultEventResponse {}

  interface ViewEventResponse extends DefaultEventResponse {}

  interface VisitResponse {
    raw: Response;
    id: string;
    visitorId: string;
  }

  interface HealthResponse {
    raw: Response;
    status: string;
  }

  interface Client {
    sendEvent(eventType: string, request: any): Promise<Response>;
    sendSearchEvent(request: SearchEventRequest): Promise<SearchEventResponse>;
    sendClickEvent(request: ClickEventRequest): Promise<ClickEventResponse>;
    sendCustomEvent(request: CustomEventRequest): Promise<CustomEventResponse>;
    sendViewEvent(request: ViewEventRequest): Promise<ViewEventResponse>;
    getVisit(): Promise<VisitResponse>;
    getHealth(): Promise<HealthResponse>;
  }

  class HistoryStore {
    constructor();

    addElement(elem: HistoryElement): void;

    getHistory(): HistoryElement[];

    setHistory(history: HistoryElement[]): void;
    clear(): void;

    getMostRecentElement(): HistoryElement;
  }

  interface History {
    HistoryStore: {
      new (storage?: WebStorage): HistoryStore;
    };
  }

  type HistoryElement = HistoryViewElement | HistoryQueryElement | any;
  interface HistoryViewElement {
    type: string;
    uri: string;
    title?: string;
  }

  interface HistoryQueryElement {
    name: string;
    value: string;
    time: string;
  }

  interface AnalyticsClient {
    Client: Client;
  }

  class SimpleAPI {
    private client;

    init(token: string | Client, endpoint: string): void;

    send(event: EventType, customData: any): void;

    onLoad(callback: Function): void;
  }

  interface WebStorage {
    getItem(key: string): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
  }
  let preferredStorage: WebStorage;

  function getAvailableStorage(): WebStorage;

  class NullStorage implements WebStorage {
    getItem(key: string): string;

    removeItem(key: string): void;

    setItem(key: string, data: string): void;
  }

  class CookieStorage implements WebStorage {
    getItem(key: string): string;

    removeItem(key: string): void;

    setItem(key: string, data: string): void;
  }

  type EventType = 'pageview';
}
