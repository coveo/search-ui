/// <reference path="../../Base.ts" />
/// <reference path="QuickviewDocument.ts" />
/// <reference path="DefaultQuickviewTemplate.ts" />
module Coveo {
  export interface QuickviewOptions {
    title?: string;
    showDate?: boolean;
    contentTemplate?: Template;
    enableLoadingAnimation?: boolean;
    loadingAnimation?: HTMLElement;
    alwaysShow?: boolean;
    size?: string;
  }

  interface QuickviewOpenerObject {
    content: JQuery;
    loadingAnimation: HTMLElement
  }

  export class Quickview extends Component {
    static ID = 'Quickview';

    static fields = [
      'urihash', // analytics
      'collection', // analytics
      'source', // analytics,
      'author' // analytics
    ];

    static options: QuickviewOptions = {
      alwaysShow: ComponentOptions.buildBooleanOption({ defaultValue: false }),
      title: ComponentOptions.buildStringOption(),
      showDate: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      enableLoadingAnimation: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      contentTemplate: ComponentOptions.buildTemplateOption({
        selectorAttr: 'data-template-selector',
        idAttr: 'data-template-id'
      }),
      loadingAnimation: ComponentOptions.buildOption<HTMLElement>(ComponentOptions.Type.NONE, (element: HTMLElement) => {
        var loadingAnimationSelector = element.getAttribute("data-loading-animation-selector");
        if (loadingAnimationSelector != null) {
          var loadingAnimation = <HTMLElement>DomUtils.find(document, loadingAnimationSelector);
          if (loadingAnimation != null) {
            DomUtils.detach(loadingAnimation);
            return loadingAnimation;
          }
        }
        var id = element.getAttribute('data-loading-animation-template-id');
        if (id != null) {
          var loadingAnimationTemplate = ComponentOptions.loadResultTemplateFromId(id);
          if (loadingAnimationTemplate) {
            return loadingAnimationTemplate.instantiateToElement({});
          }
        }
        return JQueryUtils.getBasicLoadingAnimation();
      }),
      size: ComponentOptions.buildStringOption({ defaultValue: DeviceUtils.isMobileDevice() ? '100%' : '95%' })
    };

    private link: JQuery;
    private modalbox: ModalBox.ModalBox;

    constructor(public element: HTMLElement, public options?: QuickviewOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
      super(element, Quickview.ID, bindings);
      this.options = ComponentOptions.initComponentOptions(element, Quickview, options);

      if (this.options.contentTemplate == null) {
        this.options.contentTemplate = new DefaultQuickviewTemplate();
      }

      // If there is no content inside the Quickview div,
      // we need to add something that will show up in the result template itself
      if (/^\s*$/.test(this.element.innerHTML)) {
        if (this.searchInterface.isNewDesign()) {
          $(this.element).append('<div><div class="coveo-icon-for-quickview"></div><div class="coveo-caption-for-quickview">' + 'Quickview'.toLocaleString() + '</div></div>')
        } else {
          $(this.element).append('<div class="coveo-icon-for-quickview">' + 'Quickview'.toLocaleString() + '</div>')
        }
      }

      this.bindClick(result);
      this.bind.on($(this.bindings.resultElement), ResultListEvents.openQuickview, () => this.open());
    }

