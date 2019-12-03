import { Options } from '../misc/Options';
import { Utils } from './Utils';
import { l } from '../strings/Strings';
import * as _ from 'underscore';
import * as moment from 'moment';
import { Logger } from '../misc/Logger';

declare const Globalize;

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
  /**
   * Specifies a custom date format (e.g., dd/MM/yyyy), regardless of browser locale or any other option.
   *
   * This option uses the following syntax. All examples use the April 5th, 2018 14:15:34 time.
   * - `yyyy`: full length year (e.g., 2018)
   * - `yy`: short length year (e.g., 18)
   * - `MMMM`: month name (e.g., April)
   * - `MMM`: shortened month name (e.g., Apr)
   * - `MM`: month number (e.g., 04)
   * - `M`: single digit month number for months before October (e.g., 4)
   * - `dddd`: day name (e.g., Thursday)
   * - `ddd`: shortened day name (e.g., Thu)
   * - `dd`: day number (e.g., 05)
   * - `d`: single digit day for days before the 10th (e.g., 5)
   * - `hh`: hour, in the 24-hour format (e.g., 14)
   * - `h`: hour, in the 12-hour format (e.g., 2)
   * - `mm`: minutes (e.g., 15)
   * - `ss`: seconds (e.g., 34)
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
 * The `DateUtils` class exposes methods to convert strings, numbers and date objects to standard ISO 8601 Date objects,
 * using the correct culture, language and format. It also offers methods to convert date objects to strings.
 */
