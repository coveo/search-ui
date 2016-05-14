/// <reference path="../../Base.ts" />
/// <reference path="ResultLinkOptions.ts" />
/// <reference path="../../utils/OSUtils.ts" />
/// <reference path="../../utils/PhonegapUtils.ts" />
module Coveo {

  export class ResultLink extends Component {
    static ID = 'ResultLink';

    static options = <ResultLinkOptions>{
      field: ComponentOptions.buildFieldOption(),
      openInOutlook: ComponentOptions.buildBooleanOption({ defaultValue: false }),
      openQuickview: ComponentOptions.buildBooleanOption(),
      alwaysOpenInNewWindow: ComponentOptions.buildBooleanOption({ defaultValue: false })
    };

    static fields = [
      'outlookformacuri',
      'outlookuri',
      'connectortype',
      'urihash', // analytics
      'collection', // analytics
      'source', // analytics
      'author' // analytics
    ]

    constructor(public element: HTMLElement, public options?: ResultLinkOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult, public os?: OSUtils.NAME) {
      super(element, ResultLink.ID, bindings);
      this.options = ComponentOptions.initComponentOptions(element, ResultLink, options);
      this.options = $.extend({}, this.options, this.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.resultLink))
      this.result = result || this.resolveResult();

      if (this.options.openQuickview == null) {
        this.options.openQuickview = result.raw['connectortype'] == "ExchangeCrawler" && DeviceUtils.isMobileDevice();
      }

      Assert.exists(this.componentOptionsModel);
      Assert.exists(this.result);

      if (!this.options.openQuickview) {
        $(element).on("click", () => {
          this.logOpenDocument();
        });
      }
      if (/^\s*$/.test(this.element.innerHTML)) {
        this.element.innerHTML = this.result.title ? HighlightUtils.highlightString(this.result.title, this.result.titleHighlights, null, 'coveo-highlight') : this.result.clickUri;
      }
      this.bindEventToOpen();
    }

    protected bindEventToOpen(): boolean {
      return this.bindOnClickIfNotUndefined() || this.bindOpenQuickviewIfNotUndefined() || this.setHrefIfNotAlready() || this.openLinkThatIsNotAnAnchor();
    }

    private bindOnClickIfNotUndefined() {
      if (this.options.onClick != undefined) {
        $(this.element).click((e: JQueryEventObject) => {
          this.options.onClick.call(this, e, this.result)
        });
        return true;
      } else {
        return false;
      }
    }

    private bindOpenQuickviewIfNotUndefined() {
      if ((this.options.openQuickview || this.isUriThatMustBeOpenedInQuickview()) && QueryUtils.hasHTMLVersion(this.result)) {
        $(this.element).click((e: JQueryEventObject) => {
          e.preventDefault();
          $(this.bindings.resultElement).trigger(ResultListEvents.openQuickview)
        });
        return true;
      } else {
        return false;
      }
    }

    private openLinkThatIsNotAnAnchor() {
      if (DeviceUtils.isPhonegap()) {
        PhonegapUtils.bindOpenLinkInPhonegap(this.element, this.getResultUri());
        return true;
      } else if (!this.elementIsAnAnchor()) {
        $(this.element).click((ev: JQueryEventObject) => {
          if (this.options.alwaysOpenInNewWindow) {
            if (this.options.openInOutlook && this.hasOutlookField()) {
              window.location.href = this.getResultUri();
            } else {
              window.open(this.getResultUri(), '_blank');
            }
          } else {
            window.location.href = this.getResultUri();
          }
        });
        return true;
      }
      return false;
    }

    private setHrefIfNotAlready() {
      if (DeviceUtils.isPhonegap() && this.elementIsAnAnchor()) {
        //In phonegap, we need to open using the inappbrowser plugin
        //remove the href/target so that the link doesn't open 2 times ( in the external browser + inside the webview)
        //We still retrieve the url set on the template, if available
        var uri = $(this.element).attr('href');
        if (uri == undefined || uri == "") {
          uri = this.getResultUri();
        }
        $(this.element).removeAttr('href');
        $(this.element).removeAttr('target');
        PhonegapUtils.bindOpenLinkInPhonegap(this.element, uri);
        return true;
      } else {
        // Do not erase any value put in href by the template, etc. Allows
        // using custom click urls while still keeping analytics recording
        // and other behavior brought by the component.
        if (this.elementIsAnAnchor() && !Utils.isNonEmptyString($(this.element).attr('href'))) {
          $(this.element).attr('href', this.getResultUri());
          if (this.options.alwaysOpenInNewWindow && !(this.options.openInOutlook && this.hasOutlookField())) {
            $(this.element).attr('target', '_blank');
          }
          return true;
        } else {
          return false;
        }
      }
    }

    private bindPhonegapClick() {
      if (DeviceUtils.isPhonegap()) {
        PhonegapUtils.bindOpenLinkInPhonegap(this.element, this.getResultUri());
      }
    }

    private logOpenDocument = _.debounce(() => {
      this.queryController.saveLastQuery();
      var documentURL = $(this.element).attr('href');
      if (documentURL == undefined || documentURL == '') {
        documentURL = this.result.clickUri;
      }
      this.usageAnalytics.logClickEvent(AnalyticsActionCauseList.documentOpen, {
        documentURL: documentURL,
        documentTitle: this.result.title,
        author: this.result.raw.author
      }, this.result, this.root);
      Defer.flush();
    }, 1500, true);

    private getResultUri(): string {
      if (this.options.field == undefined && this.options.openInOutlook) {
        this.setField();
      }
      if (this.options.field != undefined) {
        return Utils.getFieldValue(this.result, this.options.field);
      } else {
        return this.result.clickUri;
      }
    }

    private elementIsAnAnchor() {
      return this.element.tagName == "A"
    }

    private setField() {
      var os = Utils.exists(this.os) ? this.os : OSUtils.get();
      if (os == OSUtils.NAME.MACOSX && this.hasOutlookField()) {
        this.options.field = "@outlookformacuri"
      } else if (os == OSUtils.NAME.WINDOWS && this.hasOutlookField()) {
        this.options.field = "@outlookuri";
      }
    }

    private hasOutlookField() {
      var os = Utils.exists(this.os) ? this.os : OSUtils.get();
      if (os == OSUtils.NAME.MACOSX && this.result.raw["outlookformacuri"] != undefined) {
        return true;
      } else if (os == OSUtils.NAME.WINDOWS && this.result.raw["outlookuri"] != undefined) {
        return true;
      }
      return false;
    }

    private isUriThatMustBeOpenedInQuickview(): boolean {
      return this.result.clickUri.toLowerCase().indexOf('ldap://') == 0;
    }
  }

  Initialization.registerAutoCreateComponent(ResultLink);
}