import * as Globalize from 'globalize';
import { RangeType, IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { DynamicFacetRangeValueFormat } from '../DynamicFacetRange';
import { NumberUtils } from '../../../utils/NumberUtils';
import { isNull } from 'util';
import { DateUtils } from '../../../utils/DateUtils';

export class DynamicFacetRangeValueParser {
  constructor(private valueFormat: DynamicFacetRangeValueFormat) {}

  public parseDisplayValue(value: RangeType) {
    switch (this.valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        return this.parseNumberDisplayValue(<number>value);
      case DynamicFacetRangeValueFormat.date:
        return this.parseDateDisplayValue(value);
      default:
        return `${value}`;
    }
  }

  private parseNumberDisplayValue(value: number): string {
    const numberOfDecimals = NumberUtils.countDecimals(value);
    return Globalize.format(value, `n${numberOfDecimals}`);
  }

  private parseDateDisplayValue(value: RangeType): string {
    return DateUtils.dateToString(this.dateFromRangeTypeValue(value));
  }

  private dateFromRangeTypeValue(value: RangeType) {
    switch (typeof value) {
      case 'number':
        return new Date(<number>value);
      case 'string':
        return new Date(`${value}`);
      default:
        return <Date>value;
    }
  }

  public parseRangeDisplayValue(range: IRangeValue, valueSeparator: string) {
    const formattedStart = this.parseDisplayValue(range.start);
    const formattedEnd = this.parseDisplayValue(range.end);

    return `${formattedStart} ${valueSeparator} ${formattedEnd}`;
  }

  private parseRangeLimit(value: RangeType) {
    switch (this.valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        return this.parseNumberValue(value);
      case DynamicFacetRangeValueFormat.date:
        return this.parseDateValue(value);
      default:
        return `${value}`;
    }
  }

  private parseNumberValue(value: RangeType) {
    const number = parseFloat(`${value}`);
    return isNaN(number) ? null : number;
  }

  private parseDateValue(value: RangeType) {
    const parsedValue = DateUtils.dateTimeForQuery(this.dateFromRangeTypeValue(value));
    return parsedValue === 'Invalid date' ? null : parsedValue;
  }

  public parseRange(unvalidatedRange: IRangeValue): IRangeValue {
    const start = this.parseRangeLimit(unvalidatedRange.start);
    const end = this.parseRangeLimit(unvalidatedRange.end);

    if (isNull(start) || isNull(end)) {
      return null;
    }

    return {
      ...unvalidatedRange,
      start,
      end
    };
  }

  public createValueFromRange(range: IRangeValue) {
    const scope = range.endInclusive ? RangeEndScope.Inclusive : RangeEndScope.Exclusive;
    return `${range.start}..${range.end}${scope}`;
  }

  public createRangeFromValue(value: string): IRangeValue {
    const valueRegex = new RegExp(`^(.+)\\.\\.(.+)(${RangeEndScope.Inclusive}|${RangeEndScope.Exclusive})$`);
    const startAndEnd = valueRegex.exec(value);
    if (!startAndEnd) {
      return null;
    }

    const start = this.parseRangeLimit(startAndEnd[1]);
    const end = this.parseRangeLimit(startAndEnd[2]);
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
