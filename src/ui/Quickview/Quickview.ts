import {Component} from '../Base/Component'
import {ComponentOptions, ComponentOptionsType} from '../Base/ComponentOptions'
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings'
import {Template} from '../Templates/Template'
import {DomUtils} from '../../utils/DomUtils'
import {DeviceUtils} from '../../utils/DeviceUtils'
import {IQueryResult} from '../../rest/QueryResult'
import {$$, Dom} from '../../utils/Dom'
import {DefaultQuickviewTemplate} from './DefaultQuickviewTemplate'
import {ResultListEvents} from '../../events/ResultListEvents'
import {StringUtils} from '../../utils/StringUtils'
import {QuickviewDocument} from './QuickviewDocument'
import {QueryStateModel} from '../../models/QueryStateModel'
import {Model} from '../../models/Model'
import {QuickviewEvents} from '../../events/QuickviewEvents'
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {KEYBOARD} from '../../utils/KeyboardUtils';

export interface IQuickviewOptions {
  title?: string;
  showDate?: boolean;
  contentTemplate?: Template;
  enableLoadingAnimation?: boolean;
  loadingAnimation?: HTMLElement;
  alwaysShow?: boolean;
  size?: string;
}

interface IQuickviewOpenerObject {
  content: Dom;
  loadingAnimation: HTMLElement
}

/**
 * This component is meant to exist within a result template.
 * It allows to create a button/link inside the result list that opens a modal box for a given result.
 */
export class Quickview extends Component {
  static ID = 'Quickview';

  static fields = [
    'urihash', // analytics
    'collection', // analytics
    'source', // analytics,
    'author' // analytics
  ];

  /**
   * @componentOptions
   */
  static options: IQuickviewOptions = {
    /**
     * Specifies whether the quickview is always shown, even when the index body for a document is empty.<br/>
     * In such cases, the {@link Quickview.options.contentTemplate} specifies what appears in the quickview.<br/>
     * If there is no quickview for the document, you *MUST* specify a contentTemplate otherwise the component will throw an error when opened.
     */
    alwaysShow: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the title of your choice that appears at the top of the Quick View modal window.
     */
    title: ComponentOptions.buildStringOption(),
    /**
     * Specifies whether to show the document date in the Quick View modal window header.<br/>
     * The default value is `true`.
     */
    showDate: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    enableLoadingAnimation: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the template to use to present the Quick View content in the modal window.<br/>
     * eg : <br/>
     *     <div class="CoveoQuickview" data-template-id="TemplateId"></div>
     *     <div class="CoveoQuickview" data-template-selector=".templateSelector"></div>
     */
    contentTemplate: ComponentOptions.buildTemplateOption({
      selectorAttr: 'data-template-selector',
      idAttr: 'data-template-id'
    }),
    loadingAnimation: ComponentOptions.buildOption<HTMLElement>(ComponentOptionsType.NONE, (element: HTMLElement) => {
      var loadingAnimationSelector = element.getAttribute('data-loading-animation-selector');
      if (loadingAnimationSelector != null) {
        var loadingAnimation = $$(document.documentElement).find(loadingAnimationSelector);
        if (loadingAnimation != null) {
          $$(loadingAnimation).detach();
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
      return DomUtils.getBasicLoadingAnimation();
    }),
    /**
     * Specifies the Quick View modal window size (width and height) relative to the full window.<br/>
     * The default value is 95% on a desktop and 100% on a mobile device.
     */
    size: ComponentOptions.buildStringOption({ defaultValue: DeviceUtils.isMobileDevice() ? '100%' : '95%' })
  };

  private link: Dom;
  private modalbox: Coveo.ModalBox.ModalBox;
  private bindedHandleEscapeEvent = this.handleEscapeEvent.bind(this);

  constructor(public element: HTMLElement, public options?: IQuickviewOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
    super(element, Quickview.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Quickview, options);

    if (this.options.contentTemplate == null) {
      this.options.contentTemplate = new DefaultQuickviewTemplate();
    }

    // If there is no content inside the Quickview div,
    // we need to add something that will show up in the result template itself
    if (/^\s*$/.test(this.element.innerHTML)) {
      let iconForQuickview = $$('div');
      iconForQuickview.addClass('coveo-icon-for-quickview')
      if (this.searchInterface.isNewDesign()) {
        let captionForQuickview = $$('div');
        captionForQuickview.addClass('coveo-caption-for-quickview')
        captionForQuickview.text('Quickview'.toLocaleString())
        let div = $$('div');
        div.append(iconForQuickview.el);
        div.append(captionForQuickview.el);
        $$(this.element).append(div.el);
      } else {
        iconForQuickview.text('Quickview'.toLocaleString());
        $$(this.element).append(iconForQuickview.el);
      }
    }

    this.bindClick(result);
    if (this.bindings.resultElement) {
      this.bind.on(this.bindings.resultElement, ResultListEvents.openQuickview, () => this.open());
    }
  }

  /**
   * Open the quickview
   */
  public open() {
    if (this.modalbox == null) {
      // To prevent the keyboard from opening on mobile if the search bar has focus
      $$(<HTMLElement>document.activeElement).trigger('blur');

      var openerObject = this.prepareOpenQuickviewObject();
      this.createModalBox(openerObject);
      this.bindQuickviewEvents(openerObject);
      this.animateAndOpen();
      var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.quickview);
      this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, this.getHashId());
    }
  }

