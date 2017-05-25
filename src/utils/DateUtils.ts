import { Options } from '../misc/Options';
import { Utils } from './Utils';
import { l } from '../strings/Strings';
import * as _ from 'underscore';
import * as moment from 'moment';
import * as d3 from 'd3';
import days = d3.time.days;
/**
 * The `IDateToStringOptions` interface describes a set of options to use when converting a standard Date object to a
 * string using the [ `dateToString` ]{@link DateUtils.dateToString}, or the
 * [ `dateTimeToString` ]{@link DateUtils.dateTimeToString} method from the [ `DateUtils` ]{@link DateUtils} class.
 * The precedence orders for the options are:
 * [ `useTodayYesterdayAndTomorrow` ]{@link IDateToStringOptions.useTodayYesterdayAndTomorrow}
 * -> [ `useWeekdayIfThisWeek` ]{@link IDateToStringOptions.useWeekdayIfThisWeek}
 * -> [ `omitYearIfCurrentOne` ]{@link IDateToStringOptions.omitYearIfCurrentOne}
 * -> [ `useLongDateFormat` ]{@link IDateToStringOptions.useLongDateFormat}
 * and [ `alwaysIncludeTime` ]{@link IDateToStringOptions.alwaysIncludeTime}
 * -> [ `includeTimeIfThisWeek` ]{@link IDateToStringOptions.includeTimeIfThisWeek}
 * -> [ `includeTimeIfToday` ]{@link IDateToStringOptions.includeTimeIfToday}.
 */
export interface IDateToStringOptions {
  /**
   * Contains a standard Date object that specifies the current date and time.
   *
   * Default value is `undefined`.
   */
  now?: Date;

  /**
   * Specifies whether to convert the Date object to the localized version of `Today`, `Yesterday`, or `Tomorrow`,
   * if possible. This option takes precedence over
   * [ `useWeekdayIfThisWeek` ]{@link IDateToStringOptions.useWeekdayIfThisWeek}.
   *
   * **Examples**
   *
   * If [ `useTodayYesterdayAndTomorrow` ]{@link IDateToStringOptions.useTodayYesterdayAndTomorrow} is `true`,
   * and [ `now` ]{@link IDateToStringOptions.now} contains a Date object equivalent to `March 8, 2017`, then:
   *
   *  - If the Date object to convert contains a value equivalent to `March 7, 2017`, the resulting string is the
   *  localized version of `Yesterday`.
   *
   *  - If the Date object to convert contains a value equivalent to `March 8, 2017`, the resulting string is the
   *  localized version of `Today`.
   *
   *  - If the Date object to convert contains a value equivalent to `March 9, 2017`, the resulting string is the
   *  localized version of `Tomorrow`.
   *
   * Default value is `true`.
   */
  useTodayYesterdayAndTomorrow?: boolean;

  /**
   * Specifies whether to convert the Date object to the localized version of the corresponding day of the week,
   * if the date to convert is part of the current week. This option takes precedence over
   * [ `omitYearIfCurrentOne` ]{@link IDateToStringOptions.omitYearIfCurrentOne}.
   *
   * **Examples**
   *
   *  If [ `useWeekdayIfThisWeek` ]{@link IDateToStringOptions.useWeekdayIfThisWeek} is `true`
   *  and [ `now` ]{@link IDateToStringOptions.now} contains a Date object equivalent to `Monday, March 8, 2017`, then:
   *
   *   - If the date to convert is equivalent to `Saturday, March 6, 2017`, the resulting string is the localized
   *   version of `Last Saturday`.
   *
   *   - If the date to convert is equivalent to `Thursday, March 11, 2017`, the resulting string is the localized
   *   version of `Next Thursday`.
   *
   * Default value is `true`.
   */
  useWeekdayIfThisWeek?: boolean;

