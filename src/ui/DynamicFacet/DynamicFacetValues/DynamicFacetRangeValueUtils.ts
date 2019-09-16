import * as Globalize from 'globalize';
import { RangeType, IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { DynamicFacetRangeValueFormat } from '../DynamicFacetRange';
import { NumberUtils } from '../../../utils/NumberUtils';
import { isNull } from 'util';
import { DateUtils } from '../../../utils/DateUtils';

export class DynamicFacetRangeValueUtils {
  public static formatDisplayValue(value: RangeType, valueFormat: DynamicFacetRangeValueFormat) {
    switch (valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        return this.formatNumberDisplayValue(<number>value);
      case DynamicFacetRangeValueFormat.date:
        return this.formatDateDisplayValue(value);
      default:
        return `${value}`;
    }
  }

  private static formatNumberDisplayValue(value: number): string {
    const numberOfDecimals = NumberUtils.countDecimals(value);
    return Globalize.format(value, `n${numberOfDecimals}`);
  }

  private static formatDateDisplayValue(value: RangeType): string {
    return DateUtils.dateToString(this.dateFromRangeTypeValue(value));
  }

  private static dateFromRangeTypeValue(value: RangeType) {
    switch (typeof value) {
      case 'number':
        return new Date(<number>value);
      case 'string':
        return new Date(`${value}`);
      default:
        return <Date>value;
    }
  }

  public static formatRangeDisplayValue(range: IRangeValue, valueFormat: DynamicFacetRangeValueFormat, valueSeparator: string) {
    const formattedStart = this.formatDisplayValue(range.start, valueFormat);
    const formattedEnd = this.formatDisplayValue(range.end, valueFormat);

    return `${formattedStart} ${valueSeparator} ${formattedEnd}`;
  }

  private static parseRangeValue(value: RangeType, valueFormat: DynamicFacetRangeValueFormat) {
    switch (valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        return this.parseNumberValue(value);
      case DynamicFacetRangeValueFormat.date:
        return this.parseDateValue(value);
      default:
        return `${value}`;
    }
  }

  private static parseNumberValue(value: RangeType) {
    const number = parseFloat(`${value}`);
    return isNaN(number) ? null : number;
  }

  private static parseDateValue(value: RangeType) {
    const parsedValue = DateUtils.dateTimeForQuery(this.dateFromRangeTypeValue(value));
    return parsedValue === 'Invalid date' ? null : parsedValue;
  }

  public static parseRange(unvalidatedRange: IRangeValue, valueFormat: DynamicFacetRangeValueFormat) {
    const start = this.parseRangeValue(unvalidatedRange.start, valueFormat);
    const end = this.parseRangeValue(unvalidatedRange.end, valueFormat);

    if (isNull(start) || isNull(end)) {
      return null;
    }

    return {
      ...unvalidatedRange,
      start,
      end
    };
  }

  public static createValueFromRange(range: IRangeValue) {
    const scope = range.endInclusive ? RangeEndScope.Inclusive : RangeEndScope.Exclusive;
    return `${range.start}..${range.end}${scope}`;
  }

  public static createRangeFromValue(value: string, valueFormat: DynamicFacetRangeValueFormat): IRangeValue {
    const valueRegex = new RegExp(`^(.+)\\.\\.(.+)(${RangeEndScope.Inclusive}|${RangeEndScope.Exclusive})$`);
    const startAndEnd = valueRegex.exec(value);
    if (!startAndEnd) {
      return null;
    }

    const start = this.parseRangeValue(startAndEnd[1], valueFormat);
    const end = this.parseRangeValue(startAndEnd[2], valueFormat);
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
