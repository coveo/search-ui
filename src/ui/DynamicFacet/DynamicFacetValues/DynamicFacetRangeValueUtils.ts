import * as Globalize from 'globalize';
import { RangeType, IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { DynamicFacetRangeValueFormat } from '../DynamicFacetRange';
import { NumberUtils } from '../../../utils/NumberUtils';
import { isNull } from 'util';
import { DateUtils } from '../../../utils/DateUtils';

export class DynamicFacetRangeValueUtils {
  public static formatValue(value: RangeType, valueFormat: DynamicFacetRangeValueFormat) {
    switch (valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        return this.formatNumberValue(<number>value);
      case DynamicFacetRangeValueFormat.date:
        return this.formatDateValue(value);
      default:
        return `${value}`;
    }
  }

  private static formatNumberValue(value: number): string {
    const numberOfDecimals = NumberUtils.countDecimals(value);
    return Globalize.format(value, `n${numberOfDecimals}`);
  }

  private static dateFromRangeTypeValue(value: RangeType) {
    switch (typeof value) {
      case 'number':
        const unixTimestamp = <number>value;
        return new Date(unixTimestamp * 1000);
      case 'string':
        return new Date(`${value}`);
      default:
        return <Date>value;
    }
  }

  private static formatDateValue(value: RangeType): string {
    return DateUtils.dateToString(this.dateFromRangeTypeValue(value));
  }

  public static formatRangeValue(range: IRangeValue, valueFormat: DynamicFacetRangeValueFormat, valueSeparator: string) {
    const formattedStart = this.formatValue(range.start, valueFormat);
    const formattedEnd = this.formatValue(range.end, valueFormat);

    return `${formattedStart} ${valueSeparator} ${formattedEnd}`;
  }

  private static validateRangeValue(value: RangeType, valueFormat: DynamicFacetRangeValueFormat) {
    switch (valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        return this.validateNumberValue(value);
      case DynamicFacetRangeValueFormat.date:
        return this.validateDateValue(value);
      default:
        return `${value}`;
    }
  }

  private static validateNumberValue(value: RangeType) {
    const number = parseFloat(`${value}`);
    return isNaN(number) ? null : number;
  }

  private static validateDateValue(value: RangeType) {
    return DateUtils.dateTimeForQuery(this.dateFromRangeTypeValue(value));
  }

  public static validateRange(unvalidatedRange: IRangeValue, valueFormat: DynamicFacetRangeValueFormat) {
    const start = this.validateRangeValue(unvalidatedRange.start, valueFormat);
    const end = this.validateRangeValue(unvalidatedRange.end, valueFormat);

    if (isNull(start) || isNull(end)) {
      return null;
    }

    return {
      ...unvalidatedRange,
      start,
      end
    };
  }

  public static valueFromRange(range: IRangeValue) {
    const scope = range.endInclusive ? RangeEndScope.Inclusive : RangeEndScope.Exclusive;
    return `${range.start}..${range.end}${scope}`;
  }

  public static rangeFromValue(value: string, valueFormat: DynamicFacetRangeValueFormat): IRangeValue {
    const valueRegex = new RegExp(`^(.+)\\.\\.(.+)(${RangeEndScope.Inclusive}|${RangeEndScope.Exclusive})$`);
    const startAndEnd = valueRegex.exec(value);
    if (!startAndEnd) {
      return null;
    }

    const start = this.validateRangeValue(startAndEnd[1], valueFormat);
    const end = this.validateRangeValue(startAndEnd[2], valueFormat);
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