  /**
   * Specifies whether to omit the year from the resulting string when converting the Date object, if the year
   * is the current one. This option takes precedence over
   * [ `useLongDateFormat` ]{@link IDateToStringOptions.useLongDateFormat}.
   *
   * **Examples**
   *
   *  - If the Date object to convert is equivalent to `September 22, 2017`, the resulting string does not contain
   *  the year (e.g., `September 22`).
   *
   *  - If the Date object to convert is equivalent to `September 22, 2016`, the resulting string contains the year
   *  (e.g., `September 22, 2016`).
   *
   * Default value is `true`.
   */
  omitYearIfCurrentOne?: boolean;

  /**
   * Specifies whether to format the resulting string in the long date format (e.g., `Friday, August 04, 2017`).
   *
   * Default value is `false`.
   */
  useLongDateFormat?: boolean;

  /**
   * Specifies whether to include the time in the resulting string when converting the Date object (e.g. `May 15, 4:17 PM`)
   * if the date to convert is equivalent to [ `now` ]{@link IDateToStringOptions.now}.
   *
   * **Examples**
   *
   * If [ `includeTimeIfToday` ]{@link IDateToStringOptions.includeTimeIfToday} is `true`
   * and [ `now` ]{@link IDateToStringOptions.now} contains a Date object equivalent to `Monday, March 8, 2017`, then:
   *
   *    - If the Date object to convert is equivalent to `2017/03/08 17:23:11`, the resulting string is `3/8/2017, 5:23 PM`.
   *
   *    - If the Date object to convert is equivalent to `2017/03/09 17:23:11`, the resulting string is `3/9/2017`.
   *
   * Default value is `true`.
   */
  includeTimeIfToday?: boolean;

  /**
   * Specifies whether to include the time in the resulting string when converting the Date object (e.g. `May 15, 4:17 PM`)
   * if the date to convert within a week from [ `now` ]{@link IDateToStringOptions.now}. This option takes precedence over
   * [ `includeTimeIfToday` ]{@link IDateToStringOptions.includeTimeIfToday}.
   *
   * **Examples**
   *
   * If [ `includeTimeIfToday` ]{@link IDateToStringOptions.includeTimeIfToday} is `true`
   * and [ `now` ]{@link IDateToStringOptions.now} contains a Date object equivalent to `Monday, March 8, 2017`, then:
   *
   *    - If the Date object to convert is equivalent to `2017/03/08 17:23:11`, the resulting string is `3/8/2017, 5:23 PM`.
   *
   *    - If the Date object to convert is equivalent to `2017/03/09 17:23:11`, the resulting string is `3/9/2017 ,5:23 PM`.
   *
   * Default value is `true`.
   */
  includeTimeIfThisWeek?: boolean;

  /**
   * Specifies whether to always include the time in the resulting string when converting the Date object (e.g. `May 15, 4:17 PM`)
   * This option takes precedence over [ `includeTimeIfThisWeek` ]{@link IDateToStringOptions.includeTimeIfThisWeek}.
   *
   * **Example**
   *
   * If [ `includeTimeIfToday` ]{@link IDateToStringOptions.includeTimeIfToday} is `true`
   * and [ `now` ]{@link IDateToStringOptions.now} contains a Date object equivalent to `Monday, March 8, 2017`, then:
   *
   *    - If the Date object to convert is equivalent to `2010/03/08 17:23:11`, the resulting string is `3/8/2010, 5:23 PM`.
   *
   * Default value is `false`.
   */
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

/**
 * The `DateUtils` class exposes methods to convert strings, numbers and date objects to standard ISO 8601 Date objects,
 * using the correct culture, language and format. It also offers methods to convert date objects to strings.
 */
export class DateUtils {
  // This function is used to call convertToStandardDate for legacy reasons. convertFromJsonDateIfNeeded was refactored to
  // convertToStandardDate, which would be a breaking change otherwise.
  static convertFromJsonDateIfNeeded(date: any): Date {
    return DateUtils.convertToStandardDate(date);
  }

