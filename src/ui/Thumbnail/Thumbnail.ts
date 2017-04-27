import {Component} from '../Base/Component'
import {ComponentOptions} from '../Base/ComponentOptions'
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings'
import {ResultLink} from '../ResultLink/ResultLink'
import {IQueryResult} from '../../rest/QueryResult'
import {QueryUtils} from '../../utils/QueryUtils'
import {DeviceUtils} from '../../utils/DeviceUtils'
import {Initialization} from '../Base/Initialization'
import {ISearchEndpoint} from '../../rest/SearchEndpointInterface'
import {$$} from '../../utils/Dom'

export interface IThumbnailOptions {
  noThumbnailClass?: string;
  clickable?: boolean;
}

/**
 * This component automatically fetches the thumbnail of the result object
 * and formats an HTML image tag (<code>img</code>) with it.
 */
export class Thumbnail extends Component {
  static ID = 'Thumbnail';

  /**
   * Options for the Thumbnail
   * @componentOptions
   */
  static options: IThumbnailOptions = {
    /**
     * Specifies the CSS class to use on the thumbnail image tag when a result
     * has no thumbnail in the index.<br/>
     * Default value: <code>coveo-no-thumbnail</code>
     */
    noThumbnailClass: ComponentOptions.buildStringOption({ defaultValue: 'coveo-no-thumbnail' }),
    /**
     * Specifies if a clickable {@link ResultLink} is to be created around the Thumbnail.<br/>
     * Uses all the same options as as {@link ResultLink} except <code>field</code><br/>
     * Default value is <code>false</code>
     */
    clickable: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  static parent = ResultLink;

  static fields = [
    'outlookformacuri',
    'outlookuri',
    'connectortype',
    'urihash',  //     ⎫
    'collection', //   ⎬--- analytics
    'source' //        ⎭
  ]

  /**
   * Create a new Thumbnail component
   * @param element
   * @param options
   * @param bindings
   * @param result
   */
  constructor(public element: HTMLElement, public options?: IThumbnailOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
    super(element, Thumbnail.ID, bindings);

    this.options = ComponentOptions.initOptions(element, <any>Thumbnail.options, options);

    if (this.options.clickable) {
      new ResultLink(this.element, this.options, this.bindings, this.result);
    }


    // We need to set src to a blank image right away to avoid the image from
    // changing size once it's loaded. Also, doing this prevents a border from
    // appearing on some browsers when there is no thumbnail. I've found no other
    // way to get rid of it...
    this.element.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

    if (QueryUtils.hasThumbnail(result)) {
      this.buildThumbnailImage();
    } else {
      this.setEmptyThumbnailClass();
    }
  }

  private buildThumbnailImage() {
    let endpoint = this.bindings.queryController.getEndpoint();

    if (endpoint.isJsonp() || DeviceUtils.isIE8or9()) {
      // For jsonp and IE8-9 (XDomain) we can't GET/POST for binary data. We are limited
      // to only setting the src attribute directly on the img.
      this.buildImageWithDirectSrcAttribute(endpoint);
    } else {
      // Base 64 img allows us to GET/POST the image as raw binary, so that we can also
      // pass the credential of the user. Useful for phonegap among others.
      this.buildImageWithBase64SrcAttribute(endpoint);
    }
  }

  private buildImageWithDirectSrcAttribute(endpoint: ISearchEndpoint) {
    let dataStreamUri = endpoint.getViewAsDatastreamUri(this.result.uniqueId, '$Thumbnail$', { contentType: 'image/png' });
    this.element.setAttribute('src', dataStreamUri);
  }

  private buildImageWithBase64SrcAttribute(endpoint: ISearchEndpoint) {
    endpoint.getRawDataStream(this.result.uniqueId, '$Thumbnail$')
      .then((response) => {
        let rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
        this.element.setAttribute('src', 'data:image/png;base64, ' + btoa(rawBinary));
      })
      .catch(() => {
        this.setEmptyThumbnailClass();
      })
  }

  private setEmptyThumbnailClass() {
    $$(this.element).addClass(this.options.noThumbnailClass);
  }
}

Initialization.registerAutoCreateComponent(Thumbnail);
