import { Component } from '../Base/Component';
import { ComponentOptions, ComponentOptionsType } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { Template } from '../Templates/Template';
import { DomUtils } from '../../utils/DomUtils';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { IQueryResult } from '../../rest/QueryResult';
import { $$, Dom } from '../../utils/Dom';
import { DefaultQuickviewTemplate } from './DefaultQuickviewTemplate';
import { ResultListEvents } from '../../events/ResultListEvents';
import { StringUtils } from '../../utils/StringUtils';
import { QuickviewDocument } from './QuickviewDocument';
import { QueryStateModel } from '../../models/QueryStateModel';
import { QuickviewEvents } from '../../events/QuickviewEvents';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';

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
  loadingAnimation: HTMLElement;
}

/**
 * This component is meant to exist within a result template.
 * It allows to create a button/link inside the result list that opens a modal box for a given result.
 *
 * Most of the time, this component will reference a {@link QuickviewDocument} in its content template.
 *
 * ## Choosing what to display for the Quickview
 * The Quick View uses any HTML structure you put inside its tag and uses that as the content of the dialog box. This content can thus be any element you decide, using your CSS and your structure.
 *
 * ## Example
 * - You can change the appearance of the Quick View link by adding HTML inside the body of the div.
 *
 * - You can change the content of the Quick View link by specifying a template ID.
 *
 * - You can use the methods of the [CoreHelpers]{@link ICoreHelpers} in the template.
 *
 * ```html
 * <!-- This would change the appearance of the quickview button itself in the result. -->
 * <div class="CoveoQuickview" data-template-id="TemplateId">
 *   <span>Click here for Quickview</span>
 * </div>
 *
 * <!-- This would modify the content of the quickview when it is opened in the modal box -->
 * <script class='result-template' type='text/underscore' id='TemplateId' >
 *   <div>
 *     <span>This is the content that will be displayed when you open the Quick View. You can also include any other Coveo components.</span>
 *     <table class="CoveoFieldTable">
 *       <tr data-field="@liboardshorttitle" data-caption="Board" />
 *       <tr data-field="@licategoryshorttitle" data-caption="Category" />
 *       <tr data-field="@sysauthor" data-caption="Author" />
 *     </table>
 *   </div>
 * </script>
 *
 * <!-- Note that this is all optional: Just including a <div class='CoveoQuickview'></div> will do the job most of the time, and will include a default template and default button appearance -->
 * ```
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
     * e.g.: <br/>
     *     <div class="CoveoQuickview" data-template-id="TemplateId"></div>
     *     <div class="CoveoQuickview" data-template-selector=".templateSelector"></div>
     */
    contentTemplate: ComponentOptions.buildTemplateOption({
      selectorAttr: 'data-template-selector',
      idAttr: 'data-template-id'
    }),
    loadingAnimation: ComponentOptions.buildOption<HTMLElement>(ComponentOptionsType.NONE, (element: HTMLElement) => {
      let loadingAnimationSelector = element.getAttribute('data-loading-animation-selector');
      if (loadingAnimationSelector != null) {
        let loadingAnimation = $$(document.documentElement).find(loadingAnimationSelector);
        if (loadingAnimation != null) {
          $$(loadingAnimation).detach();
          return loadingAnimation;
        }
      }
      let id = element.getAttribute('data-loading-animation-template-id');
      if (id != null) {
        let loadingAnimationTemplate = ComponentOptions.loadResultTemplateFromId(id);
        if (loadingAnimationTemplate) {
          return loadingAnimationTemplate.instantiateToElement(undefined, {
            checkCondition: false
          });
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

  public static resultCurrentlyBeingRendered: IQueryResult = null;

  private modalbox: Coveo.ModalBox.ModalBox;
  private bindedHandleEscapeEvent = this.handleEscapeEvent.bind(this);

  constructor(public element: HTMLElement, public options?: IQuickviewOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult, private ModalBox = ModalBoxModule) {
    super(element, Quickview.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Quickview, options);

    if (this.options.contentTemplate == null) {
      this.options.contentTemplate = new DefaultQuickviewTemplate();
    }

    // If there is no content inside the Quickview div,
    // we need to add something that will show up in the result template itself
    if (/^\s*$/.test(this.element.innerHTML)) {
      let iconForQuickview = $$('div');
      iconForQuickview.addClass('coveo-icon-for-quickview');
      if (this.searchInterface.isNewDesign()) {
        let captionForQuickview = $$(
          'div',
          { className: 'coveo-caption-for-quickview', tabindex: 0 },
          'Quickview'.toLocaleString()
        ).el;
        let div = $$('div');
        div.append(iconForQuickview.el);
        div.append(captionForQuickview);
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
      Quickview.resultCurrentlyBeingRendered = this.result;
      $$(<HTMLElement>document.activeElement).trigger('blur');

      let openerObject = this.prepareOpenQuickviewObject();
      this.createModalBox(openerObject);
      this.bindQuickviewEvents(openerObject);
      this.animateAndOpen();
      this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, this.getHashId());
      Quickview.resultCurrentlyBeingRendered = null;
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
      const clickAction = () => this.open();
      $$(this.element).on('click', clickAction);
      this.bind.on(this.element, 'keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, clickAction));
    } else {
      this.element.style.display = 'none';
    }
  }

  private bindQuickviewEvents(openerObject: IQuickviewOpenerObject) {

    let closeButton = $$(this.modalbox.wrapper).find('.coveo-quickview-close-button');
    $$(closeButton).on('click', () => {
      this.closeQuickview();
      this.close();
    });

    $$(this.modalbox.overlay).on('click', () => {
      this.closeQuickview();
    });

    $$(this.modalbox.content).on(QuickviewEvents.quickviewLoaded, () => {
      $$(openerObject.loadingAnimation).remove();
      this.bindIFrameEscape();
    });

    this.bindEscape();
  }

  private animateAndOpen() {
    let animationDuration = this.modalbox.wrapper.style.animationDuration;
    let quickviewDocument = $$(this.modalbox.modalBox).find('.' + Component.computeCssClassName(QuickviewDocument));
    if (quickviewDocument) {
      if (animationDuration) {
        let duration = /^(.+)(ms|s)$/.exec(animationDuration);
        let durationMs = Number(duration[1]) * (duration[2] == 's' ? 1000 : 1);
        // open the QuickviewDocument
        setTimeout(() => {
          if (this.modalbox != null) {
            Initialization.dispatchNamedMethodCallOrComponentCreation('open', quickviewDocument, null);
          }
        }, durationMs);
      } else {
        Initialization.dispatchNamedMethodCallOrComponentCreation('open', quickviewDocument, null);
      }
    }
  }

  private createModalBox(openerObject: IQuickviewOpenerObject) {
    let computedModalBoxContent = $$('div');
    computedModalBoxContent.append(openerObject.content.el);
    this.modalbox = this.ModalBox.open(computedModalBoxContent.el, {
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
    let loadingAnimation = this.options.loadingAnimation;
    return {
      loadingAnimation: loadingAnimation,
      content: this.prepareQuickviewContent(loadingAnimation)
    };
  }

  private prepareQuickviewContent(loadingAnimation: HTMLElement) {
    let content = $$(this.options.contentTemplate.instantiateToElement(this.result));
    let initOptions = this.searchInterface.options;
    let initParameters: IInitializationParameters = {
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
    let quickviewDocument = $$(this.modalbox.content).find('.' + Component.computeCssClassName(QuickviewDocument));
    quickviewDocument = $$(quickviewDocument).find('iframe');
    let body = (<HTMLIFrameElement>quickviewDocument).contentWindow.document.body;
    $$(body).on('keyup', this.bindedHandleEscapeEvent);
  }

  private closeQuickview() {
    this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, '');
  }

  private setQuickviewSize() {
    let wrapper = $$($$(this.modalbox.modalBox).find('.coveo-wrapper'));
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
