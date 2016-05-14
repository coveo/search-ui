/// <reference path="../../Base.ts" />
/// <reference path="../../utils/HighlightUtils.ts" />

module Coveo {
  declare var attachToCaseEndpoint: AttachToCaseEndpoint;

  export interface AttachToCaseOptions {
    displayText?: boolean;
    readonly?: boolean;
  }

  export interface ResultToAttach {
    uriHash: string;
    resultUrl: string;
    source: string;
    title: string;
    name: string;
    customs: any;
    knowledgeArticleId: string;
    articleLanguage: string;
    articleVersionNumber: string;
  }

  export interface AttachToCaseStateChangedArg {
    target: HTMLElement;
    urihash: string;
    loading: boolean;
  }

  export interface AttachToCaseCallbackArg {
    succeeded: boolean;
    message: string;
  }

  export interface AttachToCaseDataArg {
    succeeded: boolean;
    message: string;
    attachedResults: string[];
  }

  export interface AttachToCaseEndpoint {
    attachToCase: (dataToAttach: ResultToAttach, callback: (arg: AttachToCaseCallbackArg) => void) => boolean;
    detachFromCase: (uriHash: string, sfkbid: string, callback: (arg: AttachToCaseCallbackArg) => void) => boolean;
    data: AttachToCaseDataArg;
    caseId: string;
  }

  export class AttachToCase extends Component {
    static ID = 'AttachToCase';
    static options: AttachToCaseOptions = {
      displayText: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      readonly: ComponentOptions.buildBooleanOption({ defaultValue: false })
    };

    protected buttonElement: JQuery;
    protected textElement: JQuery;
    protected attachToCaseEndpoint: AttachToCaseEndpoint;
    protected attachedResults: string[];
    protected attached: boolean;
    protected loading: boolean;
    protected initialized: boolean;

    constructor(public element: HTMLElement, public options?: AttachToCaseOptions, public bindings?: IComponentBindings, public result?: IQueryResult) {
      super(element, AttachToCase.ID);

      this.options = ComponentOptions.initComponentOptions(element, AttachToCase, options);
      this.result = this.result || this.resolveResult();
      this.searchInterface = this.searchInterface || this.resolveSearchInterface();

      this.attached = false;
      this.loading = false;
      this.initialized = false;

      if (typeof (attachToCaseEndpoint) != "undefined" && attachToCaseEndpoint != null) {
        this.setAttachToCaseEndpoint(attachToCaseEndpoint);
      } else {
        this.logger.warn("No endpoint detected, make sure to set one using the SetAttachToCaseEndpoint method.")
      }
    }

    private initialize() {
      if (this.attachToCaseEndpoint != null) {
        if (this.attachToCaseEndpoint.data.succeeded) {
          this.handleData(this.attachToCaseEndpoint.data);
          $(this.root).on(UserActionEvents.attachToCaseStateChanged, (e, arg: AttachToCaseStateChangedArg) => this.handleStateChanged(arg));
          this.renderButton();

          this.initialized = true;
        } else {
          this.logger.error("An error occured while getting attached results", attachToCaseEndpoint.data.message);
        }
      } else {
        this.logger.warn("No endpoint detected, make sure to set one using the SetAttachToCaseEndpoint method.")
      }
    }

    public attach(): void {
      if (this.isAttached() && this.initialized && !this.loading) {
        return;
      }

      this.loading = true;
      this.updateButton();

      var resultToAttach: ResultToAttach = {
        resultUrl: this.result.clickUri,
        source: this.result.raw.source,
        title: StringAndHoles.shortenString(this.result.title, 250, '...').value,
        name: StringAndHoles.shortenString(this.result.title, 80, '...').value,
        uriHash: this.result.raw.urihash,
        knowledgeArticleId: this.result.raw.sfkbid,
        articleLanguage: this.result.raw.sflanguage,
        articleVersionNumber: this.result.raw.sfkbversionnumber,
        customs: {}
      };

      var args: AttachToCaseEventArgs = {
        result: this.result,
        dataToAttach: resultToAttach
      }

      $(this.root).trigger(UserActionEvents.attachToCase, args);

      this.logger.info("Attaching result to case", args);

      this.attachToCaseEndpoint.attachToCase(args.dataToAttach, (arg: AttachToCaseCallbackArg) => this.handleAttachCallback(arg));
    }

    public detach() {
      if (!this.isAttached() && this.initialized && !this.loading) {
        return false;
      }

      this.loading = true;
      this.updateButton();

      var args: DetachFromCaseEventArgs = {
        result: this.result
      }

      $(this.root).trigger(UserActionEvents.detachFromCase, args);

      this.logger.info("Detaching result from case", args);

      this.attachToCaseEndpoint.detachFromCase(this.result.raw.urihash, this.result.raw.sfkbid,
        (arg: AttachToCaseCallbackArg) => this.handleDetachCallback(arg));
    }

