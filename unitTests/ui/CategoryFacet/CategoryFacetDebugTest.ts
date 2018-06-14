import { IGroupByResult } from '../../../src/rest/GroupByResult';
import { IGroupByValue } from '../../../src/rest/GroupByValue';
import { CategoryFacetDebug } from '../../../src/ui/CategoryFacet/CategoryFacetDebug';
export function CategoryFacetDebugTest() {
  function generateGroupByResult(paths: string[]): IGroupByResult {
    const groupByValues: IGroupByValue[] = [];

    paths.forEach(path => {
      groupByValues.push({
        value: path,
        numberOfResults: 1337,
        score: 31337
      });
    });
    return {
      field: '@field' as string,
      values: groupByValues
    };
  }
  describe('CategoryFacetDebug', () => {
    it('finds orphans', () => {
      const paths = ['Car', 'Car|Sport', 'Car|Sport|Ferrari', 'Car|Eco|Yaris'];
      const groupByResult = generateGroupByResult(paths);

      const orphans = CategoryFacetDebug.analyzeResults(groupByResult, '|');

      expect(orphans).toEqual(['Car|Eco|Yaris']);
    });

    it('finds orphans amongst many branches of values', () => {
      const paths = [
        'Car',
        'Car|Sport',
        'Car|Sport|Ferrari',
        'Plane',
        'Plane|Fast',
        'Plane|Slow',
        'Plane|Fast|F18',
        'Plane|Slow|Cesna',
        'Plane|Airline|Airbus',
        'Chopper',
        'Chopper|Military',
        'Chopper|Civilian',
        'Chopper|Military|Apache',
        'Chopper|Civilian|Airbus',
        'Chopper|Civilian|Airbus|Car|Sport|Ferrari',
        'Civilian',
        'Airbus'
      ];
      const groupByResult = generateGroupByResult(paths);

      const orphans = CategoryFacetDebug.analyzeResults(groupByResult, '|');

      expect(orphans).toEqual(['Plane|Airline|Airbus', 'Chopper|Civilian|Airbus|Car|Sport|Ferrari']);
    });
  });
}