  /**
   * Tries to parse an argument of any type to a standard Date object.
   * @param date The value to parse. Can be of any type (string, number, Date, etc.).
   * @returns {any} The parsed Date object, or `Invalid Date` if the `date` argument was not recognized as a valid date.
   */
  static convertToStandardDate(date: any): Date {
    if (_.isDate(date)) {
      return moment(date).toDate();
    } else if (date !== null && !isNaN(Number(date))) {
      return moment(Number(date)).toDate();
    } else if (_.isString(date)) {
      const formats = ['YYYY/MM/DD@HH:mm:ssZ', moment.ISO_8601];
      const dateMoment = moment(date, formats);
      return dateMoment.toDate();
    }
  }

  public static setLocale(): void {
    let currentLocale = String['locale'];

    // Our cultures.js directory contains 'no' which is the equivalent to 'nn' for momentJS
    if (currentLocale.toLowerCase() == ('no')) {
      currentLocale = 'nn';
    } else if (currentLocale.toLowerCase() == 'es-es') {
      // Our cultures.js directory contains 'es-es' which is the equivalent to 'es' for momentJS
      currentLocale = 'es';
    }

    moment.locale(currentLocale);

    moment.updateLocale(currentLocale, {
      calendar: {
        lastDay: `[${l('Yesterday')}]`,
        sameDay: `[${l('Today')}]`,
        nextDay: `[${l('Tomorrow')}]`
      }
    });
  }

  /**
   * Receives a Date and formats into the standard string required for queries.
   * @param date The date to convert into a string.
   * @returns {string} Corresponds to the Date in a `YYYY/MM/DD` format.
   */
  static dateForQuery(date: Date): string {
    DateUtils.setLocale();
    const dateMoment = moment(date).format('YYYY/MM/DD');
    return dateMoment;
  }

  /**
   * Keeps only the date, removing the time information.
   * @param date The date to crop.
   * @returns {Date} The cropped date, without the time information.
   */
  static keepOnlyDatePart(date: Date): Date {
    DateUtils.setLocale();
    const dateMoment = moment(date);
    return new Date(dateMoment.year(), dateMoment.month(), dateMoment.date());
  }

  /**
   * Adds offset to a Date, counted in days.
   * @param date The date to offset.
   * @param offset The amount of days to add or remove to the date.
   * @returns {Date} The modified date.
   */
  static offsetDateByDays(date: Date, offset: number): Date {
    return moment(date).add(offset, 'days').toDate();
  }

  private static isTodayYesterdayOrTomorrow(d: Date, options?: IDateToStringOptions): boolean {
    const dateOnly = moment(DateUtils.keepOnlyDatePart(d));
    const today = moment(DateUtils.keepOnlyDatePart(options.now));
    const daysDifference = dateOnly.diff(today, 'days');
    return daysDifference == 0 || daysDifference == 1 || daysDifference == -1;
  }

