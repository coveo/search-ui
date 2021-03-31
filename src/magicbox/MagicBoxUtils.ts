import _ = require('underscore');

export class MagicBoxUtils {
  static escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  static highlightText(
    text: string,
    highlight: string,
    ignoreCase = false,
    matchClass: string = 'magic-box-hightlight',
    doNotMatchClass: string = ''
  ) {
    if (highlight.length == 0) {
      return text;
    }
    const escaped = this.escapeRegExp(highlight);
    const stringRegex = '(' + escaped + ')|(.*?(?=' + escaped + ')|.+)';
    const regex = new RegExp(stringRegex, ignoreCase ? 'gi' : 'g');
    return text.replace(regex, (text, match, notmatch) => this.escapeText(match != null ? matchClass : doNotMatchClass, text));
  }

  private static escapeText = (classname: string, text: string) => {
    return `<span class="${classname}">${_.escape(text)}</span>`;
  };
}
