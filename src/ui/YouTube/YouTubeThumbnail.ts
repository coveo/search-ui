import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { ResultLink } from '../ResultLink/ResultLink';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { DomUtils } from '../../utils/DomUtils';
import { $$ } from '../../utils/Dom';
import { ModalBox } from '../../ExternalModulesShim';
import _ = require('underscore');

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

  static fields = [
    'ytthumbnailurl'
  ];

  private modalbox: Coveo.ModalBox.ModalBox;

  constructor(public element: HTMLElement, public options?: IYouTubeThumbnailOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
    super(element, YouTubeThumbnail.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, YouTubeThumbnail, options);
    let resultLink = $$('a');
    resultLink.addClass(Component.computeCssClassName(ResultLink));

    let thumbnailDiv = $$('div');
    thumbnailDiv.addClass('coveo-youtube-thumbnail-container');
    resultLink.append(thumbnailDiv.el);

    let img = $$('img');
    img.el.style.width = this.options.width;
    img.el.style.height = this.options.height;
    img.setAttribute('src', result.raw['ytthumbnailurl']);
    img.addClass('coveo-youtube-thumbnail-img');
    thumbnailDiv.append(img.el);

    let span = $$('span');
    span.addClass('coveo-youtube-thumbnail-play-button');
    thumbnailDiv.append(span.el);


    $$(this.element).append(resultLink.el);

    if (this.options.embed) {
      this.options = _.extend(this.options, {
        onClick: () => this.handleOnClick()
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

  private handleOnClick() {
    // need to put iframe inside div : iframe with position absolute and left:0, right : 0 , bottom: 0 is not standard/supported
    let iframe = $$('iframe'), div = $$('div');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.extractVideoId() + '?autoplay=1');
    iframe.setAttribute('allowfullscreen', 'allowfullscreen');
    iframe.setAttribute('webkitallowfullscreen', 'webkitallowfullscreen');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');

    div.append(iframe.el);

    this.modalbox = ModalBox.open(div.el, {
      overlayClose: true,
      title: DomUtils.getQuickviewHeader(this.result, { showDate: true, title: this.result.title }, this.bindings).el.outerHTML,
      className: 'coveo-quick-view coveo-youtube-player',
      validation: () => true,
      body: this.element.ownerDocument.body
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