  /**
   * Converts the date into a string according to the specified options.
   * This method uses [ `keepOnlyDatePart` ]{@link DateUtils.keepOnlyDatePart} which removes the time information
   * from the date. To convert a date using a timestamp, use [ `dateTimeToString` ]{@link DateUtils.dateTimeToString}.
   * @param date The date to convert to a string.
   * @param options Specifies the enabled options on the date.
   * @returns {any} The date after being formatted into a string according to the specified options.
   */
  static dateToString(date: Date, options?: IDateToStringOptions): string {
    DateUtils.setLocale();

    if (Utils.isNullOrUndefined(date)) {
      return '';
    }

    options = new DefaultDateToStringOptions().merge(options);

    const dateOnly = moment(DateUtils.keepOnlyDatePart(date));
    const today = moment(DateUtils.keepOnlyDatePart(options.now));

    if (options.predefinedFormat) {
      // yyyy was used to format dates before implementing moment.js, which only recognizes YYYY.
      return dateOnly.format(options.predefinedFormat.replace(/yyyy/g, 'YYYY'));
    }


    if (options.useTodayYesterdayAndTomorrow) {
      if (DateUtils.isTodayYesterdayOrTomorrow(date, options)) {
        return moment(dateOnly).calendar(moment(today));
      }
    }

    const isThisWeek = dateOnly.diff(moment(today), 'weeks') == 0;

    if (options.useWeekdayIfThisWeek && isThisWeek) {
      if (dateOnly.valueOf() > today.valueOf()) {
        return l('NextDay', dateOnly.format('dddd'));
      } else if (dateOnly.valueOf() < today.valueOf()) {
        return l('LastDay', dateOnly.format('dddd'));
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

    return dateOnly.format('M/D/YYYY');
  }

  /**
   * Converts the time information from a date into a string.
   * @param date The date containing the time information to format.
   * @param options Specifies the enabled options on the date.
   * @returns {any} Will either be an empty string or a string containing the time.
   */
  static timeToString(date: Date, options?: IDateToStringOptions): string {
    if (Utils.isNullOrUndefined(date)) {
      return '';
    }
    return moment(date).format('h:mm A');
  }

  /**
   * Converts the date into a string according to the specified options.
   * This method uses [ `timeToString` ]{@link DateUtils.timeToString}, which adds a time information to the
   * converted date. To display a date without a timestamp, use [ `dateToString` ]{@link DateUtils.timeToString}.
   * @param date The date to convert to a string.
   * @param options Specifies the enabled options on the date.
   * @returns {any} The date after being formatted into a string according to the specified options.
   */
  static dateTimeToString(date: Date, options?: IDateToStringOptions): string {
    DateUtils.setLocale();

    if (Utils.isNullOrUndefined(date)) {
      return '';
    }

    options = new DefaultDateToStringOptions().merge(options);
    const today = DateUtils.keepOnlyDatePart(options.now);
    const isThisWeek = moment(date).diff(moment(today), 'weeks') == 0;
    const datePart = DateUtils.dateToString(date, options);
    const dateWithoutTime = DateUtils.keepOnlyDatePart(date);

    if (moment(date).isValid() && (options.alwaysIncludeTime == true || (options.includeTimeIfThisWeek == true && isThisWeek)
      || (options.includeTimeIfToday == true && dateWithoutTime.valueOf() == today.valueOf()))) {
      return datePart + ', ' + DateUtils.timeToString(date);
    } else {
      return datePart;
    }
  }

  /**
   * Converts a month from a number to a string (e.g '0' to 'january').
   * @param month The month represented by its number (0 to 11).
   * @returns {string} The month's name associated to its number.
   */
  static monthToString(month: number): string {
    DateUtils.setLocale();
    const date = moment(new Date(1980, month)).toDate();
    return moment(date).format('MMMM');
  }

  /**
   * Checks if the input is an instance of Date.
   * @param date The value to evaluate.
   * @returns {boolean} False if the result is not an instance of `Date`.
   */
  static isValid(date: any) {
    DateUtils.setLocale();

    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    return false;
  }

  /**
   * Compares the amount of time between two dates.
   * @param from The first Date to compare.
   * @param to The second Date to compare
   * @returns {any} The amount of time between the first and second Date.
   */
  static timeBetween(from: Date, to: Date) {
    if (Utils.isNullOrUndefined(from) || Utils.isNullOrUndefined(to)) {
      return '';
    }

    return ('0' + ((moment(to).valueOf() - moment(from).valueOf()) / (1000 * 60 * 60)).toFixed()).slice(-2) +
      ':' + ('0' + ((moment(to).valueOf() - moment(from).valueOf()) % (1000 * 60 * 60) / (1000 * 60)).toFixed()).slice(-2) +
      ':' + ('0' + ((moment(to).valueOf() - moment(from).valueOf()) % (1000 * 60) / (1000)).toFixed()).slice(-2);
  }
}
