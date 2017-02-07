import { Options } from '../misc/Options';
import { Utils } from './Utils';
import { l } from '../strings/Strings';
import { TimeSpan } from './TimeSpanUtils';
import Globalize = require('globalize');
import _ = require('underscore');

export interface IDateToStringOptions {
  now?: Date;
  useTodayYesterdayAndTomorrow?: boolean;
  useWeekdayIfThisWeek?: boolean;
  omitYearIfCurrentOne?: boolean;
  useLongDateFormat?: boolean;
  includeTimeIfToday?: boolean;
  includeTimeIfThisWeek?: boolean;
  alwaysIncludeTime?: boolean;
  predefinedFormat?: string;
}

class DefaultDateToStringOptions extends Options implements IDateToStringOptions {
  now: Date = new Date();
  useTodayYesterdayAndTomorrow = true;
  useWeekdayIfThisWeek = true;
  omitYearIfCurrentOne = true;
  useLongDateFormat = false;
  includeTimeIfToday = true;
  includeTimeIfThisWeek = true;
  alwaysIncludeTime = false;
  predefinedFormat: string = undefined;
}

export class DateUtils {
  static convertFromJsonDateIfNeeded(date: string): Date;
  static convertFromJsonDateIfNeeded(date: number): Date;
  static convertFromJsonDateIfNeeded(date: Date): Date;
  static convertFromJsonDateIfNeeded(date: any): Date {
    if (_.isDate(date)) {
      return date;
    } else if (date !== null && !isNaN(Number(date))) {
      return new Date(Number(date));
    } else if (_.isString(date)) {
      return new Date(<string>date.replace('@', ' '));
    } else {
      return undefined;
    }
  }

  static dateForQuery(date: Date): string {
    return date.getFullYear() + '/' + DateUtils.padNumber((date.getMonth() + 1).toString()) + '/' + DateUtils.padNumber(date.getDate().toString());
  }

  private static padNumber(num: string, length: number = 2): string {
    while (num.length < length) {
      num = '0' + num;
    }
    return num;
  }

  static keepOnlyDatePart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static offsetDateByDays(date: Date, offset: number): Date {
    var newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + offset);

    return newDate;
  }

  static dateToString(d: Date, options?: IDateToStringOptions): string {
    if (Utils.isNullOrUndefined(d)) {
      return '';
    }

    options = new DefaultDateToStringOptions().merge(options);

    var dateOnly = DateUtils.keepOnlyDatePart(d);

    if (options.predefinedFormat) {
      return Globalize.format(dateOnly, options.predefinedFormat);
    }

    var today = DateUtils.keepOnlyDatePart(options.now);
    if (options.useTodayYesterdayAndTomorrow) {
      if (dateOnly.valueOf() == today.valueOf()) {
        return l('Today');
      }
      var tomorrow = DateUtils.offsetDateByDays(today, 1);
      if (dateOnly.valueOf() == tomorrow.valueOf()) {
        return l('Tomorrow');
      }
      var yesterday = DateUtils.offsetDateByDays(today, -1);
      if (dateOnly.valueOf() == yesterday.valueOf()) {
        return l('Yesterday');
      }
    }

    var isThisWeek = Math.abs(TimeSpan.fromDates(dateOnly, today).getDays()) < 7;
    if (options.useWeekdayIfThisWeek && isThisWeek) {
      if (dateOnly.valueOf() > today.valueOf()) {
        return l('Next') + ' ' + Globalize.format(dateOnly, 'dddd');
      } else {
        return l('Last') + ' ' + Globalize.format(dateOnly, 'dddd');
      }
    }

    if (options.omitYearIfCurrentOne && dateOnly.getFullYear() === today.getFullYear()) {
      return Globalize.format(dateOnly, 'M');
    }

    if (options.useLongDateFormat) {
      return Globalize.format(dateOnly, 'D');
    }

    return Globalize.format(dateOnly, 'd');
  }

  static timeToString(date: Date, options?: IDateToStringOptions): string {
    if (Utils.isNullOrUndefined(date)) {
      return '';
    }

    return Globalize.format(date, 't');
  }

  static dateTimeToString(date: Date, options?: IDateToStringOptions): string {
    if (Utils.isNullOrUndefined(date)) {
      return '';
    }

    options = new DefaultDateToStringOptions().merge(options);

    var today = DateUtils.keepOnlyDatePart(options.now);
    var isThisWeek = Math.abs(TimeSpan.fromDates(date, today).getDays()) < 7;
    var datePart = DateUtils.dateToString(date, options);
    var dateWithoutTime = DateUtils.keepOnlyDatePart(date);

    if (options.alwaysIncludeTime || (options.includeTimeIfThisWeek && isThisWeek) || (options.includeTimeIfToday && dateWithoutTime.valueOf() == today.valueOf())) {
      return datePart + ', ' + DateUtils.timeToString(date);
    } else {
      return datePart;
    }
  }

  static monthToString(month: number): string {
    var date = new Date(1980, month);
    return Globalize.format(date, 'MMMM');
  }

  static isValid(date: any) {
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    return false;
  }

  static timeBetween(from: Date, to: Date) {
    if (Utils.isNullOrUndefined(from) || Utils.isNullOrUndefined(to)) {
      return '';
    }

    return ('0' + ((to.getTime() - from.getTime()) / (1000 * 60 * 60)).toFixed()).slice(-2) +
      ':' + ('0' + ((to.getTime() - from.getTime()) % (1000 * 60 * 60) / (1000 * 60)).toFixed()).slice(-2) +
      ':' + ('0' + ((to.getTime() - from.getTime()) % (1000 * 60) / (1000)).toFixed()).slice(-2);
  }
}

// Shim for IE8 Date.toISOString
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
if (!Date.prototype.toISOString) {
  (function () {
    function pad(nber) {
      if (nber < 10) {
        return '0' + nber;
      }
      return nber;
    }

    Date.prototype.toISOString = function () {
      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        ':' + pad(this.getUTCMinutes()) +
        ':' + pad(this.getUTCSeconds()) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };
  }());
}
