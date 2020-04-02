import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { $$, Dom } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { get } from '../Base/RegisteredNamedMethods';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { ResultLink } from '../ResultLink/ResultLink';
import { AccessibleModal } from '../../utils/AccessibleModal';

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
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
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

  private modalbox: AccessibleModal;

  constructor(
    public element: HTMLElement,
    public options?: IYouTubeThumbnailOptions,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult,
    ModalBox = ModalBoxModule,
    private origin?: HTMLElement
  ) {
    super(element, YouTubeThumbnail.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, YouTubeThumbnail, options);

    this.resultLink = $$('a', {
      className: Component.computeCssClassName(ResultLink)
    });

    if (!origin) {
      this.origin = this.resultLink.el;
    }

    const thumbnailDiv = $$('div', {
      className: 'coveo-youtube-thumbnail-container'
    });

    this.resultLink.append(thumbnailDiv.el);

    const img = $$('img', {
      src: Utils.getFieldValue(this.result, 'ytthumbnailurl'),
      className: 'coveo-youtube-thumbnail-img',
      alt: this.result.title,
      title: this.result.title
    });

    img.el.style.width = this.options.width;
    img.el.style.height = this.options.height;
    img.el.onerror = () => {
      const svgVideo = $$('div', {}, SVGIcons.icons.video).el;
      SVGDom.addStyleToSVGInContainer(svgVideo, {
        width: this.options.width
      });
      $$(img).remove();
      thumbnailDiv.append(svgVideo);
    };
    thumbnailDiv.append(img.el);

    const span = $$('span', {
      className: 'coveo-youtube-thumbnail-play-button'
    });

    thumbnailDiv.append(span.el);

    $$(this.element).append(this.resultLink.el);

    Initialization.automaticallyCreateComponentsInsideResult(element, result, {
      ResultLink: this.options.embed ? { onClick: () => this.openYoutubeIframe() } : null
    });

    this.modalbox = new AccessibleModal('coveo-youtube-player', element.ownerDocument.body as HTMLBodyElement, ModalBox, {
      overlayClose: true
    });
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
    const iframe = $$('iframe', {
      src: `https://www.youtube.com/embed/${this.extractVideoId()}?autoplay=1`,
      allowfullscreen: 'allowfullscreen',
      width: '100%',
      height: '100%',
      title: this.result.title
    });

    const div = $$('div');

    div.append(iframe.el);

    this.modalbox.openResult(this.result, { showDate: true, title: this.result.title }, this.bindings, div.el, () => true, this.origin);

    $$($$(this.modalbox.wrapper).find('.coveo-quickview-close-button')).on('click', () => {
      this.modalbox.close();
    });
  }

  private extractVideoId() {
    return this.result.clickUri.split('watch?v=')[1];
  }
}
Initialization.registerAutoCreateComponent(YouTubeThumbnail);
