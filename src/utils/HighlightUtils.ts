import { Utils } from './Utils';
import { IHighlight } from '../rest/Highlight';
import { Assert } from '../misc/Assert';
import * as _ from 'underscore';

export interface IStringHole {
  begin: number;
  size: number;
  replacementSize: number;
}

export class StringAndHoles {
  value: string;
  holes: IStringHole[];

  static SHORTEN_END: string = '...';
  static WORD_SHORTER: number = 10;

  static replace(str: string, find: string, replace: string): StringAndHoles {
    const strAndHoles = new StringAndHoles();

    if (Utils.isNullOrEmptyString(str)) {
      return strAndHoles;
    }

    let index = str.lastIndexOf(find);
    if (index == -1) {
      strAndHoles.value = str;
      return strAndHoles;
    }

    const holes: IStringHole[] = [];
    while (index >= 0) {
      const hole = <IStringHole>{
        begin: index,
        size: find.length,
        replacementSize: replace.length
      };
      holes.push(hole);
      str = str.slice(0, index) + replace + str.slice(index + find.length);
      index = str.lastIndexOf(find);
    }

    strAndHoles.holes = holes;
    strAndHoles.value = str;
    return strAndHoles;
  }

  /**
   * Shorten the passed path intelligently (path-aware).
   * Works with *local paths* and *network paths*
   * @param uriOrig The path to shorten
   * @param length The length to which the path will be shortened.
   */
  static shortenPath(uriOrig: string, length: number): StringAndHoles {
    const strAndHoles = new StringAndHoles();
    let uri = uriOrig;
    if (Utils.isNullOrEmptyString(uri) || uri.length <= length) {
      strAndHoles.value = uri;
      return strAndHoles;
    }

    const holes: IStringHole[] = [];

    let first = -1;
    if (Utils.stringStartsWith(uri, '\\\\')) {
      first = uri.indexOf('\\', first + 2);
    } else {
      first = uri.indexOf('\\');
    }

    if (first !== -1) {
      let removed = 0;
      let next = uri.indexOf('\\', first + 1);
      while (next !== -1 && uri.length - removed + StringAndHoles.SHORTEN_END.length > length) {
        removed = next - first - 1;
        next = uri.indexOf('\\', next + 1);
      }

      if (removed > 0) {
        uri = uri.slice(0, first + 1) + StringAndHoles.SHORTEN_END + uri.slice(removed);
        const hole = <IStringHole>{
          begin: first + 1,
          size: removed - StringAndHoles.SHORTEN_END.length,
          replacementSize: StringAndHoles.SHORTEN_END.length
        };
        holes.push(hole);
      }
    }

    if (uri.length > length) {
      const over = uri.length - length + StringAndHoles.SHORTEN_END.length;
      const start = uri.length - over;
      uri = uri.slice(0, start) + StringAndHoles.SHORTEN_END;
      const hole = <IStringHole>{
        begin: start,
        size: over,
        replacementSize: StringAndHoles.SHORTEN_END.length
      };
      holes.push(hole);
    }

    strAndHoles.holes = holes;
    strAndHoles.value = uri;
    return strAndHoles;
  }

  /**
   * Shorten the passed string.
   * @param toShortenOrig The string to shorten
   * @param length The length to which the string will be shortened.
   * @param toAppend The string to append at the end (usually, it is set to '...')
   */
  static shortenString(toShortenOrig: string, length: number = 200, toAppend?: string): StringAndHoles {
    const toShorten = toShortenOrig;
    toAppend = Utils.toNotNullString(toAppend);
    const strAndHoles = new StringAndHoles();
    if (Utils.isNullOrEmptyString(toShorten) || length <= toAppend.length) {
      strAndHoles.value = toShorten;
      return strAndHoles;
    }

    if (toShorten.length <= length) {
      strAndHoles.value = toShorten;
      return strAndHoles;
    }

    let str = toShorten;

    length = length - toAppend.length;
    str = str.slice(0, length);

    if (toShorten.charAt(str.length) !== ' ') {
      const pos = str.lastIndexOf(' ');
      if (pos !== -1 && str.length - pos < StringAndHoles.WORD_SHORTER) {
        str = str.slice(0, pos);
      }
    }
    const holes: IStringHole[] = [];
    holes[0] = <IStringHole>{
      begin: str.length,
      size: toShorten.length - str.length,
      replacementSize: toAppend.length
    };
    str += toAppend;
    strAndHoles.value = str;
    strAndHoles.holes = holes;
    return strAndHoles;
  }

