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
import { exportGlobally } from '../../GlobalExports';

import 'styling/_Quickview';

export interface IQuickviewOptions {
  title?: string;
  showDate?: boolean;
  contentTemplate?: Template;
  enableLoadingAnimation?: boolean;
  loadingAnimation?: HTMLElement | Promise<HTMLElement>;
  alwaysShow?: boolean;
  size?: string;
}

interface IQuickviewOpenerObject {
  content: Promise<Dom>;
  loadingAnimation: HTMLElement | Promise<HTMLElement>;
}

/**
 * The `Quickview` component renders a button / link which the end user can click to open a modal box containing certain
 * content about a result. Most of the time, this component references a [`QuickviewDocument`]{@link QuickviewDocument}
 * in its [`contentTemplate`]{@link Quickview.options.contentTemplate}.
 *
 * **Note:**
 * > - You can change the appearance of the `Quickview` link / button by adding HTML inside the body of its `div`.
 * > - You can change the content of the `Quickview` modal box link by specifying a template ID or selector (see the
 * > [`contentTemplate`]{@link Quickview.options.contentTemplate} option).
 *
 * **Example:**
 * ```html
 * [ ... ]
 *
 * <script class='result-template' type='text/underscore' id='myContentTemplateId'>
 *   <div>
 *     <span>This content will be displayed when then end user opens the Quickview modal box. It could also include other Coveo component, and use core helpers.</span>
 *     <table class="CoveoFieldTable">
 *       <tr data-field="@liboardshorttitle" data-caption="Board" />
 *       <tr data-field="@licategoryshorttitle" data-caption="Category" />
 *       <tr data-field="@sysauthor" data-caption="Author" />
 *     </table>
 *   </div>
 * </script>
 *
 * [ ... ]
 *
 * <div class='CoveoResultList'>
 *   <script class='result-template' type='text/underscore' id='myResultTemplateId'>
 *
 *   [ ... ]
 *
 *     <!-- The `myContentTemplateId` template applies when displaying content in the Quickview modal box. -->
 *       <div class='CoveoQuickview' data-template-id='myContentTemplateId'>
 *         <!-- This changes the appearance of the Quickview button itself in the results -->
 *         <span>Click here for a Quickview</span>
 *       </div>
 *   </script>
 *
 *   [ ... ]
 *
 * <!-- Note that this is all optional. Simply including `<div class='CoveoQuickview'></div>` in the markup suffices most of the time and includes a default template, and default button appearance. -->
 * ```
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class Quickview extends Component {
  static ID = 'Quickview';

  static doExport = () => {
    exportGlobally({
      'Quickview': Quickview,
      'QuickviewDocument': QuickviewDocument
    });
  }

  /**
   * @componentOptions
   */
  static options: IQuickviewOptions = {

    /**
     * Specifies whether to always show the `Quickview` button / link, even when the index body of an item is empty.
     *
     * In such cases, the [`contentTemplate`]{@link Quickview.options.contentTemplate} defines what appears in the
     * `Quickview` modal box. Consequently, if there is no quickview for the item, you *MUST* specify a custom
     * `contentTemplate`, otherwise the component will throw an error when opened.
     *
     * Default value is `false`.
     */
    alwaysShow: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the title that should appear in the `Quickview` modal box header.
     *
     * Default value is `undefined`.
     */
    title: ComponentOptions.buildStringOption(),

    /**
     * Specifies whether to display the item date in the `Quickview` modal box header.
     *
     * Default value is `true`.
     */
    showDate: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    enableLoadingAnimation: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies a custom template to use when displaying content in the `Quickview` modal box.
     *
     * **Note:**
     * > You can use [`CoreHelpers`]{@link ICoreHelpers} methods in your content template.
     *
     * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
     * CSS selector (see [`TemplateCache`]{@link TemplateCache}).
     *
     * **Example:**
     *
     * Specifying a previously registered template by referring to its HTML `id` attribute:
     *
     * ```html
     * <div class="CoveoQuickview" data-template-id="myContentTemplateId"></div>
     * ```
     *
     * Specifying a previously registered template by referring to a CSS selector:
     *
     * ```html
     * <div class='CoveoQuickview' data-template-selector=".myContentTemplateSelector"></div>
     * ```
     *
     * If you do not specify a custom content template, the component uses its default template.
     */
    contentTemplate: ComponentOptions.buildTemplateOption({
      selectorAttr: 'data-template-selector',
      idAttr: 'data-template-id'
    }),
    loadingAnimation: ComponentOptions.buildOption<HTMLElement | Promise<HTMLElement>>(ComponentOptionsType.NONE, (element: HTMLElement) => {
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
    })
  };

  public static resultCurrentlyBeingRendered: IQueryResult = null;

  private modalbox: Coveo.ModalBox.ModalBox;

  /**
   * Creates a new `Quickview` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `Quickview` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   * @param ModalBox The quickview modal box.
   */
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
      let captionForQuickview = $$(
        'div',
        { className: 'coveo-caption-for-icon', tabindex: 0 },
        'Quickview'.toLocaleString()
      ).el;
      let div = $$('div');
      div.append(iconForQuickview.el);
      div.append(captionForQuickview);
      $$(this.element).append(div.el);
    }

    this.bindClick(result);
    if (this.bindings.resultElement) {
      this.bind.on(this.bindings.resultElement, ResultListEvents.openQuickview, () => this.open());
    }
  }

  /**
   * Opens the `Quickview` modal box.
   */
  public open() {
    if (this.modalbox == null) {
      // To prevent the keyboard from opening on mobile if the search bar has focus
      Quickview.resultCurrentlyBeingRendered = this.result;
      $$(<HTMLElement>document.activeElement).trigger('blur');

      let openerObject = this.prepareOpenQuickviewObject();
      this.createModalBox(openerObject).then(() => {
        this.bindQuickviewEvents(openerObject);
        this.animateAndOpen();
        this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, this.getHashId());
        Quickview.resultCurrentlyBeingRendered = null;
      });
    }
  }

  /**
   * Closes the `Quickview` modal box.
   */
  public close() {
    if (this.modalbox != null) {
      this.modalbox.close();
      this.modalbox = null;
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

    $$(this.modalbox.content).on(QuickviewEvents.quickviewLoaded, () => {
      if (openerObject.loadingAnimation instanceof HTMLElement) {
        $$(openerObject.loadingAnimation).remove();
      } else if (openerObject.loadingAnimation instanceof Promise) {
        openerObject.loadingAnimation.then((anim) => {
          $$(anim).remove();
        });
      }
    });
  }

  private animateAndOpen() {
    let quickviewDocument = $$(this.modalbox.modalBox).find('.' + Component.computeCssClassName(QuickviewDocument));
    if (quickviewDocument) {
      Initialization.dispatchNamedMethodCallOrComponentCreation('open', quickviewDocument, null);
    }
  }

  private createModalBox(openerObject: IQuickviewOpenerObject) {
    let computedModalBoxContent = $$('div');
    return openerObject.content.then((builtContent) => {
      computedModalBoxContent.append(builtContent.el);
      this.modalbox = this.ModalBox.open(computedModalBoxContent.el, {
        title: DomUtils.getQuickviewHeader(this.result, {
          showDate: this.options.showDate,
          title: this.options.title
        }, this.bindings).el.outerHTML,
        className: 'coveo-quick-view',
        validation: () => {
          this.closeQuickview();
          return true;
        },
        body: this.element.ownerDocument.body,
        sizeMod: 'big'
      });
      this.setQuickviewSize();
      return computedModalBoxContent;
    });
  }

  private prepareOpenQuickviewObject() {
    let loadingAnimation = this.options.loadingAnimation;
    return {
      loadingAnimation: loadingAnimation,
      content: this.prepareQuickviewContent(loadingAnimation)
    };
  }

  private prepareQuickviewContent(loadingAnimation: HTMLElement | Promise<HTMLElement>): Promise<Dom> {
    return this.options.contentTemplate.instantiateToElement(this.result).then((built: HTMLElement) => {
      let content = $$(built);

      let initOptions = this.searchInterface.options;
      let initParameters: IInitializationParameters = {
        options: initOptions,
        bindings: this.getBindings(),
        result: this.result
      };
      return Initialization.automaticallyCreateComponentsInside(content.el, initParameters).initResult.then(() => {
        if (content.find('.' + Component.computeCssClassName(QuickviewDocument)) != undefined && this.options.enableLoadingAnimation) {
          if (loadingAnimation instanceof HTMLElement) {
            content.prepend(loadingAnimation);
          } else if (loadingAnimation instanceof Promise) {
            loadingAnimation.then((anim) => {
              content.prepend(anim);
            });
          }
        }
        return content;
      });
    });
  }

  private closeQuickview() {
    this.queryStateModel.set(QueryStateModel.attributesEnum.quickview, '');
  }

  private setQuickviewSize() {
    let wrapper = $$($$(this.modalbox.modalBox).find('.coveo-modal-content'));
    wrapper.el.style.width = this.options.size;
    wrapper.el.style.height = this.options.size;
    wrapper.el.style.maxWidth = this.options.size;
    wrapper.el.style.maxHeight = this.options.size;
  }
}
Initialization.registerAutoCreateComponent(Quickview);
