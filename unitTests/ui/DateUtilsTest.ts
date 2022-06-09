import { DateUtils } from '../../src/utils/DateUtils';
import { IDateToStringOptions } from '../../src/utils/DateUtils';
import * as moment from 'moment';
import { l } from '../../src/strings/Strings';

export function DateUtilsTest() {
  describe('DateUtils', () => {
    let options: IDateToStringOptions;
    const containsTime = (result: string) => {
      return /am/i.test(result) || /pm/i.test(result);
    };

    function testDate() {
      return DateUtils.convertToStandardDate('1980-02-11');
    }

    beforeEach(() => {
      options = {
        now: moment('1980-02-11').toDate(),
        predefinedFormat: undefined
      };
      String['locale'] = 'en';
      DateUtils.setLocale();
    });

    it('should use the correct locale if the locale is `no`', () => {
      String['locale'] = 'no';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(testDate(), options)).toEqual(l('Today'));
    });

    it('should use the correct locale if the locale is `id`', () => {
      String['locale'] = 'id';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(testDate(), options)).toEqual(l('Today'));
    });

    it('should use the correct locale if the locale is `es-ES`', () => {
      String['locale'] = 'es-ES';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(testDate(), options)).toEqual(l('Today'));
    });

    it('should use the correct locale if the locale is `zh-cn`', () => {
      String['locale'] = 'zh-tw';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(testDate(), options)).toEqual(l('Today'));
    });

    it('should default to `en` if the locale is invalid', () => {
      String['locale'] = 'foobar';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(testDate(), options)).toEqual(l('Today'));
    });

    it('should return an empty string if the date entry is null or undefined', () => {
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate(null), options)).toEqual(l(''));
    });

    it('should expose an alias for convertFromJsonDateIfNeeded for legacy reasons', () => {
      options.predefinedFormat = 'MM/DD/YYYY';
      expect(DateUtils.dateToString(DateUtils.convertFromJsonDateIfNeeded('2017/03/23'), options)).toEqual('03/23/2017');
    });

    it('should display the weekday if the date is this week when useTodayYesterdayAndTomorrow is set to false', () => {
      options.useTodayYesterdayAndTomorrow = false;
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate('1980/02/11'), options)).toEqual('Monday');
    });

    it('should display the correct predefinedFormat if the YYYY is lowercase', () => {
      options.predefinedFormat = 'MM/DD/yyyy';
      expect(DateUtils.dateToString(testDate(), options)).toEqual(l('02/11/1980'));
    });

    it(`when the #useLongDateFormat option is true, when calling #dateToString,
    it returns a date with the correct form`, () => {
      options.useTodayYesterdayAndTomorrow = false;
      options.useWeekdayIfThisWeek = false;
      options.omitYearIfCurrentOne = false;

      options.useLongDateFormat = true;

      const date = DateUtils.dateToString(testDate(), options);
      expect(date).toBe('Monday, February 11, 1980');
    });

    it('should return `Invalid Date` if the date input is incorrect', () => {
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate('foobar'), options)).toEqual(l('Invalid date'));
    });

    it('should return `Invalid Date` timestamp is incorrect', () => {
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate('1980-02-11 32:11:54'), options)).toEqual(l('Invalid date'));
    });

    it('should display the name of the month correctly using `monthToString`', () => {
      expect(DateUtils.monthToString(1)).toEqual(l('February'));
    });

    it('should display the right amount of time between two dates using `timeBetween`', () => {
      expect(DateUtils.timeBetween(new Date('2017-03-07T16:17:43'), new Date('2017-03-07T16:45:45'))).toEqual(l('00:28:02'));
    });

    it('dateTimeToString should respect the option to includeTime if set to true', () => {
      const now = new Date();
      const result = DateUtils.dateTimeToString(now, { includeTimeIfToday: true, includeTimeIfThisWeek: true });
      expect(containsTime(result)).toBe(true);
    });

    it('dateTimeToString should respect the option to includeTime if set to false', () => {
      const now = moment(new Date()).toDate();

      const result = DateUtils.dateTimeToString(now, { includeTimeIfToday: false, includeTimeIfThisWeek: false });
      expect(containsTime(result)).toBe(false);
    });

    it('dateTimeToString should respect includeTimeIfToday if the date is not today', () => {
      const notToday = moment(new Date()).subtract(2, 'days').toDate();

      const result = DateUtils.dateTimeToString(notToday, { includeTimeIfToday: true, includeTimeIfThisWeek: false });
      expect(containsTime(result)).toBe(false);
    });

    it('dateTimeToString should respect includeTimeIfThisWeek if the date is not this week', () => {
      const notThisWeek = moment(new Date()).subtract(2, 'week').toDate();

      const result = DateUtils.dateTimeToString(notThisWeek, { includeTimeIfToday: false, includeTimeIfThisWeek: true });
      expect(containsTime(result)).toBe(false);
    });

    it('dateTimeToString should respect the predefinedFormat without stripping minutes', () => {
      const oneAmInTheMorning = new Date(1512021600000);
      const result = DateUtils.dateTimeToString(oneAmInTheMorning, { predefinedFormat: 'MMMM DD, YYYY [at] h:mm' });
      expect(result).toContain(':00');
    });

    it(`when the #predefinedFormat is 'yy', it displays the last two digits of the year`, () => {
      options.predefinedFormat = 'yy';
      expect(DateUtils.dateTimeToString(testDate(), options)).toBe('80');
    });

    it(`when the #predefinedFormat is 'yyy', it displays the four digits of the year`, () => {
      options.predefinedFormat = 'yyy';
      expect(DateUtils.dateTimeToString(testDate(), options)).toBe('1980');
    });

    it(`when the #predefinedFormat is 'yyyy', it displays the four digits of the year`, () => {
      options.predefinedFormat = 'yyyy';
      expect(DateUtils.dateTimeToString(testDate(), options)).toBe('1980');
    });

    it(`when the #predefinedFormat is 'yy yy', it displays the last two digits of the year twice`, () => {
      options.predefinedFormat = 'yy yy';
      expect(DateUtils.dateTimeToString(testDate(), options)).toBe('80 80');
    });

    it('dateTimeToString should work with the predefinedFormat YYYY (uppercase)', () => {
      const now = moment(new Date()).toDate();
      const result = DateUtils.dateTimeToString(now, { predefinedFormat: 'YYYY' });
      expect(result).toBe(moment(now).format('YYYY'));
    });

    it(`when the #predefined format is 'MMMN', it displays the full month name`, () => {
      const date = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'MMMM';

      expect(DateUtils.dateTimeToString(date, options)).toBe('January');
    });

    it(`when the #predefined format is 'MMM', it displays a shortened month name`, () => {
      const date = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'MMM';

      expect(DateUtils.dateTimeToString(date, options)).toBe('Jan');
    });

    it(`when the #predefined format is 'MM', it displays a double-digit month number`, () => {
      const date = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'MM';

      expect(DateUtils.dateTimeToString(date, options)).toBe('01');
    });

    it(`when the #predefined format is 'M', it displays a single-digit month number`, () => {
      const date = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'M';

      expect(DateUtils.dateTimeToString(date, options)).toBe('1');
    });

    it(`when the #predefined format is 'dddd', it displays the full day name`, () => {
      const date = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'dddd';

      expect(DateUtils.dateTimeToString(date, options)).toBe('Wednesday');
    });

    it(`when the #predefined format is 'ddd', it displays a shortened day name`, () => {
      const date = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'ddd';

      expect(DateUtils.dateTimeToString(date, options)).toBe('Wed');
    });

    it(`when the #predefined format is 'dd', it displays a double digit number for the day of month`, () => {
      const date = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'dd';

      expect(DateUtils.dateTimeToString(date, options)).toBe('09');
    });

    it(`when the #predefined format is 'd', it displays a single digit number for the day of month`, () => {
      const dateNotInFirstWeek = DateUtils.convertToStandardDate('2019-01-09');
      options.predefinedFormat = 'd';

      expect(DateUtils.dateTimeToString(dateNotInFirstWeek, options)).toBe('9');
    });

    it(`when the #predefined format is 'hh', it displays the hour using a 24-hour format`, () => {
      const date = moment('2019-01-01 14:00').toDate();
      options.predefinedFormat = 'hh';

      expect(DateUtils.dateTimeToString(date, options)).toBe('14');
    });

    it(`when the #predefined format is 'h', it displays the hour using a single-digit 12-hour format`, () => {
      const date = moment('2019-01-01 14:00').toDate();
      options.predefinedFormat = 'h';

      expect(DateUtils.dateTimeToString(date, options)).toBe('2');
    });

    it(`when the #predefined format is 'mm', it displays the minutes`, () => {
      const date = moment('2019-01-01 14:35').toDate();
      options.predefinedFormat = 'mm';

      expect(DateUtils.dateTimeToString(date, options)).toBe('35');
    });

    it(`when the #predefined format is 'ss', it displays the seconds`, () => {
      const date = moment('2019-01-01 14:35:26').toDate();
      options.predefinedFormat = 'ss';

      expect(DateUtils.dateTimeToString(date, options)).toBe('26');
    });

    it('dateTimeToString should properly return an empty string when the date is null', () => {
      const result = DateUtils.dateTimeToString(null);
      expect(result).toBe('');
    });

    it('dateTimeToString should properly return an empty string when the date is undefined', () => {
      const result = DateUtils.dateTimeToString(undefined);
      expect(result).toBe('');
    });

    it('dateTimeToString should properly return an empty string when passing in an invalid date', () => {
      const result = DateUtils.dateTimeToString(new Date('totally not a date'));
      expect(result).toBe('');
    });
  });
}
