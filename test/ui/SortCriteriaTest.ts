import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { SortCriteria, VALID_DIRECTION } from '../../src/ui/Sort/SortCriteria';
import * as Mock from '../MockEnvironment';

export function SortCriteriaTest() {
  describe('SortCriteria', () => {
    it('should construct properly without a direction', () => {
      const crit = new SortCriteria('relevancy');
      expect(crit.sort).toEqual('relevancy');
      expect(crit.direction).toEqual('');
    });

    it('should construct properly with a direction', () => {
      const crit = new SortCriteria('date ascending');
      expect(crit.sort).toEqual('date');
      expect(crit.direction).toEqual('ascending');
    });

    it('should throw an error when passed an invalid criteria', () => {
      expect(() => new SortCriteria('fdsaf ascending')).toThrow();
      expect(() => new SortCriteria('')).toThrow();
    });

    it('should throw an error when passed an invalid direction', () => {
      expect(() => new SortCriteria('date invaliddirection')).toThrow();
    });

    it('should throw an error when not passed a direction to a criteria that needs one', () => {
      expect(() => new SortCriteria('date')).toThrow();
    });

    it("should throw an error when passing a direction to a criteria that doesn't need one", () => {
      expect(() => new SortCriteria('relevancy ascending')).toThrow();
    });

    it('should parse a sort criteira string without a direction properly', () => {
      const crit = SortCriteria.parse('relevancy');
      expect(crit.sort).toEqual('relevancy');
      expect(crit.direction).toEqual('');
    });

    it('should parse a sort criteria string with a direction properly', () => {
      const crit = SortCriteria.parse('date ascending');
      expect(crit.sort).toEqual('date');
      expect(crit.direction).toEqual('ascending');
    });

    it('should properly parse multiple criteria for direction', () => {
      const crit = new SortCriteria('@ytviewcount ascending; date descending');
      expect(crit.direction).toBe(VALID_DIRECTION.ASCENDING);
    });

    it('should properly parse multiple criteria for sort', () => {
      const crit = new SortCriteria('@ytviewcount ascending; date descending');
      expect(crit.sort).toBe('@ytviewcount');
    });

    describe('putInQueryBuilder', () => {
      let qb;

      beforeEach(() => {
        qb = Mock.mock<QueryBuilder>(QueryBuilder);
      });

      afterEach(() => {
        qb = null;
      });

      it('should update the queryBuilder without a direction', () => {
        new SortCriteria('relevancy').putInQueryBuilder(qb);
        expect(qb.sortCriteria).toEqual('relevancy');
      });

      it('should update the queryBuilder with a direction', () => {
        new SortCriteria('date ascending').putInQueryBuilder(qb);
        expect(qb.sortCriteria).toEqual('date ascending');
      });

      it('should update the queryBuilder with a field', () => {
        new SortCriteria('@fillde ascending').putInQueryBuilder(qb);
        expect(qb.sortCriteria).toEqual('@fillde ascending');
      });

      it('should update the queryBuilder with multiple criteria', () => {
        new SortCriteria('@field ascending;date descending').putInQueryBuilder(qb);
        expect(qb.sortCriteria).toEqual('@field ascending,date descending');
      });

      it('should throw an error if the queryBuilder is null or undefined', () => {
        qb = null;
        expect(() => new SortCriteria('date ascending').putInQueryBuilder(qb)).toThrow();
        qb = undefined;
        expect(() => new SortCriteria('date descending').putInQueryBuilder(qb)).toThrow();
      });
    });

    describe('toString', () => {
      it('with direction should return correct string', () => {
        expect(new SortCriteria('date ascending').toString()).toEqual('date ascending');
      });

      it('without direction should return correct string', () => {
        expect(new SortCriteria('relevancy').toString()).toEqual('relevancy');
      });

      it('with multiple criteria should return correct string', () => {
        expect(new SortCriteria('@ytviewcount ascending;date descending').toString()).toBe('@ytviewcount ascending;date descending');
      });
    });

    it('equals should return true if criterias are equal', () => {
      expect(new SortCriteria('date ascending').equals(new SortCriteria('date ascending'))).toBe(true);
    });

    it('equals should return true if multiple criterias are equals in the same order', () => {
      expect(
        new SortCriteria('date ascending;@ytviewcount ascending').equals(new SortCriteria('date ascending  ;   @ytviewcount ascending'))
      ).toBe(true);
    });

    it('equals should return false if criterias are not equal', () => {
      expect(new SortCriteria('@field descending').equals(new SortCriteria('relevancy'))).toBe(false);
    });

    it('equals should return false if multiple criterias are not equals', () => {
      expect(
        new SortCriteria('@field descending;date descending').equals(new SortCriteria('@secondfield ascending; @thirdfield descending'))
      ).toBe(false);
    });

    it('equals should return false if multiple criterias equals but not in the same order', () => {
      expect(new SortCriteria('@field descending;date descending').equals(new SortCriteria('date descending;@field descending'))).toBe(
        false
      );
    });
  });
}
