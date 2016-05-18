import {Utils} from './Utils';
import {IHighlight} from '../rest/Highlight';
import {Assert} from '../misc/Assert';
import _ = require('underscore');

export class Hole {
  constructor(public begin: number, public size: number, public replacementSize: number) {
  }
}

export class StringAndHoles {
  value: string;
  holes: Hole[];

  static SHORTEN_END: string = "...";
  static WORD_SHORTER: number = 10;

  static replace(str: string, find: string, replace: string): StringAndHoles {
    var strAndHoles = new StringAndHoles();

    if (Utils.isNullOrEmptyString(str)) {
      return strAndHoles;
    }

    var index = str.lastIndexOf(find);
    if (index == -1) {
      strAndHoles.value = str;
      return strAndHoles;
    }

    var holes: Hole[] = [];
    while (index >= 0) {
      var hole = new Hole(index, find.length, replace.length);
      holes.push(hole);
      str = str.slice(0, index) + replace + str.slice(index + find.length);
      index = str.lastIndexOf(find);
    }

    strAndHoles.holes = holes;
    strAndHoles.value = str;
    return strAndHoles;
  }

  static shortenPath(uriOrig: string, length: number): StringAndHoles {
    var uri = uriOrig;
    var strAndHoles = new StringAndHoles();

    if (Utils.isNullOrEmptyString(uri) || (uri.length <= length)) {
      strAndHoles.value = uri;
      return strAndHoles;
    }

    var holes: Hole[] = [];

    var first = -1;
    if (Utils.stringStartsWith(uri, "\\\\")) {
      first = uri.indexOf('\\', first + 2);
    } else {
      first = uri.indexOf('\\');
    }

    if (first != -1) {
      var removed = 0;
      var next = uri.indexOf('\\', first + 1);
      while (next != -1 && uri.length - removed + StringAndHoles.SHORTEN_END.length > length) {
        removed = next - first - 1;
        next = uri.indexOf('\\', next + 1);
      }

      if (removed > 0) {
        uri = uri.slice(0, first + 1) + StringAndHoles.SHORTEN_END + uri.slice(removed);
        var hole = new Hole(first + 1, removed - StringAndHoles.SHORTEN_END.length, StringAndHoles.SHORTEN_END.length);
        holes.push(hole);
      }
    }

    if (uri.length > length) {
      var over = uri.length - length + StringAndHoles.SHORTEN_END.length;
      var start = uri.length - over;
      uri = uri.slice(0, start) + StringAndHoles.SHORTEN_END;
      var hole = new Hole(start, over, StringAndHoles.SHORTEN_END.length);
      holes.push(hole);
    }

    strAndHoles.holes = holes;
    strAndHoles.value = uri;
    return strAndHoles;
  }

  static shortenString(toShortenOrig: string, length: number = 200, toAppend?: string): StringAndHoles {
    var toShorten = toShortenOrig
    toAppend = Utils.toNotNullString(toAppend);
    var strAndHoles = new StringAndHoles();
    if (Utils.isNullOrEmptyString(toShorten) || length <= toAppend.length) {
      strAndHoles.value = toShorten;
      return strAndHoles;
    }

    if (toShorten.length <= length) {
      strAndHoles.value = toShorten;
      return strAndHoles;
    }

    var str = toShorten;

    length = length - toAppend.length;
    str = str.slice(0, length);

    if (toShorten.charAt(str.length) != ' ') {
      var pos = str.lastIndexOf(' ');
      if (pos != -1 && str.length - pos < StringAndHoles.WORD_SHORTER) {
        str = str.slice(0, pos);
      }
    }
    var holes: Hole[] = [];
    holes[0] = new Hole(str.length, toShorten.length - str.length, toAppend.length);
    str += toAppend;
    strAndHoles.value = str;
    strAndHoles.holes = holes;
    return strAndHoles;
  }

