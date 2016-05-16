


declare var userActionsHandler: Coveo.UserActionsHandler;

module Coveo {
  export interface UserActionsOptions {
    filters?: string[];
    showButton?: boolean;
    enableBindOnBox?: boolean;
  }

  export interface APIAnalyticsEvent {
    type: string;
    dateTime: number;
    eventMetadata: any;
  }

  export interface APIAnalyticsSession {
    events: APIAnalyticsEvent[];
    numberOfEvents: number;
    visitId: string;
  }

  export interface APIAnalyticsVisitResponse {
    visits: APIAnalyticsSession[];
    totalNumberOfVisits: number;
    message?: string;
    type?: string;
  }

  export interface UserActionsHandler {
    getDataFromUA: (callback: any) => any;
  }

  export class UserActions extends Component {
    static ID = 'UserActions';
    static DEFAULT_FILTERS = ['searchboxSubmit', 'documentOpen', 'documentQuickview', 'pageVisit', 'pageView', 'createCase'];

    static options: UserActionsOptions = {
      showButton: ComponentOptions.buildBooleanOption({ defaultValue: false }),
      enableBindOnBox: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      filters: ComponentOptions.buildListOption({ defaultValue: UserActions.DEFAULT_FILTERS })
    };

    private eventListBox: JQuery;
    private loadingBox: JQuery;
    private handler: UserActionsHandler;

    constructor(public element: HTMLElement,
      public options?: UserActionsOptions,
      public bindings?: IComponentBindings) {
      super(element, UserActions.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, UserActions, options);
      $(this.root).on(AnalyticsEvents.changeAnalyticsCustomData, $.proxy(this.handleChangeAnalyticsEvents, this));

      if (typeof userActionsHandler != "undefined") {
        this.setHandler(userActionsHandler);
      }

      this.render();

      if (this.options.enableBindOnBox) {
        $(element).closest('.CoveoBoxPopup').on('onPopupOpen', () => {
          this.open();
        });
      }
    }

    public setHandler(handler: UserActionsHandler) {
      this.handler = handler;
    }

    public setFilters(filters: string[]) {
      this.options.filters = filters;
    }

    private handleChangeAnalyticsEvents(e: Event, args: IChangeAnalyticsCustomDataEventArgs) {
      if (args.actionType == AnalyticsActionCauseList.getUserHistory.type ||
        args.actionType == AnalyticsActionCauseList.userActionDocumentClick.type) {
        args.originLevel2 = UserActions.ID;
      }
    }

    private render() {
      if (this.options.showButton) {
        var button = this.renderButton().appendTo(this.element).click(() => {
          this.toggle();
        });
      }

      this.loadingBox = $(JQueryUtils.getBasicLoadingDots()).hide().appendTo(this.element);
      this.eventListBox = $("<div>").addClass("coveo-useractions-events-list").hide().appendTo(this.element);
    }

    public open() {
      if (this.eventListBox.is(':empty') && this.handler != null) {
        this.loadingBox.show();

        this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(AnalyticsActionCauseList.getUserHistory, null, this.element);

        this.handler.getDataFromUA((sessions: APIAnalyticsVisitResponse) => {
          this.renderEvents(sessions);
        });
      } else {
        this.eventListBox.slideDown();
      }
    }

    public toggle() {
      if (this.eventListBox.is(':visible')) {
        this.close();
      } else {
        this.open();
      }
    }

    public close() {
      if (this.eventListBox.is(':visible')) {
        this.eventListBox.slideUp();
      }
    }

    private renderEvents(visits: APIAnalyticsVisitResponse) {
      this.eventListBox.empty();

      if (visits.message != null) {
        if (visits.type == "NoVisitIdError") {
          this.logger.info(visits.message, visits.type, visits);
          $("<span>").text(l("UserActionsNoVisitId")).addClass("coveo-useractions-nodata").appendTo(this.eventListBox);
        } else {
          this.logger.error(visits.message, visits.type, visits);
          $("<span>").text(l("UserActionsErrorOccured")).addClass("coveo-useractions-nodata").appendTo(this.eventListBox);
        }
      } else if (visits.totalNumberOfVisits > 0) {
        if (visits.visits[0].numberOfEvents > 0) {
          this.renderHeaderBox(visits.visits[0]).appendTo(this.eventListBox);

          _.each(visits.visits[0].events, (event) => {
            if (_.contains(this.options.filters, event.eventMetadata.actionCause) ||
              _.contains(this.options.filters, event.eventMetadata.customEventValue)) {
              this.renderEvent(event).appendTo(this.eventListBox);
            }
          });
        }
      } else {
        $("<span>").text(l("NoData")).addClass("coveo-useractions-nodata").appendTo(this.eventListBox);
      }

      this.loadingBox.hide();
      this.eventListBox.slideToggle();
    }

