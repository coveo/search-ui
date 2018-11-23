import { LocaleString } from '../ExternalModulesShim';
import * as _ from 'underscore';

String.toLocaleString = LocaleString;
const pluralRegex = /<pl>(((?!<\/pl>).)*)<\/pl>/g;
const singularRegex = /<sn>(((?!<\/sn>).)*)<\/sn>/g;

export var L10N = {
  format: (key: string, ...args: any[]) => {
    let value = key.toLocaleString();
    // Try to find a soft match
    // These conditions check if there was a change in the string (meaning toLocaleString found a match). If there was no
    // match, try another format.
    if (value == key) {
      const tryTranslationInUpperCase = key.toUpperCase().toLocaleString();
      const tryTranslationInLowerCase = key.toLowerCase().toLocaleString();
      const tryTranslationAfterCapitalization = (key.charAt(0).toUpperCase() + key.toLowerCase().slice(1)).toLocaleString();
      if (tryTranslationInUpperCase != key.toUpperCase().toLocaleString()) {
        value = tryTranslationInUpperCase;
      } else if (tryTranslationInLowerCase != key.toLowerCase().toLocaleString()) {
        value = tryTranslationInLowerCase;
      } else if (tryTranslationAfterCapitalization != key.charAt(0).toUpperCase() + key.toLowerCase().slice(1)) {
        value = tryTranslationAfterCapitalization;
      }
    }
    if (args.length > 0) {
      let last = _.last(args);
      // Last argument is either the count or a boolean forcing plural (true) or singular (false)
      if (_.isBoolean(last) || _.isNumber(last)) {
        args.pop();
        value = L10N.formatPlSn(value, last);
      }
      _.each(args, (arg, i) => (value = value.replace(`{${i}}`, arg)));
    } else {
      // If there was no parameters passed, we try to cleanup the possible parameters in the translated string.
      value = value.replace(/{[0-9]}|<pl>[a-zA-Z]+<\/pl>|<sn>|<\/sn>/g, '').trim();
    }
    return value;
  },
  formatPlSn: (value: string, count: number | boolean) => {
    let isPlural = _.isBoolean(count) ? count : count > 1;
    if (isPlural) {
      value = value.replace(pluralRegex, '$1').replace(singularRegex, '');
    } else {
      value = value.replace(pluralRegex, '').replace(singularRegex, '$1');
    }
    return value;
  }
};