    public open() {
      if (this.modalbox == null) {
        //To prevent the keyboard from opening on mobile if the search bar has focus
        $(document.activeElement).blur();

        var openerObject = this.prepareOpenQuickviewObject();
        this.createModalBox(openerObject);
        this.bindQuickviewEvents(openerObject);
        this.animateAndOpen();
        var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.quickview);
        this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, this.getHashId());
      }
    }

    public getHashId() {
      return this.result.queryUid + '.' + this.result.index + '.' + StringUtils.hashCode(this.result.uniqueId);
    }

    public close() {
      if (this.modalbox != null) {
        this.modalbox.close();
        this.modalbox = null;
        if (DeviceUtils.isAndroid() && DeviceUtils.isPhonegap()) {
          $(document).off("backbutton");
        }

        $("body").unbind("keyup.quickviewEscape");
      }
    }

    private bindClick(result: IQueryResult) {
      if (typeof result.hasHtmlVersion == 'undefined' || result.hasHtmlVersion || this.options.alwaysShow) {
        $(this.element).click($.proxy(this.open, this));
      } else {
        $(this.element).css('display', 'none');
      }
    }

    private bindQuickviewEvents(openerObject: QuickviewOpenerObject) {
      if (DeviceUtils.isAndroid() && DeviceUtils.isPhonegap()) {
        $(document).on("backbutton", () => {
          this.close();
        });
      }

      $(this.modalbox.wrapper).find('.coveo-quickview-close-button').click(() => {
        this.closeQuickview();
      })

      $(this.modalbox.overlay).click(() => {
        this.closeQuickview();
      })

      $(this.modalbox.wrapper).find('.coveo-quickview-close-button').click(() => this.close());
      $(this.modalbox.content).on(UserActionEvents.quickviewLoaded, () => {
        $(openerObject.loadingAnimation).remove();
        this.bindIFrameEscape();
      })

      this.bindEscape();
    }

    private animateAndOpen() {
      var animationDuration = $(this.modalbox.wrapper).css('animation-duration');
      if (animationDuration) {
        var duration = /^(.+)(ms|s)$/.exec(animationDuration);
        var durationMs = Number(duration[1]) * (duration[2] == 's' ? 1000 : 1);
        //open the QuickviewDocument
        setTimeout(() => {
          if (this.modalbox != null) {
            $(this.modalbox.modalBox).find("." + Component.computeCssClassName(QuickviewDocument)).coveo('open');
          }
        }, durationMs);
      } else {
        $(this.modalbox.modalBox).find("." + Component.computeCssClassName(QuickviewDocument)).coveo('open');
      }
    }

    private createModalBox(openerObject: QuickviewOpenerObject) {

      var computedModalBoxContent = $("<div/>").append(openerObject.content);
      this.modalbox = ModalBox.open(computedModalBoxContent.get(0), {
        title: JQueryUtils.getQuickviewHeader(this.result, { showDate: this.options.showDate, title: this.options.title }, this.bindings).text(),
        className: 'coveo-quick-view',
        validation: () => true,
        body: this.element.ownerDocument.body
      });
      this.setQuickviewSize();
    }

    private prepareOpenQuickviewObject() {
      var loadingAnimation = this.options.loadingAnimation;
      return {
        loadingAnimation: loadingAnimation,
        content: this.prepareQuickviewContent(loadingAnimation)
      }
    }

    private prepareQuickviewContent(loadingAnimation: HTMLElement) {
      var content = $(this.options.contentTemplate.instantiateToElement(this.result));
      var initOptions = this.searchInterface.options;
      var initParameters: IInitializationParameters = {
        options: initOptions,
        bindings: this.getBindings(),
        result: this.result
      };
      Initialization.automaticallyCreateComponentsInside(content.get(0), initParameters);
      if (content.find("." + Component.computeCssClassName(QuickviewDocument)).length != 0 && this.options.enableLoadingAnimation) {
        content.prepend(loadingAnimation);
      }
      return content;
    }

    private bindEscape() {
      $("body").on("keyup.quickviewEscape", (e: JQueryEventObject) => {
        if (e.keyCode == KEYBOARD.ESCAPE) {
          this.closeQuickview();
        }
      });
    }

    private bindIFrameEscape() {
      var quickviewDocument = $(this.modalbox.content).find("." + Component.computeCssClassName(QuickviewDocument)).find("iframe");
      $(quickviewDocument.contents().find('body')).on("keyup", null, this, (e: JQueryEventObject) => {
        if (e.keyCode == KEYBOARD.ESCAPE) {
          this.closeQuickview();
        }
      });
    }

    private closeQuickview() {
      var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.quickview);
      this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, '');
    }

    private setQuickviewSize() {
      var wrapper = $($$(this.modalbox.modalBox).find('.coveo-wrapper'));
      wrapper.css('width', this.options.size);
      wrapper.css('height', this.options.size);
      wrapper.css('max-width', this.options.size);
      wrapper.css('max-height', this.options.size);
    }
  }
  Initialization.registerAutoCreateComponent(Quickview);
}
