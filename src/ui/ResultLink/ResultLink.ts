import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IResultLinkOptions } from './ResultLinkOptions';
import { ResultListEvents } from '../../events/ResultListEvents';
import { HighlightUtils } from '../../utils/HighlightUtils';
import { IQueryResult } from '../../rest/QueryResult';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { OS_NAME, OSUtils } from '../../utils/OSUtils';
import { Initialization } from '../Base/Initialization';
import { QueryUtils } from '../../utils/QueryUtils';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { Defer } from '../../misc/Defer';
import { $$ } from '../../utils/Dom';
import { StreamHighlightUtils } from '../../utils/StreamHighlightUtils';
import { StringUtils } from '../../utils/StringUtils';
import { once, debounce, extend, escape } from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_ResultLink';
import { AccessibleButton } from '../../utils/AccessibleButton';

/**
 * The `ResultLink` component automatically transform a search result title into a clickable link pointing to the
 * original item.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
export class ResultLink extends Component {
  static ID = 'ResultLink';

  static doExport = () => {
    exportGlobally({
      ResultLink: ResultLink
    });
  };

  /**
   * The options for the ResultLink
   * @componentOptions
   */
  static options: IResultLinkOptions = {
    /**
     * Specifies the field to use to output the component `href` attribute value.
     *
     * **Tip:**
     * > Instead of specifying a value for the `field` option, you can directly add an `href` attribute to the
     * > `ResultLink` HTML element. Then, you can use a custom script to generate the `href` value.
     *
     * **Examples:**
     * - With the following markup, the `ResultLink` outputs its `href` value using the `@uri` field (rather than the
     * default field):
     *
     * ```html
     * <a class="CoveoResultLink" data-field="@uri"></a>
     * ```
     *
     * - In the following result template, the custom `getMyKBUri()` function provides the `href` value:
     *
     * ```html
     * <script id="KnowledgeArticle" type="text/underscore" class="result-template">
     *   <div class='CoveoIcon>'></div>
     *   <a class="CoveoResultLink" href="<%= getMyKBUri(raw) %>"></a>
     *   <div class="CoveoExcerpt"></div>
     * </script>
     * ```
     *
     * See also [`hrefTemplate`]{@link ResultLink.options.hrefTemplate}, which can override this option.
     *
     * By default, the component uses the `@clickUri` field of the item to output the value of its `href` attribute.
     */
    field: ComponentOptions.buildFieldOption(),

    /**
     * Specifies whether the component should try to open its link in Microsoft Outlook.
     *
     * Setting this option to `true` is normally useful for `ResultLink` instances related to Microsoft Exchange emails.
     *
     * If this option is `true`, clicking the `ResultLink` calls the
     * [`openLinkInOutlook`]{@link ResultLink.openLinkInOutlook} method instead of the
     * [`openLink`]{@link ResultLink.openLink} method.
     *
     * Default value is `false`.
     */
    openInOutlook: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether the component should open its link in the [`Quickview`]{@link Quickview} component rather than
     * loading through the original URL.
     *
     * Default value is `false`.
     */
    openQuickview: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether the component should open its link in a new window instead of opening it in the current
     * context.
     *
     * If this option is `true`, clicking the `ResultLink` calls the
     * [`openLinkInNewWindow`]{@link ResultLink.openLinkInNewWindow} method instead of the
     * [`openLink`]{@link ResultLink.openLink} method.
     *
     * **Note:**
     * > If a search page contains a [`ResultPreferences`]{@link ResultsPreferences} component whose
     * > [`enableOpenInNewWindow`]{@link ResultsPreferences.options.enableOpenInNewWindow} option is `true`, and the end
     * > user checks the <b>Always open results in new window</b> box, `ResultLink` components in this page will always
     * > open their links in a new window when the end user clicks them, no matter what the value of their
     * > `alwaysOpenInNewWindow` option is.
     *
     * Default value is `false`.
     */
    alwaysOpenInNewWindow: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies a template literal from which to generate the `ResultLink` `href` attribute value (see
     * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
     *
     * This option overrides the [`field`]{@link ResultLink.options.field} option value.
     *
     * The template literal can reference any number of fields from the parent result. It can also reference global
     * scope properties.
     *
     * **Examples:**
     *
     * - The following markup generates an `href` value such as `http://uri.com?id=itemTitle`:
     *
     * ```html
     * <a class='CoveoResultLink' data-href-template='${clickUri}?id=${raw.title}'></a>
     * ```
     *
     * - The following markup generates an `href` value such as `localhost/fooBar`:
     *
     * ```html
     * <a class='CoveoResultLink' data-href-template='${window.location.hostname}/{Foo.Bar}'></a>
     * ```
     *
     * Default value is `undefined`.
     */
    hrefTemplate: ComponentOptions.buildStringOption(),

    /**
     * Specifies a template literal from which to generate the `ResultLink` display title (see
     * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
     *
     * This option overrides the default `ResultLink` display title behavior.
     *
     * The template literal can reference any number of fields from the parent result. However, if the template literal
     * references a key whose value is undefined in the parent result fields, the `ResultLink` title displays the
     * name of this key instead.
     *
     * This option is ignored if the `ResultLink` innerHTML contains any value.
     *
     * **Examples:**
     *
     * - The following markup generates a `ResultLink` display title such as `Case number: 123456` if both the
     * `raw.objecttype` and `raw.objectnumber` keys are defined in the parent result fields:
     *
     * ```html
     * <a class="CoveoResultLink" data-title-template="${raw.objecttype} number: ${raw.objectnumber}"></a>
     * ```
     *
     * - The following markup generates `${myField}` as a `ResultLink` display title if the `myField` key is undefined
     * in the parent result fields:
     *
     * ```html
     * <a class="CoveoResultLink" data-title-template="${myField}"></a>
     * ```
     *
     * - The following markup generates `Foobar` as a `ResultLink` display title, because the `ResultLink` innterHTML is
     * not empty:
     *
     * ```html
     * <a class="CoveoResultLink" data-title-template="${will} ${be} ${ignored}">Foobar</a>
     * ```
     *
     * Default value is `undefined`.
     *
     * @availablesince [January 2017 Release (v1.1865.9)](https://docs.coveo.com/en/396/#january-2017-release-v118659)
     */
    titleTemplate: ComponentOptions.buildStringOption(),

    /**
     * Specifies an event handler function to execute when the user clicks the `ResultLink` component.
     *
     * The handler function takes a JavaScript [`Event`](https://developer.mozilla.org/en/docs/Web/API/Event) object and
     * an [`IQueryResult`]{@link IQueryResult} as its parameters.
     *
     * Overriding the default behavior of the `onClick` event can allow you to execute specific code instead.
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Passing Component Options in the init Call](https://docs.coveo.com/en/346/#passing-component-options-in-the-init-call)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Passing Component Options Before the init Call](https://docs.coveo.com/en/346/#passing-component-options-before-the-init-call)).
     *
     * **Example:**
     * ```javascript
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *   ResultLink : {
     *     onClick : function(e, result) {
     *       e.preventDefault();
     *       // Custom code to execute with the item URI and title.
     *       openUriInASpecialTab(result.clickUri, result.title);
     *     }
     *   }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector('#search'), {
     * //   ResultLink : {
     * //     onClick : function(e, result) {
     * //       e.preventDefault();
     * //       // Custom code to execute with the item URI and title.
     * //       openUriInASpecialTab(result.clickUri, result.title);
     * //     }
     * //   }
     * // });
     * ```
     */
    onClick: ComponentOptions.buildCustomOption<(e: Event, result: IQueryResult) => any>(() => {
      return null;
    }),

    /**
     * Specify this option to log additional analytics when this result link is pressed.
     *
     * **Example:**
     * ```javascript
     * const resultLink = new Coveo.ResultLink(
     *   linkElement,
     *   {
     *     logAnalytics: (href) => Coveo.logCustomEvent(
     *         Coveo.analyticsActionCauseList.openSmartSnippetSource,
     *         {
     *           searchQueryUid: searchInterface.queryController.lastSearchUid,
     *           documentTitle: result.title,
     *           author: Utils.getFieldValue(result, 'author'),
     *           documentURL: href
     *         },
     *         element
     *       )
     *   },
     *   searchInterface.getBindings(),
     *   result
     * )
     * ```
     */
    logAnalytics: ComponentOptions.buildCustomOption<(href: string) => void>(() => null)
  };

  private toExecuteOnOpen: (e?: Event) => void;

  /**
   * Creates a new `ResultLink` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `ResultLink` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   * @param os
   */
  constructor(
    public element: HTMLElement,
    public options: IResultLinkOptions,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult,
    public os?: OS_NAME
  ) {
    super(element, ResultLink.ID, bindings);

    const globalOptions = this.searchInterface.options.originalOptionsObject[ResultLink.ID] || {};
    const initialOptions = ComponentOptions.initComponentOptions(element, ResultLink, { ...globalOptions, ...options });
    const resultLinkOptions = this.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.resultLink);
    this.options = extend({}, initialOptions, resultLinkOptions);

    this.result = result || this.resolveResult();

    if (this.options.openQuickview == null) {
      this.options.openQuickview = result.raw['connectortype'] == 'ExchangeCrawler' && DeviceUtils.isMobileDevice();
    }
    this.element.setAttribute('tabindex', '0');

    Assert.exists(this.componentOptionsModel);
    Assert.exists(this.result);

    if (!this.quickviewShouldBeOpened()) {
      // Bind on multiple "click" or "mouse" events.
      // Create a function that will be executed only once, so as not to log multiple events
      // Once a result link has been opened, and that we log at least one analytics event,
      // it should not matter if the end user open the same link multiple times with different methods.
      // It's still only one "click" event as far as UA is concerned.
      // Also need to handle "longpress" on mobile (the contextual menu), which we assume to be 1 s long.

      const executeOnlyOnce = once(() => this.logAnalytics());

      $$(element).on(['contextmenu', 'click', 'mousedown', 'mouseup'], executeOnlyOnce);
      let longPressTimer: number;
      $$(element).on('touchstart', () => {
        longPressTimer = window.setTimeout(executeOnlyOnce, 1000);
      });
      $$(element).on('touchend', () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
        }
      });
    }
    this.renderUri(element, result);
    this.bindEventToOpen();
  }
  public renderUri(element: HTMLElement, result?: IQueryResult) {
    if (/^\s*$/.test(this.element.innerHTML)) {
      const title = this.getDisplayedTitle();
      this.element.innerHTML = title;
      if (!this.element.title) {
        this.element.title = this.getDisplayedTitleAsText();
      }
    }
  }
  /**
   * Opens the result in the same window, no matter how the actual component is configured for the end user.
   * @param logAnalytics Specifies whether the method should log an analytics event.
   */
  public openLink(logAnalytics = true) {
    if (logAnalytics) {
      this.logAnalytics();
    }
    window.location.href = this.getResultUri();
  }

  /**
   * Opens the result in a new window, no matter how the actual component is configured for the end user.
   * @param logAnalytics Specifies whether the method should log an analytics event.
   */
  public openLinkInNewWindow(logAnalytics = true) {
    if (logAnalytics) {
      this.logAnalytics();
    }
    window.open(this.getResultUri(), '_blank');
  }

  /**
   * Tries to open the result in Microsoft Outlook if the result has an `outlookformacuri` or `outlookuri` field.
   *
   * Normally, this implies the result should be a link to an email.
   *
   * If the needed fields are not present, this method does nothing.
   * @param logAnalytics Specifies whether the method should log an analytics event.
   */
  public openLinkInOutlook(logAnalytics = true) {
    if (this.hasOutlookField()) {
      if (logAnalytics) {
        this.logAnalytics();
      }
      this.openLink();
    }
  }

  /**
   * Opens the link in the same manner the end user would.
   *
   * This essentially simulates a click on the result link.
   *
   * @param logAnalytics Specifies whether the method should log an analytics event.
   */
  public openLinkAsConfigured(logAnalytics = true) {
    if (this.toExecuteOnOpen) {
      if (logAnalytics) {
        this.logAnalytics();
      }
      this.toExecuteOnOpen();
    }
  }

  protected bindEventToOpen(): boolean {
    return (
      this.bindOnClickIfNotUndefined() ||
      this.bindOpenQuickviewIfNotUndefined() ||
      this.setHrefIfNotAlready() ||
      this.openLinkThatIsNotAnAnchor()
    );
  }

  private getDisplayedTitle() {
    if (!this.options.titleTemplate) {
      return this.result.title
        ? HighlightUtils.highlightString(this.result.title, this.result.titleHighlights, null, 'coveo-highlight')
        : this.escapedClickUri;
    } else {
      let newTitle = StringUtils.buildStringTemplateFromResult(this.options.titleTemplate, this.result);
      return newTitle
        ? StreamHighlightUtils.highlightStreamText(newTitle, this.result.termsToHighlight, this.result.phrasesToHighlight)
        : this.escapedClickUri;
    }
  }

  private getDisplayedTitleAsText() {
    const container = $$('div');
    container.setHtml(this.getDisplayedTitle());
    return container.text();
  }

  private get escapedClickUri() {
    return escape(this.result.clickUri);
  }

  private bindOnClickIfNotUndefined() {
    if (this.options.onClick != undefined) {
      this.toExecuteOnOpen = (e: MouseEvent) => {
        this.options.onClick.call(this, e, this.result);
      };

      new AccessibleButton()
        .withElement(this.element)
        .withLabel(this.result.title)
        .withSelectAction((e: Event) => this.toExecuteOnOpen(e))
        .build();

      return true;
    } else {
      return false;
    }
  }

  private bindOpenQuickviewIfNotUndefined() {
    if (this.quickviewShouldBeOpened()) {
      this.toExecuteOnOpen = () => {
        $$(this.bindings.resultElement).trigger(ResultListEvents.openQuickview);
      };

      $$(this.element).on('click', (e: Event) => {
        e.preventDefault();
        this.toExecuteOnOpen();
      });

      return true;
    } else {
      return false;
    }
  }

  private openLinkThatIsNotAnAnchor() {
    if (!this.elementIsAnAnchor()) {
      this.toExecuteOnOpen = () => {
        if (this.options.alwaysOpenInNewWindow) {
          if (this.options.openInOutlook) {
            this.openLinkInOutlook();
          } else {
            this.openLinkInNewWindow();
          }
        } else {
          this.openLink();
        }
      };

      $$(this.element).on('click', () => {
        this.toExecuteOnOpen();
      });

      return true;
    }
    return false;
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

  private logDocumentOpen(href: string) {
    this.usageAnalytics.logClickEvent(
      analyticsActionCauseList.documentOpen,
      {
        documentURL: href,
        documentTitle: this.result.title,
        author: Utils.getFieldValue(this.result, 'author')
      },
      this.result,
      this.root
    );
  }

  private logAnalytics = debounce(
    () => {
      this.queryController.saveLastQuery();
      let documentURL = $$(this.element).getAttribute('href');
      if (documentURL == undefined || documentURL == '') {
        documentURL = this.escapedClickUri;
      }
      if (this.options.logAnalytics) {
        this.options.logAnalytics(documentURL);
      } else {
        this.logDocumentOpen(documentURL);
      }
      Defer.flush();
    },
    1500,
    true
  );

  private filterProtocol(uri: string) {
    const isAbsolute = /^(https?|ftp|file|mailto|tel):/i.test(uri);
    const isRelative = /^(\/|\.\/|\.\.\/)/.test(uri);

    return isAbsolute || isRelative ? uri : '';
  }

  private getResultUri(): string {
    if (this.options.hrefTemplate) {
      const uri = StringUtils.buildStringTemplateFromResult(this.options.hrefTemplate, this.result);
      return this.filterProtocol(uri);
    }

    if (this.options.field == undefined && this.options.openInOutlook) {
      this.setField();
    }

    if (this.options.field != undefined) {
      return this.filterProtocol(Utils.getFieldValue(this.result, <string>this.options.field));
    }

    return this.filterProtocol(this.result.clickUri);
  }

  private elementIsAnAnchor() {
    return this.element.tagName == 'A';
  }

  private setField() {
    let os = Utils.exists(this.os) ? this.os : OSUtils.get();
    if (os == OS_NAME.MACOSX && this.hasOutlookField()) {
      this.options.field = '@outlookformacuri';
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
    return this.escapedClickUri.toLowerCase().indexOf('ldap://') == 0;
  }

  private quickviewShouldBeOpened() {
    return (this.options.openQuickview || this.isUriThatMustBeOpenedInQuickview()) && QueryUtils.hasHTMLVersion(this.result);
  }
}

Initialization.registerAutoCreateComponent(ResultLink);
