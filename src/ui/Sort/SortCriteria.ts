import { chain, contains, first, values } from 'underscore';
import { Assert } from '../../misc/Assert';
import { QueryBuilder } from '../../ui/Base/QueryBuilder';

export enum VALID_SORT {
  RELEVANCY = 'relevancy',
  DATE = 'date',
  QRE = 'qre'
}

export enum VALID_DIRECTION {
  ASCENDING = 'ascending',
  DESCENDING = 'descending'
}

export class SingleSortCriteria {
  private static sortsNeedingDirection = [VALID_SORT.DATE];

  /**
   * Create a new SortCriteria
   * @param sort The sort criteria (e.g.: relevancy, date)
   * @param direction The direction by which to sort (e.g.: ascending, descending)
   */
  constructor(public sort: VALID_SORT, public direction: VALID_DIRECTION | '' = '') {
    if (!SingleSortCriteria.sortIsField(sort)) {
      Assert.check(
        this.isValidSort(sort),
        `${sort} is not a valid sort criteria. Valid values are ${values(VALID_SORT)} or a valid index sortable index field.`
      );
    }
    if (SingleSortCriteria.sortNeedsDirection(sort)) {
      Assert.check(
        this.isValidDirection(direction),
        `${direction} is not a valid sort criteria direction. Valid values are ${values(VALID_DIRECTION)}`
      );
    } else {
      Assert.check(direction == '');
    }
  }

  private isValidDirection(direction: string): direction is VALID_DIRECTION {
    return chain(VALID_DIRECTION)
      .values()
      .contains(direction as any)
      .value();
  }

  private isValidSort(sort: string): sort is VALID_SORT {
    return chain(VALID_SORT)
      .values()
      .contains(sort as any)
      .value();
  }

  private static sortIsField(criteria: string) {
    return criteria.charAt(0) == '@';
  }

  private static sortNeedsDirection(sort: string) {
    return contains(SingleSortCriteria.sortsNeedingDirection, sort) || SingleSortCriteria.sortIsField(sort);
  }
}

export class SortCriteria {
  private singleCriterias: SingleSortCriteria[] = [];

  constructor(rawCriteriaString: string) {
    const multipleCriteria = rawCriteriaString.split(';');
    multipleCriteria.forEach(singleCriteria => {
      const split = singleCriteria.match(/\S+/g);
      this.singleCriterias.push(new SingleSortCriteria(split[0] as VALID_SORT, split[1] as VALID_DIRECTION));
    });
  }

  public get direction() {
    return first(this.singleCriterias).direction;
  }

  public get sort() {
    return first(this.singleCriterias).sort;
  }

  /**
   * Return a new SortCriteria from a string
   * @param criteria The string from which to create the SortCriteria
   */
  static parse(criteria: string): SortCriteria {
    return new SortCriteria(criteria);
  }

  /**
   * Put the sort criteria in the passed queryBuilder
   * @param queryBuilder The queryBuilder in which to put the sort criteria.
   */
  public putInQueryBuilder(queryBuilder: QueryBuilder) {
    Assert.exists(queryBuilder);
    queryBuilder.sortCriteria = this.toString()
      .split(';')
      .join(',');
  }

  /**
   * Returns a string representation of the sort criteria (e.g.: 'date ascending').
   */
  public toString(): string {
    return this.singleCriterias
      .map(singleCriteria => {
        return singleCriteria.direction ? `${singleCriteria.sort} ${singleCriteria.direction}` : `${singleCriteria.sort}`;
      })
      .join(';');
  }

  /**
   * Checks if the SortCriteria is equal to another.
   * @param criteria The SortCriteria to compare with
   */
  public equals(criteria: SortCriteria): boolean {
    return criteria.toString() == this.toString();
  }
}