  /**
   * Shorten the passed URI intelligently (path-aware).
   * @param toShortenOrig The URI to shorten
   * @param length The length to which the URI will be shortened.
   */
  static shortenUri(uri: string, length: number): StringAndHoles {
    const strAndHoles = new StringAndHoles();
    if (Utils.isNullOrEmptyString(uri) || uri.length <= length) {
      strAndHoles.value = uri;
      return strAndHoles;
    }

    const holes: IStringHole[] = [];

    let first = uri.indexOf('//');
    if (first !== -1) {
      first = uri.indexOf('/', first + 2);
    }

    if (first !== -1) {
      let removed = 0;
      let next = uri.indexOf('/', first + 1);
      while (next !== -1 && uri.length - removed + StringAndHoles.SHORTEN_END.length > length) {
        removed = next - first - 1;
        next = uri.indexOf('/', next + 1);
      }

      if (removed > 0) {
        uri = uri.slice(0, first + 1) + StringAndHoles.SHORTEN_END + uri.slice(first + 1 + removed);
        const hole = <IStringHole>{
          begin: first + 1,
          size: removed,
          replacementSize: StringAndHoles.SHORTEN_END.length
        };
        holes.push(hole);
      }
    }

    if (uri.length > length) {
      const over = uri.length - length + StringAndHoles.SHORTEN_END.length;
      const start = uri.length - over;
      uri = uri.slice(0, start) + StringAndHoles.SHORTEN_END;
      const hole = <IStringHole>{
        begin: start,
        size: over,
        replacementSize: StringAndHoles.SHORTEN_END.length
      };
      holes.push(hole);
    }

    strAndHoles.holes = holes;
    strAndHoles.value = uri;
    return strAndHoles;
  }
}

export class HighlightUtils {
  /**
   * Highlight the passed string using specified highlights and holes.
   * @param content The string to highlight items in.
   * @param highlights The highlighted positions to highlight in the string.
   * @param holes Possible holes which are used to skip highlighting.
   * @param cssClass The css class to use on the highlighting `span`.
   */
  static highlightString(content: string, highlights: IHighlight[], holes: IStringHole[], cssClass: string): string {
    Assert.isNotUndefined(highlights);
    Assert.isNotNull(highlights);
    Assert.isNonEmptyString(cssClass);
    if (Utils.isNullOrEmptyString(content)) {
      return content;
    }
    const maxIndex = content.length;
    let highlighted = '';
    let last = 0;
    for (let i = 0; i < highlights.length; i++) {
      const highlight = highlights[i];
      let start: number = highlight.offset;
      let end: number = start + highlight.length;

      if (holes !== null) {
        let skip = false;
        for (let j = 0; j < holes.length; j++) {
          const hole = holes[j];
          const holeBegin = hole.begin;
          const holeEnd = holeBegin + hole.size;
          if (start < holeBegin && end >= holeBegin && end < holeEnd) {
            end = holeBegin;
          } else if (start >= holeBegin && end < holeEnd) {
            skip = true;
            break;
          } else if (start >= holeBegin && start < holeEnd && end >= holeEnd) {
            start = holeBegin + hole.replacementSize;
            end -= hole.size - hole.replacementSize;
          } else if (start < holeBegin && end >= holeEnd) {
            end -= hole.size - hole.replacementSize;
          } else if (start >= holeEnd) {
            const offset = hole.size - hole.replacementSize;
            start -= offset;
            end -= offset;
          }
        }
        if (skip || start === end) {
          continue;
        }
      }

      if (end > maxIndex) {
        break;
      }

      highlighted += _.escape(content.slice(last, start));
      highlighted += `<span class="${cssClass}"`;
      if (highlight.dataHighlightGroup) {
        highlighted += ` data-highlight-group="${highlight.dataHighlightGroup.toString()}"`;
      }
      if (highlight.dataHighlightGroupTerm) {
        highlighted += ` data-highlight-group-term="${highlight.dataHighlightGroupTerm}"`;
      }
      highlighted += '>';
      highlighted += _.escape(content.slice(start, end));
      highlighted += '</span>';

      last = end;
    }
    if (last != maxIndex) {
      highlighted += _.escape(content.slice(last));
    }
    return highlighted;
  }
}
