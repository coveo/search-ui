import * as Globalize from 'globalize';
import { RangeType, IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { DynamicFacetRangeValueFormat, DynamicFacetRange } from '../DynamicFacetRange';
import { NumberUtils } from '../../../utils/NumberUtils';
import { isNull } from 'util';
import { DateUtils } from '../../../utils/DateUtils';

export class DynamicFacetRangeValueParser {
  constructor(private facet: DynamicFacetRange) {}

  private get valueFormat() {
    return this.facet.options.valueFormat;
  }

  private get valueSeparator() {
    return this.facet.options.valueSeparator;
  }

  // TODO: Rework
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

  public formatDisplayValueFromValue(value: RangeType) {
    switch (this.valueFormat) {
      case DynamicFacetRangeValueFormat.number:
        const numberOfDecimals = NumberUtils.countDecimals(value as number);
        return Globalize.format(value, `n${numberOfDecimals}`);

      case DynamicFacetRangeValueFormat.date:
        return DateUtils.dateToString(this.dateFromRangeTypeValue(value));

      default:
        return `${value}`;
    }
  }

  public formatDisplayValueFromRange(range: IRangeValue) {
    const formattedStart = this.formatDisplayValueFromValue(range.start);
    const formattedEnd = this.formatDisplayValueFromValue(range.end);

    return `${formattedStart} ${this.valueSeparator} ${formattedEnd}`;
  }

  private validateRangeLimit(value: RangeType) {
    switch (this.valueFormat) {
      case DynamicFacetRangeValueFormat.number:
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
    const parsedValue = DateUtils.dateTimeForQuery(this.dateFromRangeTypeValue(value));
    return parsedValue === 'Invalid date' ? null : parsedValue;
  }

  public validateRange(unvalidatedRange: IRangeValue): IRangeValue {
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

  public formatValueFromRange(range: IRangeValue) {
    const scope = range.endInclusive ? RangeEndScope.Inclusive : RangeEndScope.Exclusive;
    return `${range.start}..${range.end}${scope}`;
  }

  public parseRangeFromValue(value: string): IRangeValue {
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