    private renderEvent(event: APIAnalyticsEvent): JQuery {
      var box = $("<div>").addClass("coveo-useractions-event");
      var rightBox = $("<div>").addClass("coveo-useractions-event-right").appendTo(box);
      var leftBox = $("<div>").addClass("coveo-useractions-event-left").appendTo(box);

      this.renderField(l("Time"), new Date(event.dateTime).toLocaleTimeString()).appendTo(leftBox);

      if (event.eventMetadata.documentTitle && event.eventMetadata.documentURL) {
        this.renderLinkField(l("Document"), event.eventMetadata.documentTitle, event.eventMetadata.documentURL).appendTo(rightBox);
      }

      if (event.eventMetadata.queryExpression) {
        this.renderField(l("UserQuery"), event.eventMetadata.queryExpression).appendTo(rightBox);
      }

      if (event.eventMetadata.customEventValue == "pageView") {
        this.renderLinkField(event.type, event.eventMetadata.originLevel3, event.eventMetadata.originLevel3).appendTo(rightBox);
      } else if (event.eventMetadata.customEventValue) {
        this.renderField(event.type, event.eventMetadata.customEventValue).appendTo(rightBox);
      }

      if (rightBox.is(':empty')) {
        this.renderField(l("EventType"),
          event.type + (event.eventMetadata.actionCause ? ", " + event.eventMetadata.actionCause : "")).appendTo(rightBox);
      }

      return box;
    }

    private renderField(fieldTitle: string, fieldValue: string): JQuery {
      var fieldBox = $("<div>");

      if (fieldValue) {
        $("<span>").addClass("coveo-useractions-event-title").text(fieldTitle).appendTo(fieldBox);
        $("<span>").addClass("coveo-useractions-event-value-expand").text(fieldValue).appendTo(fieldBox);
      }

      return fieldBox;
    }

    private renderLinkField(fieldTitle: string, fieldValue: string, fieldLink: string): JQuery {
      var fieldBox = $("<div>");

      if (fieldValue) {
        $("<span>").addClass("coveo-useractions-event-title").text(fieldTitle).appendTo(fieldBox);
        $("<a>").addClass("coveo-useractions-event-value-expand CoveoResultLink")
          .text(fieldValue).attr("href", fieldLink)
          .attr("target", "_blanc").appendTo(fieldBox)
          .click(() => {
            this.usageAnalytics.logCustomEvent<IAnalyticsDocumentViewMeta>(AnalyticsActionCauseList.userActionDocumentClick, {
              author: null,
              documentTitle: fieldValue,
              documentURL: fieldLink
            }, this.element);
          });
      }
      return fieldBox;
    }

    private renderHeaderBox(session: APIAnalyticsSession): JQuery {
      var box = $("<div>").addClass("coveo-useractions-event").addClass("coveo-useractions-event-header");
      var rightBox = $("<div>").addClass("coveo-useractions-event-right").appendTo(box);
      var leftBox = $("<div>").addClass("coveo-useractions-event-left").appendTo(box);

      var startDate = new Date(session.events[0].dateTime).toDateString();
      var startTime = new Date(session.events[0].dateTime).toLocaleTimeString();
      var duration = DateUtils.timeBetween(new Date(session.events[0].dateTime), new Date(session.events[session.numberOfEvents - 1].dateTime));

      this.renderField(l("StartDate"), startDate).appendTo(leftBox);
      this.renderField(l("StartTime"), startTime).css("float", "left").appendTo(rightBox);
      this.renderField(l("DurationTitle"), duration).css("float", "right").appendTo(rightBox);

      return box;
    }

    private renderButton(): JQuery {
      return $("<div>").addClass("coveo-useractions-button").append(
        $("<span>").text(l("ShowUserActions").toUpperCase())
      );
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(UserActions);
}
