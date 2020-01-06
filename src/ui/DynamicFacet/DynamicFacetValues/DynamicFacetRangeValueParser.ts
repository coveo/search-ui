import * as Globalize from 'globalize';
import { RangeType, IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { NumberUtils } from '../../../utils/NumberUtils';
import { isNull } from 'util';
import { DateUtils } from '../../../utils/DateUtils';
import { IDynamicFacetRange, DynamicFacetRangeValueFormat } from '../IDynamicFacetRange';
import { Logger } from '../../../misc/Logger';
import { CurrencyUtils } from '../../../Core';

export class DynamicFacetRangeValueParser {
  constructor(private facet: IDynamicFacetRange) {}

  private get valueFormat() {
    return this.facet.options.valueFormat;
  }

  private get valueSeparator() {
    return this.facet.options.valueSeparator;
  }

  private parseDateFromRangeType(value: RangeType) {
    const parsedDate = DateUtils.convertToStandardDate(value);
    if (!DateUtils.isValid(parsedDate)) {
      new Logger(this).warn('Date value is not valid', value);
      return null;
    }

    return parsedDate;
  }

  private formatDisplayValueFromLimit(value: RangeType) {
    switch (this.valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        const numberOfDecimals = NumberUtils.countDecimals(`${value}`);
        return Globalize.format(value, `n${numberOfDecimals}`);

      case DynamicFacetRangeValueFormat.currency:
        return CurrencyUtils.currencyToString(parseFloat(`${value}`), {
          symbol: this.facet.options.currencySymbol,
          decimals: NumberUtils.countDecimals(`${value}`) ? 2 : 0
        });

      case DynamicFacetRangeValueFormat.date:
        return DateUtils.dateToString(this.parseDateFromRangeType(value), {
          alwaysIncludeTime: false,
          includeTimeIfThisWeek: false,
          includeTimeIfToday: false,
          omitYearIfCurrentOne: false,
          useTodayYesterdayAndTomorrow: false,
          useWeekdayIfThisWeek: false
        });

      default:
        return `${value}`;
    }
  }

  public formatDisplayValue(range: IRangeValue) {
    const formattedStart = this.formatDisplayValueFromLimit(range.start);
    const formattedEnd = this.formatDisplayValueFromLimit(range.end);

    return `${formattedStart} ${this.valueSeparator} ${formattedEnd}`;
  }

  private validateRangeLimit(value: RangeType) {
    switch (this.valueFormat) {
      case DynamicFacetRangeValueFormat.number:
      case DynamicFacetRangeValueFormat.currency:
        return this.validateNumberValue(value);
      case DynamicFacetRangeValueFormat.date:
        return this.validateDateValue(value);
      default:
        return `${value}`;
    }
  }

  private validateNumberValue(value: RangeType) {
    const number = parseFloat(`${value}`);
    return isNaN(number) ? null : number;
  }

  private validateDateValue(value: RangeType) {
    const parsedValue = DateUtils.dateTimeForQuery(this.parseDateFromRangeType(value));
    return parsedValue === 'Invalid date' ? null : parsedValue;
  }

  public validate(unvalidatedRange: IRangeValue): IRangeValue {
    const start = this.validateRangeLimit(unvalidatedRange.start);
    const end = this.validateRangeLimit(unvalidatedRange.end);

    if (isNull(start) || isNull(end)) {
      return null;
    }

    return {
      ...unvalidatedRange,
      start,
      end
    };
  }

  public formatValue(range: IRangeValue) {
    const scope = range.endInclusive ? RangeEndScope.Inclusive : RangeEndScope.Exclusive;
    return `${range.start}..${range.end}${scope}`;
  }

  public parse(value: string): IRangeValue {
    const valueRegex = new RegExp(`^(.+)\\.\\.(.+)(${RangeEndScope.Inclusive}|${RangeEndScope.Exclusive})$`);
    const startAndEnd = valueRegex.exec(value);
    if (!startAndEnd) {
      return null;
    }

    const start = this.validateRangeLimit(startAndEnd[1]);
    const end = this.validateRangeLimit(startAndEnd[2]);
    if (isNull(start) || isNull(end)) {
      return null;
    }

    return {
      start,
      end,
      endInclusive: startAndEnd[3] === RangeEndScope.Inclusive
    };
  }
}
