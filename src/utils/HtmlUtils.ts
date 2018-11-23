import { IQueryResult } from '../rest/QueryResult';
import { SearchEndpoint } from '../rest/SearchEndpoint';
import * as _ from 'underscore';

/**
 * Options for building an `<a>` tag.
 */
export interface IAnchorUtilsOptions {
  /**
   * The tag's text content.
   */
  text?: string;
  /**
   * The target (`href` attribute).
   */
  target?: string;
  /**
   * The CSS class(es) of the tag.
   */
  class?: string;
}

/**
 * Options for building an `<img>` tag.
 */
export interface IImageUtilsOptions {
  /**
   * The alternative text for the image (`alt` attribute).
   */
  alt?: string;
  /**
   * The height of the image
   */
  height?: string;
  /**
   * The width of the image
   */
  width?: string;
}

export class HTMLUtils {
  static buildAttributeString(options: any): string {
    var ret = [];
    _.each(options, (val: any, key?: string, obj?) => {
      if (val != undefined) {
        ret.push(key + '=' + JSON.stringify(val.toString()));
      }
    });
    return ret.join(' ');
  }
}

export class AnchorUtils {
  static buildAnchor(href: string, options?: IAnchorUtilsOptions) {
    var text;
    if (!options || !options.text) {
      text = href;
    } else {
      text = options.text;
      options.text = undefined;
    }
    return `<a href='${href}' ${HTMLUtils.buildAttributeString(options)}>${text}</a>`;
  }
}

export class ImageUtils {
  static buildImage(src?: string, options?: IImageUtilsOptions) {
    var ret = '<img ';
    ret += src ? `src='${src}' ` : '';
    ret += HTMLUtils.buildAttributeString(options) + '/>';
    return ret;
  }

  static selectImageFromResult(result: IQueryResult): HTMLElement {
    return <HTMLElement>document.querySelector(`img[data-coveo-uri-hash=${result.raw['urihash']}]`);
  }

  static buildImageWithDirectSrcAttribute(endpoint: SearchEndpoint, result: IQueryResult) {
    var image = new Image();
    var dataStreamUri = endpoint.getViewAsDatastreamUri(result.uniqueId, '$Thumbnail$', { contentType: 'image/png' });
    image.onload = () => {
      ImageUtils.selectImageFromResult(result).setAttribute('src', dataStreamUri);
    };
    image.src = dataStreamUri;
  }

  static buildImageWithBase64SrcAttribute(endpoint: SearchEndpoint, result: IQueryResult) {
    endpoint
      .getRawDataStream(result.uniqueId, '$Thumbnail$')
      .then(response => {
        var rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
        ImageUtils.selectImageFromResult(result).setAttribute('src', 'data:image/png;base64, ' + btoa(rawBinary));
      })
      .catch(() => {
        ImageUtils.selectImageFromResult(result).remove();
      });
  }

  static buildImageFromResult(result: IQueryResult, endpoint: SearchEndpoint, options?: IImageUtilsOptions) {
    options = options ? options : <IImageUtilsOptions>{};

    let img = ImageUtils.buildImage(undefined, _.extend(options, { 'data-coveo-uri-hash': result.raw['urihash'] }));
    if (endpoint.isJsonp()) {
      // For jsonp we can't GET/POST for binary data. We are limited to only setting the src attribute directly on the img.
      ImageUtils.buildImageWithDirectSrcAttribute(endpoint, result);
    } else {
      // Base 64 img allows us to GET/POST the image as raw binary, so that we can also pass the credential of the user
      // Useful for phonegap.
      ImageUtils.buildImageWithBase64SrcAttribute(endpoint, result);
    }
    return img;
  }
}
