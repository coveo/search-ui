import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { ResultLink } from '../ResultLink/ResultLink';
import { IQueryResult } from '../../rest/QueryResult';
import { QueryUtils } from '../../utils/QueryUtils';
import { Initialization } from '../Base/Initialization';
import { ISearchEndpoint } from '../../rest/SearchEndpointInterface';
import { $$ } from '../../utils/Dom';
import { get } from '../Base/RegisteredNamedMethods';
import { IResultLinkOptions } from '../ResultLink/ResultLinkOptions';
import FieldTableModule = require('../FieldTable/FieldTable');
import { Icon } from '../Icon/Icon';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

export interface IThumbnailOptions extends IResultLinkOptions {
  noThumbnailClass?: string;
  clickable?: boolean;
}

/**
 * The Thumbnail component automatically fetches the thumbnail of the result object and outputs an HTML `img` tag with
 * it.
 * @notSupportedIn salesforcefree
 */
export class Thumbnail extends Component {
  static ID = 'Thumbnail';

  static doExport = () => {
    exportGlobally({
      Thumbnail: Thumbnail
    });
  };

  /**
   * Options for the Thumbnail
   * @componentOptions
   */
  static options: IThumbnailOptions = {
    /**
     * Specifies the CSS class to use on the `img` tag that the Thumbnail component outputs when a result has no
     * thumbnail in the index.
     *
     * Default value is `coveo-no-thumbnail`.
     */
    noThumbnailClass: ComponentOptions.buildStringOption({ defaultValue: 'coveo-no-thumbnail' }),

    /**
     * Specifies whether to create a clickable {@link ResultLink} around the Thumbnail.
     *
     * Default value is `false`.
     *
     * If set to true, you can use the options specified on {@link ResultLink.options}
     */
    clickable: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  static parent = ResultLink;

  public img: HTMLImageElement;

  /**
   * Creates a new Thumbnail component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Thumbnail component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options?: IThumbnailOptions,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, Thumbnail.ID, bindings);

    this.options = ComponentOptions.initOptions(element, <any>Thumbnail.options, options);

    if (this.element.tagName.toLowerCase() != 'img') {
      this.img = <HTMLImageElement>$$('img').el;
      this.element.appendChild(this.img);
    } else {
      this.img = <HTMLImageElement>this.element;
    }

    if (this.options.clickable) {
      if (this.element.tagName.toLowerCase() != 'img') {
        new ResultLink(this.element, this.options, this.bindings, this.result);
      } else {
        let href = $$('a');
        $$(this.element).replaceWith(href.el);
        $$(href).append(this.element);
        new ResultLink(href.el, this.options, this.bindings, this.result);
      }
    }

    // We need to set src to a blank image right away to avoid the image from
    // changing size once it's loaded. Also, doing this prevents a border from
    // appearing on some browsers when there is no thumbnail. I've found no other
    // way to get rid of it...
    this.img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

    if (QueryUtils.hasThumbnail(result)) {
      this.buildThumbnailImage();
    } else {
      this.logger.info('Result has no thumbnail. Cannot build thumbnail image, instanciating an Icon component instead.');
      new Icon(element, { small: true }, bindings, result);
    }
  }

  private buildThumbnailImage() {
    let endpoint = this.bindings.queryController.getEndpoint();

    if (endpoint.isJsonp()) {
      // For jsonp we can't GET/POST for binary data. We are limited
      // to only setting the src attribute directly on the img.
      this.buildImageWithDirectSrcAttribute(endpoint);
    } else {
      // Base 64 img allows us to GET/POST the image as raw binary, so that we can also
      // pass the credential of the user. Useful for phonegap among others.
      this.buildImageWithBase64SrcAttribute(endpoint);
    }
  }

  private buildImageWithDirectSrcAttribute(endpoint: ISearchEndpoint) {
    let dataStreamUri = endpoint.getViewAsDatastreamUri(this.result.uniqueId, '$Thumbnail$', {
      contentType: 'image/png'
    });
    this.img.setAttribute('src', dataStreamUri);
    this.resizeContainingFieldTable();
  }

  private buildImageWithBase64SrcAttribute(endpoint: ISearchEndpoint) {
    endpoint
      .getRawDataStream(this.result.uniqueId, '$Thumbnail$')
      .then(response => {
        let rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
        this.img.setAttribute('src', 'data:image/png;base64, ' + btoa(rawBinary));
        this.resizeContainingFieldTable();
      })
      .catch(() => {
        this.setEmptyThumbnailClass();
      });
  }

  private resizeContainingFieldTable() {
    let closestFieldTableElement = $$(this.element).closest(Component.computeCssClassNameForType('FieldTable'));
    if (closestFieldTableElement != null) {
      let fieldTable = <FieldTableModule.FieldTable>get(closestFieldTableElement);
      fieldTable.updateToggleHeight();
    }
  }

  private setEmptyThumbnailClass() {
    $$(this.img).addClass(this.options.noThumbnailClass);
  }
}

Thumbnail.options = _.extend({}, ResultLink.options, Thumbnail.options);

Initialization.registerAutoCreateComponent(Thumbnail);
