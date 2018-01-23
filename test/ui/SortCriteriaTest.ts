import { SortCriteria } from '../../src/ui/Sort/SortCriteria';
import * as Mock from '../MockEnvironment';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { IQueryResult } from '../../src/rest/QueryResult';

export function SortCriteriaTest() {
  describe('SortCriteria', function() {
    it('should construct properly without a direction', function() {
      var crit = new SortCriteria('relevancy');
      expect(crit.sort).toEqual('relevancy');
      expect(crit.direction).toEqual('');
    });

    it('should construct properly with a direction', function() {
      var crit = new SortCriteria('date', 'ascending');
      expect(crit.sort).toEqual('date');
      expect(crit.direction).toEqual('ascending');
    });

    it('should throw an error when passed an invalid criteria', function() {
      expect(() => new SortCriteria('fdsaf', 'ascending')).toThrow();
      expect(() => new SortCriteria('')).toThrow();
    });

    it('should throw an error when passed an invalid direction', function() {
      expect(() => new SortCriteria('date', 'invaliddirection')).toThrow();
    });

    it('should throw an error when not passed a direction to a criteria that needs one', function() {
      expect(() => new SortCriteria('date')).toThrow();
    });

    it("should throw an error when passing a direction to a criteria that doesn't need one", function() {
      expect(() => new SortCriteria('relevancy', 'ascending')).toThrow();
    });

    it('should parse a sort criteira string without a direction properly', function() {
      var crit = SortCriteria.parse('relevancy');
      expect(crit.sort).toEqual('relevancy');
      expect(crit.direction).toEqual('');
    });

    it('should parse a sort criteria string with a direction properly', function() {
      var crit = SortCriteria.parse('date ascending');
      expect(crit.sort).toEqual('date');
      expect(crit.direction).toEqual('ascending');
    });

    describe('putInQueryBuilder', function() {
      var qb;

      beforeEach(function() {
        qb = Mock.mock<QueryBuilder>(QueryBuilder);
      });

      afterEach(function() {
        qb = null;
      });

      it('should update the queryBuilder without a direction', function() {
        new SortCriteria('relevancy').putInQueryBuilder(qb);
        expect(qb.sortCriteria).toEqual('relevancy');
      });

      it('should update the queryBuilder with a direction', function() {
        new SortCriteria('date', 'ascending').putInQueryBuilder(qb);
        expect(qb.sortCriteria).toEqual('dateascending');
      });

      it('should update the queryBuilder with a field', function() {
        new SortCriteria('@fillde', 'ascending').putInQueryBuilder(qb);
        expect(qb.sortCriteria).toEqual('fieldascending');
        expect(qb.sortField).toEqual('@fillde');
      });

      it('should throw an error if the queryBuilder is null or undefined', function() {
        qb = null;
        expect(() => new SortCriteria('date', 'ascending').putInQueryBuilder(qb)).toThrow();
        qb = undefined;
        expect(() => new SortCriteria('date', 'descending').putInQueryBuilder(qb)).toThrow();
      });
    });

    describe('getValueFromResult', function() {
      var result;

      beforeEach(function() {
        result = <IQueryResult>{
          uri: 'http://gogole.quebec',
          raw: {
            date: 12345,
            myfield: 'myfieldvalue'
          }
        };
      });

      it('should return the correct field value', function() {
        expect(new SortCriteria('@uri', 'ascending').getValueFromResult(result)).toEqual(result.uri);
      });

      it('should return the correct date', function() {
        expect(new SortCriteria('date', 'ascending').getValueFromResult(result)).toEqual(result.raw['date']);
      });

      it('should return the correct raw field value', function() {
        expect(new SortCriteria('@myfield', 'descending').getValueFromResult(result)).toEqual(result.raw['myfield']);
      });
    });

    describe('toString', function() {
      it('with direction should return correct string', function() {
        expect(new SortCriteria('date', 'ascending').toString()).toEqual('date ascending');
      });

      it('without direction should return correct string', function() {
        expect(new SortCriteria('relevancy').toString()).toEqual('relevancy');
      });
    });

    it('equals should return true if criterias are equal', function() {
      expect(new SortCriteria('date', 'ascending').equals(new SortCriteria('date', 'ascending'))).toBe(true);
    });

    it('equals should return false if criterias are not equal', function() {
      expect(new SortCriteria('@field', 'descending').equals(new SortCriteria('relevancy'))).toBe(false);
    });
  });
}
