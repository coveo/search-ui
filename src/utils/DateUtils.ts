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
   * Specifies whether the date and time are the current ones.
   */
  now?: Date;

  /**
   * Specifies whether the date should be displayed normally or using Today, Yesterday and Tomorrow.
   *
   * **Examples**
   *
   * - If the date to render is equal to the current date, it will display 'Today':
   *    Current date: march 8 2017, date to render: march 8 2017, result: 'Today'
   *
   * - If the date to render is equal to the current date plus or minus 1, it will display Yesterday or Tomorrow:
   *    Current date: march 8 2017, date to render: march 7 2017, result: 'Yesterday'
   *
   * Default value is 'true'
   */
  useTodayYesterdayAndTomorrow?: boolean;

  /**
   * Specifies whether the date should be displayed normally or using days of the week if the date it is part of the
   * current week.
   *
   * **Example**
   *
   * -If the date to render has less than a week's difference with the current date, it will display the corresponding
   * day:
   *    Current date: monday march 8 2017, date to render: march 11 2017, result: 'Next Thursday'
   *
   * Default value is 'true'
   */
  useWeekdayIfThisWeek?: boolean;

  /**
   * Specifies whether the date should be displayed normally or without the year.
   *
   * **Example**
   *
   * - If the date to render is the same year as the current one, it won't display the year value:
   *    Current date: march 8 2017, date to render: 09/22/2017, result: 'September 22'
   *
   * Default value is 'true'
   */
  omitYearIfCurrentOne?: boolean;

  /**
   * Specifies whether the date should be displayed normally or displayed using the complete format.
   *
   * **Example**
   *
   * - If the date to render is 08/04/2017:
   *    The result will be Friday, August 04, 2017
   *
   * Default value is 'false'
   */
  useLongDateFormat?: boolean;

  /**
   * Specifies whether the date should be dislayed normally or if it should also display the time if it is today.
   *
   * **Example**
   *
   * - If the date to render is equal to the current date, it will display the day and the time:
   *    Current date: march 8th 2017, date to render: 03/08/2017 7:10, result: 'Today, 7:10 AM'
   *
   * Default value is 'true'
   */
  includeTimeIfToday?: boolean;

  /**
   * Specifies whether the date should be dislayed normally or if it should also display the time if it is part of
   * the current week.
   *
   * **Example**
   *
   * - If the date to render is equal to the current date, it will display the day and the time:
   *    Current date: march 8th 2017, date to render: 03/10/2017 7:10, result: 'March 03, 7:10 AM'
   *
   * Default value is 'true'
   */
  includeTimeIfThisWeek?: boolean;

  /**
   * Specifies whether the date should be dislayed normally or if it should also display the time.
   *
   * **Example**
   *
   * - If the option is 'true', the time will always be displayed:
   *    Current date: march 8th 2017, date to render: 04/11/2015 7:10, result: '04/11/2015, 7:10 AM'
   *
   * Default value is 'false'
   */
  alwaysIncludeTime?: boolean;

  /**
   * Specifies a specific format to use when displaying the date.
   *
   * **Example**
   *
   * - If the predefinedFormat is 'YYYY-MM-dd', the date will be displayed as such:
   *    Date to render: 04/11/2015, result: 2015-04-11
   *
   * Default value is 'undefined'
   */
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

/**
 * This class modifies the received Date so that it is rendered the way the options specify.
 */
export class DateUtils {

  static convertFromJsonDateIfNeeded(date: any): Date {
   return DateUtils.convertToStandardDate(date);
}

