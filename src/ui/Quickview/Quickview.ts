/// <reference path='../../../node_modules/modal-box/bin/ModalBox.d.ts' />

import {Component} from '../Base/Component';
import {ComponentOptions, Type} from '../Base/ComponentOptions';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {Template} from '../Templates/Template';
import {DomUtils} from '../../utils/DomUtils';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {IQueryResult} from '../../rest/QueryResult';
import {$$, Dom} from '../../utils/Dom';
import {DefaultQuickviewTemplate} from './DefaultQuickviewTemplate';
import {ResultListEvents} from '../../events/ResultListEvents';
import {StringUtils} from '../../utils/StringUtils';
import {QuickviewDocument} from './QuickviewDocument';
import {QueryStateModel} from '../../models/QueryStateModel';
import {Model} from '../../models/Model';
import {QuickviewEvents} from '../../events/QuickviewEvents';
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {KEYBOARD} from '../../utils/KeyboardUtils';

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
  content: Dom;
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
    loadingAnimation: ComponentOptions.buildOption<HTMLElement>(Type.NONE, (element: HTMLElement) => {
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
    size: ComponentOptions.buildStringOption({ defaultValue: DeviceUtils.isMobileDevice() ? '100%' : '95%' })
  };

  private link: Dom;
  private modalbox: Coveo.ModalBox.ModalBox;
  private bindedHandleEscapeEvent = this.handleEscapeEvent.bind(this);

  constructor(public element: HTMLElement, public options?: QuickviewOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
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
    this.bind.on($$(this.bindings.resultElement), ResultListEvents.openQuickview, () => this.open());
  }

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

  public getHashId() {
    return this.result.queryUid + '.' + this.result.index + '.' + StringUtils.hashCode(this.result.uniqueId);
  }

  public close() {
    if (this.modalbox != null) {
      this.modalbox.close();
      this.modalbox = null;
      $$(document.body).off('keyup', this.bindedHandleEscapeEvent);
    }
  }

  private bindClick(result: IQueryResult) {
    if (typeof result.hasHtmlVersion == 'undefined' || result.hasHtmlVersion || this.options.alwaysShow) {
      $$(this.element).on('click', () => this.open());
    } else {
      this.element.style.display = 'none';
    }
  }

  private bindQuickviewEvents(openerObject: QuickviewOpenerObject) {

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

  private createModalBox(openerObject: QuickviewOpenerObject) {

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
