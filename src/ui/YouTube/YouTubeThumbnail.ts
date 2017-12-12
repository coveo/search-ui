import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { ResultLink } from '../ResultLink/ResultLink';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { DomUtils } from '../../utils/DomUtils';
import { $$, Dom } from '../../utils/Dom';
import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { get } from '../Base/RegisteredNamedMethods';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { Utils } from '../../UtilsModules';

export interface IYouTubeThumbnailOptions {
  width: string;
  height: string;
  embed: boolean;
}

/**
 * The YouTubeThumbnail component automatically fetches the thumbnail of a YouTube video.
 *
 * This component differs from the standard {@link Thumbnail} component because the thumbnail it outputs is always
 * clickable.
 *
 * Depending on the component configuration, clicking a YouTube thumbnail can either automatically open a modal box
 * containing the `iframe` from YouTube, or open the target URL in the current window (see
 * {@link YouTubeThumbnail.options.embed}).
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class YouTubeThumbnail extends Component {
  static ID = 'YouTubeThumbnail';

  static doExport = () => {
    exportGlobally({
      YouTubeThumbnail: YouTubeThumbnail
    });
  };

  /**
   * @componentOptions
   */
  static options: IYouTubeThumbnailOptions = {
    /**
     * Specifies the width (in pixels) of the YouTube thumbnail.
     *
     * Default value is `200px`.
     */
    width: ComponentOptions.buildStringOption({ defaultValue: '200px' }),

    /**
     * Specifies the height (in pixels) of the YouTube thumbnail.
     *
     * Default value is `112px`.
     */
    height: ComponentOptions.buildStringOption({ defaultValue: '112px' }),

    /**
     * Specifies whether clicking on the YouTube thumbnail loads the video in a modal box.
     *
     * Setting this option to `false` causes the browser to change its current location to that of the target URL when
     * the end user clicks the YouTube thumbnail.
     *
     * Default value is `true`.
     */
    embed: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  public resultLink: Dom;

  private modalbox: Coveo.ModalBox.ModalBox;

  constructor(
    public element: HTMLElement,
    public options?: IYouTubeThumbnailOptions,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult,
    public ModalBox = ModalBoxModule
  ) {
    super(element, YouTubeThumbnail.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, YouTubeThumbnail, options);
    this.resultLink = $$('a');
    this.resultLink.addClass(Component.computeCssClassName(ResultLink));

    let thumbnailDiv = $$('div');
    thumbnailDiv.addClass('coveo-youtube-thumbnail-container');
    this.resultLink.append(thumbnailDiv.el);

    let img = $$('img');
    img.el.style.width = this.options.width;
    img.el.style.height = this.options.height;
    img.setAttribute('src', Utils.getFieldValue(this.result, 'ytthumbnailurl'));
    img.addClass('coveo-youtube-thumbnail-img');
    img.el.onerror = () => {
      const svgVideo = $$('div', {}, SVGIcons.icons.video).el;
      SVGDom.addStyleToSVGInContainer(svgVideo, {
        width: this.options.width
      });
      $$(img).remove();
      thumbnailDiv.append(svgVideo);
    };
    thumbnailDiv.append(img.el);

    let span = $$('span');
    span.addClass('coveo-youtube-thumbnail-play-button');
    thumbnailDiv.append(span.el);

    $$(this.element).append(this.resultLink.el);

    if (this.options.embed) {
      this.options = _.extend(this.options, {
        onClick: () => this.openYoutubeIframe()
      });
    }

    let initOptions = this.searchInterface.options.originalOptionsObject;
    let resultComponentBindings: IResultsComponentBindings = _.extend({}, this.getBindings(), {
      resultElement: element
    });
    let initParameters: IInitializationParameters = {
      options: _.extend({}, { initOptions: { ResultLink: options } }, initOptions),
      bindings: resultComponentBindings,
      result: result
    };
    Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  /**
   * Open the result link embedded in this component.
   *
   * With a standard configuration of this component, this will open an iframe that automatically plays the video.
   */
  public openResultLink() {
    let resultLinkComponent = <ResultLink>get(this.resultLink.el);
    resultLinkComponent.openLinkAsConfigured();
  }

  private openYoutubeIframe() {
    // need to put iframe inside div : iframe with position absolute and left:0, right : 0 , bottom: 0 is not standard/supported
    let iframe = $$('iframe'),
      div = $$('div');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.extractVideoId() + '?autoplay=1');
    iframe.setAttribute('allowfullscreen', 'allowfullscreen');
    iframe.setAttribute('webkitallowfullscreen', 'webkitallowfullscreen');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');

    div.append(iframe.el);

    this.modalbox = this.ModalBox.open(div.el, {
      overlayClose: true,
      title: DomUtils.getQuickviewHeader(this.result, { showDate: true, title: this.result.title }, this.bindings).el.outerHTML,
      className: 'coveo-youtube-player',
      validation: () => true,
      body: this.element.ownerDocument.body,
      sizeMod: 'big'
    });

    $$($$(this.modalbox.wrapper).find('.coveo-quickview-close-button')).on('click', () => {
      this.modalbox.close();
    });
  }

  private extractVideoId() {
    return this.result.clickUri.split('watch?v=')[1];
  }
}
Initialization.registerAutoCreateComponent(YouTubeThumbnail);
