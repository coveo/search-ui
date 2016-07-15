import {Component} from '../Base/Component'
import {ComponentOptions} from '../Base/ComponentOptions'
import {ComponentOptionsModel} from '../../models/ComponentOptionsModel'
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings'
import {analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta'
import {IResultLinkOptions} from './ResultLinkOptions'
import {ResultListEvents} from '../../events/ResultListEvents'
import {HighlightUtils} from '../../utils/HighlightUtils'
import {IQueryResult} from '../../rest/QueryResult'
import {DeviceUtils} from '../../utils/DeviceUtils'
import {OS_NAME, OSUtils} from '../../utils/OSUtils'
import {Initialization} from '../Base/Initialization'
import {QueryUtils} from '../../utils/QueryUtils'
import {Assert} from '../../misc/Assert'
import {Utils} from '../../utils/Utils'
import {Defer} from '../../misc/Defer'
import {$$} from '../../utils/Dom'

/**
 * This component is intended to be placed inside a @link{ResultTemplate}, which itself is used inside a ResultList component. 
 * The ResultLink component automatically transforms a search result title into a clickable link that points to the original document.
 */
export class ResultLink extends Component {
  static ID = 'ResultLink';

  /**
   * The options for the ResultLink
   * @componentOptions
   */
  static options = <IResultLinkOptions>{

    /**
     * Specifies the field that the result link uses to output its href. 
     * By default, the clickUri available on the document is used, but you can override this with this option.
     * Tip:
     * When you do not include a field option, in your result template, you can include an href attribute on the <a class='CoveoResultLink'> element. When present, the href attribute value overrides the clickUri that is otherwise taken by default.
     * Specifying an href attribute is useful when you want to build the result link using a custom script or by concatenating the content of two or more variables.
     */
    field: ComponentOptions.buildFieldOption(),

    /**
     * Specifies whether the result link tries to open in Microsoft Outlook. This is normally intended for ResultLink related to Microsoft Exchange emails.
     * Default value is false.
     */
    openInOutlook: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether the result link should open in the Quick View rather than loading through the original URL.
     * Default value is false.
     */
    openQuickview: ComponentOptions.buildBooleanOption(),

    /**
     * Specifies whether the result link always opens in a new window ( <a target='_blank' /> ).
     * Default is false
     */
    alwaysOpenInNewWindow: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies a template string to use to generate the href.
     * It is possible to reference fields from the associated result:
     * Ex: '${clickUri}?id=${title}' will generate something like 'http://uri.com?id=documentTitle'
     * Or from the global scope:
     * Ex: '${window.location.hostname}/{Foo.Bar} will generate something like 'localhost/fooBar'
     * This option will override the field option.
     * Default is undefined
     */
    hrefTemplate: ComponentOptions.buildStringOption()
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

  constructor(public element: HTMLElement, public options?: IResultLinkOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult, public os?: OS_NAME) {
    super(element, ResultLink.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultLink, options);
    this.options = _.extend({}, this.options, this.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.resultLink))
    this.result = result || this.resolveResult();

    if (this.options.openQuickview == null) {
      this.options.openQuickview = result.raw['connectortype'] == 'ExchangeCrawler' && DeviceUtils.isMobileDevice();
    }

    Assert.exists(this.componentOptionsModel);
    Assert.exists(this.result);

    if (!this.quickviewShouldBeOpened()) {
      // We assume that anytime the contextual menu is opened on a result link
      // this is do "open in a new tab" or something similar.
      // This is not 100% accurate, but we estimate it to be the lesser of 2 evils (not logging anything)
      $$(element).on('contextmenu', () => {
        this.logOpenDocument();
      })
      $$(element).on('click', () => {
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
      $$(this.element).on('click', (e: Event) => {
        this.options.onClick.call(this, e, this.result)
      });
      return true;
    } else {
      return false;
    }
  }

  private bindOpenQuickviewIfNotUndefined() {
    if (this.quickviewShouldBeOpened()) {
      $$(this.element).on('click', (e: Event) => {
        e.preventDefault();
        $$(this.bindings.resultElement).trigger(ResultListEvents.openQuickview)
      });
      return true;
    } else {
      return false;
    }
  }

  private openLinkThatIsNotAnAnchor() {
    if (!this.elementIsAnAnchor()) {
      $$(this.element).on('click', (ev: Event) => {
        if (this.options.alwaysOpenInNewWindow) {
          if (this.options.openInOutlook) {
            this.openLinkInOutlook();
          } else {
            this.openLinkInNewWindow();
          }
        } else {
          this.openLink();
        }
      });
      return true;
    }
    return false;
  }

  /**
   * Opens the result
   */
  public openLink() {
    window.location.href = this.getResultUri();
  }

  /**
   * Opens the result in a new window
   */
  public openLinkInNewWindow() {
    window.open(this.getResultUri(), '_blank');
  }

  /**
   * Opens the result in outlook if the result has an outlook field.
   */
  public openLinkInOutlook() {
    if (this.hasOutlookField()) {
      this.openLink();
    }
  }

  private setHrefIfNotAlready() {
    // Do not erase any value put in href by the template, etc. Allows
    // using custom click urls while still keeping analytics recording
    // and other behavior brought by the component.
    if (this.elementIsAnAnchor() && !Utils.isNonEmptyString($$(this.element).getAttribute('href'))) {
      $$(this.element).setAttribute('href', this.getResultUri());
      if (this.options.alwaysOpenInNewWindow && !(this.options.openInOutlook && this.hasOutlookField())) {
        $$(this.element).setAttribute('target', '_blank');
      }
      return true;
    } else {
      return false;
    }
  }

  private logOpenDocument = _.debounce(() => {
    this.queryController.saveLastQuery();
    let documentURL = $$(this.element).getAttribute('href');
    if (documentURL == undefined || documentURL == '') {
      documentURL = this.result.clickUri;
    }
    this.usageAnalytics.logClickEvent(analyticsActionCauseList.documentOpen, {
      documentURL: documentURL,
      documentTitle: this.result.title,
      author: this.result.raw.author
    }, this.result, this.root);
    Defer.flush();
  }, 1500, true);

  private getResultUri(): string {
    if (this.options.hrefTemplate) {
      return this.parseHrefTemplate();
    }
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
    return this.element.tagName == 'A'
  }

  private setField() {
    let os = Utils.exists(this.os) ? this.os : OSUtils.get();
    if (os == OS_NAME.MACOSX && this.hasOutlookField()) {
      this.options.field = '@outlookformacuri'
    } else if (os == OS_NAME.WINDOWS && this.hasOutlookField()) {
      this.options.field = '@outlookuri';
    }
  }

  private hasOutlookField() {
    let os = Utils.exists(this.os) ? this.os : OSUtils.get();
    if (os == OS_NAME.MACOSX && this.result.raw['outlookformacuri'] != undefined) {
      return true;
    } else if (os == OS_NAME.WINDOWS && this.result.raw['outlookuri'] != undefined) {
      return true;
    }
    return false;
  }

  private isUriThatMustBeOpenedInQuickview(): boolean {
    return this.result.clickUri.toLowerCase().indexOf('ldap://') == 0;
  }

  private quickviewShouldBeOpened() {
    return (this.options.openQuickview || this.isUriThatMustBeOpenedInQuickview()) && QueryUtils.hasHTMLVersion(this.result);
  }

  private parseHrefTemplate(): string {
    return this.options.hrefTemplate.replace(/\$\{(.*?)\}/g, (value: string) => {
      let key = value.substring(2, value.length - 1);
      let newValue = this.readFromObject(this.result, key);
      if (!newValue) {
        newValue = this.readFromObject(window, key);
      }
      return newValue || value;
    });
  }

  private readFromObject(object: Object, key: string): string {
    if (object && key.indexOf('.') !== -1) {
      let newKey = key.substring(key.indexOf('.') + 1);
      key = key.substring(0, key.indexOf('.'));
      return this.readFromObject(object[key], newKey);
    }
    return object ? object[key] : undefined;
  }
}

Initialization.registerAutoCreateComponent(ResultLink);
