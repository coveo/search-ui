import { DateUtils } from '../../src/utils/DateUtils';
import { IDateToStringOptions } from '../../src/utils/DateUtils';
import * as moment from 'moment';
import { l } from '../../src/strings/Strings';

export function DateUtilsTest() {

  describe('DateUtils', () => {
    let options: IDateToStringOptions;
    afterEach(() => {
      options = null;
      String['locale'] = 'en';
    });

    it('should use the correct locale if the locale is "no"', () => {
      String['locale'] = 'no';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate('1980-02-11'), { now: moment('1980-02-11').toDate() })).toEqual(l('Today'));
    });

    it('should use the correct locale if the locale is "id"', () => {
      String['locale'] = 'id';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate('1980-02-11'), { now: moment('1980-02-11').toDate() })).toEqual(l('Today'));
    });

    it('should use the correct locale if the locale is "es-ES"', () => {
      String['locale'] = 'es-ES';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate('1980-02-11'), { now: moment('1980-02-11').toDate() })).toEqual(l('Today'));
    });

    it('should use the correct locale if the locale is "zh-cn"', () => {
      String['locale'] = 'zh-tw';
      DateUtils.setLocale();
      expect(DateUtils.dateToString(DateUtils.convertToStandardDate('1980-02-11'), { now: moment('1980-02-11').toDate() })).toEqual(l('Today'));
    });

    it('should return an empty string if the date entry is null or undefined', () => {
      expect(DateUtils.dateToString((null), { now: moment('1980-02-11').toDate() })).toEqual(l(''));
    });

    it('should expose an alias for convertFromJsonDateIfNeeded for legacy reasons', () => {
      expect(DateUtils.dateToString(DateUtils.convertFromJsonDateIfNeeded('2017/03/23'),
        { predefinedFormat: 'MM/DD/YYYY' })).toEqual('03/23/2017');
    });

    it('should display the weekday if the date is this week when useTodayYesterdayAndTomorrow is set to false', () => {
      expect(DateUtils.dateToString(DateUtils.convertFromJsonDateIfNeeded('1980/02/11'),
        { useTodayYesterdayAndTomorrow: false, now: moment('1980-02-11').toDate() })).toEqual('Monday');
    });

    it('monthToString should display the name of the month corresponding to its number correctly', () => {
      expect(DateUtils.monthToString(1)).toEqual('February');
    });


  });
}
