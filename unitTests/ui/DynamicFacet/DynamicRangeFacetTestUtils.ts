import { IRangeValue } from '../../../src/rest/RangeValue';

export class DynamicRangeFacetTestUtils {
  static createFakeRanges(count = 8, step = 100, endInclusive = false) {
    const ranges: IRangeValue[] = [];
    for (let index = 0; index < count; index++) {
      ranges.push({
        start: step * index,
        end: step * (index + 1),
        endInclusive
      });
    }

    return ranges;
  }
}
