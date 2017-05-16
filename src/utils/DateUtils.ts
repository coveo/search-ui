import { Options } from '../misc/Options';
import { Utils } from './Utils';
import { l } from '../strings/Strings';
import * as _ from 'underscore';
import * as moment from 'moment';
/**
 * The 'DateUtils' class renders dates and times using momentJS using the right culture languages and formats.
 *
 * This class can transform strings, numbers and date objects into a standardized ISO_8601 Date.
 *
 */
export interface IDateToStringOptions {
  /**
   * Specifies whether the date and time are the current ones
   */
  now?: Date;
  /**
   * Specifies whether the date should be displayed normally or using Today, Yesterday and Tomorrow
   *
   * **Examples**
   *
   * - If the date to render is equal to the current date, it will display 'Today':
   *    Current date: march 8 2017, date to render: march 8 2017, final result: 'Today'
   *
   * - If the date to render is equal to the current date plus or minus 1, it will display Yesterday or Tomorrow:
   *    Current date: march 8 2017, date to render: march 7 2017, final result: 'Yesterday'
   */
  useTodayYesterdayAndTomorrow?: boolean;
  /**
   * Specifies whether the date should be displayed normally or using days of the week if the date it is part of the
   * current week
   *
   * **Example**
   *
   * -If the date to render has less than a week's difference with the current date, it will display the corresponding
   * day:
   *    Current date: monday march 8 2017, date to render: march 11 2017, final result: 'Next Thursday'
   *
   * Default value is 'true'
   */
  useWeekdayIfThisWeek?: boolean;
  /**
   * Specifies whether the date should be displayed normally or without the year
   *
   * **Example**
   *
   * - If the date to render is the same year as the current one, it won't display the year value:
   *    Current date: march 8 2017, date to render: 09/22/2017, final result: 'September 22'
   *
   * Default value is 'true'
   */
  omitYearIfCurrentOne?: boolean;
  /**
   * Specifies whether the date should be displayed normally or displayed using the complete format
   *
   * **Example**
   *
   * - If the date to render is 08/04/2017:
   *    The result will be Friday, August 04, 2017
   *
   * Default value is 'true'
   */
  useLongDateFormat?: boolean;
  /**
   * Specifies whether the date should be dislayed normally or if it should also display the timestamp if it is today.
   *
   * **Example**
   *
   * - If the date to render is equal to the current date, it will display the date and the timestamp:
   *    Current date: march 8th 2017, date to render: 03/08/2017 7:10, final result: 'Today, 7:10 AM'
   */
  includeTimeIfToday?: boolean;
  includeTimeIfThisWeek?: boolean;
  alwaysIncludeTime?: boolean;
  predefinedFormat?: string;
}

class DefaultDateToStringOptions extends Options implements IDateToStringOptions {
  now: Date = moment().toDate();
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
      return moment(date).toDate();
    } else if (date !== null && !isNaN(Number(date))) {
      return moment(Number(date)).toDate();
    } else if (_.isString(date)) {
      const dateMoment = moment(date, ['YYYY/MM/DD@HH:mm:ssZ', moment.ISO_8601]);
      return dateMoment.toDate();
    } else {
      return undefined;
    }
  }

  static setLocale():void {
    let currentLocale = String['locale'];
    if(currentLocale == 'no') {
      currentLocale = 'nn'
    }
    else if(currentLocale == 'es-es') {
      currentLocale = 'es';
    }
    moment.locale(currentLocale);
  }

  static dateForQuery(date: Date): string {
    DateUtils.setLocale();
    const dateMoment = moment(date).format('YYYY/MM/DD');
    return dateMoment;
  }

  static keepOnlyDatePart(date: Date): Date {
    DateUtils.setLocale();
    const dateMoment = moment(date);
    return new Date(dateMoment.year(), dateMoment.month(),dateMoment.date())
  }

  static dateToString(d: Date, options?: IDateToStringOptions): string {
    DateUtils.setLocale();
    if (Utils.isNullOrUndefined(d)) {
      return '';
    }

    options = new DefaultDateToStringOptions().merge(options);

    const dateOnly = moment(DateUtils.keepOnlyDatePart(d));

    if (options.predefinedFormat) {
      return dateOnly.format(options.predefinedFormat.replace(/yyyy/g, String.prototype.toUpperCase()));
    }

    let today = moment(DateUtils.keepOnlyDatePart(options.now));
    if (options.useTodayYesterdayAndTomorrow) {
      if (dateOnly.valueOf() == today.valueOf()) {
        return l('Today');
      }
      if (dateOnly.valueOf() == moment(today).add(1,'days').valueOf()) {
        return l('Tomorrow');
      }
      if (dateOnly.valueOf() == moment(today).add(-1,'days').valueOf()) {
        return l('Yesterday');
      }
    }

    const isThisWeek = dateOnly.diff(moment(today),'weeks') == 0;
    if (options.useWeekdayIfThisWeek && isThisWeek) {
      if (dateOnly.valueOf() > today.valueOf()) {
        return l('Next') + ' ' + dateOnly.format('dddd');
      } else if (dateOnly.valueOf() < today.valueOf()){
        return l('Last') + ' ' + dateOnly.format('dddd');
      } else {
        return dateOnly.format('dddd');
      }
    }

    if (options.omitYearIfCurrentOne && dateOnly.year() === today.year()) {
      return dateOnly.format('MMMM DD');
    }

    if (options.useLongDateFormat) {
      return dateOnly.format('dddd, MMMM DD, YYYY');
    }

    return dateOnly.format('M/D/YYYY')
  }

  static timeToString(date: Date, options?: IDateToStringOptions): string {
    if (Utils.isNullOrUndefined(date)) {
      return '';
    }

    return moment(date).format('h:mm A');
  }

  static dateTimeToString(date: Date, options?: IDateToStringOptions): string {
    DateUtils.setLocale();
    if (Utils.isNullOrUndefined(date)) {
      return '';
    }

    options = new DefaultDateToStringOptions().merge(options);

    const today = DateUtils.keepOnlyDatePart(options.now);
    const isThisWeek = moment(date).diff(moment(today),'weeks') == 0;
    const datePart = DateUtils.dateToString(date, options);
    const dateWithoutTime = DateUtils.keepOnlyDatePart(date);

    if (options.alwaysIncludeTime || (options.includeTimeIfThisWeek && isThisWeek) || (options.includeTimeIfToday && dateWithoutTime.valueOf() == today.valueOf())) {
      return datePart + ', ' + DateUtils.timeToString(date);
    } else {
      return datePart;
    }
  }

  static monthToString(month: number): string {
    DateUtils.setLocale();
    let date = moment(new Date(1980, month)).toDate();
    return moment(date).format('MMMM');
  }

  static isValid(date: any) {
    DateUtils.setLocale();
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    return false;
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