  static shortenUri(uri: string, length: number): StringAndHoles {
    var strAndHoles = new StringAndHoles();
    if (Utils.isNullOrEmptyString(uri) || (uri.length <= length)) {
      strAndHoles.value = uri;
      return strAndHoles;
    }

    var holes: Hole[] = [];

    var first = uri.indexOf("//");
    if (first != -1) {
      first = uri.indexOf('/', first + 2);
    }

    if (first != -1) {
      var removed = 0;
      var next = uri.indexOf('/', first + 1);
      while (next != -1 && uri.length - removed + StringAndHoles.SHORTEN_END.length > length) {
        removed = next - first - 1;
        next = uri.indexOf('/', next + 1);
      }

      if (removed > 0) {
        uri = uri.slice(0, first + 1) + StringAndHoles.SHORTEN_END + uri.slice(first + 1 + removed);
        var hole = new Hole(first + 1, removed, StringAndHoles.SHORTEN_END.length);
        holes.push(hole);
      }
    }

    if (uri.length > length) {
      var over = uri.length - length + StringAndHoles.SHORTEN_END.length;
      var start = uri.length - over;
      uri = uri.slice(0, start) + StringAndHoles.SHORTEN_END;
      var hole = new Hole(start, over, StringAndHoles.SHORTEN_END.length);
      holes.push(hole);
    }

    strAndHoles.holes = holes;
    strAndHoles.value = uri;
    return strAndHoles;
  }
}

export class HighlightUtils {
  static highlightString(content: string, highlights: IHighlight[], holes: Hole[], cssClass: string): string {
    return HighlightUtils.buildHighlightedString(content, highlights, holes, cssClass);
  }

  static buildHighlightedString(content: string, highlights: IHighlight[], holes: Hole[], cssClass: string): string {
    Assert.isNotUndefined(highlights);
    Assert.isNotNull(highlights);
    Assert.isNonEmptyString(cssClass);
    if (Utils.isNullOrEmptyString(content)) {
      return content;
    }
    var last = 0;
    var maxIndex = content.length;
    var highlighted = "";
    for (var i = 0; i < highlights.length; i++) {
      var highlight = highlights[i];
      var start = highlight.offset;
      var end = start + highlight.length;

      if (holes != null) {
        var skip = false;
        for (var j = 0; j < holes.length; j++) {
          var hole = holes[j];
          var holeBegin = hole.begin;
          var holeEnd = holeBegin + hole.size;
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
            var offset = hole.size - hole.replacementSize;
            start -= offset;
            end -= offset;
          }
        }
        if (skip || start == end) {
          continue;
        }
      }

      if (end > maxIndex) {
        break;
      }

      highlighted += _.escape(content.slice(last, start));
      highlighted += "<span class='" + cssClass + "'"
      if (highlight.dataHighlightGroup) {
        highlighted += " data-highlight-group='" + highlight.dataHighlightGroup.toString() + "'";
      }
      if (highlight.dataHighlightGroupTerm) {
        highlighted += " data-highlight-group-term='" + highlight.dataHighlightGroupTerm + "'";
      }
      highlighted += " >";
      highlighted += _.escape(content.slice(start, end));
      highlighted += "</span>";

      last = end;
    }
    if (last != maxIndex) {
      highlighted += _.escape(content.slice(last));
    }
    return highlighted;
  }
}

var hightlightTemplate = _.template('<% var i = 0; var lowercaseValue = value.toLowerCase(); while(i < value.length) { %>' +
  '<% var index = lowercaseValue.indexOf(search, i); if(index != -1) { %>' +
  '<% if(i != index){ %> <span><%- value.substr(i, index) %></span><% } %>' +
  '<span class="coveo-hightlight"><%- value.substr(index, search.length) %></span>' +
  '<% i = index + search.length %></span>' +
  '<% } else { %>' +
  '<span><%- value.substr(i) %></span>' +
  '<% i = value.length; %>' +
  '<% } %>' +
  '<% } %>');

export function highlightString(value: string, search: string) {
  if (_.isEmpty(search)) {
    return value;
  }
  return hightlightTemplate({ value: value, search: search.toLowerCase() });
}