  static convertToStandardDate(date: string): Date;
  static convertToStandardDate(date: number): Date;
  static convertToStandardDate(date: Date): Date;
  /**
   * Receives a date of any type and converts it to a standard Date object.
   * @param date can be a string, a number or a Date object. It can also be any other type, but the result will be
   * 'undefined' if it is not recognized as a date.
   * @returns {any} the Date, or undefined it it wasn't recognized as a valid date.
   */
  static convertToStandardDate(date: any): Date {
    if (_.isDate(date)) {
      return moment(date).toDate();
    } else if (date !== null && !isNaN(Number(date))) {
      return moment(Number(date)).toDate();
    } else if (_.isString(date)) {
      /*
      If the input is a string recognized as a Date, parse it using momentJS.
      This array specifies the possible string formats the moment will have to parse. It will be either the standard
      ISO_8601 or the format our index uses to store dates ('YYYY/MM/DD@HH:mm:ssZ').
      */
      const dateMoment = moment(date, ['YYYY/MM/DD@HH:mm:ssZ', moment.ISO_8601]);
      return dateMoment.toDate();
    } else {
      return undefined;
    }
  }

  public static setLocale():void {
    let currentLocale = String['locale'];

    //Our cultures.js directory contains 'no' which is the equivalent to 'nn' for momentJS
    if(currentLocale == 'no') {
      currentLocale = 'nn';
    } else if(currentLocale == 'es-ES') {
      //Our cultures.js directory contains 'es-es' which is the equivalent to 'es' for momentJS
      currentLocale = 'es';
    }

    moment.locale(currentLocale);

    moment.updateLocale(currentLocale, {
      calendar : {
        lastDay : `[${l('Yesterday')}]`,
        sameDay : `[${l('Today')}]`,
        nextDay : `[${l('Tomorrow')}]`
      }
    });
  }

  /**
   * Receives a Date and formats into the standard string required for queries.
   * @param date The date to convert into a string.
   * @returns {string} Corresponds to the Date in a 'YYYY/MM/DD' format.
   */
  static dateForQuery(date: Date): string {
    DateUtils.setLocale();
    const dateMoment = moment(date).format('YYYY/MM/DD');
    return dateMoment;
  }

  /**
   * Keeps only the date information, removing the time information.
   * @param date The date to crop.
   * @returns {Date} The cropped date, without the time information.
   */
  static keepOnlyDatePart(date: Date): Date {
    DateUtils.setLocale();
    const dateMoment = moment(date);
    return new Date(dateMoment.year(), dateMoment.month(),dateMoment.date())
  }

  /**
   * Converts the date into a string according to the specified options.
   * @param d The date to convert to a string.
   * @param options Specifies the enabled options on the date.
   * @returns {any} The date after being formatted into a string according to the specified options.
   */
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

    const today = moment(DateUtils.keepOnlyDatePart(options.now));
    if (options.useTodayYesterdayAndTomorrow) {
      /*
       'today' is already a moment, but we need to create another instance of moment so that 'today' isn't modified by 'add'.
       If we simply used 'today', we would have to add(-2,'days') instead of -1.
       */
      if (dateOnly.valueOf() == today.valueOf() || dateOnly.valueOf() == moment(today).add(1,'days').valueOf() ||
          dateOnly.valueOf() == moment(today).add(-1,'days').valueOf()) {
            return moment(dateOnly).calendar(moment(today));
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

  /**
   * Converts the time information from a date into a string.
   * @param date The date containing the time information to format.
   * @returns {any} Will either be an empty string or a string containing the time.
   */
  static timeToString(date: Date, options?: IDateToStringOptions): string {
    if (Utils.isNullOrUndefined(date)) {
      return '';
    }

    return moment(date).format('h:mm A');
  }

  /**
   * Checks if options and their time conditions are met, and returns the date accordingly using timeToString.
   * @param date The date to format according to the specified options.
   * @param options The options specified to format the date according to preference.
   * @returns {any} The date after being formatted according to the specified options.
   */
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

  /**
   * Converts a month from a number to a string (e.g '1' to 'january').
   * @param month The month represented by it's number (1 to 12).
   * @returns {string} The month's name associated to it's number.
   */
  static monthToString(month: number): string {
    DateUtils.setLocale();
    const date = moment(new Date(1980, month)).toDate();
    return moment(date).format('MMMM');
  }

  /**
   * Checks if the input is an instance of Date.
   * @param date The value to evaluate.
   * @returns {boolean} False if the result is not an instance of Date.
   */
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