export class DateUtils {
  private static momentjsLocaleDataMap: Record<string, moment.Locale> = {};

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
    DateUtils.saveOriginalMomentLocaleData();
    moment.updateLocale(DateUtils.momentjsCompatibleLocale, DateUtils.transformGlobalizeCalendarToMomentCalendar());
    moment.locale(DateUtils.momentjsCompatibleLocale);
  }

  private static saveOriginalMomentLocaleData() {
    const locale = DateUtils.momentjsCompatibleLocale;
    const alreadySaved = DateUtils.momentjsLocaleDataMap[locale] != null;

    if (alreadySaved) {
      return;
    }

    DateUtils.momentjsLocaleDataMap[locale] = moment.localeData();
  }

  /**
   * Creates a string from a Date object. The resulting string is in the date format required for queries.
   * @param date The Date object to create a string from.
   * @returns {string} A string corresponding to the `date` argument value, in the `YYYY/MM/DD` format.
   */
  static dateForQuery(date: Date): string {
    DateUtils.setLocale();
    const dateMoment = moment(date).format('YYYY/MM/DD');
    return dateMoment;
  }

  /**
   * Creates a string from a Date object. The resulting string is in the datetime format required for queries.
   * @param date The Date object to create a string from.
   * @returns {string} A string corresponding to the `date` argument value, in the `YYYY/MM/DD@HH:mm:ss` format.
   */
  static dateTimeForQuery(date: Date): string {
    DateUtils.setLocale();
    const dateMoment = moment(date).format('YYYY/MM/DD@HH:mm:ss');
    return dateMoment;
  }

  /**
   * Creates a cropped version of a Date object. The resulting object contains no time information.
   * @param date The original Date object to create a cropped Date object from.
   * @returns {Date} A cropped Date object corresponding to the `date` argument value, excluding its time information.
   */
  static keepOnlyDatePart(date: Date): Date {
    DateUtils.setLocale();
    const dateMoment = moment(date);
    return new Date(dateMoment.year(), dateMoment.month(), dateMoment.date());
  }

  /**
   * Creates an offset version of a Date object. The offset is counted in days.
   * @param date The original Date object to create an offset Date object from.
   * @param offset The number of days to add to (or subtract from) the `date` argument.
   * @returns {Date} An offset Date object corresponding to the `date` argument value plus the `offset` value.
   */
  static offsetDateByDays(date: Date, offset: number): Date {
    return moment(date)
      .add(offset, 'days')
      .toDate();
  }

  private static isTodayYesterdayOrTomorrow(d: Date, options?: IDateToStringOptions): boolean {
    const dateOnly = moment(DateUtils.keepOnlyDatePart(d));
    const today = moment(DateUtils.keepOnlyDatePart(options.now));
    const daysDifference = dateOnly.diff(today, 'days');
    return daysDifference == 0 || daysDifference == 1 || daysDifference == -1;
  }

  private static getMomentJsFormat(format: string) {
    let correctedFormat = format;

    const fourLowercaseY = DateUtils.buildRegexMatchingExactCharSequence('y', 4);
    correctedFormat = correctedFormat.replace(fourLowercaseY, '$1YYYY');

    const twoLowercaseY = DateUtils.buildRegexMatchingExactCharSequence('y', 2);
    correctedFormat = correctedFormat.replace(twoLowercaseY, '$1YY');

    const twoLowercaseD = DateUtils.buildRegexMatchingExactCharSequence('d', 2);
    correctedFormat = correctedFormat.replace(twoLowercaseD, '$1DD');

    const oneLowercaseD = DateUtils.buildRegexMatchingExactCharSequence('d', 1);
    correctedFormat = correctedFormat.replace(oneLowercaseD, '$1D');

    const twoLowercaseH = DateUtils.buildRegexMatchingExactCharSequence('h', 2);
    correctedFormat = correctedFormat.replace(twoLowercaseH, '$1H');

    return correctedFormat;
  }

  private static buildRegexMatchingExactCharSequence(char: string, sequenceLength: number) {
    const negativeNonCapturingGroup = `(?:([^${char}]|^))`; // look-behind is not supported in Firefox
    const charSequence = `${char}{${sequenceLength}}`;
    const negativeLookAhead = `(?!${char})`;
    const exactSequence = `${negativeNonCapturingGroup}${charSequence}${negativeLookAhead}`;

    return new RegExp(exactSequence, 'g');
  }

  /**
   * Creates a string from a Date object. The resulting string is formatted according to a set of options.
   * This method calls [ `keepOnlyDatePart` ]{@link DateUtils.keepOnlyDatePart} to remove time information from the date.
   * If you need to create a timestamp, use the [ `dateTimeToString` ]{@link DateUtils.dateTimeToString} method instead.
   * @param date The Date object to create a string from.
   * @param options The set of options to apply when formatting the resulting string. If you do not specify a value for
   * this parameter, the method uses a default set of options.
   * @returns {string} A date string corresponding to the `date` argument value, formatted according to the specified `options`.
   */
  static dateToString(date: Date, options?: IDateToStringOptions): string {
    DateUtils.setLocale();

    if (Utils.isNullOrUndefined(date)) {
      new Logger(this).warn(`Impossible to format an undefined or null date.`);
      return '';
    }

    options = new DefaultDateToStringOptions().merge(options);

    const dateOnly = moment(DateUtils.keepOnlyDatePart(date));
    const today = moment(DateUtils.keepOnlyDatePart(options.now));

    if (options.predefinedFormat) {
      return dateOnly.format(this.getMomentJsFormat(options.predefinedFormat));
    }

    if (options.useTodayYesterdayAndTomorrow) {
      if (DateUtils.isTodayYesterdayOrTomorrow(date, options)) {
        return moment(dateOnly).calendar(moment(today));
      }
    }

    const isThisWeek = dateOnly.diff(moment(today), 'weeks') == 0;

    if (options.useWeekdayIfThisWeek && isThisWeek) {
      if (dateOnly.valueOf() > today.valueOf()) {
        return l('NextDay', l(dateOnly.format('dddd')));
      } else if (dateOnly.valueOf() < today.valueOf()) {
        return l('LastDay', l(dateOnly.format('dddd')));
      } else {
        return dateOnly.format('dddd');
      }
    }

    if (options.omitYearIfCurrentOne && dateOnly.year() === today.year()) {
      return dateOnly.format('LL');
    }

    if (options.useLongDateFormat) {
      return dateOnly.format(this.longDateFormat);
    }

    return dateOnly.format('L');
  }

  private static get longDateFormat() {
    const momentLocaleData = DateUtils.momentjsLocaleDataMap[DateUtils.momentjsCompatibleLocale];

    return momentLocaleData
      .longDateFormat('LLLL')
      .replace(/[h:mA]/g, '')
      .trim();
  }

  /**
   * Creates a string from a Date object. The string corresponds to the time information of the Date object.
   * @param date The Date object to create a string from.
   * @param options The set of options to apply when formatting the resulting string. If you do not specify a
   * value for this parameter, the method uses a default set of options.
   * @returns {string} A string containing the time information of the `date` argument, and formatted according to the specified `options`.
   */
  static timeToString(date: Date, options?: IDateToStringOptions): string {
    if (Utils.isNullOrUndefined(date)) {
      return '';
    }
    return moment(date).format('h:mm A');
  }

  /**
   * Creates a string from a Date object. The resulting string is formatted according to a set of options.
   * This method calls [ `timeToString` ]{@link DateUtils.timeToString} to add time information to the date.
   * If you need to create a date string without a timestamp, use the [ `dateToString` ]{@link DateUtils.dateToString} method instead.
   * @param date The date object to create a string from.
   * @param options The set of options to apply when formatting the resulting string. If you do not specify a value for
   * this parameter, the method uses a default set of options.
   * @returns {string} A date string corresponding to the `date` argument value, formatted according to the specified `options`.
   */
  static dateTimeToString(date: Date, options?: IDateToStringOptions): string {
    DateUtils.setLocale();
    options = new DefaultDateToStringOptions().merge(options);

    if (Utils.isNullOrUndefined(date)) {
      new Logger(this).warn(`Impossible to format an undefined or null date.`);
      return '';
    }

    if (!moment(date).isValid()) {
      new Logger(this).warn(`Impossible to format an invalid date: ${date}`);
      return '';
    }

    if (options.predefinedFormat) {
      return moment(date).format(this.getMomentJsFormat(options.predefinedFormat));
    }

    const today = DateUtils.keepOnlyDatePart(options.now);
    const datePart = DateUtils.dateToString(date, options);
    const dateWithoutTime = DateUtils.keepOnlyDatePart(date);
    const isThisWeek = moment(date).diff(moment(today), 'weeks') == 0;
    const isToday = dateWithoutTime.valueOf() == today.valueOf();

    const shouldIncludeTime = () => {
      if (options.alwaysIncludeTime) {
        return true;
      }
      if (options.includeTimeIfThisWeek && isThisWeek) {
        return true;
      }
      if (options.includeTimeIfToday && isToday) {
        return true;
      }

      return false;
    };

    if (shouldIncludeTime()) {
      return `${datePart}, ${DateUtils.timeToString(date)}`;
    }

    return datePart;
  }

  /**
   * Creates a string from a number. The resulting string is the localized name of the month that corresponds
   * to this number (e.g., `0` results in the localized version of `January`).
   * @param month The number to create a string from. Minimum value is `0` (which corresponds to `January`). Maximum
   * value is `11` (which corresponds to `December`).
   * @returns {string} A string whose value is the localized name of the corresponding `month`.
   */
  static monthToString(month: number): string {
    DateUtils.setLocale();
    const date = moment(new Date(1980, month)).toDate();
    return moment(date).format('MMMM');
  }

  /**
   * Validates whether a value is an instance of Date.
   * @param date The value to verify.
   * @returns {boolean} `true` if the `date` argument is an instance of Date; `false` otherwise.
   */
  static isValid(date: any) {
    DateUtils.setLocale();

    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    return false;
  }

  /**
   * Creates a string from two Date objects. The resulting string corresponds to the amount of time between those two dates.
   * @param from The Date object which contains the "oldest" value.
   * @param to The Date object which contains the "newest" value.
   * @returns {any} A string whose value corresponds to the amount of time between `from` and `to`,
   * or an empty string if either argument was undefined.
   */
  static timeBetween(from: Date, to: Date) {
    if (Utils.isNullOrUndefined(from) || Utils.isNullOrUndefined(to)) {
      return '';
    }

    return (
      ('0' + ((moment(to).valueOf() - moment(from).valueOf()) / (1000 * 60 * 60)).toFixed()).slice(-2) +
      ':' +
      ('0' + (((moment(to).valueOf() - moment(from).valueOf()) % (1000 * 60 * 60)) / (1000 * 60)).toFixed()).slice(-2) +
      ':' +
      ('0' + (((moment(to).valueOf() - moment(from).valueOf()) % (1000 * 60)) / 1000).toFixed()).slice(-2)
    );
  }

  static get currentGlobalizeCalendar(): GlobalizeCalendar {
    return Globalize.culture(DateUtils.currentLocale).calendar as GlobalizeCalendar;
  }

  static get currentLocale() {
    return String['locale'];
  }

  static get momentjsCompatibleLocale(): string {
    let currentLocale = DateUtils.currentLocale;

    // Our cultures.js directory contains 'no' which is the equivalent to 'nn' for momentJS
    if (currentLocale.toLowerCase() == 'no') {
      currentLocale = 'nn';
    } else if (currentLocale.toLowerCase() == 'es-es') {
      // Our cultures.js directory contains 'es-es' which is the equivalent to 'es' for momentJS
      currentLocale = 'es';
    }
    return currentLocale;
  }

  static transformGlobalizeCalendarToMomentCalendar(): moment.LocaleSpecification {
    const cldrToMomentFormat = (cldrFormat: string) => {
      return cldrFormat.replace(/y/g, 'Y').replace(/d/g, 'D');
    };

    return {
      months: DateUtils.currentGlobalizeCalendar.months.names,
      monthsShort: DateUtils.currentGlobalizeCalendar.months.namesAbbr,
      weekdays: DateUtils.currentGlobalizeCalendar.days.names,
      weekdaysShort: DateUtils.currentGlobalizeCalendar.days.namesAbbr,
      weekdaysMin: DateUtils.currentGlobalizeCalendar.days.namesShort,
      longDateFormat: {
        LT: cldrToMomentFormat(DateUtils.currentGlobalizeCalendar.patterns.t),
        LTS: cldrToMomentFormat(DateUtils.currentGlobalizeCalendar.patterns.T),
        L: cldrToMomentFormat(DateUtils.currentGlobalizeCalendar.patterns.d),
        LL: cldrToMomentFormat(DateUtils.currentGlobalizeCalendar.patterns.M),
        LLL: cldrToMomentFormat(DateUtils.currentGlobalizeCalendar.patterns.f),
        LLLL: cldrToMomentFormat(DateUtils.currentGlobalizeCalendar.patterns.F)
      },
      calendar: {
        lastDay: `[${l('Yesterday')}]`,
        sameDay: `[${l('Today')}]`,
        nextDay: `[${l('Tomorrow')}]`
      }
    };
  }
}
