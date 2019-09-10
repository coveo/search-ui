import { RangeType, IRangeValue, RangeEndScope } from '../../../rest/RangeValue';
import { DynamicRangeFacetValueFormat } from '../DynamicRangeFacet';
import { NumberUtils } from '../../../utils/NumberUtils';
import * as Globalize from 'globalize';
import { isNull } from 'util';

export class DynamicRangeFacetValueUtils {
  public static formatValue(value: RangeType, valueFormat: DynamicRangeFacetValueFormat) {
    switch (valueFormat) {
      case DynamicRangeFacetValueFormat.number:
        return this.formatNumberValue(<number>value);
      // TODO: Manage more value formats
      default:
        return `${value}`;
    }
  }

  private static formatNumberValue(value: number): string {
    const numberOfDecimals = NumberUtils.countDecimals(value);
    return Globalize.format(value, `n${numberOfDecimals}`);
  }

  public static formatRangeValue(range: IRangeValue, valueFormat: DynamicRangeFacetValueFormat, valueSeparator: string) {
    const formattedStart = this.formatValue(range.start, valueFormat);
    const formattedEnd = this.formatValue(range.end, valueFormat);

    return `${formattedStart} ${valueSeparator} ${formattedEnd}`;
  }

  private static validateRangeValue(value: RangeType, valueFormat: DynamicRangeFacetValueFormat) {
    switch (valueFormat) {
      case DynamicRangeFacetValueFormat.number:
        return this.validateNumberValue(value);
      // TODO: Manage more value formats
      default:
        return `${value}`;
    }
  }

  private static validateNumberValue(value: RangeType) {
    const number = parseFloat(`${value}`);
    return isNaN(number) ? null : number;
  }

  public static validateRange(unvalidatedRange: IRangeValue, valueFormat: DynamicRangeFacetValueFormat) {
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

  public static rangeFromValue(value: string, valueFormat: DynamicRangeFacetValueFormat): IRangeValue {
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
