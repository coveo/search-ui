import {LocaleString} from '../ExternalModulesShim';

String.toLocaleString = LocaleString;
const pluralRegex = /<pl>(((?!<\/pl>).)*)<\/pl>/g;
const singularRegex = /<sn>(((?!<\/sn>).)*)<\/sn>/g;

export var L10N = {
  format: (key: string, ...args: any[]) => {
    let value = key.toLocaleString();
    if (args.length > 0) {
      let last = _.last(args);
      // Last argument is either the count or a boolean forcing plural (true) or singular (false)
      if (_.isBoolean(last) || _.isNumber(last)) {
        args.pop();
        value = L10N.formatPlSn(value, last);
      }
      _.each(args, (arg, i) => value = value.replace(`{${i}}`, arg));
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
}