  /**
   * Close the quickview
   */
  public close() {
    if (this.modalbox != null) {
      this.modalbox.close();
      this.modalbox = null;
      $$(document.body).off('keyup', this.bindedHandleEscapeEvent);
    }
  }

  public getHashId() {
    return this.result.queryUid + '.' + this.result.index + '.' + StringUtils.hashCode(this.result.uniqueId);
  }

  private bindClick(result: IQueryResult) {
    if (typeof result.hasHtmlVersion == 'undefined' || result.hasHtmlVersion || this.options.alwaysShow) {
      $$(this.element).on('click', () => this.open());
    } else {
      this.element.style.display = 'none';
    }
  }

  private bindQuickviewEvents(openerObject: IQuickviewOpenerObject) {

    let closeButton = $$(this.modalbox.wrapper).find('.coveo-quickview-close-button');
    $$(closeButton).on('click', () => {
      this.closeQuickview();
      this.close();
    })

    $$(this.modalbox.overlay).on('click', () => {
      this.closeQuickview();
    })

    $$(this.modalbox.content).on(QuickviewEvents.quickviewLoaded, () => {
      $$(openerObject.loadingAnimation).remove();
      this.bindIFrameEscape();
    })

    this.bindEscape();
  }

  private animateAndOpen() {
    var animationDuration = this.modalbox.wrapper.style.animationDuration;
    if (animationDuration) {
      var duration = /^(.+)(ms|s)$/.exec(animationDuration);
      var durationMs = Number(duration[1]) * (duration[2] == 's' ? 1000 : 1);
      // open the QuickviewDocument
      setTimeout(() => {
        if (this.modalbox != null) {
          let quickviewDocument = $$(this.modalbox.modalBox).find('.' + Component.computeCssClassName(QuickviewDocument));
          Initialization.dispatchNamedMethodCallOrComponentCreation('open', quickviewDocument, null);
        }
      }, durationMs);
    } else {
      let quickviewDocument = $$(this.modalbox.modalBox).find('.' + Component.computeCssClassName(QuickviewDocument));
      Initialization.dispatchNamedMethodCallOrComponentCreation('open', quickviewDocument, null);
    }
  }

  private createModalBox(openerObject: IQuickviewOpenerObject) {

    var computedModalBoxContent = $$('div')
    computedModalBoxContent.append(openerObject.content.el);
    this.modalbox = Coveo.ModalBox.open(computedModalBoxContent.el, {
      title: DomUtils.getQuickviewHeader(this.result, {
        showDate: this.options.showDate,
        title: this.options.title
      }, this.bindings).el.outerHTML,
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
    var content = $$(this.options.contentTemplate.instantiateToElement(this.result));
    var initOptions = this.searchInterface.options;
    var initParameters: IInitializationParameters = {
      options: initOptions,
      bindings: this.getBindings(),
      result: this.result
    };
    Initialization.automaticallyCreateComponentsInside(content.el, initParameters);
    if (content.find('.' + Component.computeCssClassName(QuickviewDocument)) != undefined && this.options.enableLoadingAnimation) {
      content.prepend(loadingAnimation);
    }
    return content;
  }

  private bindEscape() {
    $$(document.body).on('keyup', this.bindedHandleEscapeEvent);
  }

  private bindIFrameEscape() {
    let quickviewDocument = $$(this.modalbox.content).find('.' + Component.computeCssClassName(QuickviewDocument))
    quickviewDocument = $$(quickviewDocument).find('iframe');
    let body = (<HTMLIFrameElement>quickviewDocument).contentWindow.document.body
    $$(body).on('keyup', this.bindedHandleEscapeEvent);
  }

  private closeQuickview() {
    var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.quickview);
    this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, '');
  }

  private setQuickviewSize() {
    var wrapper = $$($$(this.modalbox.modalBox).find('.coveo-wrapper'));
    wrapper.el.style.width = this.options.size;
    wrapper.el.style.height = this.options.size;
    wrapper.el.style.maxWidth = this.options.size;
    wrapper.el.style.maxHeight = this.options.size;
  }

  private handleEscapeEvent(e: KeyboardEvent) {
    if (e.keyCode == KEYBOARD.ESCAPE) {
      this.closeQuickview();
      this.close();
    }
  }
}
Initialization.registerAutoCreateComponent(Quickview);
