import {Assert} from '../../misc/Assert';
import {QueryBuilder} from '../Base/QueryBuilder';
import {Utils} from '../../utils/Utils';
import {IQueryResult} from '../../rest/QueryResult';

export class SortCriteria {
  private static validSorts = ['relevancy', 'date', 'qre'];
  private static sortsNeedingDirection = ['date'];
  private static validDirections = ['ascending', 'descending'];

  /**
   * Create a new SortCriteria
   * @param sort The sort criteria (e.g. relevancy, date)
   * @param direction The direction by which to sort (e.g. ascending, descending)
   */
  constructor(public sort: string, public direction: string = '') {
    Assert.isNonEmptyString(sort);
    Assert.check(_.contains(SortCriteria.validSorts, sort) || SortCriteria.sortIsField(sort));
    if (SortCriteria.sortNeedsDirection(sort)) {
      Assert.check(_.contains(SortCriteria.validDirections, direction));
    } else {
      Assert.check(direction == '');
    }
  }

  /**
   * Return a new SortCriteria from a string
   * @param criteria The string from which to create the SortCriteria
   */
  static parse(criteria: string): SortCriteria {
    Assert.isNonEmptyString(criteria);
    var split = criteria.match(/\S+/g);
    return new SortCriteria(split[0], split[1]);
  }

  /**
   * Put the sort criteria in the passed queryBuilder
   * @param queryBuilder The queryBuilder in which to put the sort criteria
   */
  public putInQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);
    if (SortCriteria.sortIsField(this.sort)) {
      queryBuilder.sortCriteria = 'field' + this.direction;
      queryBuilder.sortField = this.sort;
    } else if (this.direction != '') {
      queryBuilder.sortCriteria = this.sort + this.direction;
    } else {
      queryBuilder.sortCriteria = this.sort;
    }
  }

  /**
   * Gets the value of the sort criteria from a single {@link IQueryResult}<br/>
   * For example, if the sort criteria is 'relevancy', it will return the value of the 'relevancy' field from result
   * @param result The {@link IQueryResult} from which to get the value.
   */
  public getValueFromResult(result: IQueryResult): any {
    Assert.exists(result);

    if (SortCriteria.sortIsField(this.sort)) {
      return Utils.getFieldValue(result, this.sort);
    } else if (this.sort == 'date') {
      return result.raw['date'];
    } else {
      Assert.fail('Cannot retrieve value: ' + this.sort);
    }
  }

  /**
   * Returns a string representation of the sort criteria (e.g. 'date ascending')
   */
  public toString(): string {
    if (Utils.isNonEmptyString(this.direction)) {
      return this.sort + ' ' + this.direction;
    } else {
      return this.sort;
    }
  }

  /**
   * Checks if the SortCriteria is equal to another
   * @param criteria The SortCriteria to compare with
   */
  public equals(criteria: SortCriteria): boolean {
    Assert.exists(criteria);
    return criteria.sort == this.sort && criteria.direction == this.direction;
  }

  private static sortIsField(criteria: string) {
    return criteria.charAt(0) == '@';
  }

  private static sortNeedsDirection(sort: string) {
    return _.contains(SortCriteria.sortsNeedingDirection, sort) || SortCriteria.sortIsField(sort);
  }
}