    public setAttachToCaseEndpoint(endpoint: AttachToCaseEndpoint) {
      if (endpoint != null) {
        this.attachToCaseEndpoint = endpoint;
        this.initialize();
      }
    }

    public isAttached(): boolean {
      return this.attached;
    }

    protected handleClick() {
      this.isAttached() ? this.detach() : this.attach();
    }

    private handleData(arg: AttachToCaseDataArg) {
      this.attachedResults = arg.attachedResults;
      this.attached = _.contains(arg.attachedResults, this.result.raw.urihash) || (Utils.isNullOrEmptyString(this.result.raw.sfkbid) ? false :
        _.contains(arg.attachedResults, this.result.raw.sfkbid));
    }

    private handleAttachCallback(arg: AttachToCaseCallbackArg) {
      if (arg != null) {
        if (arg.succeeded) {
          this.attached = true;
          this.attachedResults.push(this.result.raw.urihash);

          if (!Utils.isNullOrEmptyString(this.result.raw.sfkbid)) {
            this.attachedResults.push(this.result.raw.sfkbid);
          }

          var customData: IAnalyticsCaseAttachMeta = {
            articleID: this.result.raw.sfkbid,
            caseID: this.attachToCaseEndpoint.caseId,
            resultUriHash: this.result.raw.urihash,
            author: this.result.raw.author
          }

          this.usageAnalytics.logClickEvent(AnalyticsActionCauseList.caseAttach, {
            documentTitle: this.result.title,
            documentURL: this.result.clickUri,
            author: this.result.raw.author
          }, this.result, this.root);
          this.usageAnalytics.logCustomEvent<IAnalyticsCaseAttachMeta>(AnalyticsActionCauseList.caseAttach, customData, this.root);
        } else {
          this.logger.error("Attach failed", arg.message);
        }
      }

      this.loading = false;
      this.updateButton();
    }

    private handleDetachCallback(arg: AttachToCaseCallbackArg) {
      if (arg != null) {
        if (arg.succeeded) {
          this.attached = false;

          delete this.attachedResults[this.attachedResults.indexOf(this.result.raw.urihash)];

          if (!Utils.isNullOrEmptyString(this.result.raw.sfkbid)) {
            delete this.attachedResults[this.attachedResults.indexOf(this.result.raw.sfkbid)];
          }

          var customData: IAnalyticsCaseAttachMeta = {
            articleID: this.result.raw.sfkbid,
            caseID: this.attachToCaseEndpoint.caseId,
            resultUriHash: this.result.raw.urihash,
            author: this.result.raw.author
          }

          this.usageAnalytics.logCustomEvent<IAnalyticsCaseDetachMeta>(AnalyticsActionCauseList.caseDetach, customData, this.root);
        } else {
          this.logger.error("Detach failed", arg.message);
        }
      }

      this.loading = false;
      this.updateButton();
    }

    private handleStateChanged(arg: AttachToCaseStateChangedArg) {
      if (arg.target != this.element && arg.urihash == this.result.raw.urihash) {
        this.attached = _.contains(this.attachedResults, this.result.raw.urihash) || (Utils.isNullOrEmptyString(this.result.raw.sfkbid) ? false :
          _.contains(this.attachedResults, this.result.raw.sfkbid));
        this.loading = arg.loading;

        this.updateButton(false);
      }
    }

    protected renderButton() {
      $(this.element).empty();

      this.buttonElement = $(document.createElement("span")).appendTo(this.element);

      if (this.options.displayText) {
        this.textElement = $(document.createElement("span")).appendTo(this.buttonElement);
      }

      if (!this.options.readonly) {
        $(this.element).click(() => this.handleClick());
        $(this.element).hover(() => this.handleHover(true), () => this.handleHover(false));
      }

      this.updateButton();
    }

    protected handleHover(isIn: boolean) {
      if (this.isAttached() && this.options.displayText) {
        this.textElement.text(isIn ? l('Detach') : l('Attached'));
      }
    }

    protected sendStateChangedEvent() {
      var arg: AttachToCaseStateChangedArg = {
        target: this.element,
        urihash: this.result.raw.urihash,
        loading: this.loading
      };

      $(this.root).trigger(UserActionEvents.attachToCaseStateChanged, arg);
    }

    protected updateButton(sendEvent: boolean = true) {
      this.buttonElement.removeClass();

      if (this.loading) {
        this.buttonElement.addClass("coveo-attach-to-case-loading");
      } else if (this.isAttached()) {
        this.buttonElement.addClass("coveo-attach-to-case-attached");
      } else {
        this.buttonElement.addClass("coveo-attach-to-case-attach");
      }

      if (this.options.readonly) {
        this.buttonElement.addClass("coveo-attach-to-case-readonly");
      }

      if (this.options.displayText) {
        this.textElement.text(this.isAttached() ? l('Attached') : l('Attach'));
      }

      if (sendEvent) {
        this.sendStateChangedEvent()
      }
    }
  }

  Initialization.registerAutoCreateComponent(AttachToCase);
}